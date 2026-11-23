// The extraction seam. PeliculasFlix no longer runs its own hoster extractors: each third-party embed goes to the
// shared kino-resolver through its provider door (`kino.plugins.call`). The door is a background call and cannot open
// the hidden browser, so a gated/unknown host (e.g. savefiles, vimeos) comes back empty or `needs_browser`; THEN
// PeliculasFlix (which has `browser: true`) captures it in its own WebView. The answer is reshaped into what
// openServer() returns: { url, mime?, headers?, subtitles? }.
import { HLS_MIME } from "./extractors/shared.js";

export const RESOLVER_ALIAS = "resolver";
export const RESOLVER_REPO = "xuper-plugin/kino-plugin-kino-resolver";
const CAPTURE_MS = 18000;

/** A door/capture stream's headers (plain object or a [{name,value}] list) merged with its referer. */
function headersOf(s) {
  const out = {};
  if (s.referer) out.Referer = s.referer;
  const h = s.headers;
  if (Array.isArray(h)) for (const x of h) { if (x && x.name) out[x.name] = String(x.value); }
  else if (h && typeof h === "object") for (const [k, v] of Object.entries(h)) { if (v != null) out[k] = String(v); }
  return out;
}

/** Prefer an HLS copy, else the first with a url. */
function pickBest(streams) {
  return streams.find((s) => s && s.url && (s.kind === "hls" || /\.m3u8(\?|$)/i.test(s.url)))
    || streams.find((s) => s && s.url) || null;
}

/** Capture the embed in PeliculasFlix's own hidden WebView (for needs_browser / unknown / provider-missing hosts). */
async function captureStreams(kino, embedUrl, referer) {
  const b = kino && kino.browser;
  if (!b || typeof b.capture !== "function") return [];
  const opts = { timeoutMs: CAPTURE_MS };
  if (referer) opts.headers = { Referer: referer };
  let cap;
  try { cap = await b.capture(embedUrl, opts); } catch (_) { return []; }
  const out = [];
  for (const m of (cap && cap.media) || []) {
    if (!m || !m.url) continue;
    out.push({ url: m.url, kind: /\.m3u8(\?|$)/i.test(m.url) ? "hls" : "mp4", server: "browser", headers: m.headers || {} });
  }
  return out;
}

/**
 * Resolve one hoster embed through the kino-resolver, falling back to a WebView capture.
 * Returns openServer()'s stream shape, or null when nothing plays.
 */
export async function resolveViaHelper(embedUrl, kino, referer) {
  let res = null;
  try {
    res = await kino.plugins.call(RESOLVER_ALIAS, "resolve", { url: embedUrl, referer });
  } catch (err) {
    // provider_missing / timeout / upstream_error -> the browser fallback still has a shot.
    try { kino.log("[peliculasflix]", "resolver", (err && err.code) || "call_failed"); } catch (_) { /* no log */ }
  }
  let streams = res && Array.isArray(res.streams) ? res.streams.slice() : [];
  const subtitles = res && Array.isArray(res.subtitles) ? res.subtitles.filter((x) => x && x.lang && x.url) : [];
  // A player the resolver read as gone (deleted, blocked for copyright) has nothing a 20 s capture could find.
  if (!streams.length && !(res && res.error === "dead")) streams = await captureStreams(kino, embedUrl, referer);
  const s = pickBest(streams);
  if (!s) return null;
  const headers = headersOf(s);
  return {
    url: s.url,
    ...(s.kind === "hls" || /\.m3u8(\?|$)/i.test(s.url) ? { mime: HLS_MIME } : {}),
    ...(Object.keys(headers).length ? { headers } : {}),
    ...(subtitles.length ? { subtitles } : {}),
  };
}

/** True when the kino-resolver provider is installed and reachable (a cheap door probe; only provider_missing means "not installed"). */
export async function resolverInstalled(kino) {
  try {
    await kino.plugins.call(RESOLVER_ALIAS, "normalizeHost", { url: "https://probe.invalid/" });
    return true;
  } catch (err) {
    return (err && err.code) !== "provider_missing";
  }
}
