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
    if (!url || out.some((t2) => t2.url === url)) continue;
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
  const url = findIn(html, (t2) => fileM3u8(t2, embedUrl));
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
  const url = findIn(html, (t2) => fileM3u8(t2, embedUrl));
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
  version: "0.2.1",
  apiVersion: 9,
  entry: "plugin.js",
  icon: "icon.png",
  description: "Pel\xEDculas en espa\xF1ol latino, castellano o subtituladas de pelisflixhd.love, con slider, g\xE9neros y buscador.",
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
  browser: true,
  theme: {
    accent: "#E50914",
    onAccent: "#FFFFFF",
    background: "#0C0708",
    surface: "#1B1214",
    highlight: "#F7C6C9"
  },
  enhancements: {
    "14": {
      capabilities: [
        "screen"
      ],
      screen: {
        label: "PeliculasFlix",
        labelEn: "PeliculasFlix",
        icon: "movie",
        menuOpens: "screen",
        opensFrom: [
          "menu",
          "settings"
        ],
        settingsButton: {
          label: "Abrir PeliculasFlix",
          labelEn: "Open PeliculasFlix"
        },
        settingsIn: "screen"
      }
    },
    "19": {
      capabilities: [
        "screen"
      ]
    }
  }
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
  const url = findIn(html, (t2) => hlsKey(t2, ["hls4", "hls2", "hls3"], u.origin) || fileM3u8(t2, u.origin));
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
  const url = findIn(html, (t2) => hlsKey(t2, ["hls4", "hls2"], u.origin) || fileM3u8(t2, u.origin));
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
  const url = findIn(html, (t2) => fileM3u8(t2, embedUrl));
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
  const page = await req(u.href, { headers: { Referer: u.origin + "/" } });
  const path = page.ok ? passPath(page.text()) : null;
  if (!path) return captureMedia(u.href, req, kino2, "dood");
  const base = await req(u.origin + path, { headers: { Referer: u.href } });
  const head = base.ok ? base.text().trim() : "";
  if (!/^https:\/\//.test(head)) return captureMedia(u.href, req, kino2, "dood");
  let rand = "";
  for (let i = 0; i < 10; i++) rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const token = path.split("/").pop();
  return { url: head + rand + "?token=" + token + "&expiry=" + Date.now(), mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/mixdrop.js
var mixdrop_exports = {};
__export(mixdrop_exports, {
  HOSTS: () => HOSTS13,
  extract: () => extract13,
  wurlOf: () => wurlOf
});
var HOSTS13 = ["mixdrop.top", "mixdrop.co", "mixdrop.to", "mixdrop.ch", "mixdrop.ag", "mixdrop.bz", "mixdrop.sx", "mixdrop.gl", "mxdrop.click", "mxcontent.net", "m1xdrop.com"];
function wurlOf(text) {
  const m = /wurl\s*=\s*"((?:https?:)?\/\/[^"]+)"/.exec(text || "");
  return m ? m[1] : null;
}
async function extract13(embedUrl, req, kino2) {
  const u = new URL(embedUrl.replace("/f/", "/e/"));
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino2, "mixdrop");
  if (html == null) return null;
  const raw = findIn(html, wurlOf);
  if (!raw) return miss(kino2, "mixdrop", "no wurl in page");
  const url = raw.startsWith("//") ? "https:" + raw : raw;
  if (!/^https:\/\//.test(url)) return miss(kino2, "mixdrop", "not https");
  return { url, mime: "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/mp4upload.js
var mp4upload_exports = {};
__export(mp4upload_exports, {
  HOSTS: () => HOSTS14,
  extract: () => extract14,
  srcOf: () => srcOf
});
var HOSTS14 = ["mp4upload.com"];
function srcOf(text) {
  const m = /player\.src\(\s*"([^"]+)"/.exec(text || "") || /player\.src\(\s*\{[\s\S]*?\bsrc\s*:\s*"([^"]+)"/.exec(text || "");
  return m ? m[1] : null;
}
async function extract14(embedUrl, req, kino2) {
  const id = /mp4upload\.com\/(?:embed-)?([A-Za-z0-9]+)/.exec(embedUrl);
  const page = id ? "https://www.mp4upload.com/embed-" + id[1] + ".html" : embedUrl;
  const html = await pageText(req, page, { Referer: "https://www.mp4upload.com/" }, kino2, "mp4upload");
  if (html == null) return null;
  const url = findIn(html, srcOf);
  if (!url || !/^https:\/\//.test(url)) return miss(kino2, "mp4upload", "no source in page");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? "application/vnd.apple.mpegurl" : "video/mp4", headers: { Referer: "https://www.mp4upload.com/" } };
}

// src/extractors/hexload.js
var hexload_exports = {};
__export(hexload_exports, {
  HOSTS: () => HOSTS15,
  extract: () => extract15,
  formOf: () => formOf
});
var HOSTS15 = ["hexload.com"];
function formOf(html) {
  const block = /data\s*:\s*\{([^}]*)\}/.exec(html || "");
  if (!block) return null;
  const out = {};
  for (const m of block[1].matchAll(/(\w+)\s*:\s*['"]([\w-]+)['"]/g)) out[m[1]] = m[2];
  return Object.keys(out).length ? out : null;
}
async function extract15(embedUrl, req, kino2) {
  const u = new URL(embedUrl);
  const html = await pageText(req, u.href, { Referer: u.origin + "/" }, kino2, "hexload");
  if (html == null) return null;
  const form = formOf(html);
  if (!form) return miss(kino2, "hexload", "no request form in page");
  const r = await req(u.origin + "/download", { method: "POST", body: { form }, headers: { Referer: u.href, Accept: "application/json" } });
  if (!r.ok) return miss(kino2, "hexload", "download " + r.status);
  const j = r.json();
  const url = j && j.result && j.result.url;
  if (typeof url !== "string" || !/^https:\/\//.test(url)) return miss(kino2, "hexload", "no address");
  return { url, mime: /\.m3u8(\?|$)/i.test(url) ? "application/vnd.apple.mpegurl" : "video/mp4", headers: { Referer: u.origin + "/" } };
}

// src/extractors/savefiles.js
var savefiles_exports = {};
__export(savefiles_exports, {
  HOSTS: () => HOSTS16,
  extract: () => extract16
});
var HOSTS16 = ["savefiles.com", "streamhls.to"];
async function extract16(embedUrl, req, kino2) {
  return captureMedia(embedUrl, req, kino2, "savefiles");
}

// src/extractors/index.js
var TABLE = { goodstream: goodstream_exports, vimeos: vimeos_exports, streamwish: streamwish_exports, vidhide: vidhide_exports, fastream: fastream_exports, voe: voe_exports, okru: okru_exports, nupload: nupload_exports, byse: byse_exports, uqload: uqload_exports, streamtape: streamtape_exports, dood: dood_exports, mixdrop: mixdrop_exports, mp4upload: mp4upload_exports, hexload: hexload_exports, savefiles: savefiles_exports };
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
var HOSTS17 = Object.values(TABLE).flatMap((m) => m.HOSTS);

// src/browse/model.js
var MAX_SLIDES = 6;
var MAX_RAILS = 8;
var MAX_RAIL_ITEMS = 20;
var MAX_SLIDE_TEXT = 160;
var HTTPS = /^https:\/\//;
function cardOf(item) {
  const out = { id: item.id, ref: item.ref, title: item.title, kind: item.kind };
  if (item.poster && HTTPS.test(item.poster)) out.poster = item.poster;
  if (item.backdrop && HTTPS.test(item.backdrop)) out.backdrop = item.backdrop;
  if (item.year !== void 0) out.year = item.year;
  if (item.lang) out.lang = item.lang;
  return out;
}
function slidesOf(rows) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row of rows) {
    for (const item of row.items) {
      if (out.length >= MAX_SLIDES) return out;
      const image2 = item.backdrop && HTTPS.test(item.backdrop) ? item.backdrop : item.poster;
      if (seen.has(item.id) || !image2 || !HTTPS.test(image2)) continue;
      const text = typeof item.overview === "string" ? item.overview.trim() : "";
      if (text === "") continue;
      seen.add(item.id);
      out.push({ id: item.id, ref: item.ref, kind: item.kind, title: item.title, image: image2, text: text.length <= MAX_SLIDE_TEXT ? text : `${text.slice(0, MAX_SLIDE_TEXT - 1).trimEnd()}\u2026` });
    }
  }
  return out;
}
function railsOf(rows) {
  return rows.filter((r) => !r.hidden && r.items && r.items.length > 0).slice(0, MAX_RAILS).map((r) => ({
    id: r.id,
    title: r.title,
    ...r.titleEn ? { titleEn: r.titleEn } : {},
    ...r.ref ? { ref: r.ref } : {},
    items: r.items.slice(0, MAX_RAIL_ITEMS).map(cardOf)
  }));
}
function tabOf(page) {
  const rows = page && Array.isArray(page.rows) ? page.rows : [];
  const rails = railsOf(rows);
  if (rails.length === 0) return null;
  return { slides: slidesOf(rows), rails };
}
function recentOf(keys, tabs) {
  if (keys.length === 0) return [];
  const byRef = /* @__PURE__ */ new Map();
  for (const data of tabs) for (const rail2 of data.rails) for (const card of rail2.items) if (!byRef.has(card.ref)) byRef.set(card.ref, card);
  const out = [];
  const used = /* @__PURE__ */ new Set();
  for (const key of keys) {
    const card = byRef.get(key);
    if (card && !used.has(card.id)) {
      used.add(card.id);
      out.push(card);
    }
  }
  return out;
}

// src/i18n.js
var T = {
  brWatch: ["Ver ahora", "Watch now"],
  brInfo: ["M\xE1s informaci\xF3n", "More info"],
  brRecent: ["Continuar viendo", "Continue watching"],
  brEmpty: ["No hay t\xEDtulos para mostrar ahora.", "There is nothing to show right now."],
  brFailed: ["No se pudo cargar esta secci\xF3n. Revisa tu conexi\xF3n.", "This section could not be loaded. Check your connection."],
  brRetry: ["Reintentar", "Retry"],
  brClose: ["Cerrar", "Close"],
  brBack: ["Atr\xE1s", "Back"],
  brSearch: ["Buscar", "Search"],
  brSearchHint: ["Escribe un t\xEDtulo", "Type a title"],
  brSearchTitle: ["Buscar", "Search"],
  brSearchFailed: ["La b\xFAsqueda no respondi\xF3. Intenta de nuevo.", "The search did not answer. Try again."],
  brNoResults: ["No encontramos nada con esas palabras.", "Nothing matched those words."],
  brSearchedBefore: ["Buscados antes", "Searched before"],
  noServer: ["Esta pel\xEDcula no tiene ahora un servidor que abra. Intenta de nuevo m\xE1s tarde.", "This movie has no server that opens right now. Try again later."],
  siteDown: ["El cat\xE1logo no responde ahora. Intenta de nuevo en un rato.", "The catalog is not answering right now. Try again in a moment."]
};
function both(key, vars = {}) {
  const pair = T[key] || [key, key];
  const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => k in vars ? String(vars[k]) : "");
  return { es: fill(pair[0]), en: fill(pair[1]) };
}
function t(kino2, key, vars) {
  const w = both(key, vars);
  return String(kino2 && kino2.lang || "").toLowerCase().startsWith("es") ? w.es : w.en;
}

// src/browse/logo.js
var LOGO_ASPECT = "500:120";
var LOGO_DATA = "data:image/png;base64,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";

// src/browse/view.js
var POLL_MS = 1500;
var SEARCH_CAP = 60;
var twin = (key, field = "text", vars) => {
  const w = both(key, vars);
  return { [field]: w.es, [field + "En"]: w.en };
};
var tabLabel = (tab) => ({ label: tab.es, labelEn: tab.en });
var railSkeleton = (n) => ({
  type: "Column",
  key: "skel" + n,
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, sizes: ["compact"], children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}c${i}`, flex: 1 })) },
    { type: "Row", gap: 12, sizes: ["medium", "expanded"], children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}w${i}`, flex: 1 })) }
  ]
});
var gridSkeleton = () => ({
  type: "Column",
  key: "gridSkeleton",
  gap: 12,
  children: [
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["compact"], key: `gc${r}`, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `gc${r}-${i}`, flex: 1 })) })),
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["medium", "expanded"], key: `gw${r}`, children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `gw${r}-${i}`, flex: 1 })) }))
  ]
});
var heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var slideNode = (s, canPlay) => ({
  type: "heroCard",
  key: "slide-" + s.id,
  h: { compact: 200, expanded: 240 },
  title: s.title,
  text: s.text,
  image: s.image,
  buttons: canPlay ? [
    { type: "ElevatedButton", key: "watch-" + s.id, ...twin("brWatch", "labelText"), icon: "play", onPressed: { go: { play: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } },
    { type: "TextButton", key: "info-" + s.id, ...twin("brInfo", "labelText"), onPressed: { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } }
  ] : [
    { type: "ElevatedButton", key: "watch-" + s.id, ...twin("brWatch", "labelText"), icon: "play", onPressed: { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } }
  ]
});
var hero = (slides, canPlay) => slides.length === 1 ? slideNode(slides[0], canPlay) : { type: "PageView", key: "hero", autoPlayMs: 6e3, children: slides.map((x) => slideNode(x, canPlay)) };
var rail = (r, key, titleOverride) => ({
  type: "titleRail",
  key,
  ...titleOverride || { title: r.title, ...r.titleEn ? { titleEn: r.titleEn } : {} },
  ...r.ref ? { ref: r.ref } : {},
  items: r.items,
  size: "medium"
});
var brandNode = (brand) => ({
  type: "Image",
  key: "logo",
  url: LOGO_DATA,
  aspect: LOGO_ASPECT,
  fit: "contain",
  h: 40,
  alt: brand,
  altEn: brand,
  fallback: { type: "Text", text: brand, textEn: brand, style: "h4" }
});
var tabBar = (tabs, active) => ({ type: "TabBar", key: "tabs", divider: false, value: active, onChanged: "tab", tabs: tabs.map((t2) => ({ value: t2.id, ...tabLabel(t2) })) });
function browseView({ brand, tabs, tab, data, recent, pending, failed, canPlay = false, device = "phone" }) {
  const tv = device === "tv";
  const active = tabs.some((t2) => t2.id === tab) ? tab : tabs[0].id;
  const body = [];
  if (data) {
    if (data.slides.length > 0) body.push(hero(data.slides, canPlay));
    if (recent.length > 0) body.push(rail({ items: recent }, "recent", twin("brRecent", "title")));
    for (const r of data.rails) body.push(rail(r, "rail-" + String(r.id).replace(/[^A-Za-z0-9_-]/g, "_")));
    if (data.rails.length === 0) body.push({ type: "Text", ...twin("brEmpty", "text"), color: "muted" });
  } else if (failed) {
    body.push({ type: "MaterialBanner", key: "loadFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "retry" } });
  } else {
    body.push(heroSkeleton(), railSkeleton(1), railSkeleton(2), railSkeleton(3));
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin("brClose", "labelText"), ...twin("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
      actions: tv ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin("brSearch", "labelText"), ...twin("brSearch", "tooltip"), onPressed: "openSearch" }] : [],
      // On a TV the tabs sit in the bar beside the name (one row, one D-pad strip); elsewhere they are pinned under it.
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [brandNode(brand), tabBar(tabs, active)] } : brandNode(brand)
    },
    ...tv ? {} : { floatingActionButton: { type: "FloatingActionButton", key: "searchFab", icon: "search", ...twin("brSearch", "tooltip"), onPressed: "openSearch" } },
    body: { type: "Column", key: "page", children: [
      ...tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(tabs, active)] }],
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] }
    ] },
    ...pending ? { every: { ms: POLL_MS, event: "tick" } } : {}
  };
}
function searchView({ query, status, items, history = [], device = "phone" }) {
  const tv = device === "tv";
  const searchForm = () => ({
    type: "Form",
    key: "searchForm",
    onSubmitted: "search",
    gap: 8,
    children: tv ? [{ type: "Row", key: "searchRow", gap: 16, crossAxisAlignment: "center", children: [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true, weight: 1 },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ] }] : [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ]
  });
  const body = tv ? [] : [searchForm()];
  if (status === "fail") {
    body.push({ type: "MaterialBanner", key: "searchFailed", role: "error", ...twin("brSearchFailed"), action: { ...twin("brRetry", "label"), onTap: "sretry" } });
  } else if (status === "done" && items) {
    if (items.length === 0) body.push({ type: "Text", ...twin("brNoResults", "text"), color: "muted" });
    else body.push({ type: "titleGrid", key: "results", columns: { compact: 3, expanded: 6 }, items: items.slice(0, SEARCH_CAP) });
  } else if (status !== "idle") {
    body.push(gridSkeleton());
  } else if (history.length > 0) {
    body.push({ type: "Text", ...twin("brSearchedBefore", "text"), style: "h4" });
    body.push({ type: "titleGrid", key: "history", columns: { compact: 3, expanded: 6 }, items: history.slice(0, SEARCH_CAP) });
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" },
      ...tv ? { title: searchForm() } : twin("brSearchTitle", "title")
    },
    body: { type: "SingleChildScrollView", key: "search-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...status === "loading" ? { every: { ms: 1e3, event: "stick" } } : {}
  };
}

// src/browse/index.js
var SNAP_TTL_MS = 12 * 3600 * 1e3;
var SNAP_MAX = 20 * 1024;
var RECENT_MAX = 12;
var HIST_MAX = 24;
function makeBrowse({ kino: kino2, brand, tabs, loadTab: loadTab2, searchTitles, canPlay = false }) {
  const TAB_IDS = tabs.map((t2) => t2.id);
  const TAB_KEY = "browseTab";
  const SNAP_PREFIX = "browse1:";
  const RECENT_KEY = "recent1";
  const HIST_KEY = "searchHist1";
  const memo = /* @__PURE__ */ new Map();
  const log = (...a) => {
    try {
      kino2.log("[" + brand + "]", ...a);
    } catch (_) {
    }
  };
  const get = (k) => {
    try {
      return kino2.storage.get(k);
    } catch (_) {
      return null;
    }
  };
  const set = (k, v, opts) => {
    try {
      kino2.storage.set(k, v, opts);
    } catch (_) {
    }
  };
  function readSnap(tab) {
    try {
      const o = JSON.parse(get(SNAP_PREFIX + tab) || "null");
      return o && Date.now() - o.at < SNAP_TTL_MS && o.data && Array.isArray(o.data.rails) ? o.data : null;
    } catch (_) {
      return null;
    }
  }
  function writeSnap(tab, data) {
    for (let per = 10; per >= 3; per -= 2) {
      const slim2 = { slides: data.slides.slice(0, 4), rails: data.rails.map((r) => ({ ...r, items: r.items.slice(0, per) })) };
      const text = JSON.stringify({ at: Date.now(), data: slim2 });
      if (text.length <= SNAP_MAX) {
        set(SNAP_PREFIX + tab, text, { ttlMs: SNAP_TTL_MS });
        return;
      }
    }
  }
  const stored = () => {
    const t2 = get(TAB_KEY);
    return TAB_IDS.includes(t2) ? t2 : null;
  };
  const remember = (tab) => set(TAB_KEY, tab);
  function dataOf(tab) {
    if (memo.has(tab)) return memo.get(tab).data;
    const snap = readSnap(tab);
    if (snap) {
      memo.set(tab, { data: snap, whole: false });
      return snap;
    }
    return null;
  }
  const readKeys = () => {
    try {
      const a = JSON.parse(get(RECENT_KEY) || "[]");
      return Array.isArray(a) ? a.filter((k) => typeof k === "string") : [];
    } catch (_) {
      return [];
    }
  };
  function notePlayed(ref) {
    try {
      const key = String(ref || "");
      if (key === "") return;
      const keys = readKeys();
      if (keys[0] === key) return;
      set(RECENT_KEY, JSON.stringify([key, ...keys.filter((k) => k !== key)].slice(0, RECENT_MAX)));
    } catch (_) {
    }
  }
  const slim = (c) => ({ id: c.id, ref: c.ref, title: c.title, kind: c.kind, ...c.poster ? { poster: c.poster } : {} });
  function readHistory() {
    try {
      const a = JSON.parse(get(HIST_KEY) || "[]");
      return Array.isArray(a) ? a.filter((c) => c && typeof c.id === "string" && typeof c.ref === "string" && typeof c.title === "string").slice(0, HIST_MAX) : [];
    } catch (_) {
      return [];
    }
  }
  function rememberFound(cards) {
    try {
      const fresh = cards.slice(0, 12).map(slim);
      const ids = new Set(fresh.map((c) => c.id));
      set(HIST_KEY, JSON.stringify([...fresh, ...readHistory().filter((c) => !ids.has(c.id))].slice(0, HIST_MAX)));
    } catch (_) {
    }
  }
  let found = null;
  const tabFromArgs = (route) => {
    const a = route && route.args && typeof route.args === "object" ? route.args : {};
    return TAB_IDS.includes(a.tab) ? a.tab : null;
  };
  function needed(tab, device) {
    const order2 = [tab, ...TAB_IDS.filter((t2) => t2 !== tab)];
    return order2.filter((t2, i) => (i === 0 || device !== "tv") && !(memo.get(t2) && memo.get(t2).whole));
  }
  function view(ctx) {
    const st = ctx.state && typeof ctx.state === "object" ? ctx.state : {};
    if (ctx.route && ctx.route.name === "search") {
      const query = typeof st.sq === "string" ? st.sq : "";
      const items = found && found.q === query ? found.items : null;
      const status = query === "" ? "idle" : st.sstate === "fail" ? "fail" : items ? "done" : "loading";
      return searchView({ query, status, items, history: query === "" ? readHistory() : [], device: ctx.device });
    }
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(ctx.route) ?? stored() ?? TAB_IDS[0];
    const data = dataOf(tab);
    const loaded = TAB_IDS.map((t2) => memo.get(t2)).filter(Boolean).map((m) => m.data);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    return browseView({ brand, tabs, tab, data, recent: recentOf(readKeys(), loaded), pending, failed: !!(st.failed && st.failed[tab]), canPlay, device: ctx.device });
  }
  async function load(tab) {
    const page = await loadTab2(tab);
    const data = tabOf(page);
    if (data) {
      memo.set(tab, { data, whole: true });
      writeSnap(tab, data);
    }
    return data !== null;
  }
  const events = {
    open({ route, state, device }) {
      const tab = tabFromArgs(route) ?? (TAB_IDS.includes(state.tab) ? state.tab : stored() ?? TAB_IDS[0]);
      for (const t2 of TAB_IDS) dataOf(t2);
      return { state: { tab, pending: needed(tab, device), failed: null } };
    },
    tab({ value, arg, state }) {
      const tab = TAB_IDS.includes(value) ? value : TAB_IDS.includes(arg) ? arg : null;
      if (!tab) return null;
      remember(tab);
      dataOf(tab);
      const failed = { ...state.failed || {} };
      delete failed[tab];
      const pending = [tab, ...Array.isArray(state.pending) ? state.pending.filter((t2) => t2 !== tab) : []];
      return { state: { tab, pending: memo.get(tab) && memo.get(tab).whole ? pending.slice(1) : pending, failed } };
    },
    retry({ state, device }) {
      const tab = TAB_IDS.includes(state.tab) ? state.tab : TAB_IDS[0];
      return { state: { failed: null, pending: [tab, ...needed(tab, device).filter((t2) => t2 !== tab)] } };
    },
    async tick({ state }) {
      const pending = Array.isArray(state.pending) ? state.pending : [];
      if (pending.length === 0) return null;
      const [next, ...rest] = pending;
      const failed = { ...state.failed || {} };
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
      } catch (e) {
        log("browse tab", e && e.code || "error");
        failed[next] = true;
      }
      return { state: { pending: rest, failed } };
    },
    // The floating button: straight to the search page, empty and ready for the words.
    openSearch() {
      return { route: { push: "search" }, state: { sq: "", sstate: null } };
    },
    search({ value, route }) {
      const q = value && typeof value.q === "string" ? value.q.trim().slice(0, 100) : "";
      if (q === "") return null;
      const state = { sq: q, sstate: "loading" };
      return route && route.name === "search" ? { state } : { route: { push: "search" }, state };
    },
    // The search page's timer: one search per press, then no timer.
    async stick({ state }) {
      const q = typeof state.sq === "string" ? state.sq : "";
      if (q === "" || state.sstate !== "loading") return null;
      try {
        const out = await searchTitles(q);
        found = { q, items: (Array.isArray(out) ? out : []).slice(0, 60).map(cardOf) };
        rememberFound(found.items);
        return { state: { sstate: "done" } };
      } catch (e) {
        log("browse search", e && e.code || "error");
        return { state: { sstate: "fail" } };
      }
    },
    sretry({ state }) {
      return typeof state.sq === "string" && state.sq !== "" ? { state: { sstate: "loading" } } : null;
    },
    back() {
      return { route: { pop: true }, state: { sq: null, sstate: null } };
    }
  };
  async function event(ev) {
    const handler = Object.hasOwn(events, ev.name) ? events[ev.name] : null;
    return handler ? await handler({ ...ev, state: ev.state || {} }) ?? null : null;
  }
  return { view, event, notePlayed };
}

// src/plugin.js
var BRAND = "PeliculasFlix";
var API = "https://doraflix.fluxcedene.net/api/gql";
var PLAYER_API = "https://pelisplus.esplay.io/video/";
var TMDB = "https://image.tmdb.org/t/p/w500";
var TMDB_BACK = "https://image.tmdb.org/t/p/w1280";
var SITE = "https://pelisflixhd.love";
var PER_PAGE = 30;
var SLIDES = 6;
var MAX_COPIES = 8;
var TRY_AT_ONCE = 3;
var CALL_MS = 16e3;
var GENRES = [
  ["accion", "Acci\xF3n", "Action"],
  ["aventura", "Aventura", "Adventure"],
  ["comedia", "Comedia", "Comedy"],
  ["drama", "Drama", "Drama"],
  ["terror", "Terror", "Horror"],
  ["ciencia-ficcion", "Ciencia ficci\xF3n", "Sci-fi"],
  ["animacion", "Animaci\xF3n", "Animation"],
  ["romance", "Romance", "Romance"],
  ["thriller", "Suspenso", "Thriller"],
  ["fantasia", "Fantas\xEDa", "Fantasy"],
  ["familia", "Familia", "Family"],
  ["crimen", "Crimen", "Crime"]
];
var LISTS = {
  new: { sort: "CREATEDAT_DESC", es: "\xDAltimas pel\xEDculas", en: "Latest movies" },
  popular: { sort: "POPULARITY_DESC", es: "M\xE1s populares", en: "Most popular" },
  ...Object.fromEntries(GENRES.map(([slug, es, en]) => ["g:" + slug, { sort: "CREATEDAT_DESC", genre: slug, es, en }]))
};
var TABS = [
  { id: "inicio", es: "Inicio", en: "Home", lists: ["new", "popular", "g:accion", "g:comedia", "g:terror", "g:animacion"] },
  { id: "populares", es: "Populares", en: "Popular", lists: ["popular", "g:aventura", "g:ciencia-ficcion", "g:thriller"] },
  { id: "generos", es: "G\xE9neros", en: "Genres", lists: ["g:accion", "g:aventura", "g:comedia", "g:drama", "g:terror", "g:ciencia-ficcion", "g:romance", "g:fantasia"] }
];
var LIST_QUERY = "query listFilms($filter: FilterFindManyFilmInput, $limit: Int, $skip: Int, $sort: SortFindManyFilmInput) { listFilms(filter: $filter, limit: $limit, skip: $skip, sort: $sort) { name title name_es slug poster_path poster } }";
var SEARCH_QUERY = "query searchFilm($q: String!, $limit: Int) { searchFilm(input: $q, limit: $limit) { name title name_es slug poster_path poster } }";
var CAROUSEL_QUERY = "query carrouselFilms($limit: Float) { carrouselFilms(limit: $limit) { name title name_es slug overview poster_path poster backdrop_path backdrop } }";
var DETAIL_QUERY = "query detailFilm($slug: String!) { detailFilm(filter: {slug: $slug}) { name title name_es overview poster poster_path backdrop backdrop_path genres { name } links_online { _id server lang link } } }";
var LANG = { 38: "Latino", 37: "Castellano", 192: "Subtitulado" };
var LANG_ORDER = ["Latino", "Castellano", "Subtitulado"];
async function gql(operationName, query, variables) {
  const r = await kino.fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: { json: { operationName, variables, query } }
  });
  if (!r.ok) throw kino.error("unavailable", "the catalog answered " + r.status, { userMessage: t(kino, "siteDown") });
  const data = r.json();
  if (!data || !data.data) throw kino.error("unavailable", "the catalog answered without data", { userMessage: t(kino, "siteDown") });
  return data.data;
}
var image = (base, p) => /^\/[\w.-]+\.(jpg|png|webp)$/i.test(p || "") ? base + p : /^https:\/\//i.test(p || "") ? p : void 0;
var posterOf = (m) => image(TMDB, m && (m.poster_path || m.poster));
var backdropOf = (m) => image(TMDB_BACK, m && (m.backdrop_path || m.backdrop));
function itemOf(m) {
  const slug = String(m && m.slug || "");
  if (!/^[\w-]{1,120}$/.test(slug)) return null;
  const title = String(m.name_es || m.name || m.title || "").trim();
  if (!title) return null;
  return { id: slug, ref: slug, title: title.slice(0, 120), kind: "movie", poster: posterOf(m) };
}
async function listing(ref, page = 1) {
  const l = LISTS[ref];
  if (!l) return { items: [], next: void 0 };
  const filter = l.genre ? { isPublish: true, genres: { slug: l.genre } } : { isPublish: true };
  const data = await gql("listFilms", LIST_QUERY, { filter, limit: PER_PAGE, skip: (page - 1) * PER_PAGE, sort: l.sort });
  const films = Array.isArray(data.listFilms) ? data.listFilms : [];
  return { items: films.map(itemOf).filter(Boolean), next: films.length >= PER_PAGE ? String(page + 1) : void 0 };
}
var rowOf = (ref, items) => ({ id: ref, title: LISTS[ref].es, titleEn: LISTS[ref].en, ref, items });
async function home() {
  const refs = ["new", "popular", "g:accion", "g:comedia", "g:terror"];
  const rows = await Promise.all(refs.map(async (ref) => {
    try {
      const p = await listing(ref, 1);
      return p.items.length ? rowOf(ref, p.items) : null;
    } catch (_) {
      return null;
    }
  }));
  const out = rows.filter(Boolean);
  if (!out.length) throw kino.error("unavailable", "no list answered", { userMessage: t(kino, "siteDown") });
  return out.map(({ titleEn, ...row }) => row);
}
async function browse(ref, cursor) {
  return listing(ref, Math.max(1, parseInt(cursor, 10) || 1));
}
async function search(query) {
  const q = String(query && query.q || "").trim();
  if (!q) return [];
  const data = await gql("searchFilm", SEARCH_QUERY, { q, limit: 40 });
  return (Array.isArray(data.searchFilm) ? data.searchFilm : []).map(itemOf).filter(Boolean);
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
  const servers = serversOf(await filmOf(slug));
  if (!servers.length) throw kino.error("not_found", "no servers", { userMessage: t(kino, "noServer") });
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
  if (at < 0) throw kino.error("not_found", "no server opened", { userMessage: t(kino, "noServer") });
  const first = servers[at];
  const alternatives = servers.filter((s) => s !== first).map((s) => {
    const i = servers.indexOf(s);
    return opened[i] ? { ...opened[i], label: labelOf(s) } : { label: labelOf(s), ref: slug + "|" + s.n };
  }).slice(0, MAX_COPIES - 1);
  const out = { ...opened[at], label: labelOf(first), alternatives };
  try {
    browseScreen().notePlayed(slug);
  } catch (_) {
  }
  return out;
}
async function loadTab(tabId) {
  const tab = TABS.find((x) => x.id === tabId);
  if (!tab) return { rows: [] };
  const [rows, slides] = await Promise.all([
    Promise.all(tab.lists.map(async (ref) => {
      try {
        const p = await listing(ref, 1);
        return p.items.length ? rowOf(ref, p.items) : null;
      } catch (_) {
        return null;
      }
    })),
    tab.id === "inicio" ? carousel() : Promise.resolve([])
  ]);
  const out = rows.filter(Boolean);
  return { rows: slides.length ? [{ id: "carousel", title: "", items: slides, hidden: true }, ...out] : out };
}
async function carousel() {
  try {
    const data = await gql("carrouselFilms", CAROUSEL_QUERY, { limit: SLIDES });
    return (Array.isArray(data.carrouselFilms) ? data.carrouselFilms : []).map((m) => {
      const it = itemOf(m);
      return it ? { ...it, overview: String(m.overview || "").trim(), backdrop: backdropOf(m) } : null;
    }).filter(Boolean);
  } catch (_) {
    return [];
  }
}
var browseInstance = null;
var browseScreen = () => browseInstance ?? (browseInstance = makeBrowse({
  kino,
  brand: BRAND,
  tabs: TABS.map(({ id, es, en }) => ({ id, es, en })),
  loadTab,
  searchTitles: (q) => search({ q }),
  canPlay: true
  // a film plays straight from the slider
}));
async function screen(ctx) {
  await null;
  return browseScreen().view(ctx && typeof ctx === "object" ? ctx : {});
}
async function screenEvent(ev) {
  await null;
  return browseScreen().event(ev && typeof ev === "object" ? ev : {});
}
export {
  TABS,
  backdropOf,
  browse,
  home,
  itemOf,
  posterOf,
  resolve,
  screen,
  screenEvent,
  search,
  serversOf
};
