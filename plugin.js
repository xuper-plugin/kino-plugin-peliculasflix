var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/extractors/goodstream.js
var goodstream_exports = {};
__export(goodstream_exports, {
  HOSTS: () => HOSTS,
  extract: () => extract
});

// src/util/unpack.js
var ALPHA = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var toNum = (s, radix) => [...s].reduce((n, ch) => n * radix + ALPHA.indexOf(ch), 0);
function unpack(source) {
  const m = /}\s*\(\s*'((?:\\'|[^'])*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:\\'|[^'])*)'\.split\('\|'\)/.exec(source || "");
  if (!m) return null;
  const payload = m[1].replace(/\\'/g, "'");
  const radix = Number(m[2]);
  const keys = m[4].split("|");
  if (radix < 2 || radix > 62) return null;
  return payload.replace(/\b[0-9a-zA-Z]+\b/g, (w) => {
    const i = toNum(w, radix);
    return Number.isInteger(i) && i >= 0 && keys[i] ? keys[i] : w;
  });
}

// src/extractors/shared.js
var HLS_MIME = "application/vnd.apple.mpegurl";
function fileM3u8(text, base) {
  const m = /\bfile\s*:\s*["']([^"']+\.m3u8[^"']*)["']/.exec(text || "");
  return m ? absolute(m[1], base) : null;
}
function hlsKey(text, keys, base) {
  for (const k of keys) {
    const m = new RegExp(`["']${k}["']\\s*:\\s*["']([^"']+)["']`).exec(text || "");
    if (m) return absolute(m[1].replace(/\\\//g, "/"), base);
  }
  return null;
}
function absolute(href, base) {
  try {
    return new URL(href, base).href;
  } catch (_) {
    return null;
  }
}
function findIn(html, pick) {
  return pick(html) || pick(unpack(html) || "") || null;
}
function miss(kino2, server, reason) {
  if (kino2 && typeof kino2.log === "function") kino2.log("[latino]", server, reason);
  return null;
}
async function pageText(req, url, headers, kino2, server) {
  const r = await req(url, { headers });
  return r.ok ? r.text() : miss(kino2, server || "embed", "status " + r.status);
}
var LANG_CODES = [
  [/^(español|espanol|spanish|castellano|latino|spa|esp?)\b/i, "es"],
  [/^(english|inglés|ingles|eng?)\b/i, "en"],
  [/^(portugu[eê]s|portuguese|pt)\b/i, "pt"],
  // never a bare "por": "Por defecto" is not Portuguese
  [/^(fran[cç]ais|french|franc[eé]s|fre|fra|fr)\b/i, "fr"],
  [/^(italiano|italian|ita|it)\b/i, "it"],
  [/^(deutsch|german|alem[aá]n|ger|deu|de)\b/i, "de"]
];
function langCode(label) {
  const s = String(label || "").trim();
  for (const [re, code] of LANG_CODES) if (re.test(s)) return code;
  return null;
}
function captionTracks(text, base) {
  const m = /["']?\btracks["']?\s*:\s*\[([\s\S]*?)\]/.exec(text || "");
  if (!m) return [];
  const out = [];
  for (const [obj] of m[1].matchAll(/\{[^{}]*\}/g)) {
    const field = (k) => (new RegExp(`["']?${k}["']?\\s*:\\s*["']([^"']*)["']`).exec(obj) || [])[1] || "";
    const kind = field("kind").toLowerCase();
    if (kind && kind !== "captions" && kind !== "subtitles") continue;
    const file = field("file");
    const format = (/\.(vtt|srt)(?:[?#]|$)/i.exec(file) || [])[1];
    const label = field("label");
    const lang = langCode(label);
    const url = format && lang ? absolute(file, base) : null;
    if (!url || out.some((t) => t.url === url)) continue;
    out.push({ lang, url, label, format: format.toLowerCase() });
  }
  return out;
}
function durationMsOf(text) {
  const re = /(?<![-\w])duration["']?\s*:\s*["']?(\d+(?:\.\d+)?)(?![\d.])(?!\s*m?s\b)/g;
  for (const m of String(text || "").matchAll(re)) {
    const ms = Math.round(Number(m[1]) * 1e3);
    if (ms >= 6e4) return ms;
  }
  return null;
}
function pageExtras(html, base) {
  const unpacked = unpack(html) || "";
  const subs = captionTracks(html, base);
  const subtitles = subs.length ? subs : captionTracks(unpacked, base);
  const durationMs = durationMsOf(html) || durationMsOf(unpacked);
  return { ...subtitles.length ? { subtitles } : {}, ...durationMs ? { durationMs } : {} };
}
var canCapture = (kino2) => !!(kino2 && kino2.browser && typeof kino2.browser.capture === "function");
var CAPTURE_MS = 12e3;
var MIN_CAPTURE_MS = 3e3;
async function captureMedia(embedUrl, req, kino2, server) {
  if (!canCapture(kino2)) return miss(kino2, server, "challenge page and no browser");
  const ms = Math.min(CAPTURE_MS, (req.left ? req.left() : CAPTURE_MS) - 300);
  if (ms < MIN_CAPTURE_MS) return miss(kino2, server, "no time to capture");
  let cap;
  try {
    cap = await kino2.browser.capture(embedUrl, { match: ".m3u8|.mp4", timeoutMs: ms });
  } catch (e) {
    return miss(kino2, server, "capture " + (e && e.code || "error"));
  }
  const m = cap && Array.isArray(cap.media) ? cap.media.find((x) => x && typeof x.url === "string" && /^https?:\/\//i.test(x.url)) : null;
  if (!m) return miss(kino2, server, "capture saw no media");
  return { url: m.url, mime: m.mime || (/\.mp4(?:[?#]|$)/i.test(m.url) ? "video/mp4" : HLS_MIME), headers: { Referer: embedUrl, ...m.headers || {} } };
}

// src/extractors/goodstream.js
var HOSTS = ["goodstream.one"];
async function extract(embedUrl, req, kino2) {
  const html = await pageText(req, embedUrl, { Referer: "https://goodstream.one/" }, kino2, "goodstream");
  if (html == null) return null;
  const url = findIn(html, (t) => fileM3u8(t, embedUrl));
  if (!url) return miss(kino2, "goodstream", "no playlist in page");
  return { url, mime: HLS_MIME, headers: { Referer: embedUrl, Origin: "https://goodstream.one" }, ...pageExtras(html, embedUrl) };
}

// src/extractors/vimeos.js
var vimeos_exports = {};
__export(vimeos_exports, {
  HOSTS: () => HOSTS2,
  extract: () => extract2
});
var HOSTS2 = ["vimeos.net", "vimeos.zip"];
async function extract2(embedUrl, req, kino2) {
  const html = await pageText(req, embedUrl, { Referer: "https://vimeos.net/" }, kino2, "vimeos");
  if (html == null) return null;
  const url = findIn(html, (t) => fileM3u8(t, embedUrl));
  if (!url) return miss(kino2, "vimeos", "no playlist in page");
  return { url, mime: HLS_MIME, headers: { Referer: "https://vimeos.net/" }, ...pageExtras(html, embedUrl) };
}

// src/extractors/streamwish.js
var streamwish_exports = {};
__export(streamwish_exports, {
  HOSTS: () => HOSTS3,
  extract: () => extract3
});

// kino-plugin.json
var kino_plugin_default = {
  id: "peliculasflix",
  name: "PeliculasFlix",
  version: "0.1.0",
  apiVersion: 9,
  entry: "plugin.js",
  icon: "icon.png",
  description: "Pel\xEDculas en espa\xF1ol latino, castellano o subtituladas de pelisflixhd.blog.",
  author: "xuper-plugin",
  homepage: "https://github.com/xuper-plugin/kino-plugin-peliculasflix",
  hosts: [
    "pelisflixhd.blog",
    "doraflix.fluxcedene.net",
    "pelisplus.esplay.io",
    "nupload.top",
    "*.nupload.top",
    "image.tmdb.org",
    "goodstream.one",
    "*.goodstream.one",
    "vimeos.net",
    "*.vimeos.net",
    "vimeos.zip",
    "*.vimeos.zip",
    "hlswish.com",
    "*.hlswish.com",
    "streamwish.com",
    "*.streamwish.com",
    "streamwish.to",
    "*.streamwish.to",
    "strwish.com",
    "*.strwish.com",
    "wishembed.com",
    "*.wishembed.com",
    "filelions.com",
    "*.filelions.com",
    "hglink.to",
    "*.hglink.to",
    "vibuxer.com",
    "*.vibuxer.com",
    "vidhide.com",
    "*.vidhide.com",
    "vidhidepro.com",
    "*.vidhidepro.com",
    "dintezuvio.com",
    "*.dintezuvio.com",
    "minochinos.com",
    "*.minochinos.com",
    "filelions.to",
    "*.filelions.to",
    "morencius.com",
    "*.morencius.com",
    "fastream.to",
    "*.fastream.to",
    "voe.sx",
    "*.voe.sx",
    "ok.ru",
    "*.ok.ru",
    "nupload.me",
    "*.nupload.me",
    "nupload.my",
    "*.nupload.my",
    "vidhidefast.com",
    "*.vidhidefast.com",
    "vidhideplus.com",
    "*.vidhideplus.com",
    "pelisflixhd.love",
    "filemoon.sx",
    "*.filemoon.sx",
    "filemoon.link",
    "*.filemoon.link",
    "byse.sx",
    "*.byse.sx",
    "bysezoxexe.com",
    "*.bysezoxexe.com",
    "bysezejataos.com",
    "*.bysezejataos.com",
    "bysebuho.com",
    "*.bysebuho.com",
    "bysevepoin.com",
    "*.bysevepoin.com",
    "byseqekaho.com",
    "*.byseqekaho.com",
    "uqload.com",
    "*.uqload.com",
    "uqload.co",
    "*.uqload.co",
    "uqload.cx",
    "*.uqload.cx",
    "uqload.bz",
    "*.uqload.bz",
    "uqload.vc",
    "*.uqload.vc",
    "uqload.is",
    "*.uqload.is",
    "uqload.io",
    "*.uqload.io",
    "uqload.net",
    "*.uqload.net",
    "streamtape.com",
    "*.streamtape.com",
    "streamtape.net",
    "*.streamtape.net",
    "streamtape.xyz",
    "*.streamtape.xyz",
    "streamtape.to",
    "*.streamtape.to",
    "shavetape.cash",
    "*.shavetape.cash",
    "watchadsontape.com",
    "*.watchadsontape.com",
    "tapewithadblock.org",
    "*.tapewithadblock.org",
    "strtape.cloud",
    "*.strtape.cloud",
    "strcloud.link",
    "*.strcloud.link",
    "stape.fun",
    "*.stape.fun",
    "dood.la",
    "*.dood.la",
    "dood.yt",
    "*.dood.yt",
    "dood.to",
    "*.dood.to",
    "dood.so",
    "*.dood.so",
    "dood.ws",
    "*.dood.ws",
    "dood.pm",
    "*.dood.pm",
    "dood.wf",
    "*.dood.wf",
    "dood.re",
    "*.dood.re",
    "dood.cx",
    "*.dood.cx",
    "dood.sh",
    "*.dood.sh",
    "dood.li",
    "*.dood.li",
    "dood.watch",
    "*.dood.watch",
    "doodstream.com",
    "*.doodstream.com",
    "dooood.com",
    "*.dooood.com",
    "doods.pro",
    "*.doods.pro",
    "d0000d.com",
    "*.d0000d.com",
    "d000d.com",
    "*.d000d.com",
    "ds2play.com",
    "*.ds2play.com",
    "ds2video.com",
    "*.ds2video.com",
    "dsvplay.com",
    "*.dsvplay.com",
    "vide0.net",
    "*.vide0.net",
    "myvidplay.com",
    "*.myvidplay.com",
    "playmogo.com",
    "*.playmogo.com"
  ],
  capabilities: [
    "search",
    "home",
    "browse",
    "resolve"
  ],
  streamHosts: "any",
  categories: [
    "movies"
  ],
  color: "#E50914",
  browser: true
};

// src/util/hosts.js
function hostMatcher(entries) {
  const exact = /* @__PURE__ */ new Set();
  const suffixes = [];
  for (const raw of entries || []) {
    const h = String(typeof raw === "string" ? raw : raw && raw.host || "").toLowerCase();
    if (!h) continue;
    if (h.startsWith("*.")) suffixes.push(h.slice(1));
    else exact.add(h);
  }
  return (host) => {
    const h = String(host || "").toLowerCase();
    return exact.has(h) || suffixes.some((s) => h.length > s.length && h.endsWith(s));
  };
}
var hostDeclared = hostMatcher(kino_plugin_default.hosts);
function urlDeclared(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch (_) {
    return false;
  }
  return hostDeclared(host);
}

// src/util/http.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
var RETRY_STATUS = /* @__PURE__ */ new Set([408, 425, 429, 500, 502, 503, 504, 520, 521, 522, 524]);
var SLOW_ATTEMPT_MS = 3e3;
var fetchAllowed = (kino2, url) => kino2 && kino2.fetchAnyHost === true || urlDeclared(url);
var requestPool = (n) => ({ left: n });
function makeRequester(kino2, { budget = 12, deadline = Date.now() + 8e3, pools = [], concurrency = Infinity, maxMs = 8e3 } = {}) {
  let used = 0;
  let active = 0;
  const waiting = [];
  const acquire = () => active < concurrency ? (active++, Promise.resolve()) : new Promise((r) => waiting.push(r));
  const release = () => {
    const next = waiting.shift();
    if (next) next();
    else active--;
  };
  function makeLocalError(code, message) {
    const e = kino2.error(code, message);
    e.local = true;
    return e;
  }
  async function once(url, opts, timing = {}) {
    if (!fetchAllowed(kino2, url)) throw makeLocalError("host_not_allowed", "host not declared: " + hostOf(url));
    await acquire();
    try {
      if (used >= budget) throw makeLocalError("unavailable", "budget spent at " + url);
      if (pools.some((p) => p.left <= 0)) throw makeLocalError("unavailable", "call allowance spent at " + url);
      const left = deadline - Date.now();
      if (left <= 0) throw makeLocalError("unavailable", "deadline before " + url);
      used++;
      for (const p of pools) p.left--;
      const headers = { "User-Agent": UA, ...opts.headers || {} };
      const { retry, ...rest } = opts;
      const sentAt = Date.now();
      try {
        return await kino2.fetch(url, { ...rest, headers, timeoutMs: Math.min(maxMs, left) });
      } finally {
        timing.spentMs = Date.now() - sentAt;
      }
    } finally {
      release();
    }
  }
  let degraded = false;
  const roomToRetry = () => used < budget && !pools.some((p) => p.left <= 0) && deadline - Date.now() > 600;
  async function send(url, opts = {}) {
    const timing = {};
    try {
      const r = await once(url, opts, timing);
      if (opts.retry === false || !RETRY_STATUS.has(r.status)) return r;
      if (roomToRetry() && timing.spentMs < SLOW_ATTEMPT_MS) {
        await kino2.sleep(600);
        return once(url, opts);
      }
      return r;
    } catch (e) {
      if (opts.retry === false || e && (e.local || e.code === "host_not_allowed")) throw e;
      if (roomToRetry() && !(timing.spentMs >= SLOW_ATTEMPT_MS)) {
        await kino2.sleep(600);
        return once(url, opts);
      }
      throw e;
    }
  }
  async function req(url, opts = {}) {
    const r = await send(url, opts);
    if (r && (r.status === 429 || r.status >= 500)) degraded = true;
    return r;
  }
  req.degraded = () => degraded;
  req.used = () => used;
  req.exhausted = () => used >= budget || deadline - Date.now() <= 0 || pools.some((p) => p.left <= 0);
  req.left = () => Math.max(0, deadline - Date.now());
  return req;
}
var hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return String(url).slice(0, 80);
  }
};

// src/extractors/streamwish.js
var HOSTS3 = ["hlswish.com", "streamwish.com", "streamwish.to", "strwish.com", "wishembed.com", "filelions.com", "hglink.to", "vibuxer.com"];
async function extract3(embedUrl, req, kino2) {
  const u = new URL(embedUrl);
  if (u.hostname === "hglink.to") u.hostname = "vibuxer.com";
  const referer = u.origin + "/";
  const html = await pageText(req, u.href, { Referer: referer }, kino2, "streamwish");
  if (html == null) return null;
  const url = findIn(html, (t) => hlsKey(t, ["hls4", "hls2", "hls3"], u.origin) || fileM3u8(t, u.origin));
  if (!url) return miss(kino2, "streamwish", "no playlist in page");
  return { url, mime: HLS_MIME, headers: { "User-Agent": UA, Referer: referer }, ...pageExtras(html, u.origin) };
}

// src/extractors/vidhide.js
var vidhide_exports = {};
__export(vidhide_exports, {
  HOSTS: () => HOSTS4,
  extract: () => extract4
});
var HOSTS4 = ["vidhide.com", "vidhidepro.com", "vidhideplus.com", "vidhidefast.com", "dintezuvio.com", "minochinos.com", "filelions.to", "morencius.com"];
async function extract4(embedUrl, req, kino2) {
  const u = new URL(embedUrl);
  const html = await pageText(req, embedUrl, { Referer: u.origin + "/" }, kino2, "vidhide");
  if (html == null) return null;
  const url = findIn(html, (t) => hlsKey(t, ["hls4", "hls2"], u.origin) || fileM3u8(t, u.origin));
  if (!url) return miss(kino2, "vidhide", "no playlist in page");
  return { url, mime: HLS_MIME, headers: { Referer: u.origin + "/", Origin: u.origin }, ...pageExtras(html, u.origin) };
}

// src/extractors/fastream.js
var fastream_exports = {};
__export(fastream_exports, {
  HOSTS: () => HOSTS5,
  extract: () => extract5
});
var HOSTS5 = ["fastream.to"];
async function extract5(embedUrl, req, kino2) {
  const html = await pageText(req, embedUrl, { Referer: "https://fastream.to/" }, kino2, "fastream");
  if (html == null) return null;
  const url = findIn(html, (t) => fileM3u8(t, embedUrl));
  if (!url) return miss(kino2, "fastream", "no playlist in page");
  return { url, mime: HLS_MIME, headers: { Referer: "https://fastream.to/" }, ...pageExtras(html, embedUrl) };
}

// src/extractors/voe.js
var voe_exports = {};
__export(voe_exports, {
  HOSTS: () => HOSTS6,
  canCapture: () => canCapture2,
  decodeVoe: () => decodeVoe,
  extract: () => extract6
});
var HOSTS6 = ["voe.sx"];
var JUNK = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];
var rot13 = (s) => s.replace(/[a-z]/gi, (c) => {
  const b = c <= "Z" ? 65 : 97;
  return String.fromCharCode((c.charCodeAt(0) - b + 13) % 26 + b);
});
function decodeVoe(enc) {
  let s = rot13(enc);
  for (const j of JUNK) s = s.split(j).join("");
  s = atob(s);
  s = [...s].map((c) => String.fromCharCode(c.charCodeAt(0) - 3)).join("");
  s = [...s].reverse().join("");
  return JSON.parse(decodeURIComponent(escape(atob(s))));
}
var redirectOf = (html) => (/window\.location\.href\s*=\s*'([^']+)'/.exec(html) || [])[1] || null;
var canCapture2 = (kino2) => !!(kino2 && kino2.browser && kino2.browser.captureAll === true && typeof kino2.browser.capture === "function");
var CAPTURE_MS2 = 12e3;
var MIN_CAPTURE_MS2 = 3e3;
async function capture(embedUrl, req, kino2) {
  const ms = Math.min(CAPTURE_MS2, (req.left ? req.left() : CAPTURE_MS2) - 300);
  if (ms < MIN_CAPTURE_MS2) {
    kino2.log("[latino]", "voe", "no time to capture");
    return null;
  }
  let cap;
  try {
    cap = await kino2.browser.capture(embedUrl, { match: "\\.m3u8|\\.mp4", timeoutMs: ms });
  } catch (e) {
    kino2.log("[latino]", "voe capture", e && e.code || "error");
    return null;
  }
  const m = cap && Array.isArray(cap.media) ? cap.media.find((x) => x && typeof x.url === "string" && /^https?:\/\//i.test(x.url)) : null;
  if (!m) {
    kino2.log("[latino]", "voe capture", "no media");
    return null;
  }
  const mime = m.mime || (/\.mp4(?:[?#]|$)/i.test(m.url) ? "video/mp4" : HLS_MIME);
  return { url: m.url, mime, headers: { Referer: embedUrl, ...m.headers || {} } };
}
async function extract6(embedUrl, req, kino2) {
  const log = (...a) => {
    if (kino2) kino2.log("[latino]", "voe", ...a);
  };
  const first = await req(embedUrl, { headers: { Referer: embedUrl } });
  if (!first.ok) {
    log("embed", first.status);
    return null;
  }
  let html = first.text();
  const next = redirectOf(html);
  if (next) {
    if (!fetchAllowed(kino2, next)) {
      if (canCapture2(kino2)) return capture(embedUrl, req, kino2);
      log("rotating host, no browser");
      return null;
    }
    try {
      const r = await req(next, { headers: { Referer: embedUrl } });
      if (!r.ok) {
        log("player", r.status);
        return null;
      }
      html = r.text();
    } catch (e) {
      if (!(e && e.code === "host_not_allowed")) throw e;
      if (canCapture2(kino2)) return capture(embedUrl, req, kino2);
      log("host_not_allowed");
      return null;
    }
  }
  const j = /<script type="application\/json">\s*\["([^"]+)"\]/.exec(html);
  if (j) {
    try {
      const d = decodeVoe(j[1]);
      const url = d.source || d.direct_access_url;
      if (url) return { url, mime: /\.mp4/.test(url) ? "video/mp4" : HLS_MIME, headers: { Referer: embedUrl } };
    } catch (_) {
    }
  }
  const h = /'hls'\s*:\s*'([^']+)'/.exec(html) || /(https?:\/\/[^"'\s]+\.mp4[^"'\s]*)/.exec(html);
  if (!h) {
    log("no stream in page");
    return null;
  }
  return { url: h[1], headers: { Referer: embedUrl } };
}

// src/extractors/okru.js
var okru_exports = {};
__export(okru_exports, {
  HOSTS: () => HOSTS7,
  extract: () => extract7,
  playerMetadata: () => playerMetadata,
  renditions: () => renditions,
  unescapeAttr: () => unescapeAttr
});
var HOSTS7 = ["ok.ru"];
var HEIGHT_OF = { mobile: 144, lowest: 240, low: 360, sd: 480, hd: 720, full: 1080, quad: 1440, ultra: 2160 };
var HEADERS = { Referer: "https://ok.ru/" };
var ENTITIES = { quot: '"', amp: "&", apos: "'", lt: "<", gt: ">" };
function unescapeAttr(value) {
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, code) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCharCode(n) : all;
    }
    return ENTITIES[code.toLowerCase()] ?? all;
  });
}
var parse = (text) => {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
};
function playerMetadata(html) {
  const attr = /\bdata-options\s*=\s*"([^"]*)"/.exec(html || "");
  if (!attr) return null;
  const options = parse(unescapeAttr(attr[1]));
  const meta = options && options.flashvars && options.flashvars.metadata;
  if (typeof meta === "string") return parse(meta);
  return meta && typeof meta === "object" ? meta : null;
}
var order = (h) => h == null ? 99999 : h <= 1080 ? 1080 - h : 1e3 + h;
function renditions(meta) {
  const list = meta && Array.isArray(meta.videos) ? meta.videos : [];
  return list.filter((v) => v && typeof v.url === "string" && /^https?:\/\//i.test(v.url) && !v.disallowed).map((v) => {
    const name = String(v.name || "").toLowerCase();
    return { name, height: HEIGHT_OF[name] ?? null, url: v.url };
  }).filter((v) => v.height !== HEIGHT_OF.mobile).sort((a, b) => order(a.height) - order(b.height));
}
async function extract7(embedUrl, req, kino2) {
  const r = await req(embedUrl, { headers: { Accept: "text/html", ...HEADERS } });
  if (!r.ok) return miss(kino2, "okru", "status " + r.status);
  const meta = playerMetadata(r.text());
  if (!meta) return miss(kino2, "okru", "no player settings (removed or restricted video)");
  const [best] = renditions(meta);
  if (best) return { url: best.url, mime: "video/mp4", headers: HEADERS, ...best.height ? { quality: best.height + "p" } : {} };
  const hls = typeof meta.hlsManifestUrl === "string" && /^https?:\/\//i.test(meta.hlsManifestUrl) ? meta.hlsManifestUrl : null;
  return hls ? { url: hls, mime: HLS_MIME, headers: HEADERS } : miss(kino2, "okru", "no renditions");
}

// src/extractors/nupload.js
var nupload_exports = {};
__export(nupload_exports, {
  HOSTS: () => HOSTS8,
  extract: () => extract8
});
var HOSTS8 = ["nupload.me", "nupload.my"];
async function extract8(embedUrl, req, kino2) {
  const origin = new URL(embedUrl).origin;
  const r = await req(embedUrl, { headers: { Referer: origin + "/" } });
  if (!r.ok) return miss(kino2, "nupload", "status " + r.status);
  const html = r.text();
  const arr = /([A-Za-z]+)\.forEach\s*\(function\s+\w+\s*\(value\)\s*\{[^}]+atob/.exec(html);
  if (!arr) return miss(kino2, "nupload", "no encoded address");
  const name = arr[1];
  const off = new RegExp(name + "\\.forEach[^-]+-\\s*(\\d+)").exec(html);
  const list = new RegExp("var\\s+" + name + "\\s*=\\s*(\\[[^\\]]+\\])").exec(html);
  const sesz = /var sesz\s*=\s*"([^"]+)"/.exec(html);
  if (!off || !list || !sesz) return miss(kino2, "nupload", "encoded address incomplete");
  let path = "";
  for (const v of JSON.parse(list[1])) {
    path += String.fromCharCode(parseInt(atob(v).replace(/\D/g, ""), 10) - parseInt(off[1], 10));
  }
  let url;
  try {
    url = new URL(path + "?s=" + sesz[1], origin).href;
  } catch (_) {
    return miss(kino2, "nupload", "bad address");
  }
  return /^https:\/\//i.test(url) ? { url, headers: { Referer: origin + "/", Origin: origin } } : miss(kino2, "nupload", "not https");
}

// src/extractors/byse.js
var byse_exports = {};
__export(byse_exports, {
  HOSTS: () => HOSTS9,
  b64urlToHex: () => b64urlToHex,
  extract: () => extract9
});
var HOSTS9 = ["filemoon.sx", "filemoon.link", "byse.sx", "bysezoxexe.com", "bysezejataos.com", "bysebuho.com", "bysevepoin.com", "byseqekaho.com"];
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64urlToHex(s) {
  const text = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  let bits = 0, acc = 0, hex = "";
  for (const ch of text) {
    const v = B64.indexOf(ch);
    if (v < 0) return null;
    acc = acc << 6 | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      hex += (acc >> bits & 255).toString(16).padStart(2, "0");
      acc &= (1 << bits) - 1;
    }
  }
  return hex;
}
var codeOf = (url) => new URL(url).pathname.replace(/\/+$/, "").split("/").pop();
async function extract9(embedUrl, req, kino2) {
  let u;
  try {
    u = new URL(embedUrl);
  } catch (_) {
    return null;
  }
  const code = codeOf(embedUrl);
  if (!/^[\w-]{4,40}$/.test(code)) return miss(kino2, "byse", "no code");
  const d = await req(u.origin + "/api/videos/" + code + "/embed/details", { headers: { Accept: "application/json", Referer: u.origin + "/" } });
  if (!d.ok) return miss(kino2, "byse", "details " + d.status);
  const frame = d.json() && d.json().embed_frame_url;
  let f;
  try {
    f = new URL(frame);
  } catch (_) {
    return miss(kino2, "byse", "no frame");
  }
  const p = await req(f.origin + "/api/videos/" + codeOf(frame) + "/embed/playback", {
    headers: { Accept: "*/*", Referer: frame, "x-embed-parent": embedUrl }
  });
  if (!p.ok) return miss(kino2, "byse", "playback " + p.status);
  const pb = p.json() && p.json().playback;
  if (!pb || !Array.isArray(pb.key_parts) || pb.key_parts.length < 2) return miss(kino2, "byse", "no key");
  const key = b64urlToHex(pb.key_parts[0]) + b64urlToHex(pb.key_parts[1]);
  const iv = b64urlToHex(pb.iv);
  const data = b64urlToHex(pb.payload);
  if (!/^[0-9a-f]+$/.test(key + (iv || "x") + (data || "x"))) return miss(kino2, "byse", "bad key material");
  const alg = key.length === 32 ? "aes-128-gcm" : key.length === 48 ? "aes-192-gcm" : key.length === 64 ? "aes-256-gcm" : null;
  if (!alg) return miss(kino2, "byse", "key of " + key.length / 2 + " bytes");
  let json;
  try {
    json = kino2.crypto.decrypt(alg, { key, iv, data, keyEncoding: "hex", ivEncoding: "hex", inputEncoding: "hex" });
  } catch (_) {
    return miss(kino2, "byse", "decrypt failed");
  }
  let sources;
  try {
    sources = JSON.parse(json.replace(/^﻿/, "")).sources;
  } catch (_) {
    return miss(kino2, "byse", "bad playback json");
  }
  const url = Array.isArray(sources) && sources[0] && sources[0].url;
  if (typeof url !== "string" || !/^https:\/\//.test(url)) return miss(kino2, "byse", "no source");
  return { url, mime: HLS_MIME, headers: { Referer: u.origin + "/" } };
}

// src/extractors/uqload.js
var uqload_exports = {};
__export(uqload_exports, {
  HOSTS: () => HOSTS10,
  extract: () => extract10,
  sourceOf: () => sourceOf
});
var HOSTS10 = ["uqload.com", "uqload.co", "uqload.cx", "uqload.bz", "uqload.vc", "uqload.is", "uqload.io", "uqload.net"];
function sourceOf(text) {
  const m = /sources\s*:\s*\[\s*(?:\{\s*file\s*:\s*)?["'](https:[^"']+)["']/.exec(text || "");
  return m ? m[1] : null;
}
async function extract10(embedUrl, req, kino2) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino2, "uqload");
  if (html == null) return null;
  const url = findIn(html, sourceOf);
  if (!url) return miss(kino2, "uqload", "no source in page");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? HLS_MIME : "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/streamtape.js
var streamtape_exports = {};
__export(streamtape_exports, {
  HOSTS: () => HOSTS11,
  addressOf: () => addressOf,
  extract: () => extract11
});
var HOSTS11 = ["streamtape.com", "streamtape.net", "streamtape.xyz", "streamtape.to", "shavetape.cash", "watchadsontape.com", "tapewithadblock.org", "strtape.cloud", "strcloud.link", "stape.fun"];
function addressOf(text) {
  const line = /botlink'\)\.innerHTML\s*=\s*([^\n]*)/.exec(text || "");
  if (!line) return null;
  const head = /^\s*(?:'([^']*)'|"([^"]*)")/.exec(line[1]);
  if (!head) return null;
  let out = head[1] ?? head[2];
  const rest = line[1].slice(head[0].length);
  const part = /\+\s*\(\s*(?:'([^']*)'|"([^"]*)")\s*\)((?:\s*\.substring\(\s*\d+\s*\))*)/g;
  let m;
  while (m = part.exec(rest)) {
    let s = m[1] ?? m[2];
    for (const n of m[3].matchAll(/\.substring\(\s*(\d+)\s*\)/g)) s = s.substring(Number(n[1]));
    out += s;
  }
  if (out.startsWith("//")) out = "https:" + out;
  return /^https:\/\/[^/]+\/get_video\?/.test(out) ? out : null;
}
async function extract11(embedUrl, req, kino2) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino2, "streamtape");
  if (html == null) return null;
  const url = addressOf(html);
  if (!url) return miss(kino2, "streamtape", "no address in page");
  return { url: url + "&stream=1", mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/dood.js
var dood_exports = {};
__export(dood_exports, {
  HOSTS: () => HOSTS12,
  extract: () => extract12,
  passPath: () => passPath
});
var HOSTS12 = [
  "dood.la",
  "dood.yt",
  "dood.to",
  "dood.so",
  "dood.ws",
  "dood.pm",
  "dood.wf",
  "dood.re",
  "dood.cx",
  "dood.sh",
  "dood.li",
  "dood.watch",
  "doodstream.com",
  "dooood.com",
  "doods.pro",
  "d0000d.com",
  "d000d.com",
  "ds2play.com",
  "ds2video.com",
  "dsvplay.com",
  "vide0.net",
  "myvidplay.com",
  "playmogo.com"
];
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function passPath(html) {
  const m = /\/pass_md5\/[\w\-/]+/.exec(html || "");
  return m ? m[0] : null;
}
async function extract12(embedUrl, req, kino2) {
  const u = new URL(embedUrl.replace("/d/", "/e/"));
  const page2 = await req(u.href, { headers: { Referer: u.origin + "/" } });
  const path = page2.ok ? passPath(page2.text()) : null;
  if (!path) return captureMedia(u.href, req, kino2, "dood");
  const base = await req(u.origin + path, { headers: { Referer: u.href } });
  const head = base.ok ? base.text().trim() : "";
  if (!/^https:\/\//.test(head)) return captureMedia(u.href, req, kino2, "dood");
  let rand = "";
  for (let i = 0; i < 10; i++) rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const token = path.split("/").pop();
  return { url: head + rand + "?token=" + token + "&expiry=" + Date.now(), mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/index.js
var TABLE = { goodstream: goodstream_exports, vimeos: vimeos_exports, streamwish: streamwish_exports, vidhide: vidhide_exports, fastream: fastream_exports, voe: voe_exports, okru: okru_exports, nupload: nupload_exports, byse: byse_exports, uqload: uqload_exports, streamtape: streamtape_exports, dood: dood_exports };
function extractorFor(embedUrl) {
  let host;
  try {
    host = new URL(embedUrl).hostname.replace(/^www\./, "");
  } catch (_) {
    return null;
  }
  for (const [name, mod] of Object.entries(TABLE)) {
    if (mod.HOSTS.some((h) => host === h || host.endsWith("." + h))) return { name, extract: mod.extract };
  }
  return null;
}
var HOSTS13 = Object.values(TABLE).flatMap((m) => m.HOSTS);

// src/plugin.js
var SITE = "https://pelisflixhd.love";
var API = "https://doraflix.fluxcedene.net/api/gql";
var PLAYER_API = "https://pelisplus.esplay.io/video/";
var TMDB = "https://image.tmdb.org/t/p/w500";
var PER_PAGE = 30;
var MAX_COPIES = 8;
var TRY_AT_ONCE = 3;
var CALL_MS = 16e3;
var ROWS = [
  { id: "new", title: "\xDAltimas pel\xEDculas", sort: "CREATEDAT_DESC", genre: null },
  { id: "popular", title: "M\xE1s populares", sort: "POPULARITY_DESC", genre: null },
  { id: "accion", title: "Acci\xF3n", sort: "CREATEDAT_DESC", genre: "accion" }
];
var LANG = { 38: "Latino", 37: "Castellano", 192: "Subtitulado" };
var LANG_ORDER = ["Latino", "Castellano", "Subtitulado"];
var LIST_QUERY = "query listMovies($page: Int, $perPage: Int, $sort: SortFindManyFilmInput, $filter: FilterFindManyFilmInput) { paginationFilm(page: $page, perPage: $perPage, sort: $sort, filter: $filter) { items { _id title name poster_path slug name_es } pageInfo { currentPage hasNextPage } } }";
var DETAIL_QUERY = "query detailFilm($slug: String!) { detailFilm(filter: {slug: $slug}) { name title name_es overview poster poster_path backdrop backdrop_path genres { name } links_online { _id server lang link } } }";
async function gql(operationName, query, variables) {
  const r = await kino.fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: { json: { operationName, variables, query } }
  });
  if (!r.ok) throw kino.error("unavailable", "the catalog answered " + r.status);
  const data = r.json();
  if (!data || !data.data) throw kino.error("unavailable", "the catalog answered without data");
  return data.data;
}
function posterOf(m) {
  const p = m && (m.poster_path || m.poster) || "";
  if (/^\/[\w.-]+\.(jpg|png|webp)$/i.test(p)) return TMDB + p;
  return /^https:\/\//i.test(p) ? p : void 0;
}
function itemOf(m) {
  const slug = String(m && m.slug || "");
  if (!/^[\w-]{1,120}$/.test(slug)) return null;
  const title = String(m.name_es || m.name || m.title || "").trim();
  if (!title) return null;
  return { id: slug, ref: slug, title: title.slice(0, 120), kind: "movie", poster: posterOf(m) };
}
async function page(row, number) {
  const filter = row.genre ? { isPublish: true, genres: { slug: row.genre } } : { isPublish: true };
  const data = await gql("listMovies", LIST_QUERY, { perPage: PER_PAGE, sort: row.sort, filter, page: number });
  const list = data.paginationFilm && data.paginationFilm.items || [];
  const info = data.paginationFilm && data.paginationFilm.pageInfo || {};
  return { items: list.map(itemOf).filter(Boolean), next: info.hasNextPage ? String(number + 1) : void 0 };
}
async function home() {
  const rows = await Promise.all(ROWS.map(async (row) => {
    try {
      const p = await page(row, 1);
      return p.items.length ? { id: row.id, title: row.title, ref: row.id, items: p.items } : null;
    } catch (_) {
      return null;
    }
  }));
  const out = rows.filter(Boolean);
  if (!out.length) throw kino.error("unavailable", "no row answered");
  return out;
}
async function browse(ref, cursor) {
  const row = ROWS.find((r) => r.id === ref);
  if (!row) return { items: [] };
  const n = Math.max(1, parseInt(cursor, 10) || 1);
  return page(row, n);
}
function parseSearch(html) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const block of String(html || "").split(/<div[^>]*class="[^"]*movie-item/).slice(1)) {
    const href = /href="[^"]*\/pelicula\/([\w-]+)\/?"/.exec(block);
    const title = /class="item-detail"[^>]*>\s*<p[^>]*>([^<]+)</.exec(block);
    if (!href || !title || seen.has(href[1])) continue;
    seen.add(href[1]);
    const img = /<img[^>]+src="([^"]+)"/.exec(block);
    let poster = img ? img[1] : "";
    if (poster.startsWith("//")) poster = "https:" + poster;
    out.push({ id: href[1], ref: href[1], title: title[1].replace(/&amp;/g, "&").trim().slice(0, 120), kind: "movie", poster: /^https:\/\//.test(poster) ? poster : void 0 });
  }
  return out;
}
async function search(query) {
  const q = String(query && query.q || "").trim();
  if (!q) return [];
  const r = await kino.fetch(SITE + "/busqueda/" + encodeURIComponent(q), { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!r.ok) throw kino.error("unavailable", "the site answered " + r.status);
  return parseSearch(r.text()).slice(0, 40);
}
function serversOf(film) {
  const links = (film && film.links_online || []).map((l) => ({ link: String(l && l.link || "").trim(), lang: LANG[l && l.lang] || String(l && l.lang || "Servidor") })).filter((l) => /^https:\/\//i.test(l.link) && understood(l.link));
  const rank = (l) => {
    const i = LANG_ORDER.indexOf(l.lang);
    return i < 0 ? LANG_ORDER.length : i;
  };
  return links.map((l, n) => ({ ...l, n })).sort((a, b) => rank(a) - rank(b) || a.n - b.n).slice(0, MAX_COPIES);
}
function understood(link) {
  return link.includes("player.html#") || hostName(link).endsWith("nupload.top") || extractorFor(link) !== null;
}
function hostName(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch (_) {
    return "servidor";
  }
}
var labelOf = (s) => (s.lang + " \xB7 " + hostName(s.link)).slice(0, 48);
async function filmOf(slug) {
  const data = await gql("detailFilm", DETAIL_QUERY, { slug });
  if (!data.detailFilm) throw kino.error("not_found", "film not found");
  return data.detailFilm;
}
async function openServer(link, req) {
  if (link.includes("player.html#")) {
    const id = link.slice(link.indexOf("player.html#") + "player.html#".length);
    if (!/^[\w-]{1,200}$/.test(id)) return null;
    const r = await req(PLAYER_API + id, { headers: { Accept: "application/json" } });
    const file = r.ok && r.json() && r.json().file;
    if (typeof file !== "string" || !/^https:\/\//.test(file)) return null;
    return { url: file, mime: /\.m3u8(\?|$)/i.test(file) ? HLS_MIME : void 0, headers: { "User-Agent": UA } };
  }
  let embed = link;
  if (hostName(link).endsWith("nupload.top")) {
    const r = await req(link, { headers: { Referer: SITE + "/" } });
    const m = r.ok && /<iframe[^>]+src=["']([^"']+)["']/i.exec(r.text());
    if (!m) return null;
    embed = m[1].startsWith("//") ? "https:" + m[1] : m[1];
  }
  const ex = extractorFor(embed);
  return ex ? ex.extract(embed, req, kino) : null;
}
async function resolve(ref) {
  const [slug, pick] = String(ref || "").split("|");
  if (!/^[\w-]{1,120}$/.test(slug)) throw kino.error("not_found");
  const film = await filmOf(slug);
  const servers = serversOf(film);
  if (!servers.length) throw kino.error("not_found", "no servers");
  const pool = requestPool(54);
  const deadline = Date.now() + CALL_MS;
  const open = (s) => openServer(s.link, makeRequester(kino, { budget: 6, deadline, pools: [pool], maxMs: 8e3 })).catch(() => null);
  if (pick !== void 0) {
    const s = servers.find((x) => String(x.n) === pick);
    const stream = s && await open(s);
    if (!stream) throw kino.error("not_found", "that server did not open");
    return { ...stream, label: labelOf(s) };
  }
  const opened = new Array(servers.length).fill(null);
  let at = -1;
  for (let from = 0; from < servers.length && at < 0 && Date.now() < deadline - 1500; from += TRY_AT_ONCE) {
    const got = await Promise.all(servers.slice(from, from + TRY_AT_ONCE).map(open));
    got.forEach((g, i) => {
      opened[from + i] = g;
    });
    at = opened.findIndex(Boolean);
  }
  if (at < 0) throw kino.error("not_found", "no server opened", { userMessage: "Esta pel\xEDcula no tiene ahora un servidor que abra. Intenta de nuevo m\xE1s tarde." });
  const first = servers[at];
  const alternatives = servers.filter((s) => s !== first).map((s) => {
    const i = servers.indexOf(s);
    return opened[i] ? { ...opened[i], label: labelOf(s) } : { label: labelOf(s), ref: slug + "|" + s.n };
  }).slice(0, MAX_COPIES - 1);
  return { ...opened[at], label: labelOf(first), alternatives };
}
export {
  browse,
  home,
  itemOf,
  parseSearch,
  posterOf,
  resolve,
  search,
  serversOf
};
