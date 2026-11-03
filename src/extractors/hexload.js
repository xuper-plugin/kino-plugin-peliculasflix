// Hexload: the embed page's script posts a small form (`data: { key: 'value', ... }`) to /download, which answers the
// file address as JSON.

import { miss, pageText } from "./shared.js";

export const HOSTS = ["hexload.com"];

/** The `key: 'value'` pairs of the page's `data: {…}` block (the request's form), or null when there is none. */
export function formOf(html) {
  const block = /data\s*:\s*\{([^}]*)\}/.exec(html || "");
  if (!block) return null;
  const out = {};
  for (const m of block[1].matchAll(/(\w+)\s*:\s*['"]([\w-]+)['"]/g)) out[m[1]] = m[2];
  return Object.keys(out).length ? out : null;
}

export async function extract(embedUrl, req, kino) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino, "hexload");
  if (html == null) return null;
  const form = formOf(html);
  if (!form) return miss(kino, "hexload", "no request form in page");
  const r = await req(u.origin + "/download", { method: "POST", body: { form }, headers: { Referer: u.href, Accept: "application/json" } });
  if (!r.ok) return miss(kino, "hexload", "download " + r.status);
  const j = r.json();
  const url = j && j.result && j.result.url;
  if (typeof url !== "string" || !/^https:\/\//.test(url)) return miss(kino, "hexload", "no address");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? "application/vnd.apple.mpegurl" : "video/mp4", headers: { Referer: u.origin + "/" } };
}
