// src/extractors/shared.js
var HLS_MIME = "application/vnd.apple.mpegurl";

// kino-plugin.json
var kino_plugin_default = {
  id: "peliculasflix",
  name: "PeliculasFlix",
  version: "0.6.0",
  apiVersion: 20,
  entry: "plugin.js",
  icon: "icon.png",
  description: "Pel\xC3\xADculas en espa\xC3\xB1ol latino, castellano o subtituladas de pelisflixhd.love, con slider, g\xC3\xA9neros y buscador.",
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
    "resolve",
    "screen"
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
  settings: [
    {
      key: "lang",
      type: "select",
      label: "Idioma preferido",
      labelEn: "Preferred language",
      default: "latino",
      options: [
        {
          value: "latino",
          label: "Latino",
          labelEn: "Latin Spanish"
        },
        {
          value: "castellano",
          label: "Castellano",
          labelEn: "Spain Spanish"
        },
        {
          value: "subtitulado",
          label: "Subtitulado",
          labelEn: "Subtitled"
        }
      ],
      hint: "Se prueba primero al reproducir; los otros quedan como copias.",
      hintEn: "Tried first when you play; the others stay as copies."
    }
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
  },
  consumes: {
    resolver: {
      repo: "xuper-plugin/kino-plugin-kino-resolver",
      door: "resolver",
      calls: [
        "resolve"
      ]
    }
  },
  recommends: [
    "xuper-plugin/kino-plugin-kino-resolver"
  ]
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
  brSettings: ["Ajustes", "Settings"],
  brSearchHint: ["Escribe un t\xEDtulo", "Type a title"],
  brSearchTitle: ["Buscar", "Search"],
  brSearchFailed: ["La b\xFAsqueda no respondi\xF3. Intenta de nuevo.", "The search did not answer. Try again."],
  brNoResults: ["No encontramos nada con esas palabras.", "Nothing matched those words."],
  brSearchedBefore: ["Buscados antes", "Searched before"],
  noServer: ["Esta pel\xEDcula no tiene ahora un servidor que abra. Intenta de nuevo m\xE1s tarde.", "This movie has no server that opens right now. Try again later."],
  siteDown: ["El cat\xE1logo no responde ahora. Intenta de nuevo en un rato.", "The catalog is not answering right now. Try again in a moment."],
  needResolver: ["Para reproducir, abre PeliculasFlix desde el men\xFA e instala el motor de reproducci\xF3n que te pedir\xE1.", "To play, open PeliculasFlix from the menu and install the playback engine it asks for."]
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
  ...s.logo ? { logo: s.logo } : {},
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
var hero = (slides, canPlay) => slides.length === 1 ? slideNode(slides[0], canPlay) : { type: "PageView", key: "hero" + slides.length, autoPlayMs: 6e3, children: slides.map((x) => slideNode(x, canPlay)) };
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
  const gear = { type: "IconButton", key: "settingsButton", icon: "settings", ...twin("brSettings", "labelText"), ...twin("brSettings", "tooltip"), onPressed: { event: "go", arg: "settings" } };
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin("brClose", "labelText"), ...twin("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
      actions: tv ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin("brSearch", "labelText"), ...twin("brSearch", "tooltip"), onPressed: "openSearch" }, gear] : [gear],
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
function settingsView({ brand }) {
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" },
      title: brandNode(brand)
    },
    body: { type: "SingleChildScrollView", key: "settings-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: [{ type: "settings", key: "form" }] }] }
  };
}

// src/browse/metaCache.js
var KEY = "meta1";
var MAX = 120;
var CALL_MS = 8e3;
var HTTPS2 = /^https:\/\//;
function makeMetaCache({ kino: kino2, titleOf = (c) => c.title, clock = { now: () => Date.now() } }) {
  const usable = () => {
    try {
      return typeof kino2.meta === "function" && kino2.meta.byTitle === true;
    } catch (_) {
      return false;
    }
  };
  let book = null;
  function read() {
    if (book) return book;
    try {
      const o = JSON.parse(kino2.storage.get(KEY) || "null");
      book = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (_) {
      book = {};
    }
    return book;
  }
  function write() {
    try {
      const ids = Object.keys(book);
      if (ids.length > MAX) for (const id of ids.slice(0, ids.length - MAX)) delete book[id];
      kino2.storage.set(KEY, JSON.stringify(book));
    } catch (_) {
    }
  }
  function known(id) {
    const e = read()[id];
    if (!e) return {};
    return { ...e.t > 0 ? { tmdb: e.t } : {}, ...e.l && HTTPS2.test(e.l) ? { logo: e.l } : {} };
  }
  function dress(cards) {
    return cards.map((c) => {
      const k = known(c.id);
      return k.tmdb && !(c.ids && c.ids.tmdb) ? { ...c, ids: { ...c.ids || {}, tmdb: k.tmdb } } : c;
    });
  }
  async function fill(cards, budgetMs) {
    if (!usable()) return 0;
    const b = read();
    const end = clock.now() + budgetMs;
    let asked = 0;
    for (const c of cards) {
      if (clock.now() + CALL_MS > end) break;
      if (!c || typeof c.id !== "string" || Object.hasOwn(b, c.id) || c.ids && c.ids.tmdb && c.noLogo) continue;
      const year = c.year !== void 0 ? { year: c.year } : {};
      try {
        const a = await kino2.meta({ type: c.kind === "series" ? "series" : "movie", title: titleOf(c), ...year });
        b[c.id] = { t: a && a.ids && Number.isInteger(a.ids.tmdb) ? a.ids.tmdb : 0, l: a && typeof a.logo === "string" ? a.logo : "" };
      } catch (e) {
        if (e && e.code === "rate_limited") break;
        continue;
      }
      asked++;
    }
    if (asked > 0) write();
    return asked;
  }
  return { known, dress, fill, usable };
}

// src/browse/index.js
var SNAP_TTL_MS = 12 * 3600 * 1e3;
var SNAP_MAX = 20 * 1024;
var RECENT_MAX = 12;
var HIST_MAX = 24;
function makeBrowse({ kino: kino2, brand, tabs, loadTab: loadTab2, searchTitles, canPlay = false, titleOf }) {
  const TAB_IDS = tabs.map((t2) => t2.id);
  const TAB_KEY = "browseTab";
  const SNAP_PREFIX = "browse1:";
  const RECENT_KEY = "recent1";
  const HIST_KEY = "searchHist1";
  const meta = makeMetaCache({ kino: kino2, titleOf });
  const enrich = (data) => data ? {
    slides: data.slides.map((s) => {
      const k = meta.known(s.id);
      return k.logo ? { ...s, logo: k.logo } : s;
    }),
    rails: data.rails.map((r) => ({ ...r, items: meta.dress(r.items) }))
  } : data;
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
      const slim2 = { slides: data.slides, rails: data.rails.map((r) => ({ ...r, items: r.items.slice(0, per) })) };
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
    const order = [tab, ...TAB_IDS.filter((t2) => t2 !== tab)];
    return order.filter((t2, i) => (i === 0 || device !== "tv") && !(memo.get(t2) && memo.get(t2).whole));
  }
  function view(ctx) {
    const st = ctx.state && typeof ctx.state === "object" ? ctx.state : {};
    if (ctx.route && ctx.route.name === "settings") return settingsView({ brand });
    if (ctx.route && ctx.route.name === "search") {
      const query = typeof st.sq === "string" ? st.sq : "";
      const items = found && found.q === query ? found.items : null;
      const status = query === "" ? "idle" : st.sstate === "fail" ? "fail" : items ? "done" : "loading";
      return searchView({ query, status, items, history: query === "" ? readHistory() : [], device: ctx.device });
    }
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(ctx.route) ?? stored() ?? TAB_IDS[0];
    const data = enrich(dataOf(tab));
    const loaded = TAB_IDS.map((t2) => memo.get(t2)).filter(Boolean).map((m) => m.data);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    return browseView({ brand, tabs, tab, data, recent: meta.dress(recentOf(readKeys(), loaded)), pending, failed: !!(st.failed && st.failed[tab]), canPlay, device: ctx.device });
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
      if (next.startsWith("meta:")) {
        const m = memo.get(next.slice(5));
        if (m) await meta.fill([...m.data.slides.map((s) => ({ id: s.id, title: s.title, kind: s.kind })), ...m.data.rails.flatMap((r) => r.items.slice(0, 6).map((c) => ({ id: c.id, title: c.title, kind: c.kind })))], 12e3);
        return { state: { pending: rest } };
      }
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
        if (ok && meta.usable()) rest.unshift("meta:" + next);
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
    // The gear: the plugin's settings are a page of their own, one Back away.
    go({ arg }) {
      return arg === "settings" ? { route: { push: "settings" }, state: { fromBrowse: true } } : null;
    },
    back({ state, route }) {
      if (route && route.name === "settings" && !state.fromBrowse) return { close: true };
      return { route: { pop: true }, state: { sq: null, sstate: null } };
    }
  };
  async function event(ev) {
    const handler = Object.hasOwn(events, ev.name) ? events[ev.name] : null;
    return handler ? await handler({ ...ev, state: ev.state || {} }) ?? null : null;
  }
  return { view, event, notePlayed };
}

// src/resolve-door.js
var RESOLVER_ALIAS = "resolver";
var RESOLVER_REPO = "xuper-plugin/kino-plugin-kino-resolver";
var CAPTURE_MS = 18e3;
function headersOf(s) {
  const out = {};
  if (s.referer) out.Referer = s.referer;
  const h = s.headers;
  if (Array.isArray(h)) for (const x of h) {
    if (x && x.name) out[x.name] = String(x.value);
  }
  else if (h && typeof h === "object") for (const [k, v] of Object.entries(h)) {
    if (v != null) out[k] = String(v);
  }
  return out;
}
function pickBest(streams) {
  return streams.find((s) => s && s.url && (s.kind === "hls" || /\.m3u8(\?|$)/i.test(s.url))) || streams.find((s) => s && s.url) || null;
}
async function captureStreams(kino2, embedUrl, referer) {
  const b = kino2 && kino2.browser;
  if (!b || typeof b.capture !== "function") return [];
  const opts = { timeoutMs: CAPTURE_MS };
  if (referer) opts.headers = { Referer: referer };
  let cap;
  try {
    cap = await b.capture(embedUrl, opts);
  } catch (_) {
    return [];
  }
  const out = [];
  for (const m of cap && cap.media || []) {
    if (!m || !m.url) continue;
    out.push({ url: m.url, kind: /\.m3u8(\?|$)/i.test(m.url) ? "hls" : "mp4", server: "browser", headers: m.headers || {} });
  }
  return out;
}
async function resolveViaHelper(embedUrl, kino2, referer) {
  let res = null;
  try {
    res = await kino2.plugins.call(RESOLVER_ALIAS, "resolve", { url: embedUrl, referer });
  } catch (err) {
    try {
      kino2.log("[peliculasflix]", "resolver", err && err.code || "call_failed");
    } catch (_) {
    }
  }
  let streams = res && Array.isArray(res.streams) ? res.streams.slice() : [];
  const subtitles = res && Array.isArray(res.subtitles) ? res.subtitles.filter((x) => x && x.lang && x.url) : [];
  if (!streams.length) streams = await captureStreams(kino2, embedUrl, referer);
  const s = pickBest(streams);
  if (!s) return null;
  const headers = headersOf(s);
  return {
    url: s.url,
    ...s.kind === "hls" || /\.m3u8(\?|$)/i.test(s.url) ? { mime: HLS_MIME } : {},
    ...Object.keys(headers).length ? { headers } : {},
    ...subtitles.length ? { subtitles } : {}
  };
}
async function resolverInstalled(kino2) {
  try {
    await kino2.plugins.call(RESOLVER_ALIAS, "normalizeHost", { url: "https://probe.invalid/" });
    return true;
  } catch (err) {
    return (err && err.code) !== "provider_missing";
  }
}

// src/plugin.js
globalThis.__kinoDropPendingFetches = true;
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
var CALL_MS2 = 16e3;
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
function langOrder() {
  let want = "";
  try {
    want = String(kino.config.get("lang") || "").toLowerCase();
  } catch (_) {
  }
  const first = LANG_ORDER.find((l) => l.toLowerCase() === want);
  return first ? [first, ...LANG_ORDER.filter((l) => l !== first)] : LANG_ORDER;
}
async function gql(operationName, query, variables) {
  const r = await kino.fetch(API, {
    method: "POST",
    timeoutMs: 1e4,
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
var rowOf = (ref, items) => ({ id: ref.replace(/[^\w-]/g, "-"), title: LISTS[ref].es, titleEn: LISTS[ref].en, ref, items });
var ROWS_BUDGET_MS = 12e3;
async function rowsOfLists(refs) {
  const out = refs.map(() => null);
  let done = false;
  const all = Promise.all(refs.map(async (ref, i) => {
    try {
      const p = await listing(ref, 1);
      out[i] = p.items.length ? rowOf(ref, p.items) : null;
    } catch (_) {
    }
  })).then(() => {
    done = true;
  });
  const end = Date.now() + ROWS_BUDGET_MS;
  while (!done && Date.now() < end) await Promise.race([all, kino.sleep(Math.min(250, Math.max(1, end - Date.now())))]);
  return out.filter(Boolean);
}
async function home() {
  const out = await rowsOfLists(["new", "popular", "g:accion", "g:comedia", "g:terror"]);
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
  const links = (film && film.links_online || []).map((l) => ({ link: String(l && l.link || "").trim(), lang: LANG[l && l.lang] || String(l && l.lang || "Servidor") })).filter((l) => /^https:\/\//i.test(l.link));
  const order = langOrder();
  const stats = readStats();
  const rank = (l) => {
    const i = order.indexOf(l.lang);
    return (i < 0 ? order.length : i) * 100 + (1 - scoreOf(hostName(l.link), stats)) * 20;
  };
  return links.map((l, n) => ({ ...l, n })).sort((a, b) => rank(a) - rank(b) || a.n - b.n).slice(0, MAX_COPIES);
}
var STATS_KEY = "srvStats";
var STATS_CAP = 24;
function readStats() {
  try {
    const o = JSON.parse(kino.storage.get(STATS_KEY) || "{}");
    return o && typeof o === "object" ? o : {};
  } catch (_) {
    return {};
  }
}
function scoreOf(id, stats) {
  const s = stats[id] || { ok: 0, fail: 0 };
  return (s.ok + 1) / (s.ok + s.fail + 2);
}
function noteServer(id, ok) {
  try {
    const stats = readStats();
    const s = stats[id] || { ok: 0, fail: 0 };
    s[ok ? "ok" : "fail"] += 1;
    if (s.ok + s.fail > STATS_CAP) {
      s.ok = Math.round(s.ok / 2);
      s.fail = Math.round(s.fail / 2);
    }
    stats[id] = s;
    kino.storage.set(STATS_KEY, JSON.stringify(stats));
  } catch (_) {
  }
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
  return resolveViaHelper(embed, kino, SITE + "/");
}
async function resolve(ref) {
  const [slug, pick] = String(ref || "").split("|");
  if (!/^[\w-]{1,120}$/.test(slug)) throw kino.error("not_found");
  if (!await resolverInstalled(kino)) throw kino.error("unavailable", "resolver missing", { userMessage: t(kino, "needResolver") });
  const servers = serversOf(await filmOf(slug));
  if (!servers.length) throw kino.error("not_found", "no servers", { userMessage: t(kino, "noServer") });
  const pool = requestPool(54);
  const deadline = Date.now() + CALL_MS2;
  const open = (s) => openServer(s.link, makeRequester(kino, { budget: 6, deadline, pools: [pool], maxMs: 8e3 })).catch(() => null);
  if (pick !== void 0) {
    const s = servers.find((x) => String(x.n) === pick);
    const stream = s && await open(s);
    if (s) noteServer(hostName(s.link), !!stream);
    if (!stream) throw kino.error("not_found", "that server did not open");
    return { ...stream, label: labelOf(s) };
  }
  const opened = new Array(servers.length).fill(null);
  let at = -1;
  for (let from = 0; from < servers.length && at < 0 && Date.now() < deadline - 1500; from += TRY_AT_ONCE) {
    const got = await Promise.all(servers.slice(from, from + TRY_AT_ONCE).map(open));
    got.forEach((g, i) => {
      opened[from + i] = g;
      noteServer(hostName(servers[from + i].link), !!g);
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
    rowsOfLists(tab.lists),
    tab.id === "inicio" ? carousel() : Promise.resolve([])
  ]);
  const out = rows;
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
var SUPPORT_URL = "https://ko-fi.com/xuperplugins";
function supportNode(device) {
  if (device === "tv") return { type: "QrImage", value: SUPPORT_URL, size: "large", labelText: "Si te gusta mi trabajo, escan\xE9alo y ap\xF3yame", labelTextEn: "If you like my work, scan it and support me" };
  return { type: "ElevatedButton", key: "donate", icon: "heart", labelText: "Si te gusta mi trabajo, ap\xF3yame", labelTextEn: "If you like my work, support me", onPressed: { go: { url: { href: SUPPORT_URL } } } };
}
function installGateView(device) {
  return {
    type: "Scaffold",
    key: "peliculasflix-install",
    body: { type: "SingleChildScrollView", key: "installScroll", children: [
      { type: "Column", padding: 24, gap: 16, crossAxisAlignment: "stretch", children: [
        { type: "Text", text: "Necesitas el motor de reproducci\xF3n", textEn: "You need the playback engine", style: "h3" },
        { type: "Text", color: "secondary", text: "PeliculasFlix reproduce a trav\xE9s de Kino Resolver (gratis). Inst\xE1lalo una vez y sirve para este y para otros plugins de sitios.", textEn: "PeliculasFlix plays through Kino Resolver (free). Install it once and it works here and in other site plugins." },
        { type: "ElevatedButton", key: "installResolver", labelText: "Instalar Kino Resolver", labelTextEn: "Install Kino Resolver", onPressed: { go: { installPlugin: { repo: RESOLVER_REPO } } } },
        supportNode(device)
      ] }
    ] }
  };
}
async function screen(ctx) {
  await null;
  const c = ctx && typeof ctx === "object" ? ctx : {};
  if (!(c.installed && c.installed[RESOLVER_REPO])) return installGateView(c.device);
  return browseScreen().view(c);
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
