// Doodstream and its mirrors: the embed page names a /pass_md5/ path; that path answers the start of the file address,
// to which ten random letters and the path's last part as a token are added. Many mirrors sit behind a challenge page
// that only a browser passes: then there is no /pass_md5/ in the page and the hidden browser plays the embed instead.

import { captureMedia, miss } from "./shared.js";

export const HOSTS = [
  "dood.la", "dood.yt", "dood.to", "dood.so", "dood.ws", "dood.pm", "dood.wf", "dood.re", "dood.cx", "dood.sh", "dood.li", "dood.watch",
  "doodstream.com", "dooood.com", "doods.pro", "d0000d.com", "d000d.com", "ds2play.com", "ds2video.com", "dsvplay.com", "vide0.net",
  "myvidplay.com", "playmogo.com",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** The /pass_md5/ path of an embed page, or null. */
export function passPath(html) {
  const m = /\/pass_md5\/[\w\-/]+/.exec(html || "");
  return m ? m[0] : null;
}

export async function extract(embedUrl, req, kino) {
  const u = new URL(embedUrl.replace("/d/", "/e/"));
  const page = await req(u.href, { headers: { Referer: u.origin + "/" } });
  // A challenge page answers 403 or has no /pass_md5/: only the hidden browser gets past it.
  const path = page.ok ? passPath(page.text()) : null;
  if (!path) return captureMedia(u.href, req, kino, "dood");
  const base = await req(u.origin + path, { headers: { Referer: u.href } });
  const head = base.ok ? base.text().trim() : "";
  if (!/^https:\/\//.test(head)) return captureMedia(u.href, req, kino, "dood");
  let rand = "";
  for (let i = 0; i < 10; i++) rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const token = path.split("/").pop();
  return { url: head + rand + "?token=" + token + "&expiry=" + Date.now(), mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}
