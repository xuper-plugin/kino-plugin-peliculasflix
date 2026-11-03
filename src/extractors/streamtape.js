// Streamtape: the page builds the video address in a script line, `getElementById('robotlink').innerHTML = '<start>' +
// ('<tail>').substring(n)...`, so the address is put together here the same way (no script is run).

import { miss, pageText } from "./shared.js";

export const HOSTS = ["streamtape.com", "streamtape.net", "streamtape.xyz", "streamtape.to", "shavetape.cash", "watchadsontape.com", "tapewithadblock.org", "strtape.cloud", "strcloud.link", "stape.fun"];

/** The address a `…botlink').innerHTML = '…' + ('…').substring(n)` line spells, or null. */
export function addressOf(text) {
  const line = /botlink'\)\.innerHTML\s*=\s*([^\n]*)/.exec(text || "");
  if (!line) return null;
  const head = /^\s*(?:'([^']*)'|"([^"]*)")/.exec(line[1]);
  if (!head) return null;
  let out = head[1] ?? head[2];
  const rest = line[1].slice(head[0].length);
  const part = /\+\s*\(\s*(?:'([^']*)'|"([^"]*)")\s*\)((?:\s*\.substring\(\s*\d+\s*\))*)/g;
  let m;
  while ((m = part.exec(rest))) {
    let s = m[1] ?? m[2];
    for (const n of m[3].matchAll(/\.substring\(\s*(\d+)\s*\)/g)) s = s.substring(Number(n[1]));
    out += s;
  }
  if (out.startsWith("//")) out = "https:" + out;
  return /^https:\/\/[^/]+\/get_video\?/.test(out) ? out : null;
}

export async function extract(embedUrl, req, kino) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino, "streamtape");
  if (html == null) return null;
  const url = addressOf(html);
  if (!url) return miss(kino, "streamtape", "no address in page");
  return { url: url + "&stream=1", mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}
