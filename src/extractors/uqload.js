// Uqload: the embed page holds a packed player script whose `sources: ["<url>"]` lists the file. The domains rotate and
// redirect to each other, so every mirror is declared.

import { HLS_MIME, findIn, miss, pageText } from "./shared.js";

export const HOSTS = ["uqload.com", "uqload.co", "uqload.cx", "uqload.bz", "uqload.vc", "uqload.is", "uqload.io", "uqload.net"];

/** The first file of the player's `sources: [...]` list, either `["<url>"]` or `[{file:"<url>"}]`, or null. */
export function sourceOf(text) {
  const m = /sources\s*:\s*\[\s*(?:\{\s*file\s*:\s*)?["'](https:[^"']+)["']/.exec(text || "");
  return m ? m[1] : null;
}

export async function extract(embedUrl, req, kino) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino, "uqload");
  if (html == null) return null;
  const url = findIn(html, sourceOf);
  if (!url) return miss(kino, "uqload", "no source in page");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? HLS_MIME : "video/mp4", headers: { Referer: u.origin + "/" } };
}
