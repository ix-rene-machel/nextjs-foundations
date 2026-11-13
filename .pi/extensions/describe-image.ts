/**
 * Describe Image Extension
 *
 * Pi does not support image input. This tool delegates image understanding to
 * Claude Code in headless mode (`claude -p`), which can read local image files.
 *
 * The image is read via the Read tool using its full absolute path. The prompt
 * is kept minimal (<120 chars) because the IBM proxy has aggressive token limits.
 * The IBM proxy also blocks prompts containing file extensions (.png, etc), so
 * we construct the prompt carefully to avoid triggering the filter.
 *
 * Usage: the LLM calls `describe_image` with a path (and optional focused prompt).
 */

import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { copyFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, isAbsolute, join, resolve } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";

const SONNET_MODEL = "claude-sonnet-4-6";
const SETTINGS_PATH = ".claude/settings.json";
const CLAUDE_TIMEOUT_MS = 180_000;

const describeImageSchema = Type.Object({
  path: Type.String({
    description:
      "Path to the image file (relative to cwd or absolute). Supported: png, jpg, jpeg, gif, webp.",
  }),
  prompt: Type.Optional(
    Type.String({
      description:
        "Optional focused instruction, e.g. 'read all visible text' or 'describe the UI layout'. Defaults to a full general description.",
    }),
  ),
});

export type DescribeImageInput = Static<typeof describeImageSchema>;

const DEFAULT_PROMPT =
  "Describe this image in detail, including all visible text, UI elements, layout, and colors";

// claude -p embeds the image path inside the prompt string. A path containing
// whitespace gets tokenized by the prompt parser and the Read tool can no
// longer resolve it. When the resolved path has any whitespace, copy the file
// to a hashed, space-free temp path and use that instead. Returns the path to
// feed to claude plus an optional cleanup callback for the temp copy.
function toSafeImagePath(imagePath: string): {
  safePath: string;
  cleanup: () => void;
} {
  const hasWhitespace = /\s/.test(imagePath);
  if (!hasWhitespace) {
    return { safePath: imagePath, cleanup: () => {} };
  }

  const hash = createHash("sha1")
    .update(imagePath)
    .update(randomBytes(8))
    .digest("hex")
    .slice(0, 16);
  const ext = extname(imagePath) || ".png";
  const safePath = join(tmpdir(), `describe-image-${hash}${ext}`);
  copyFileSync(imagePath, safePath);

  return {
    safePath,
    cleanup: () => {
      try {
        rmSync(safePath, { force: true });
      } catch {
        // best-effort cleanup; ignore failures
      }
    },
  };
}

// Resolve the Sonnet model from .claude/settings.json, falling back to the pinned default.
function resolveSonnetModel(cwd: string): string {
  try {
    const raw = readFileSync(resolve(cwd, SETTINGS_PATH), "utf8");
    const settings = JSON.parse(raw) as {
      env?: { ANTHROPIC_DEFAULT_SONNET_MODEL?: string };
    };
    return settings.env?.ANTHROPIC_DEFAULT_SONNET_MODEL ?? SONNET_MODEL;
  } catch {
    return SONNET_MODEL;
  }
}

type ClaudeResult = { stdout: string; stderr: string; code: number };

function runClaude(
  args: string[],
  cwd: string,
  signal?: AbortSignal,
): Promise<ClaudeResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    // Set stdio to ignore stdin (prevents "no stdin data received" timeout)
    const child = spawn("claude", args, {
      cwd,
      signal,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), CLAUDE_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      rejectPromise(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({ stdout, stderr, code: code ?? -1 });
    });
  });
}

export default function describeImageExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "describe_image",
    label: "Describe Image",
    description:
      "Describe or read an image file. Pi cannot view images directly, so this delegates to Claude Code (`claude -p`) using the Sonnet model. Use whenever the user provides an image path or attaches a screenshot and wants it understood, read, or acted upon.",
    promptSnippet:
      "Describe/read an image file via claude -p (Pi has no native image input)",
    promptGuidelines: [
      "Use describe_image whenever an image path or screenshot is provided and its contents matter; Pi cannot see images natively.",
      "Pass a focused prompt to describe_image (e.g. 'read the error text') when the user asks about a specific part of the image.",
    ],
    parameters: describeImageSchema,

    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const cwd = ctx.cwd;
      const imagePath = isAbsolute(params.path)
        ? params.path
        : resolve(cwd, params.path);

      // Fail fast with a clear error if the file is missing.
      try {
        readFileSync(imagePath);
      } catch {
        return {
          content: [
            { type: "text", text: `Image not found at: ${imagePath}` },
          ],
          isError: true,
          details: { imagePath },
        };
      }

      const model = resolveSonnetModel(cwd);
      const instruction = params.prompt?.trim() || DEFAULT_PROMPT;

      // Copy to a hashed, space-free temp path when the original has whitespace,
      // so claude -p can resolve it from inside the prompt string.
      const { safePath, cleanup } = toSafeImagePath(imagePath);

      // IBM proxy: keep prompt minimal to stay under ~120 chars total.
      // Do not mention file extensions (.png, .jpg, etc) — the proxy blocks them.
      const fullPrompt = `${instruction}: ${safePath}`;

      // Extract the parent directory for --add-dir to grant file access.
      const fileDir = safePath.includes("/")
        ? safePath.slice(0, safePath.lastIndexOf("/"))
        : cwd;

      onUpdate?.({
        content: [
          {
            type: "text",
            text: `Describing image via claude -p (${model})...`,
          },
        ],
        details: {},
      });

      let result: ClaudeResult;
      try {
        result = await runClaude(
          [
            "-p",
            "--model",
            model,
            "--add-dir",
            fileDir,
            "--allowedTools",
            "Read",
            "--",
            fullPrompt,
          ],
          cwd,
          signal,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            { type: "text", text: `Failed to run claude -p: ${message}` },
          ],
          isError: true,
          details: { imagePath, model, error: message },
        };
      } finally {
        cleanup();
      }

      if (result.code !== 0) {
        return {
          content: [
            {
              type: "text",
              text: `claude -p exited with code ${result.code}.\n${result.stderr || result.stdout}`,
            },
          ],
          isError: true,
          details: { imagePath, model, code: result.code },
        };
      }

      const description = result.stdout.trim();
      return {
        content: [{ type: "text", text: description }],
        details: { imagePath, model, prompt: instruction },
      };
    },
  });
}
