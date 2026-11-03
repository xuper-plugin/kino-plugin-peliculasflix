// MixDrop and its mirrors: the embed page holds a packed script whose `wurl = "<address>"` is the file (protocol-relative).

import { findIn, miss, pageText } from "./shared.js";

export const HOSTS = ["mixdrop.top", "mixdrop.co", "mixdrop.to", "mixdrop.ch", "mixdrop.ag", "mixdrop.bz", "mixdrop.sx", "mixdrop.gl", "mxdrop.click", "mxcontent.net", "m1xdrop.com"];

/** The address of the unpacked script's `wurl = "…"`, or null. */
export function wurlOf(text) {
  const m = /wurl\s*=\s*"((?:https?:)?\/\/[^"]+)"/.exec(text || "");
  return m ? m[1] : null;
}

export async function extract(embedUrl, req, kino) {
  const u = new URL(embedUrl.replace("/f/", "/e/"));
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino, "mixdrop");
  if (html == null) return null;
  const raw = findIn(html, wurlOf);
  if (!raw) return miss(kino, "mixdrop", "no wurl in page");
  const url = raw.startsWith("//") ? "https:" + raw : raw;
  if (!/^https:\/\//.test(url)) return miss(kino, "mixdrop", "not https");
  return { url, mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}
