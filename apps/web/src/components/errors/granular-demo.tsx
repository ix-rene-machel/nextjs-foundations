"use client";

import { useEffect, useState } from "react";
import { FlakyWidget } from "./flaky-widget";
import { WidgetBoundary } from "./widget-boundary";

type Draft = { name: string; message: string };
type Broken = { stats: boolean; feed: boolean; preview: boolean };

const DRAFT_KEY = "error-demo:draft";
const EMPTY_DRAFT: Draft = { name: "", message: "" };
const NOT_BROKEN: Broken = { stats: false, feed: false, preview: false };

function isDraft(value: unknown): value is Draft {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).name === "string" &&
    typeof (value as Record<string, unknown>).message === "string"
  );
}

/**
 * Form state lives ABOVE the boundaries (survives a component boundary
 * recovering) and is mirrored to sessionStorage (survives the segment
 * error.tsx unmounting this whole tree, and full reloads).
 */
function useDraft(): [Draft, (patch: Partial<Draft>) => void, () => void] {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  // Restore after mount (not in the initializer) to keep SSR/hydration identical.
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(
        sessionStorage.getItem(DRAFT_KEY) ?? "null"
      );
      if (isDraft(stored)) setDraft(stored);
    } catch {
      // Corrupt or unavailable storage: start empty.
    }
  }, []);

  const update = (patch: Partial<Draft>): void => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = (): void => {
    sessionStorage.removeItem(DRAFT_KEY);
    setDraft(EMPTY_DRAFT);
  };

  return [draft, update, clear];
}

/** Renders the draft; throws while `broken`, like a buggy formatter would. */
function DraftPreview({ draft, broken }: { draft: Draft; broken: boolean }) {
  if (broken) {
    throw new Error("Preview renderer crashed");
  }
  return (
    <p className="rounded bg-muted p-3 text-sm">
      Preview: <strong>{draft.name || "(no name)"}</strong>:{" "}
      {draft.message || "(empty)"}
    </p>
  );
}

export function GranularDemo() {
  const [broken, setBroken] = useState<Broken>(NOT_BROKEN);
  const [crashPage, setCrashPage] = useState(false);
  const [draft, updateDraft, clearDraft] = useDraft();

  // Level 2: escalates to the segment boundary (app/error-demo/error.tsx).
  if (crashPage) {
    throw new Error("Granular demo page crashed (segment-level)");
  }

  const breakIt = (key: keyof Broken) => (): void =>
    setBroken((b) => ({ ...b, [key]: true }));
  const fixIt = (key: keyof Broken) => (): void =>
    setBroken((b) => ({ ...b, [key]: false }));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">
          1. Isolated widgets (component boundaries)
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={breakIt("stats")}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
          >
            Break Stats
          </button>
          <button
            type="button"
            onClick={breakIt("feed")}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
          >
            Break Feed
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <WidgetBoundary name="Stats" onRecover={fixIt("stats")}>
            <FlakyWidget label="Stats" broken={broken.stats} />
          </WidgetBoundary>
          <WidgetBoundary name="Feed" onRecover={fixIt("feed")}>
            <FlakyWidget label="Feed" broken={broken.feed} />
          </WidgetBoundary>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">2. Form that survives errors</h2>
        <form
          className="space-y-3 rounded border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            clearDraft();
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              name="name"
              value={draft.name}
              onChange={(e) => updateDraft({ name: e.target.value })}
              className="rounded border bg-background px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Message
            <textarea
              name="message"
              value={draft.message}
              onChange={(e) => updateDraft({ message: e.target.value })}
              className="rounded border bg-background px-3 py-2"
            />
          </label>

          <WidgetBoundary name="Preview" onRecover={fixIt("preview")}>
            <DraftPreview draft={draft} broken={broken.preview} />
          </WidgetBoundary>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={breakIt("preview")}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Break Preview
            </button>
            <button
              type="button"
              onClick={() => setCrashPage(true)}
              className="rounded bg-red-800 px-3 py-1 text-sm text-white"
            >
              Crash whole page
            </button>
            <button
              type="submit"
              className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
            >
              Submit (clears draft)
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
