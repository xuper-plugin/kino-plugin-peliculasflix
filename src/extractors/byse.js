// Byse (the player behind Filemoon's /e/ pages): the page is an empty shell, the stream comes from two JSON calls. The
// first names the real embed frame, the second returns the playback description encrypted with AES-GCM; its key is the
// two `key_parts` joined.

import { HLS_MIME, miss } from "./shared.js";

export const HOSTS = ["filemoon.sx", "filemoon.link", "byse.sx", "bysezoxexe.com", "bysezejataos.com", "bysebuho.com", "bysevepoin.com", "byseqekaho.com"];

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** Hex of a base64url string (the engine has no Buffer): [] when it is not valid. */
export function b64urlToHex(s) {
  const text = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  let bits = 0, acc = 0, hex = "";
  for (const ch of text) {
    const v = B64.indexOf(ch);
    if (v < 0) return null;
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      hex += ((acc >> bits) & 255).toString(16).padStart(2, "0");
      acc &= (1 << bits) - 1;
    }
  }
  return hex;
}

const codeOf = (url) => new URL(url).pathname.replace(/\/+$/, "").split("/").pop();

export async function extract(embedUrl, req, kino) {
  let u;
  try { u = new URL(embedUrl); } catch (_) { return null; }
  const code = codeOf(embedUrl);
  if (!/^[\w-]{4,40}$/.test(code)) return miss(kino, "byse", "no code");
  const d = await req(u.origin + "/api/videos/" + code + "/embed/details", { headers: { Accept: "application/json", Referer: u.origin + "/" } });
  if (!d.ok) return miss(kino, "byse", "details " + d.status);
  const frame = d.json() && d.json().embed_frame_url;
  let f;
  try { f = new URL(frame); } catch (_) { return miss(kino, "byse", "no frame"); }
  const p = await req(f.origin + "/api/videos/" + codeOf(frame) + "/embed/playback", {
    headers: { Accept: "*/*", Referer: frame, "x-embed-parent": embedUrl },
  });
  if (!p.ok) return miss(kino, "byse", "playback " + p.status);
  const pb = p.json() && p.json().playback;
  if (!pb || !Array.isArray(pb.key_parts) || pb.key_parts.length < 2) return miss(kino, "byse", "no key");
  const key = b64urlToHex(pb.key_parts[0]) + b64urlToHex(pb.key_parts[1]);
  const iv = b64urlToHex(pb.iv);
  const data = b64urlToHex(pb.payload);
  if (!/^[0-9a-f]+$/.test(key + (iv || "x") + (data || "x"))) return miss(kino, "byse", "bad key material");
  const alg = key.length === 32 ? "aes-128-gcm" : key.length === 48 ? "aes-192-gcm" : key.length === 64 ? "aes-256-gcm" : null;
  if (!alg) return miss(kino, "byse", "key of " + key.length / 2 + " bytes");
  let json;
  try {
    json = kino.crypto.decrypt(alg, { key, iv, data, keyEncoding: "hex", ivEncoding: "hex", inputEncoding: "hex" });
  } catch (_) {
    return miss(kino, "byse", "decrypt failed");
  }
  let sources;
  try { sources = JSON.parse(json.replace(/^﻿/, "")).sources; } catch (_) { return miss(kino, "byse", "bad playback json"); }
  const url = Array.isArray(sources) && sources[0] && sources[0].url;
  if (typeof url !== "string" || !/^https:\/\//.test(url)) return miss(kino, "byse", "no source");
  return { url, mime: HLS_MIME, headers: { Referer: u.origin + "/" } };
}
