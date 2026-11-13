export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

/**
 * Self-contained snippet (it runs as an inline script, no imports available).
 * Resolves the theme: stored choice, else OS preference, and sets it on <html>.
 */
export const APPLY_THEME_SNIPPET = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
