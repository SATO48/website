// The site may be served from a sub-path (e.g. https://sato48.github.io/website/),
// so internal links and public assets are always built from Astro's base URL.
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

/** Link to a page on this site, e.g. url("film-challenge/"). */
export const url = (path = "") => base + path.replace(/^\//, "");

/**
 * Resolve a link entered in Keystatic: site paths ("/fivefest/") and public files
 * ("/images/…") get the base URL; full URLs, mailto: and #anchors pass through.
 */
export const href = (link: string) => (link.startsWith("/") ? url(link) : link);
