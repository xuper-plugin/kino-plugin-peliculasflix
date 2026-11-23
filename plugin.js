// src/extractors/shared.js
var HLS_MIME = "application/vnd.apple.mpegurl";

// kino-plugin.json
var kino_plugin_default = {
  id: "peliculasflix",
  name: "PeliculasFlix",
  version: "0.7.4",
  apiVersion: 30,
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
    settingsIn: "both"
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
  ],
  provides: {
    catalog: {
      summary: "Titles this plugin finds, for the author's other plugins",
      calls: {
        search: {
          in: {
            q: "string",
            type: "string?"
          },
          out: "Item[]"
        }
      },
      types: {
        Item: {
          id: "string",
          ref: "string",
          title: "string",
          kind: "string",
          poster: "string?",
          backdrop: "string?",
          year: "string?",
          overview: "string?",
          tmdb: "number?"
        }
      }
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

// src/std/model.js
var MAX_SLIDES = 5;
var MAX_RAILS = 8;
var MAX_RAIL_ITEMS = 20;
var MAX_SLIDE_TEXT = 160;
var HTTPS = /^https:\/\//;
function cardOf(item) {
  const out = { id: item.id, ref: item.ref, title: item.title, kind: item.kind };
  if (item.poster && HTTPS.test(item.poster)) out.poster = item.poster;
  if (item.backdrop && HTTPS.test(item.backdrop)) out.backdrop = item.backdrop;
  if (item.badges) out.badges = item.badges;
  if (item.rating !== void 0) out.rating = item.rating;
  if (item.year !== void 0) out.year = item.year;
  if (item.ids && item.ids.tmdb) out.ids = { tmdb: item.ids.tmdb };
  if (item.lang) out.lang = item.lang;
  if (item.adult === true) out.adult = true;
  return out;
}
var slidesOf = (rows) => pickSlides(rows, (item) => item.backdrop);
var posterSlidesOf = (rows) => pickSlides(rows, (item) => item.poster);
function slideText(overview, item = {}) {
  const text = typeof overview === "string" ? overview.trim() : "";
  if (text === "") return [item.year, item.rating ? "\u2605 " + item.rating : null].filter(Boolean).join(" \xB7 ");
  return text.length <= MAX_SLIDE_TEXT ? text : `${text.slice(0, MAX_SLIDE_TEXT - 1).trimEnd()}\u2026`;
}
function pickSlides(rows, pictureOf) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row of rows) {
    for (const item of row.items || []) {
      if (out.length >= MAX_SLIDES) return out;
      const image2 = pictureOf(item);
      if (item.adult === true || seen.has(item.id) || !image2 || !HTTPS.test(image2)) continue;
      seen.add(item.id);
      out.push({ id: item.id, ref: item.ref, kind: item.kind, title: item.title, image: image2, text: slideText(item.overview, item) });
    }
  }
  return out;
}
var uniform = (items) => items.every((i) => i.backdrop) ? items : items.map(({ backdrop, ...rest }) => rest);
function railsOf(rows) {
  return rows.filter((r) => !r.hidden && r.items && r.items.length > 0).slice(0, MAX_RAILS).map((r) => ({
    id: r.id,
    title: r.title,
    ...r.titleEn ? { titleEn: r.titleEn } : {},
    ...r.ref ? { ref: r.ref } : {},
    items: uniform(r.items.slice(0, MAX_RAIL_ITEMS).map(cardOf))
  }));
}
function tabOf(page) {
  const rows = page && Array.isArray(page.rows) ? page.rows : [];
  const rails = railsOf(rows);
  if (rails.length === 0) return null;
  return { slides: slidesOf(rows), posterSlides: posterSlidesOf(rows), rails };
}
function playedKey(ref) {
  const m = /^(?:m|s|e):(\d{1,10})(?::|$)/.exec(String(ref || ""));
  return m ? `t:${m[1]}` : String(ref || "");
}
function recentOf(keys, tabs) {
  if (keys.length === 0) return [];
  const byKey = /* @__PURE__ */ new Map();
  for (const data of tabs) {
    for (const rail2 of data.rails) {
      for (const card of rail2.items) {
        const ks = [card.ref];
        if (card.ids && card.ids.tmdb) ks.push(`t:${card.ids.tmdb}`);
        for (const k of ks) if (!byKey.has(k)) byKey.set(k, card);
      }
    }
  }
  const out = [];
  const used = /* @__PURE__ */ new Set();
  for (const key of keys) {
    const card = byKey.get(key);
    if (card && !used.has(card.id)) {
      used.add(card.id);
      out.push(card);
    }
  }
  return out;
}

// src/std/strings.js
var WORDS = {
  watch: ["Ver", "Watch"],
  info: ["M\xE1s informaci\xF3n", "More info"],
  recent: ["Continuar viendo", "Continue watching"],
  search: ["Buscar", "Search"],
  searchHint: ["Buscar en {name}", "Search {name}"],
  failed: ["No se pudo cargar esta secci\xF3n. Revisa tu conexi\xF3n e int\xE9ntalo de nuevo.", "This section could not be loaded. Check your connection and try again."],
  retry: ["Reintentar", "Retry"],
  empty: ["A\xFAn no hay nada aqu\xED.", "Nothing here yet."],
  back: ["Atr\xE1s", "Back"],
  close: ["Cerrar", "Close"],
  settings: ["Ajustes", "Settings"],
  resultsTitle: ["Resultados: {q}", "Results: {q}"],
  resultsIn: ["En {name}", "In {name}"],
  resultsSearching: ["Buscando en {name}\u2026", "Searching {name}\u2026"],
  resultsFailed: ["{name} no respondi\xF3 esta vez.", "{name} did not answer this time."],
  noResults: ["No encontramos nada con esas palabras en tus plugins.", "Nothing in your plugins matched those words."],
  supportTv: ["Si te gusta mi trabajo, escan\xE9alo y ap\xF3yame", "If you like my work, scan it and support me"],
  support: ["Si te gusta mi trabajo, ap\xF3yame", "If you like my work, support me"],
  gateTitle: ["Necesitas el motor de reproducci\xF3n", "You need the playback engine"],
  gateText: [
    "{name} reproduce a trav\xE9s de Kino Resolver (gratis). Inst\xE1lalo una vez y sirve para este y para otros plugins de sitios.",
    "{name} plays through Kino Resolver (free). Install it once and it works here and in other site plugins."
  ],
  gateInstall: ["Instalar Kino Resolver", "Install Kino Resolver"]
};
var fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => vars && vars[k] != null ? String(vars[k]) : m);
function twin(key, field = "text", vars) {
  const [es, en] = WORDS[key];
  const pick = (i) => vars && Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, Array.isArray(v) ? v[i] : v]));
  return { [field]: fill(es, pick(0)), [field + "En"]: fill(en, pick(1)) };
}
var STRING_KEYS = Object.keys(WORDS);

// src/std/view.js
var SUPPORT_URL = "https://ko-fi.com/xuperplugins";
var RESOLVER_REPO = "xuper-plugin/kino-plugin-kino-resolver";
var POLL_MS = 1500;
function brand(cfg) {
  return {
    type: "Row",
    key: "brand",
    gap: 12,
    crossAxisAlignment: "center",
    children: [
      ...cfg.logo ? [{ type: "Image", key: "logo", url: cfg.logo, aspect: cfg.logoAspect || "1:1", fit: "contain", h: 32, alt: cfg.name, altEn: cfg.nameEn || cfg.name }] : [],
      { type: "Text", key: "name", style: "h4", text: cfg.name, textEn: cfg.nameEn || cfg.name }
    ]
  };
}
var tabBar = (tabs, active) => ({
  type: "TabBar",
  key: "tabs",
  divider: false,
  value: active,
  onChanged: "tab",
  tabs: tabs.map((t2) => ({ value: t2.id, label: t2.label, labelEn: t2.labelEn || t2.label }))
});
var iconButton = (key, icon, word, onPressed) => ({ type: "IconButton", key, icon, ...twin(word, "labelText"), ...twin(word, "tooltip"), onPressed });
var searchOpenOps = (tabsInBar) => [
  { hide: "brand" },
  { hide: "searchButton" },
  { hide: "settingsButton" },
  ...tabsInBar ? [{ hide: "tabs" }] : [],
  { show: "closeSearch" },
  { show: "q" },
  { focus: "q" }
];
var searchClosedOps = (tabsInBar) => [
  { hide: "closeSearch" },
  { hide: "q" },
  { clear: "q" },
  { show: "brand" },
  { show: "searchButton" },
  { show: "settingsButton" },
  ...tabsInBar ? [{ show: "tabs" }] : []
];
function supportNode(device) {
  if (device === "tv") return { type: "QrImage", key: "donate", value: SUPPORT_URL, size: "large", ...twin("supportTv", "labelText") };
  return { type: "ElevatedButton", key: "donate", icon: "heart", ...twin("support", "labelText"), onPressed: { go: { url: { href: SUPPORT_URL } } } };
}
var bar = ({ leading, title, actions = [] }) => ({ type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading, title, actions });
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
var heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var titleOf = (s) => ({ ref: s.ref, kind: s.kind, id: s.id, title: s.title });
var withHeaders = (headers) => headers ? { headers } : {};
var slideNode = (s, headers) => ({
  type: "heroCard",
  key: "slide-" + s.id,
  h: { compact: 200, expanded: 240 },
  ...s.logo ? { logo: s.logo } : {},
  title: s.title,
  text: s.text,
  image: s.image,
  ...withHeaders(headers),
  buttons: [
    { type: "ElevatedButton", key: "watch-" + s.id, ...twin("watch", "labelText"), icon: "play", onPressed: { go: { play: titleOf(s) } } },
    { type: "TextButton", key: "info-" + s.id, ...twin("info", "labelText"), onPressed: { go: { title: titleOf(s) } } }
  ]
});
var hero = (slides, headers) => slides.length === 1 ? slideNode(slides[0], headers) : {
  type: "PageView",
  key: "hero" + slides.length,
  autoPlayMs: 6e3,
  children: slides.map((s) => slideNode(s, headers))
};
var rail = (r, key, words, headers) => ({
  type: "titleRail",
  key,
  ...words || { title: r.title, titleEn: r.titleEn || r.title },
  ...r.ref ? { ref: r.ref } : {},
  items: r.items,
  ...withHeaders(headers)
});
function browseView(cfg, { tab, data, recent, pending, failed, searching = false, device = "phone", own = null }) {
  const tv = device === "tv";
  const tabs = own ? [cfg.tabs[0]] : cfg.tabs;
  const active = tabs.some((t2) => t2.id === tab) ? tab : tabs[0].id;
  const withTabs = tabs.length > 1;
  const body = [];
  if (own) {
    body.push(...own);
  } else if (data) {
    const h = cfg.imageHeaders;
    if (data.slides.length > 0) body.push(hero(data.slides, h));
    if (recent.length > 0) body.push(rail({ items: recent }, "recent", twin("recent", "title"), h));
    for (const r of data.rails) body.push(rail(r, "rail-" + String(r.id).replace(/[^A-Za-z0-9_-]/g, "_"), null, h));
    if (data.rails.length === 0) body.push({ type: "Text", key: "empty", ...twin("empty"), color: "muted" });
  } else if (failed) {
    body.push({ type: "MaterialBanner", key: "loadFailed", role: "error", ...twin("failed"), action: { ...twin("retry", "label"), onTap: "retry" } });
  } else {
    body.push(heroSkeleton(), railSkeleton(1), railSkeleton(2), railSkeleton(3));
  }
  const isBanner = (n) => !!n && (n.type === "heroCard" || n.key === "heroSkeleton" || n.type === "PageView" && String(n.key).startsWith("hero"));
  const banner = body.length > 0 && isBanner(body[0]) ? body.shift() : null;
  const tabsInBar = tv && withTabs;
  const appBar = bar({
    leading: iconButton("close", "close", "close", { go: { close: true } }),
    title: { type: "Row", key: "titleRow", gap: tabsInBar ? 24 : 8, crossAxisAlignment: "center", children: [
      { ...iconButton("closeSearch", "arrow_back", "back", { ui: searchClosedOps(tabsInBar), event: "searchClosed" }), hidden: true },
      brand(cfg),
      ...tabsInBar ? [tabBar(tabs, active)] : [],
      {
        type: "TextField",
        key: "q",
        hidden: true,
        flex: 1,
        kind: "search",
        maxLength: 200,
        ...twin("searchHint", "hintText", { name: [cfg.name, cfg.nameEn || cfg.name] }),
        onSubmitted: "search",
        trailingIcon: "search",
        ...twin("search", "trailingLabel"),
        onTrailingTap: "search"
      }
    ] },
    actions: [
      iconButton("searchButton", "search", "search", { ui: searchOpenOps(tabsInBar), event: "searchOpened" }),
      iconButton("settingsButton", "settings", "settings", "openSettings")
    ]
  });
  return {
    type: "Scaffold",
    ...searching ? { onBack: { ui: searchClosedOps(tabsInBar), event: "searchClosed" } } : {},
    appBar,
    body: { type: "Column", key: "page", children: [
      ...withTabs && !tv ? [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(tabs, active)] }] : [],
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [...banner ? [banner] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] }
    ] },
    ...pending ? { every: { ms: POLL_MS, event: "tick" } } : {}
  };
}
function resultsView(cfg, { q, order, names, pending, found, device = "phone" }) {
  const body = [];
  let shown = 0;
  order.forEach((repo, i) => {
    const name = [names[repo] || repo, names[repo] || repo];
    if (pending.includes(repo)) {
      body.push({ type: "Column", key: "wait-" + i, gap: 8, children: [{ type: "Text", key: "waitText-" + i, color: "muted", ...twin("resultsSearching", "text", { name }) }, railSkeleton(i)] });
      return;
    }
    const r = found.get(repo);
    if (!r || !r.ok) {
      body.push({ type: "Text", key: "failed-" + i, color: "muted", ...twin("resultsFailed", "text", { name }) });
      return;
    }
    if (!r.items.length) return;
    shown++;
    body.push(rail({ items: r.items }, "found-" + i, twin("resultsIn", "title", { name }), cfg.imageHeaders));
  });
  if (!pending.length && shown === 0) body.unshift({ type: "Text", key: "noResults", ...twin("noResults") });
  return {
    type: "Scaffold",
    appBar: bar({ leading: iconButton("back", "arrow_back", "back", "back"), title: { type: "Text", key: "resultsTitle", style: "h4", ...twin("resultsTitle", "text", { q }) } }),
    body: { type: "SingleChildScrollView", key: "results-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...pending.length ? { every: { ms: 1500, event: "tick" } } : {}
  };
}
function settingsView(cfg, device = "phone") {
  return {
    type: "Scaffold",
    appBar: bar({ leading: iconButton("back", "arrow_back", "back", "back"), title: brand(cfg) }),
    body: { type: "SingleChildScrollView", key: "settings-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: [
      ...cfg.hasSettings ? [{ type: "settings", key: "form" }, { type: "Divider", key: "supportDivider" }] : [],
      supportNode(device)
    ] }] }
  };
}
function gateView(cfg, device = "phone") {
  const name = [cfg.name, cfg.nameEn || cfg.name];
  return {
    type: "Scaffold",
    appBar: bar({ leading: iconButton("close", "close", "close", { go: { close: true } }), title: brand(cfg) }),
    body: { type: "Column", key: "gate", mainAxisAlignment: "center", crossAxisAlignment: "center", padding: 24, gap: 16, children: [
      { type: "Text", key: "gateTitle", style: "h3", ...twin("gateTitle") },
      { type: "Text", key: "gateText", style: "p", ...twin("gateText", "text", { name }) },
      { type: "ElevatedButton", key: "installResolver", ...twin("gateInstall", "labelText"), onPressed: { go: { installPlugin: { repo: RESOLVER_REPO } } } },
      supportNode(device)
    ] }
  };
}

// src/std/metaCache.js
var KEY = "meta3";
var MAX = 160;
var CONCURRENCY = 3;
var OVERVIEW_MAX = 160;
var HTTPS2 = /^https:\/\//;
function makeMetaCache({ kino: kino2, titleOf: titleOf2 = (c) => c.title, typeOf = (c) => c.kind === "series" ? "series" : "movie", tmdbPictures = false, clock = { now: () => Date.now() } }) {
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
    return {
      ...e.t > 0 ? { tmdb: e.t } : {},
      ...e.l && HTTPS2.test(e.l) ? { logo: e.l } : {},
      ...e.p && HTTPS2.test(e.p) ? { poster: e.p } : {},
      ...e.b && HTTPS2.test(e.b) ? { backdrop: e.b } : {},
      ...typeof e.o === "string" && e.o ? { overview: e.o } : {}
    };
  }
  const asked = (id) => Object.hasOwn(read(), id);
  function dress(cards) {
    return cards.map((c) => {
      const k = known(c.id);
      const poster = tmdbPictures && k.poster ? k.poster : null;
      if (!k.tmdb && !poster) return c;
      return { ...c, ...k.tmdb && !(c.ids && c.ids.tmdb) ? { ids: { ...c.ids || {}, tmdb: k.tmdb } } : {}, ...poster ? { poster } : {} };
    });
  }
  async function fill2(cards, budgetMs) {
    if (!usable()) return 0;
    const b = read();
    const end = clock.now() + budgetMs;
    let count = 0;
    let stop = false;
    const seen = /* @__PURE__ */ new Set();
    const todo = cards.filter((c) => {
      if (!c || typeof c.id !== "string" || seen.has(c.id) || Object.hasOwn(b, c.id) || c.ids && c.ids.tmdb && c.noLogo) return false;
      seen.add(c.id);
      return true;
    });
    let next = 0;
    const str = (v, max) => typeof v === "string" ? v.slice(0, max) : "";
    const worker = async () => {
      while (!stop && next < todo.length && clock.now() < end) {
        const c = todo[next++];
        const year = c.year !== void 0 ? { year: c.year } : {};
        try {
          const a = await kino2.meta({ type: typeOf(c), title: titleOf2(c), ...year });
          b[c.id] = {
            t: a && a.ids && Number.isInteger(a.ids.tmdb) ? a.ids.tmdb : 0,
            l: str(a && a.logo, 2048),
            p: str(a && a.poster, 2048),
            b: str(a && a.backdrop, 2048),
            o: str(a && a.overview, OVERVIEW_MAX)
          };
          count++;
        } catch (e) {
          if (e && e.code === "rate_limited") stop = true;
        }
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    if (count > 0) write();
    return count;
  }
  return { known, asked, dress, fill: fill2, usable, tmdbPictures };
}

// src/std/index.js
var TAB_KEY = "browseTab";
var SNAP_PREFIX = "browse1:";
var SNAP_TTL_MS = 7 * 24 * 3600 * 1e3;
var SNAP_MAX = 20 * 1024;
var SNAPS_TOTAL = 96 * 1024;
var RECENT_KEY = "recent1";
var RECENT_MAX = 12;
var Q_MAX = 200;
var META_TICK_MS = 3e3;
var META_TICK_CARDS = 24;
var INFLIGHT_KEY = "std:inflight";
var INFLIGHT_STALE_MS = 18e3;
var MAX_META_TICKS = 10;
var DEFAULT_TABS = [{ id: "inicio", label: "Inicio", labelEn: "Home" }];
function makeStandardScreen({ kino: kino2, name, nameEn, logo = null, logoAspect = "1:1", needsResolver, hasSettings, tabs, loadTab: loadTab2, homeKey = null, titleOf: titleOf2, typeOf, tmdbPictures = false, imageHeaders = null, searchHere = null, page = null }) {
  const cfg = { name, nameEn, logo, logoAspect, imageHeaders, hasSettings: !!hasSettings, tabs: Array.isArray(tabs) && tabs.length > 0 ? tabs : DEFAULT_TABS };
  const TAB_IDS = cfg.tabs.map((t2) => t2.id);
  const meta = makeMetaCache({ kino: kino2, titleOf: titleOf2, typeOf, tmdbPictures });
  function slidesFromMeta(rails) {
    const out = [];
    for (const r of rails) {
      for (const c of r.items) {
        if (out.length >= MAX_SLIDES) return out;
        const k = meta.known(c.id);
        if (!k.backdrop || c.adult === true || out.some((x) => x.id === c.id)) continue;
        out.push({ id: c.id, ref: c.ref, kind: c.kind, title: c.title, image: k.backdrop, text: slideText(k.overview, c), ...k.logo ? { logo: k.logo } : {} });
      }
    }
    return out;
  }
  const enrich = (data) => {
    if (!data) return data;
    const own = data.slides.map((s) => {
      const k = meta.known(s.id);
      const image2 = tmdbPictures && k.backdrop ? k.backdrop : null;
      return k.logo || image2 ? { ...s, ...k.logo ? { logo: k.logo } : {}, ...image2 ? { image: image2 } : {} } : s;
    });
    const learned = own.length > 0 ? [] : slidesFromMeta(data.rails);
    return {
      // The site's own backdrops, else TMDB's, else the posters: every plugin has a hero.
      slides: own.length > 0 ? own : learned.length > 0 ? learned : data.posterSlides || [],
      rails: data.rails.map((r) => ({ ...r, items: meta.dress(r.items) }))
    };
  };
  const metaTicks = /* @__PURE__ */ new Map();
  const found = /* @__PURE__ */ new Map();
  const SOURCES_PER_TICK = 3;
  const asFound = (a, index) => ({
    ok: !!(a && a.ok),
    items: a && a.ok && Array.isArray(a.items) ? a.items.filter((x) => x && x.id && x.ref && x.title).slice(0, 40).map((x) => ({ ...x, id: ("p" + index + "~" + x.id).slice(0, 128), origin: a.repo })) : []
  });
  const memo = /* @__PURE__ */ new Map();
  const log = (...a) => {
    try {
      kino2.log("[std]", ...a);
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
  const snapMax = Math.min(SNAP_MAX, Math.floor(SNAPS_TOTAL / TAB_IDS.length));
  function writeSnap(tab, data) {
    for (let per = 10; per >= 3; per -= 2) {
      const slim = { slides: data.slides, posterSlides: data.posterSlides || [], rails: data.rails.map((r) => ({ ...r, items: r.items.slice(0, per) })) };
      const text = JSON.stringify({ at: Date.now(), data: slim });
      if (text.length <= snapMax) {
        set(SNAP_PREFIX + tab, text, { ttlMs: SNAP_TTL_MS });
        return;
      }
    }
  }
  function homeSeed(tab) {
    if (!homeKey || tab !== TAB_IDS[0]) return null;
    try {
      const o = JSON.parse(get(homeKey) || "null");
      return o && Array.isArray(o.rows) && o.rows.length ? tabOf({ rows: o.rows }) : null;
    } catch (_) {
      return null;
    }
  }
  const stored = () => {
    const t2 = get(TAB_KEY);
    return TAB_IDS.includes(t2) ? t2 : null;
  };
  function dataOf(tab) {
    if (memo.has(tab)) return memo.get(tab).data;
    const snap = readSnap(tab) || homeSeed(tab);
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
      const key = playedKey(ref);
      if (key === "" || key.startsWith("x|")) return;
      const keys = readKeys();
      if (keys[0] === key) return;
      set(RECENT_KEY, JSON.stringify([key, ...keys.filter((k) => k !== key)].slice(0, RECENT_MAX)));
    } catch (_) {
    }
  }
  const tabFromArgs = (route) => {
    const a = route && route.args && typeof route.args === "object" ? route.args : {};
    return TAB_IDS.includes(a.tab) ? a.tab : null;
  };
  function needed(tab) {
    return memo.get(tab) && memo.get(tab).whole ? [] : [tab];
  }
  function screen2(ctx) {
    const c = ctx || {};
    const device = c.device || "phone";
    if (needsResolver && !(c.installed && c.installed[RESOLVER_REPO])) return gateView(cfg, device);
    if (c.route && c.route.name === "settings") return settingsView(cfg, device);
    if (searchHere && c.route && c.route.name === "results") {
      const st0 = c.state && typeof c.state === "object" ? c.state : {};
      return resultsView(cfg, {
        q: String(st0.rq || ""),
        order: Array.isArray(st0.rorder) ? st0.rorder : [],
        names: st0.rnames || {},
        pending: Array.isArray(st0.rpending) ? st0.rpending : [],
        found,
        device
      });
    }
    const st = c.state && typeof c.state === "object" ? c.state : {};
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(c.route) ?? stored() ?? TAB_IDS[0];
    const data = enrich(dataOf(tab));
    const loaded = TAB_IDS.map((t2) => memo.get(t2)).filter(Boolean).map((m) => m.data);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    const searching = st.searching === true;
    if (page) {
      const tree = browseView(cfg, { tab: TAB_IDS[0], data: null, recent: [], pending: false, failed: false, searching, device, own: page.view({ ...c, state: st }) || [] });
      const every = page.every ? page.every({ ...c, state: st }) : null;
      return every ? { ...tree, every } : tree;
    }
    return browseView(cfg, { tab, data, recent: meta.dress(recentOf(readKeys(), loaded)), pending, failed: !!(st.failed && st.failed[tab]), searching, device });
  }
  function cutShort() {
    try {
      const o = JSON.parse(get(INFLIGHT_KEY) || "null");
      if (!o || typeof o.tab !== "string") return null;
      if (Date.now() - Number(o.at) < INFLIGHT_STALE_MS) return null;
      kino2.storage.remove(INFLIGHT_KEY);
      return o.tab;
    } catch (_) {
      return null;
    }
  }
  async function load(tab) {
    set(INFLIGHT_KEY, JSON.stringify({ tab, at: Date.now() }));
    let page2;
    try {
      page2 = await loadTab2(tab);
    } finally {
      try {
        kino2.storage.remove(INFLIGHT_KEY);
      } catch (_) {
      }
    }
    const data = tabOf(page2);
    if (data) {
      memo.set(tab, { data, whole: true });
      writeSnap(tab, data);
    }
    return data !== null;
  }
  const events = {
    async open(ev) {
      if (page) {
        let patch = {};
        try {
          patch = (page.open ? await page.open(ev) : {}) || {};
        } catch (e) {
          log("page open", e && e.code || "error");
        }
        return { state: { ...patch, tab: TAB_IDS[0], pending: [], failed: null } };
      }
      return events.openTabs(ev);
    },
    openTabs({ route, state, device }) {
      const tab = tabFromArgs(route) ?? (TAB_IDS.includes(state.tab) ? state.tab : stored() ?? TAB_IDS[0]);
      for (const t2 of TAB_IDS) dataOf(t2);
      return { state: { tab, pending: needed(tab), failed: null } };
    },
    tab({ value, arg, state }) {
      const tab = TAB_IDS.includes(value) ? value : TAB_IDS.includes(arg) ? arg : null;
      if (!tab) return null;
      set(TAB_KEY, tab);
      dataOf(tab);
      const failed = { ...state.failed || {} };
      delete failed[tab];
      const pending = [tab, ...Array.isArray(state.pending) ? state.pending.filter((t2) => t2 !== tab) : []];
      return { state: { tab, pending: memo.get(tab) && memo.get(tab).whole ? pending.slice(1) : pending, failed } };
    },
    retry({ state }) {
      const tab = TAB_IDS.includes(state.tab) ? state.tab : TAB_IDS[0];
      const queued = Array.isArray(state.pending) ? state.pending.filter((t2) => t2 !== tab) : [];
      return { state: { failed: null, pending: [tab, ...queued] } };
    },
    async tick({ state, route }) {
      if (searchHere && route && route.name === "results") {
        const rp = Array.isArray(state.rpending) ? state.rpending : [];
        if (rp.length === 0) return null;
        const batch = rp.slice(0, SOURCES_PER_TICK);
        const order = Array.isArray(state.rorder) ? state.rorder : [];
        let answers = [];
        try {
          answers = await searchHere.searchIn(String(state.rq || ""), batch);
        } catch (e) {
          log("results", e && e.code || "error");
        }
        for (const repo of batch) {
          const a = (Array.isArray(answers) ? answers : []).find((x) => x && x.repo === repo);
          found.set(repo, asFound(a, order.indexOf(repo)));
        }
        return { state: { rpending: rp.slice(SOURCES_PER_TICK) } };
      }
      const pending = Array.isArray(state.pending) ? state.pending : [];
      if (pending.length === 0) return null;
      const [next, ...rest] = pending;
      const failed = { ...state.failed || {} };
      if (next.startsWith("meta:")) {
        const tab = next.slice(5);
        const m = memo.get(tab);
        if (!m) return { state: { pending: rest } };
        const ask = (x) => ({ id: x.id, title: x.title, kind: x.kind, ...x.year !== void 0 ? { year: x.year } : {} });
        const noOwnSlides = m.data.slides.length === 0;
        const cards = [...m.data.slides.map(ask), ...m.data.rails.flatMap((r) => r.items.slice(0, noOwnSlides ? MAX_SLIDES * 3 : 6).map(ask))].filter((c) => !meta.asked(c.id)).slice(0, META_TICK_CARDS);
        const count = await meta.fill(cards, META_TICK_MS);
        const ticks = (metaTicks.get(tab) || 0) + 1;
        metaTicks.set(tab, ticks);
        const again = noOwnSlides && count > 0 && ticks < MAX_META_TICKS && slidesFromMeta(m.data.rails).length < MAX_SLIDES && cards.some((c) => !meta.asked(c.id));
        return { state: { pending: again ? [next, ...rest] : rest } };
      }
      if (cutShort() === next) {
        log("tab", next, "cut short by Kino last time");
        failed[next] = true;
        return { state: { pending: rest, failed } };
      }
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
        if (ok && meta.usable()) rest.unshift("meta:" + next);
      } catch (e) {
        log("tab", e && e.code || "error");
        failed[next] = true;
      }
      return { state: { pending: rest, failed } };
    },
    // The words go to Kino's own search, with this plugin as the source; the bar is put back as it was, locally.
    // The search button's own event (after its local ops): while searching, the tree declares onBack, so Back closes the box.
    searchOpened() {
      return { state: { searching: true } };
    },
    // The box was closed (its arrow, or Back through onBack, already ran the local ops): the flag and the ops go, so the next
    // tree declares no onBack and draws the bar's defaults.
    searchClosed() {
      return { state: { searching: false, ui: null } };
    },
    async search({ value, state, device }) {
      const typed = value && typeof value === "object" ? value.q : value;
      const raw = typed != null && String(typed).trim() !== "" ? typed : state.inputs && state.inputs.q;
      const q = String(raw == null ? "" : raw).trim().slice(0, Q_MAX);
      if (!q) return null;
      const closed = searchClosedOps(device === "tv" && TAB_IDS.length > 1);
      if (searchHere) {
        let sources = [];
        try {
          sources = await searchHere.sources() || [];
        } catch (e) {
          log("sources", e && e.code || "error");
        }
        const order = sources.map((x) => x.repo).filter((r) => typeof r === "string");
        found.clear();
        return { route: { push: "results" }, ui: closed, state: {
          searching: false,
          ui: null,
          rq: q,
          rorder: order,
          rnames: Object.fromEntries(sources.map((x) => [x.repo, String(x.name || x.repo)])),
          rpending: order
        } };
      }
      return { go: { search: { q } }, ui: closed, state: { searching: false, ui: null } };
    },
    openSettings() {
      return { route: { push: "settings" }, state: { fromBrowse: true } };
    },
    back({ state, route }) {
      if (route && route.name === "settings" && !state.fromBrowse) return { close: true };
      return { route: { pop: true }, state: { fromBrowse: false } };
    }
  };
  async function screenEvent2(ev) {
    const e = ev || {};
    const name2 = e.name != null ? e.name : e.event;
    const own = page && page.events && typeof name2 === "string" && Object.hasOwn(page.events, name2) && !Object.hasOwn(events, name2) ? page.events[name2] : null;
    if (own) return await own({ ...e, state: e.state || {} }) ?? null;
    const handler = typeof name2 === "string" && name2 !== "openTabs" && Object.hasOwn(events, name2) ? events[name2] : null;
    return handler ? await handler({ ...e, state: e.state || {} }) ?? null : null;
  }
  return { screen: screen2, screenEvent: screenEvent2, notePlayed };
}

// src/logo.js
var LOGO = "data:image/png;base64,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";
var LOGO_ASPECT = "1:1";

// src/i18n.js
var T = {
  noServer: ["Esta pel\xEDcula no tiene ahora un servidor que abra. Intenta de nuevo m\xE1s tarde.", "This movie has no server that opens right now. Try again later."],
  siteDown: ["El cat\xE1logo no responde ahora. Intenta de nuevo en un rato.", "The catalog is not answering right now. Try again in a moment."],
  needResolver: ["Para reproducir, abre PeliculasFlix desde el men\xFA e instala el motor de reproducci\xF3n que te pedir\xE1.", "To play, open PeliculasFlix from the menu and install the playback engine it asks for."]
};
function both(key, vars = {}) {
  const pair = T[key] || [key, key];
  const fill2 = (s) => s.replace(/\{(\w+)\}/g, (_, k) => k in vars ? String(vars[k]) : "");
  return { es: fill2(pair[0]), en: fill2(pair[1]) };
}
function t(kino2, key, vars) {
  const w = both(key, vars);
  return String(kino2 && kino2.lang || "").toLowerCase().startsWith("es") ? w.es : w.en;
}

// src/resolve-door.js
var RESOLVER_ALIAS = "resolver";
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
  if (!streams.length && !(res && res.error === "dead")) streams = await captureStreams(kino2, embedUrl, referer);
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

// src/std/catalog.js
var CATALOG_MAX = 40;
var OVERVIEW_MAX2 = 300;
var HTTPS3 = /^https:\/\//;
function catalogItems(found) {
  const out = [];
  const list = Array.isArray(found) ? found : found && Array.isArray(found.items) ? found.items : [];
  for (const it of list) {
    if (out.length >= CATALOG_MAX) break;
    if (!it || typeof it.id !== "string" || !it.id || typeof it.ref !== "string" || !it.ref || typeof it.title !== "string" || !it.title) continue;
    const item = { id: it.id, ref: it.ref, title: it.title, kind: typeof it.kind === "string" && it.kind ? it.kind : "movie" };
    if (typeof it.poster === "string" && HTTPS3.test(it.poster)) item.poster = it.poster;
    if (typeof it.backdrop === "string" && HTTPS3.test(it.backdrop)) item.backdrop = it.backdrop;
    if (it.year !== void 0 && it.year !== null && String(it.year)) item.year = String(it.year);
    if (typeof it.overview === "string" && it.overview.trim()) item.overview = it.overview.trim().slice(0, OVERVIEW_MAX2);
    const tmdb = it.ids && Number.isInteger(it.ids.tmdb) ? it.ids.tmdb : Number.isInteger(it.tmdb) ? it.tmdb : 0;
    if (tmdb > 0) item.tmdb = tmdb;
    out.push(item);
  }
  return out;
}
function catalogQuery(arg) {
  const q = String(arg && arg.q || "").trim().slice(0, 200);
  const type = arg && (arg.type === "movie" || arg.type === "series") ? arg.type : "any";
  return { q, type, season: 0, episode: 0, tmdbId: 0, year: 0, originalTitle: "", altTitles: [], cursor: null };
}
function catalogDoor(search2) {
  return async (arg) => {
    const query = catalogQuery(arg);
    if (!query.q) return [];
    return catalogItems(await search2(query));
  };
}

// src/plugin.js
globalThis.__kinoDropPendingFetches = true;
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
  const deadline = Date.now() + CALL_MS;
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
    standard().notePlayed(slug);
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
var std = null;
var standard = () => std ?? (std = makeStandardScreen({
  kino,
  name: "PeliculasFlix",
  logo: LOGO,
  logoAspect: LOGO_ASPECT,
  needsResolver: true,
  hasSettings: true,
  tabs: TABS.map(({ id, es, en }) => ({ id, label: es, labelEn: en })),
  loadTab
}));
async function screen(ctx) {
  await null;
  return standard().screen(ctx && typeof ctx === "object" ? ctx : {});
}
async function screenEvent(ev) {
  await null;
  return standard().screenEvent(ev && typeof ev === "object" ? ev : {});
}
var proto_catalog_search = catalogDoor(search);
export {
  TABS,
  backdropOf,
  browse,
  home,
  itemOf,
  posterOf,
  proto_catalog_search,
  resolve,
  screen,
  screenEvent,
  search,
  serversOf
};
