// Mp4Upload: the embed page's player script calls `player.src({ ... src: "<file>" })` (or `player.src("<file>")`).

import { findIn, miss, pageText } from "./shared.js";

export const HOSTS = ["mp4upload.com"];

/** The file the player is given, or null. */
export function srcOf(text) {
  const m = /player\.src\(\s*"([^"]+)"/.exec(text || "") || /player\.src\(\s*\{[\s\S]*?\bsrc\s*:\s*"([^"]+)"/.exec(text || "");
  return m ? m[1] : null;
}

export async function extract(embedUrl, req, kino) {
  const id = /mp4upload\.com\/(?:embed-)?([A-Za-z0-9]+)/.exec(embedUrl);
  const page = id ? "https://www.mp4upload.com/embed-" + id[1] + ".html" : embedUrl;
  const html = await pageText(req, page, { Referer: "https://www.mp4upload.com/" }, kino, "mp4upload");
  if (html == null) return null;
  const url = findIn(html, srcOf);
  if (!url || !/^https:\/\//.test(url)) return miss(kino, "mp4upload", "no source in page");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? "application/vnd.apple.mpegurl" : "video/mp4", headers: { Referer: "https://www.mp4upload.com/" } };
}
