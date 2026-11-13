import { APPLY_THEME_SNIPPET } from "@/lib/theme";

/**
 * Server Component. Renders a blocking inline script in <head> so the theme is
 * set while the HTML is still being parsed, before first paint and before
 * React hydrates. This is what removes the flash of the wrong theme.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: APPLY_THEME_SNIPPET }} />;
}
