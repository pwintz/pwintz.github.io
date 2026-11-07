// ╭───────────────────────────────────────────────────────────────╮
// │          Music link converter: one link → every service       │
// ╰───────────────────────────────────────────────────────────────╯
// Takes a link to a song, album, or artist on one streaming service, looks up its metadata, and
// finds the same item on the other services.
//
// Song.link's free API was shut down in 2026, and this site is static (no server to hold API keys),
// so everything here uses public endpoints that a browser can call without a key:
//   - iTunes Search/Lookup API (CORS): Apple Music metadata and links.
//   - Deezer API (JSONP, since it doesn't send CORS headers): metadata, ISRC/UPC codes, and links.
//   - oEmbed endpoints for Spotify, YouTube, and SoundCloud (CORS): the title of the pasted item.
// Services without a public lookup (Spotify, TIDAL, Qobuz, …) get a search link instead of a
// direct link, unless the pasted link was for that service.

import { loadString, saveString, loadJSON, saveJSON, removeSaved } from "./common/storage";

// ⋘──────── Types and constants ────────⋙

export type Kind = "track" | "album" | "artist";

export type PlatformKey =
  | "spotify" | "appleMusic" | "youtubeMusic" | "youtube" | "tidal" | "qobuz"
  | "deezer" | "amazonMusic" | "soundcloud" | "bandcamp";

// A pasted link, broken into the parts the lookups need.
export interface ParsedLink {
  platform : PlatformKey;
  kind     : Kind;
  id       : string;    // The service's ID for the item ("" if the URL has none, e.g. Bandcamp)
  url      : string;    // The link as pasted, normalized to https
  country? : string;    // Two-letter storefront from the URL, if it has one (Apple Music)
  text?    : string;    // Words from the URL's slug, used as a search when there's no lookup
}

// Everything found about the item. Only `title` is always set.
export interface Info {
  title        : string;   // Track, album, or artist name
  artist?      : string;
  album?       : string;
  releaseDate? : string;   // YYYY-MM-DD
  durationSec? : number;
  trackNumber? : number;
  trackCount?  : number;
  genre?       : string;
  label?       : string;
  isrc?        : string;
  upc?         : string;
  bpm?         : number;
  explicit?    : boolean;
  artwork?     : string;
  previewUrl?  : string;   // 30-second audio preview
}

// Another possible match, offered when the pasted link didn't say who the artist is.
export interface Alternate {
  platform : "appleMusic" | "deezer";
  id       : number;
  label    : string;   // "Title — Artist"
}

export interface LookupResult {
  kind       : Kind;
  info       : Info;
  links      : Partial<Record<PlatformKey, string>>;   // Direct links (not searches)
  notes      : string[];                                // Caveats to show the user
  alternates : Alternate[];
  source     : ParsedLink;
}

interface Platform {
  name   : string;
  color  : string;
  hosts  : RegExp;   // Hostnames its links may use (shared links are checked against this)
  search : (query: string, kind: Kind) => string;
}

// Qobuz's web player (play.qobuz.com) drops search terms passed in its URL, so searches use the
// public store, whose results link to the player.
const QOBUZ_SEARCH: Record<Kind, string> = { track: "tracks", album: "albums", artist: "artists" };

// The order here is the order of the links on the page.
const PLATFORMS: Record<PlatformKey, Platform> = {
  spotify      : { name: "Spotify",       color: "#1db954", hosts: /^open\.spotify\.com$/, search: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}` },
  appleMusic   : { name: "Apple Music",   color: "#fa2d48", hosts: /^(music|itunes|geo\.music)\.apple\.com$/, search: (q) => `https://music.apple.com/${storefront()}/search?term=${encodeURIComponent(q)}` },
  youtubeMusic : { name: "YouTube Music", color: "#ff0000", hosts: /^music\.youtube\.com$/, search: (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}` },
  tidal        : { name: "TIDAL",         color: "#000000", hosts: /^(listen\.)?tidal\.com$/, search: (q) => `https://listen.tidal.com/search?q=${encodeURIComponent(q)}` },
  qobuz        : { name: "Qobuz",         color: "#0070ef", hosts: /^([a-z]+\.)?qobuz\.com$/, search: (q, kind) => `https://www.qobuz.com/us-en/search/${QOBUZ_SEARCH[kind]}/${encodeURIComponent(q)}` },
  deezer       : { name: "Deezer",        color: "#a238ff", hosts: /^(www\.)?deezer\.com$/, search: (q) => `https://www.deezer.com/search/${encodeURIComponent(q)}` },
  amazonMusic  : { name: "Amazon Music",  color: "#25d1da", hosts: /^music\.amazon\.(com|ca|de|fr|it|es|in|co\.uk|co\.jp|com\.au|com\.br|com\.mx)$/, search: (q) => `https://music.amazon.com/search/${encodeURIComponent(q)}` },
  youtube      : { name: "YouTube",       color: "#ff0000", hosts: /^((www|m)\.)?youtube\.com$|^youtu\.be$/, search: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` },
  soundcloud   : { name: "SoundCloud",    color: "#ff5500", hosts: /^(m\.)?soundcloud\.com$/, search: (q) => `https://soundcloud.com/search?q=${encodeURIComponent(q)}` },
  bandcamp     : { name: "Bandcamp",      color: "#1da0c3", hosts: /^([a-z0-9-]+\.)?bandcamp\.com$/, search: (q) => `https://bandcamp.com/search?q=${encodeURIComponent(q)}` },
};

const TIMEOUT_MS = 10000;

// The viewer's Apple storefront (e.g. "us", "gb"), guessed from the browser's language setting.
function storefront(): string {
  const region = (typeof navigator !== "undefined" ? navigator.language : "").split("-")[1];
  return region && /^[a-z]{2}$/i.test(region) ? region.toLowerCase() : "us";
}

// ╭────────────────────────────────────────╮
// │              Parsing links             │
// ╰────────────────────────────────────────╯

// Turns a URL slug like "whenever-you-need-somebody-rick-astley" into search words.
function slugText(slug: string | undefined): string | undefined {
  const text = decodeURIComponent(slug ?? "").replace(/[-_+]+/g, " ").trim();
  return text || undefined;
}

// Maps the words services use for an item type onto ours.
function toKind(word: string): Kind {
  if (/^(track|song|music-video)s?$/i.test(word)) return "track";
  if (/^(album|release|playlist)s?$/i.test(word)) return "album";
  return "artist";
}

// Identifies the service and item in a pasted link. Throws an Error with a user-facing message.
export function parseLink(input: string): ParsedLink {
  let raw = input.trim();
  if (!raw) {
    throw new Error("Paste a link first.");
  }

  // Spotify URIs like "spotify:track:4cOdK2wGLETKBW3PvgPWqT"
  const uri = raw.match(/^spotify:(track|album|artist):([A-Za-z0-9]+)$/);
  if (uri) {
    return { platform: "spotify", kind: toKind(uri[1]), id: uri[2], url: `https://open.spotify.com/${uri[1]}/${uri[2]}` };
  }

  if (!/^[a-z]+:\/\//i.test(raw)) {
    raw = `https://${raw}`;   // Allow pasting without the scheme
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That doesn't look like a valid link.");
  }
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;
  const href = url.href;
  let m: RegExpMatchArray | null;

  // ⋘──────── Spotify ────────⋙
  if (host === "open.spotify.com" || host === "play.spotify.com") {
    m = path.match(/^(?:\/intl-[a-z-]+)?\/(?:embed\/)?(track|album|artist)\/([A-Za-z0-9]+)/);
    if (m) return { platform: "spotify", kind: toKind(m[1]), id: m[2], url: `https://open.spotify.com/${m[1]}/${m[2]}` };
    throw new Error("Only Spotify track, album, and artist links are supported (not playlists or podcasts).");
  }
  if (host === "spotify.link" || host === "spotify.app.link") {
    throw new Error("Short spotify.link links can't be read here. Open the link, then copy the full open.spotify.com address.");
  }

  // ⋘──────── Apple Music / iTunes ────────⋙
  // e.g. music.apple.com/us/album/never-gonna-give-you-up/1559885420?i=1559885421
  if (/(^|\.)(music|itunes|geo\.music)\.apple\.com$/.test(host)) {
    m = path.match(/^\/([a-z]{2})?\/?(album|song|artist|music-video)\/(?:[^/]+\/)?(?:id)?(\d+)/);
    if (m) {
      const trackId = url.searchParams.get("i");
      const kind = trackId ? "track" : toKind(m[2]);
      return { platform: "appleMusic", kind, id: trackId ?? m[3], url: href, country: m[1] };
    }
    throw new Error("Only Apple Music song, album, and artist links are supported (not playlists).");
  }

  // ⋘──────── Deezer ────────⋙
  if (host === "deezer.com") {
    m = path.match(/^(?:\/[a-z]{2})?\/(track|album|artist)\/(\d+)/);
    if (m) return { platform: "deezer", kind: toKind(m[1]), id: m[2], url: `https://www.deezer.com/${m[1]}/${m[2]}` };
    throw new Error("Only Deezer track, album, and artist links are supported.");
  }
  if (host === "deezer.page.link" || host === "link.deezer.com") {
    throw new Error("Short Deezer share links can't be read here. Open the link, then copy the full deezer.com address.");
  }

  // ⋘──────── YouTube and YouTube Music ────────⋙
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtu.be") {
    const platform: PlatformKey = host === "music.youtube.com" ? "youtubeMusic" : "youtube";
    const videoId = host === "youtu.be" ? path.slice(1) : url.searchParams.get("v");
    if (videoId) return { platform, kind: "track", id: videoId, url: href };
    const list = url.searchParams.get("list");
    if (list) return { platform, kind: "album", id: list, url: href };
    throw new Error("Paste a YouTube link to a video (watch?v=…) or an album playlist (playlist?list=…).");
  }

  // ⋘──────── SoundCloud ────────⋙
  if (host === "soundcloud.com" || host === "m.soundcloud.com") {
    const parts = path.split("/").filter(Boolean);
    const kind: Kind = parts.length === 1 ? "artist" : parts[1] === "sets" ? "album" : "track";
    return { platform: "soundcloud", kind, id: "", url: `https://soundcloud.com${path}` };
  }

  // ⋘──────── Qobuz ────────⋙
  // www.qobuz.com/us-en/album/<slug>/<id>, open.qobuz.com/album/<id>, play.qobuz.com/album/<id>.
  // All become play.qobuz.com links, the web player that signed-in listeners use.
  if (/(^|\.)qobuz\.com$/.test(host)) {
    m = path.match(/^(?:\/[a-z]{2}-[a-z]{2})?\/(album|track|artist|interpreter)\/(?:([^/]+)\/)?([^/]+)\/?$/);
    if (m) {
      const kind = toKind(m[1]);
      const playPath = { track: "track", album: "album", artist: "artist" }[kind];
      return { platform: "qobuz", kind, id: m[3], url: `https://play.qobuz.com/${playPath}/${m[3]}`, text: slugText(m[2]) };
    }
    throw new Error("Only Qobuz album, track, and artist links are supported.");
  }

  // ⋘──────── Bandcamp ────────⋙
  // <artist>.bandcamp.com/track/<slug> or /album/<slug>
  if (host.endsWith(".bandcamp.com")) {
    const artist = slugText(host.replace(/\.bandcamp\.com$/, ""));
    m = path.match(/^\/(track|album)\/([^/]+)/);
    const text = [m ? slugText(m[2]) : undefined, artist].filter(Boolean).join(" ");
    return { platform: "bandcamp", kind: m ? toKind(m[1]) : "artist", id: "", url: href, text };
  }

  // ⋘──────── Services without a public lookup ────────⋙
  if (/(^|\.)tidal\.com$/.test(host)) {
    throw new Error("TIDAL doesn't share song details publicly, so its links can't be looked up. Try a link from another service.");
  }
  if (/(^|\.)amazon\.[a-z.]+$/.test(host)) {
    throw new Error("Amazon Music doesn't share song details publicly, so its links can't be looked up. Try a link from another service.");
  }
  throw new Error("That link isn't from a supported service (Spotify, Apple Music, YouTube, Deezer, Qobuz, SoundCloud, or Bandcamp).");
}

// ╭────────────────────────────────────────╮
// │            Network helpers             │
// ╰────────────────────────────────────────╯

async function fetchJson(url: string): Promise<any> {
  const host = new URL(url).hostname;
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    throw new Error(`Couldn't reach ${host}. Check your connection, or try again in a minute.`);
  }
  if (!response.ok) {
    throw new Error(`${host} couldn't find that link (error ${response.status}).`);
  }
  return response.json();
}

// The Deezer API doesn't send CORS headers, but it supports JSONP, so load it as a script.
let jsonpCounter = 0;
function deezer(path: string, params: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const callback = `__musicLinkDeezer${jsonpCounter++}`;
    const query = new URLSearchParams({ ...params, output: "jsonp", callback });
    const script = document.createElement("script");
    const cleanUp = () => {
      clearTimeout(timer);
      delete (window as any)[callback];
      script.remove();
    };
    const timer = window.setTimeout(() => {
      cleanUp();
      reject(new Error("Deezer didn't respond."));
    }, TIMEOUT_MS);
    (window as any)[callback] = (data: any) => {
      cleanUp();
      if (data?.error) {
        reject(new Error(data.error.message ?? "Deezer returned an error."));
      } else {
        resolve(data);
      }
    };
    script.onerror = () => {
      cleanUp();
      reject(new Error("Couldn't reach Deezer."));
    };
    script.src = `https://api.deezer.com/${path}?${query}`;
    document.head.append(script);
  });
}

function itunes(endpoint: "lookup" | "search", params: Record<string, string>): Promise<any[]> {
  const query = new URLSearchParams(params);
  return fetchJson(`https://itunes.apple.com/${endpoint}?${query}`).then((data) => data.results ?? []);
}

function oembed(endpoint: string, url: string): Promise<any> {
  return fetchJson(`${endpoint}${endpoint.includes("?") ? "&" : "?"}url=${encodeURIComponent(url)}`);
}

// ╭────────────────────────────────────────╮
// │                Matching                │
// ╰────────────────────────────────────────╯

// Simplifies a title or name for comparison: lowercase, no accents or punctuation, and no
// version tags like "(Remastered 2009)" or "- Radio Edit".
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/\s*[([][^)\]]*[)\]]/g, "")
    .replace(/\s+-\s+.*$/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Like normalize(), but keeps version tags, to prefer "Song" over "Song (Live)" when looking for "Song".
function normalizeExact(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

interface Candidate {
  title        : string;
  artist?      : string;
  durationSec? : number;
  trackCount?  : number;   // For albums, to tell editions apart
}

// Scores how well a search result matches what we're looking for. Higher is better; a result
// whose title doesn't match at all scores below zero.
function matchScore(candidate: Candidate, target: Info, query?: string): number {
  const title = normalize(candidate.title);
  const artist = normalize(candidate.artist ?? "");
  if (!target.title && query) {
    // Only free text is known (e.g. a URL slug): count how much of the result appears in it.
    const words = normalize(query);
    return (words.includes(title) ? 2 : -1) + (artist && words.includes(artist) ? 1 : 0)
      + (normalizeExact(query).includes(normalizeExact(candidate.title)) ? 0.5 : 0);
  }
  const wantTitle = normalize(target.title);
  let score = title === wantTitle ? 3 : title.includes(wantTitle) || wantTitle.includes(title) ? 1 : -5;
  if (normalizeExact(candidate.title) === normalizeExact(target.title)) {
    score += 0.5;
  }
  if (target.artist) {
    const wantArtist = normalize(target.artist);
    score += artist === wantArtist ? 2 : artist.includes(wantArtist) || wantArtist.includes(artist) ? 1 : -2;
  }
  if (target.durationSec && candidate.durationSec) {
    score += Math.abs(target.durationSec - candidate.durationSec) <= 3 ? 1 : 0;
  }
  if (target.trackCount && candidate.trackCount) {
    score += target.trackCount === candidate.trackCount ? 1 : 0;
  }
  return score;
}

// Returns the best-scoring item, or undefined if none matches. Ties keep the service's order,
// which is usually by popularity.
function bestMatch<T>(items: T[], toCandidate: (item: T) => Candidate, target: Info, query?: string): T | undefined {
  let best: T | undefined;
  let bestScore = 0;
  for (const item of items) {
    const score = matchScore(toCandidate(item), target, query);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

// The words to search for on other services.
export function searchQuery(result: LookupResult): string {
  const { info, kind } = result;
  const title = info.title.replace(/\s*[([][^)\]]*[)\]]/g, "");   // Drop "(Remastered)" etc.
  if (kind === "artist") return info.title;
  return [title, info.artist].filter(Boolean).join(" ");
}

// ╭────────────────────────────────────────╮
// │       Reading each service's data      │
// ╰────────────────────────────────────────╯

// Copies fields into `info` that it doesn't already have, so the pasted service's data wins.
function fill(info: Info, extra: Partial<Info>): void {
  for (const [key, value] of Object.entries(extra) as [keyof Info, unknown][]) {
    if (value !== undefined && value !== null && value !== "" && (info[key] === undefined || info[key] === "")) {
      (info as any)[key] = value;
    }
  }
}

function applyDeezer(result: LookupResult, data: any): void {
  result.links.deezer = data.link;
  if (result.kind === "track") {
    fill(result.info, {
      title       : data.title,
      artist      : (data.contributors ?? [data.artist]).map((a: any) => a?.name).filter(Boolean).join(", "),
      album       : data.album?.title,
      releaseDate : data.release_date,
      durationSec : data.duration,
      trackNumber : data.track_position,
      isrc        : data.isrc,
      bpm         : data.bpm ? Math.round(data.bpm) : undefined,
      explicit    : data.explicit_lyrics,
      artwork     : data.album?.cover_xl,
      previewUrl  : data.preview,
    });
  } else if (result.kind === "album") {
    fill(result.info, {
      title       : data.title,
      artist      : data.artist?.name,
      releaseDate : data.release_date,
      durationSec : data.duration,
      trackCount  : data.nb_tracks,
      genre       : data.genres?.data?.map((g: any) => g.name).join(", "),
      label       : data.label,
      upc         : data.upc,
      explicit    : data.explicit_lyrics,
      artwork     : data.cover_xl,
    });
  } else {
    fill(result.info, { title: data.name, artwork: data.picture_xl });
  }
}

function applyApple(result: LookupResult, data: any): void {
  const link = data.trackViewUrl ?? data.collectionViewUrl ?? data.artistLinkUrl ?? data.artistViewUrl;
  if (link) {
    const url = new URL(link);
    url.searchParams.delete("uo");   // Tracking parameter
    result.links.appleMusic = url.href;
  }
  if (result.kind === "artist") {
    fill(result.info, { title: data.artistName, genre: data.primaryGenreName });
    return;
  }
  const isTrack = result.kind === "track";
  fill(result.info, {
    title       : isTrack ? data.trackName : data.collectionName,
    artist      : data.artistName,
    album       : isTrack ? data.collectionName : undefined,
    releaseDate : data.releaseDate?.slice(0, 10),
    durationSec : isTrack && data.trackTimeMillis ? Math.round(data.trackTimeMillis / 1000) : undefined,
    trackNumber : isTrack ? data.trackNumber : undefined,
    trackCount  : data.trackCount,
    genre       : data.primaryGenreName,
    explicit    : (isTrack ? data.trackExplicitness : data.collectionExplicitness) === "explicit" ? true : undefined,
    artwork     : data.artworkUrl100?.replace(/\/100x100bb\./, "/600x600bb."),
    previewUrl  : data.previewUrl,
  });
}

// YouTube titles often look like "Artist - Title (Official Video)". Splits them and drops the tags.
export function parseVideoTitle(title: string, channel: string): { title: string; artist?: string } {
  const clean = title
    .replace(/\s*[([][^)\]]*(official|video|audio|lyric|visuali[sz]er|remaster|\bhd\b|\b4k\b|\bmv\b)[^)\]]*[)\]]/gi, "")
    .trim();
  if (/ - Topic$/.test(channel)) {
    return { title: clean, artist: channel.replace(/ - Topic$/, "") };   // Auto-generated music channel
  }
  const dash = clean.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (dash) {
    return { title: dash[2], artist: dash[1] };
  }
  return { title: clean, artist: channel };
}

// ⋘──────── Step 1: read what the pasted link's own service says ────────⋙

async function readSource(result: LookupResult): Promise<{ query?: string; titleOnly?: boolean }> {
  const { source, info } = result;
  switch (source.platform) {
    case "appleMusic": {
      const items = await itunes("lookup", { id: source.id, country: source.country ?? storefront() });
      if (!items.length) throw new Error("Apple Music didn't find anything for that link.");
      applyApple(result, items[0]);
      result.links.appleMusic = source.url;   // Keep the link exactly as pasted
      return {};
    }
    case "deezer": {
      applyDeezer(result, await deezer(`${source.kind}/${source.id}`));
      return {};
    }
    case "spotify": {
      // Spotify's oEmbed gives the title and artwork but not the artist.
      const data = await oembed("https://open.spotify.com/oembed", source.url);
      fill(info, { title: data.title, artwork: data.thumbnail_url });
      return { titleOnly: source.kind !== "artist" };
    }
    case "youtube":
    case "youtubeMusic": {
      const watch = source.kind === "track"
        ? `https://www.youtube.com/watch?v=${source.id}`
        : `https://www.youtube.com/playlist?list=${source.id}`;
      const data = await oembed("https://www.youtube.com/oembed?format=json", watch);
      const parsed = parseVideoTitle(data.title, data.author_name ?? "");
      fill(info, { ...parsed, artwork: data.thumbnail_url });
      return {};
    }
    case "soundcloud": {
      const data = await oembed("https://soundcloud.com/oembed?format=json", source.url);
      const by = String(data.title ?? "").match(/^(.+) by (.+)$/);
      fill(info, by ? { title: by[1], artist: by[2] } : { title: data.title });
      fill(info, { artwork: data.thumbnail_url });
      return {};
    }
    case "qobuz": {
      // Qobuz album IDs are usually the album's UPC barcode, which Deezer can look up directly.
      if (source.kind === "album" && /^\d{8,14}$/.test(source.id)) {
        for (const upc of new Set([source.id, source.id.replace(/^0+/, "")])) {
          try {
            applyDeezer(result, await deezer(`album/upc:${upc}`));
            return {};
          } catch {
            // Not on Deezer under that code; try the next form, then the slug.
          }
        }
      }
      if (!source.text) {
        throw new Error("This Qobuz link has no song or album name in it. Open it on qobuz.com and copy that address instead.");
      }
      return { query: source.text };
    }
    case "bandcamp":
      return { query: source.text };
    default:
      throw new Error("Links from that service can't be looked up.");
  }
}

// ⋘──────── Step 2: for links that only give a title, work out which item it is ────────⋙

// Spotify's oEmbed gives the title and artwork but not the artist, and many songs share a title.
// Search both catalogs by title, then pick the result whose cover matches the link's artwork, or
// else Apple's top result (Apple orders by popularity; Deezer's title search often doesn't).
async function identifyByTitle(result: LookupResult): Promise<void> {
  const { info, kind } = result;
  const isTrack = kind === "track";
  const wantTitle = normalize(info.title);
  const [appleItems, deezerItems] = await Promise.all([
    itunes("search", { term: info.title, entity: isTrack ? "song" : "album", limit: "25", country: storefront() })
      .catch(() => []),
    deezer(isTrack ? "search" : "search/album", { q: info.title, limit: "25" })
      .then((data) => data.data ?? [], () => []),
  ]);

  interface Choice extends Alternate { artist: string; cover?: string }
  const candidates: Choice[] = [
    ...appleItems.map((item: any): Choice => ({
      platform : "appleMusic",
      id       : isTrack ? item.trackId : item.collectionId,
      label    : `${isTrack ? item.trackName : item.collectionName} — ${item.artistName}`,
      artist   : item.artistName,
      cover    : item.artworkUrl100,
    })),
    ...deezerItems.map((item: any): Choice => ({
      platform : "deezer",
      id       : item.id,
      label    : `${item.title} — ${item.artist?.name}`,
      artist   : item.artist?.name ?? "",
      cover    : isTrack ? item.album?.cover_medium : item.cover_medium,
    })),
  ].filter((choice) => normalize(choice.label.replace(/ — [^—]*$/, "")) === wantTitle);
  if (!candidates.length) {
    result.notes.push("Couldn't find anything with this title.");
    return;
  }

  const byArtwork = info.artwork ? await matchArtwork(info.artwork, candidates, (choice) => choice.cover) : undefined;
  const choice = byArtwork ?? candidates[0];
  await applyChoice(result, choice);

  if (byArtwork) {
    return;
  }
  // Not sure, so offer one result per other artist in case the guess is wrong.
  const seen = new Set<string>([normalize(choice.artist)]);
  for (const candidate of candidates) {
    if (!seen.has(normalize(candidate.artist)) && result.alternates.length < 8) {
      seen.add(normalize(candidate.artist));
      result.alternates.push({ platform: candidate.platform, id: candidate.id, label: candidate.label });
    }
  }
  if (result.alternates.length) {
    result.notes.push(`${PLATFORMS[result.source.platform].name} doesn't share the artist publicly, so this was matched by title. If it's the wrong one, pick another below.`);
  }
}

// Loads a specific Apple Music or Deezer item into the result.
async function applyChoice(result: LookupResult, choice: Alternate): Promise<void> {
  if (choice.platform === "deezer") {
    applyDeezer(result, await deezer(`${result.kind}/${choice.id}`));
  } else {
    const [item] = await itunes("lookup", { id: String(choice.id), country: storefront() });
    if (item) applyApple(result, item);
  }
}

// ⋘──────── Matching by cover art ────────⋙

const FINGERPRINT_SIZE = 8;   // Images are compared as 8×8 grids of average colors

// Shrinks an image to a small grid of average colors. The image host must allow CORS (Spotify's,
// Deezer's, and Apple's do), or the canvas can't be read.
async function fingerprint(src: string): Promise<number[]> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    window.setTimeout(() => reject(new Error("Image timed out.")), TIMEOUT_MS);
    image.src = src;
  });
  // Draw at 4× the grid size and average each 4×4 block, which is steadier than one big downscale.
  const size = FINGERPRINT_SIZE * 4;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  const grid = new Array(FINGERPRINT_SIZE * FINGERPRINT_SIZE * 3).fill(0);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = (Math.floor(y / 4) * FINGERPRINT_SIZE + Math.floor(x / 4)) * 3;
      for (let c = 0; c < 3; c++) {
        grid[cell + c] += pixels[(y * size + x) * 4 + c] / 16;
      }
    }
  }
  return grid;
}

// Average per-channel color difference (0–255) between two fingerprints.
function fingerprintDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  return a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / a.length;
}

// Returns the item whose cover looks like `artwork`, or undefined if none is close.
async function matchArtwork<T>(artwork: string, items: T[], coverOf: (item: T) => string | undefined): Promise<T | undefined> {
  const MAX_DISTANCE = 12;   // The same cover differs by a few units after resizing and compression
  try {
    const target = await fingerprint(artwork);
    const distances = await Promise.all(items.map(async (item) => {
      const cover = coverOf(item);
      return cover ? fingerprintDistance(target, await fingerprint(cover).catch(() => [])) : Infinity;
    }));
    let bestIndex = -1;
    distances.forEach((distance, i) => {
      if (distance <= MAX_DISTANCE && (bestIndex < 0 || distance < distances[bestIndex])) bestIndex = i;
    });
    return bestIndex >= 0 ? items[bestIndex] : undefined;
  } catch {
    return undefined;   // The artwork couldn't be loaded
  }
}

// ⋘──────── Step 4: find the item on Deezer ────────⋙

async function findOnDeezer(result: LookupResult, query?: string): Promise<void> {
  const { info, kind } = result;
  if (kind === "track" && info.isrc) {
    try {
      return applyDeezer(result, await deezer(`track/isrc:${info.isrc}`));
    } catch { /* Fall back to searching */ }
  }
  if (kind === "album" && info.upc) {
    try {
      return applyDeezer(result, await deezer(`album/upc:${info.upc}`));
    } catch { /* Fall back to searching */ }
  }

  const endpoint = { track: "search", album: "search/album", artist: "search/artist" }[kind];
  const q = info.title ? [info.title, info.artist].filter(Boolean).join(" ") : query ?? "";
  let items: any[] = (await deezer(endpoint, { q, limit: "15" })).data ?? [];
  const toCandidate = (item: any): Candidate => ({
    title       : kind === "artist" ? item.name : item.title,
    artist      : item.artist?.name,
    durationSec : kind === "track" ? item.duration : undefined,
    trackCount  : item.nb_tracks,
  });
  let best = bestMatch(items, toCandidate, info, info.title ? undefined : query);

  // Deezer's search often ranks remixes above the original. If there's no exact match, look
  // through the artist's top tracks too.
  if (kind === "track" && info.title && info.artist && normalizeExact(best?.title ?? "") !== normalizeExact(info.title)) {
    const artistId = items.find((item) => normalize(item.artist?.name ?? "") === normalize(info.artist!))?.artist?.id;
    if (artistId) {
      items = [...((await deezer(`artist/${artistId}/top`, { limit: "100" })).data ?? []), ...items];
      best = bestMatch(items, toCandidate, info);
    }
  }
  if (best) {
    applyDeezer(result, await deezer(`${kind}/${best.id}`));
  } else {
    result.notes.push("Couldn't find this on Deezer.");
  }
}

// ⋘──────── Step 3: find the item on Apple Music ────────⋙

async function findOnApple(result: LookupResult, query?: string): Promise<void> {
  const { info, kind } = result;
  const entity = { track: "song", album: "album", artist: "musicArtist" }[kind];
  const term = info.title ? [info.title, info.artist].filter(Boolean).join(" ") : query ?? "";
  const items = await itunes("search", { term, entity, limit: "15", country: storefront() });
  const best = bestMatch(items, (item: any) => ({
    title       : kind === "track" ? item.trackName : kind === "album" ? item.collectionName : item.artistName,
    artist      : kind === "artist" ? undefined : item.artistName,
    durationSec : item.trackTimeMillis ? item.trackTimeMillis / 1000 : undefined,
    trackCount  : kind === "album" ? item.trackCount : undefined,
  }), info, info.title ? undefined : query);
  if (best) {
    applyApple(result, best);
  } else {
    result.notes.push("Couldn't find this on Apple Music.");
  }
}

// ⋘──────── Qobuz (looked up separately, since it's slow) ────────⋙
// Qobuz has no public API, and its store pages don't allow cross-site requests, so its search page
// is fetched through Jina Reader (r.jina.ai), a free service that fetches pages and allows CORS.
// It takes several seconds, so the sender's page shows the result first and adds Qobuz after.

const JINA_READER = "https://r.jina.ai/";
const QOBUZ_TIMEOUT_MS = 30000;

async function fetchQobuzPage(path: string): Promise<Document> {
  let response: Response;
  try {
    response = await fetch(`${JINA_READER}https://www.qobuz.com${path}`, {
      headers : { "X-Return-Format": "html" },
      signal  : AbortSignal.timeout(QOBUZ_TIMEOUT_MS),
    });
  } catch {
    throw new Error("Couldn't reach Qobuz.");
  }
  if (!response.ok) {
    throw new Error(`Qobuz lookup failed (error ${response.status}).`);
  }
  // Parsing doesn't run the page's scripts or load its images.
  return new DOMParser().parseFromString(await response.text(), "text/html");
}

// Finds the item on Qobuz and returns its play.qobuz.com link, or undefined if there's no match.
// Search results link to album pages (for songs too), and the album ID there is the same one the
// web player uses. For a song, the album page lists each track's ID in a data-track-v2 attribute.
export async function findOnQobuz(result: LookupResult): Promise<string | undefined> {
  const { info, kind } = result;
  if (kind === "artist") return undefined;
  const search = await fetchQobuzPage(`/us-en/search/${QOBUZ_SEARCH[kind]}/${encodeURIComponent(searchQuery(result))}`);
  // Track results are listed as "ListItem" links; album results only in the page's structured
  // data (JSON-LD), which has no artist, so the URL's slug ("in-rainbows-radiohead") stands in.
  const items = [...search.querySelectorAll<HTMLAnchorElement>("a.ListItem__title")].map((link) => ({
    title  : link.getAttribute("title")?.trim() || link.textContent?.trim() || "",
    artist : link.closest(".ListItem__titleWithArtists")?.querySelector(".ListItem__artists")?.textContent?.replace(/\s+/g, " ").trim(),
    href   : link.getAttribute("href") ?? "",
  }));
  for (const script of search.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.textContent ?? "");
      if (data?.["@type"] !== "SearchResultsPage") continue;
      for (const entry of data.mainEntity?.itemListElement ?? []) {
        const url = String(entry.item?.url ?? entry.url ?? "");
        items.push({ title: String(entry.item?.name ?? ""), artist: slugText(url.split("/").at(-2)), href: url });
      }
    } catch { /* Skip malformed structured data */ }
  }
  // The first result whose title (and artist) match, rather than blindly the first result.
  const best = bestMatch(items, (item) => item, info);
  const albumPath = best && new URL(best.href, "https://www.qobuz.com").pathname;
  const albumId = albumPath?.match(/\/album\/[^/]+\/([a-z0-9]+)\/?$/i)?.[1];
  if (!best || !albumPath || !albumId) return undefined;
  const albumLink = `https://play.qobuz.com/album/${albumId}`;
  if (kind === "album") return albumLink;

  try {
    const album = await fetchQobuzPage(albumPath);
    const tracks: { item_name: string; item_id: number; item_brand?: string }[] = [];
    for (const node of album.querySelectorAll("[data-track-v2]")) {
      try {
        tracks.push(JSON.parse(node.getAttribute("data-track-v2")!));
      } catch { /* Skip malformed entries */ }
    }
    const track = tracks.find((t) => normalizeExact(t.item_name) === normalizeExact(best.title))
      ?? bestMatch(tracks, (t) => ({ title: t.item_name, artist: t.item_brand }), info);
    if (track?.item_id) return `https://play.qobuz.com/track/${track.item_id}`;
  } catch {
    // Fall back to the album, which at least contains the song.
  }
  return albumLink;
}

// Reads a link the sender pastes for another service. Qobuz store and open.qobuz.com links become
// play.qobuz.com links; tracking parameters are removed. Throws an Error with a user-facing message.
export function parseServiceLink(input: string): { key: PlatformKey; url: string } {
  let raw = input.trim();
  if (!/^[a-z]+:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That doesn't look like a valid link.");
  }
  url.protocol = "https:";
  for (const param of [...url.searchParams.keys()]) {
    if (/^(si|utm_.*|ref|context|fbclid)$/i.test(param)) url.searchParams.delete(param);
  }
  const key = (Object.keys(PLATFORMS) as PlatformKey[]).find((k) => PLATFORMS[k].hosts.test(url.hostname));
  if (!key) {
    throw new Error("That isn't a link to one of the services listed above.");
  }
  if (key === "qobuz") {
    const m = url.pathname.match(/\/(album|track|artist|interpreter)\/(?:[^/]+\/)?([^/]+)\/?$/);
    if (!m) throw new Error("Paste a link to a Qobuz album, track, or artist.");
    return { key, url: `https://play.qobuz.com/${m[1] === "interpreter" ? "artist" : m[1]}/${m[2]}` };
  }
  return { key, url: url.href };
}

// ⋘──────── Putting it together ────────⋙

// Looks up a parsed link. `choice` overrides the match (when the sender picks another item).
export async function lookup(source: ParsedLink, choice?: Alternate): Promise<LookupResult> {
  const result: LookupResult = {
    kind: source.kind, info: { title: "" }, links: { [source.platform]: source.url },
    notes: [], alternates: [], source,
  };
  const { query, titleOnly } = await readSource(result);

  if (choice) {
    // The sender picked this item themselves, so it outranks what was read from the link.
    result.info = { title: "" };
    result.links = { [source.platform]: source.url };
  }
  try {
    if (choice) {
      await applyChoice(result, choice);
    } else if (titleOnly) {
      await identifyByTitle(result);
    }
  } catch {
    result.notes.push("Couldn't search for this title.");
  }
  // Apple first: its search ranks results better, and the track length it finds helps on Deezer.
  if (!result.links.appleMusic) {
    try {
      await findOnApple(result, query);
    } catch {
      result.notes.push("Couldn't search Apple Music.");
    }
  }
  if (!result.links.deezer) {
    try {
      await findOnDeezer(result, query);
    } catch {
      result.notes.push("Couldn't search Deezer.");
    }
  }
  if (!result.info.title) {
    throw new Error("Couldn't find any details for that link.");
  }
  return result;
}


// ╭────────────────────────────────────────╮
// │                 Sharing                │
// ╰────────────────────────────────────────╯
// A share link carries the sender's checked result in its `s` parameter (compressed JSON), so
// receivers get exactly the item the sender confirmed, without the page looking anything up again.
// Anyone can craft such a link, so everything read from it is validated before use.

export interface SharedSong {
  v  : 1;
  k  : Kind;
  t  : string;                                  // Title
  a? : string;                                  // Artist
  al?: string;                                  // Album
  y? : string;                                  // Release date
  d? : number;                                  // Duration in seconds
  i? : string;                                  // Artwork URL
  p? : string;                                  // Preview audio URL (only Apple's, which don't expire)
  c? : string;                                  // ISRC
  q  : string;                                  // Search words for services without a direct link
  l  : Partial<Record<PlatformKey, string>>;    // Direct links
}

// Image and audio hosts that shared artwork and previews may use.
const MEDIA_HOSTS = /(^|\.)(scdn\.co|spotifycdn\.com|mzstatic\.com|apple\.com|dzcdn\.net|ytimg\.com|sndcdn\.com)$/;

function hostMatches(url: string | undefined, hosts: RegExp): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && hosts.test(parsed.hostname);
  } catch {
    return false;
  }
}

function isPlatformKey(key: unknown): key is PlatformKey {
  return typeof key === "string" && Object.hasOwn(PLATFORMS, key);
}

export function toShared(result: LookupResult): SharedSong {
  const { info } = result;
  const links: SharedSong["l"] = {};
  for (const [key, url] of Object.entries(result.links)) {
    if (isPlatformKey(key) && hostMatches(url, PLATFORMS[key].hosts)) links[key] = url;
  }
  return {
    v  : 1,
    k  : result.kind,
    t  : info.title,
    a  : info.artist,
    al : info.album,
    y  : info.releaseDate,
    d  : info.durationSec,
    i  : hostMatches(info.artwork, MEDIA_HOSTS) ? info.artwork : undefined,
    p  : hostMatches(info.previewUrl, /(^|\.)apple\.com$/) ? info.previewUrl : undefined,
    c  : info.isrc,
    q  : searchQuery(result),
    l  : links,
  };
}

// Checks a decoded share and drops anything that isn't safe to show or link to.
function sanitizeShared(raw: any): SharedSong {
  if (!raw || raw.v !== 1 || typeof raw.t !== "string" || !raw.t) {
    throw new Error("This share link is damaged or incomplete.");
  }
  const text = (value: unknown) => (typeof value === "string" && value ? value.slice(0, 300) : undefined);
  const links: SharedSong["l"] = {};
  for (const [key, url] of Object.entries(raw.l ?? {})) {
    if (isPlatformKey(key) && typeof url === "string" && hostMatches(url, PLATFORMS[key].hosts)) links[key] = url;
  }
  return {
    v  : 1,
    k  : raw.k === "album" || raw.k === "artist" ? raw.k : "track",
    t  : text(raw.t)!,
    a  : text(raw.a),
    al : text(raw.al),
    y  : text(raw.y),
    d  : typeof raw.d === "number" && raw.d > 0 ? raw.d : undefined,
    i  : hostMatches(raw.i, MEDIA_HOSTS) ? raw.i : undefined,
    p  : hostMatches(raw.p, /(^|\.)apple\.com$/) ? raw.p : undefined,
    c  : typeof raw.c === "string" && /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(raw.c) ? raw.c : undefined,
    q  : text(raw.q) ?? text(raw.t)!,
    l  : links,
  };
}

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pipeBytes(bytes: Uint8Array, transform: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Encodes a share as "z" + compressed JSON, or "j" + plain JSON where compression isn't supported.
export async function encodeShare(song: SharedSong): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(song));
  if (typeof CompressionStream === "undefined") {
    return "j" + toBase64Url(bytes);
  }
  return "z" + toBase64Url(await pipeBytes(bytes, new CompressionStream("deflate-raw")));
}

export async function decodeShare(token: string): Promise<SharedSong> {
  if (token[0] === "z" && typeof DecompressionStream === "undefined") {
    throw new Error("This browser is too old to open share links. Try updating it.");
  }
  let raw: unknown;
  try {
    let bytes = fromBase64Url(token.slice(1));
    if (token[0] === "z") {
      bytes = await pipeBytes(bytes, new DecompressionStream("deflate-raw"));
    } else if (token[0] !== "j") {
      throw new Error("Unknown format");
    }
    raw = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error("This share link is damaged or incomplete. Ask the sender to copy it again.");
  }
  return sanitizeShared(raw);
}

// Where a service's button goes for a shared item: its direct link, or else a search.
function serviceUrl(song: SharedSong, key: PlatformKey): string {
  return song.l[key] ?? PLATFORMS[key].search(song.q, song.k);
}

function shareUrl(token: string): string {
  return `${location.origin}${location.pathname}?s=${token}`;
}

// ⋘──────── Receiver's preferred service (saved only in this browser) ────────⋙

const PREFERENCE_KEY = "music-link-service";
const REDIRECT_DELAY_MS = 2000;   // How long the "Opening in …" notice shows before redirecting
const RECENT_KEY = "music-link-recent-redirect";  // The share last redirected, and when
const RECENT_MS = 10 * 60 * 1000;                  // Reopening it within this long shows the chooser

function loadPreference(): PlatformKey | null {
  const value = loadString(PREFERENCE_KEY);
  return isPlatformKey(value) ? value : null;
}

function savePreference(key: PlatformKey | null): void {
  if (key) {
    saveString(PREFERENCE_KEY, key);
  } else {
    removeSaved(PREFERENCE_KEY);
  }
}

// Remembers that this share just redirected, so opening it again shows the chooser instead.
// If it isn't saved, reopening the link redirects again.
function markRedirected(token: string): void {
  saveJSON(RECENT_KEY, { token, at: Date.now() });
}

function recentlyRedirected(token: string): boolean {
  const recent = loadJSON<{ token?: unknown; at?: unknown }>(RECENT_KEY);
  return recent?.token === token && typeof recent.at === "number" && Date.now() - recent.at < RECENT_MS;
}

// ╭────────────────────────────────────────╮
// │              Page helpers              │
// ╰────────────────────────────────────────╯

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

// Creates an element with optional class and text (text is never parsed as HTML).
function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A row in an item's details: label, value, and optionally a link for the value and a help note.
type Detail = [string, string | undefined, (DetailExtra | undefined | "")?];
interface DetailExtra {
  href?  : string;
  title? : string;
  help?  : { text: string; link: string; linkText: string };
}

const ISRC_HELP = {
  text     : "An ISRC (International Standard Recording Code) is a 12-character ID for one specific " +
             "recording. Remasters, live versions, and remixes each get their own, so it pins down exactly " +
             "this recording across every store and streaming service. The code links to MusicBrainz, " +
             "which lists the releases that include it.",
  link     : "https://isrc.ifpi.org/",
  linkText : "Learn more from the ISRC agency (IFPI)",
};

let helpCounter = 0;

// Adds a "?" button after a detail's label that shows or hides an explanation below the row.
function renderHelp(dt: HTMLElement, term: string, help: NonNullable<DetailExtra["help"]>): HTMLElement {
  const panel = el("dd", "ml-help-panel");
  panel.id = `ml-help-${helpCounter++}`;
  panel.hidden = true;
  const link = el("a", undefined, help.linkText);
  link.href = help.link;
  link.target = "_blank";
  link.rel = "noopener";
  panel.append(el("span", undefined, `${help.text} `), link);

  const button = el("button", "ml-help");
  button.type = "button";
  button.setAttribute("aria-label", `What is an ${term}?`);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panel.id);
  button.title = `What is an ${term}?`;
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>`;
  button.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    button.setAttribute("aria-expanded", String(!panel.hidden));
  });
  dt.append(button);
  return panel;
}

// The artwork, title, details, and preview player for an item.
function renderCard(kind: Kind, info: Info): HTMLElement {
  const card = el("div", "ml-card");
  if (info.artwork) {
    const art = el("img", kind === "artist" ? "ml-art ml-art-round" : "ml-art");
    art.src = info.artwork;
    art.alt = "";
    art.referrerPolicy = "no-referrer";
    card.append(art);
  }
  const body = el("div", "ml-card-body");
  body.append(el("p", "ml-kind", { track: "Song", album: "Album", artist: "Artist" }[kind]));
  body.append(el("h2", "ml-title", info.title));
  if (info.artist) body.append(el("p", "ml-artist", info.artist));

  const details: Detail[] = [
    ["Album",    info.album],
    ["Released", info.releaseDate && formatDate(info.releaseDate)],
    ["Length",   info.durationSec ? formatDuration(info.durationSec) : undefined],
    ["Track",    info.trackNumber ? `${info.trackNumber}${info.trackCount ? ` of ${info.trackCount}` : ""}` : undefined],
    ["Tracks",   kind === "album" && info.trackCount ? String(info.trackCount) : undefined],
    ["Genre",    info.genre],
    ["Label",    info.label],
    ["Tempo",    info.bpm ? `${info.bpm} BPM` : undefined],
    ["Explicit", info.explicit ? "Yes" : undefined],
    ["ISRC",     info.isrc, info.isrc && {
      href  : `https://musicbrainz.org/isrc/${encodeURIComponent(info.isrc)}`,
      title : "See every release of this recording on MusicBrainz",
      help  : ISRC_HELP,
    }],
    ["UPC",      info.upc],
  ];
  const list = el("dl", "ml-details");
  for (const [term, value, extra] of details) {
    if (!value) continue;
    const dt = el("dt", undefined, term);
    const dd = el("dd");
    if (extra && extra.href) {
      const link = el("a", undefined, value);
      link.href = extra.href;
      link.title = extra.title ?? "";
      link.target = "_blank";
      link.rel = "noopener";
      dd.append(link);
    } else {
      dd.textContent = value;
    }
    list.append(dt, dd);
    if (extra && extra.help) {
      list.append(renderHelp(dt, term, extra.help));
    }
  }
  if (list.childElementCount) body.append(list);

  if (info.previewUrl) {
    const audio = el("audio", "ml-preview");
    audio.controls = true;
    audio.preload = "none";
    audio.src = info.previewUrl;
    body.append(audio);
  }
  card.append(body);
  return card;
}

interface GridOptions {
  newTab     : boolean;
  pending?   : PlatformKey[];                // Services still being looked up
  preferred? : PlatformKey | null;
  onPick?    : (key: PlatformKey) => void;   // Called when a link is clicked, before it opens
}

// One tile per service, linking straight to the item or to a search for it.
function renderServiceGrid(song: SharedSong, options: GridOptions): HTMLElement {
  const links = el("ul", "ml-links");
  for (const key of Object.keys(PLATFORMS) as PlatformKey[]) {
    const platform = PLATFORMS[key];
    const direct = Boolean(song.l[key]);
    const link = el("a", direct ? "ml-link" : "ml-link ml-link-search");
    link.href = serviceUrl(song, key);
    if (options.newTab) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    link.style.setProperty("--ml-brand", platform.color);
    link.append(el("span", "ml-dot"), el("span", "ml-name", platform.name));
    if (options.preferred === key) {
      link.classList.add("ml-link-preferred");
      link.append(el("span", "ml-default", "Default"));
    }
    const pending = !direct && options.pending?.includes(key);
    link.append(el("span", pending ? "ml-badge ml-badge-pending" : "ml-badge", direct ? "Open" : pending ? "Finding…" : "Search"));
    if (options.onPick) {
      link.addEventListener("click", () => options.onPick!(key));
    }
    const item = el("li");
    item.append(link);
    links.append(item);
  }
  return links;
}

async function copyText(button: HTMLButtonElement, text: string, label: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
  } catch {
    button.textContent = "Copy failed";
  }
  window.setTimeout(() => (button.textContent = label), 1500);
}

// Search results the sender can pick from when the match is wrong.
interface Pick extends Alternate {
  detail?  : string;
  artwork? : string;
}

async function searchPicks(query: string, kind: Kind): Promise<Pick[]> {
  const isTrack = kind === "track";
  const [appleItems, deezerItems] = await Promise.all([
    itunes("search", { term: query, entity: { track: "song", album: "album", artist: "musicArtist" }[kind], limit: "10", country: storefront() })
      .catch(() => []),
    deezer({ track: "search", album: "search/album", artist: "search/artist" }[kind], { q: query, limit: "10" })
      .then((data) => data.data ?? [], () => []),
  ]);
  const picks: Pick[] = [];
  const seen = new Set<string>();
  const add = (pick: Pick) => {
    const id = normalizeExact(pick.label);
    if (!seen.has(id)) {
      seen.add(id);
      picks.push(pick);
    }
  };
  for (const item of appleItems) {
    add({
      platform : "appleMusic",
      id       : kind === "track" ? item.trackId : kind === "album" ? item.collectionId : item.artistId,
      label    : kind === "artist" ? item.artistName : `${isTrack ? item.trackName : item.collectionName} — ${item.artistName}`,
      detail   : [isTrack ? item.collectionName : undefined, item.releaseDate?.slice(0, 4)].filter(Boolean).join(" · "),
      artwork  : item.artworkUrl60,
    });
  }
  for (const item of deezerItems) {
    add({
      platform : "deezer",
      id       : item.id,
      label    : kind === "artist" ? item.name : `${item.title} — ${item.artist?.name}`,
      detail   : isTrack ? item.album?.title : undefined,
      artwork  : kind === "artist" ? item.picture_small : isTrack ? item.album?.cover_small : item.cover_small,
    });
  }
  return picks;
}

// ╭────────────────────────────────────────╮
// │              Sender view               │
// ╰────────────────────────────────────────╯

function initSender(): void {
  const form = document.getElementById("ml-form") as HTMLFormElement;
  const input = document.getElementById("ml-input") as HTMLInputElement;
  const clearButton = document.getElementById("ml-clear") as HTMLButtonElement;
  const message = document.getElementById("ml-message") as HTMLParagraphElement;
  const output = document.getElementById("ml-output") as HTMLDivElement;

  let requestId = 0;   // Ignore results from lookups that were superseded by a newer one

  function showMessage(text: string, isError: boolean): void {
    message.hidden = !text;
    message.textContent = text;
    message.classList.toggle("ml-error", isError);
  }

  // "Not the right one?": a search the sender can use to pick the correct item.
  function renderCorrection(result: LookupResult): HTMLElement {
    const details = el("details", "ml-correct");
    details.open = result.alternates.length > 0;
    details.append(el("summary", undefined, "Not the right one?"));
    for (const note of result.notes) {
      details.append(el("p", "ml-note", note));
    }
    const searchForm = el("form", "ml-field ml-search");
    const searchInput = el("input");
    searchInput.type = "search";
    searchInput.value = searchQuery(result);
    searchInput.setAttribute("aria-label", "Search for the right item");
    const searchButton = el("button", undefined, "Search");
    searchButton.type = "submit";
    searchForm.append(searchInput, searchButton);
    const picks = el("ul", "ml-picks");
    details.append(searchForm, picks);

    const showPicks = (items: Pick[]) => {
      picks.replaceChildren();
      if (!items.length) {
        picks.append(el("li", "ml-note", "No results."));
      }
      for (const pick of items) {
        const button = el("button", "ml-pick");
        button.type = "button";
        if (pick.artwork) {
          const art = el("img");
          art.src = pick.artwork;
          art.alt = "";
          art.referrerPolicy = "no-referrer";
          button.append(art);
        }
        const text = el("span");
        text.append(el("span", "ml-pick-label", pick.label));
        if (pick.detail) text.append(el("span", "ml-pick-detail", pick.detail));
        button.append(text);
        button.addEventListener("click", () => run(result.source, pick));
        const item = el("li");
        item.append(button);
        picks.append(item);
      }
    };
    if (result.alternates.length) showPicks(result.alternates);

    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!searchInput.value.trim()) return;
      picks.replaceChildren(el("li", "ml-note", "Searching…"));
      showPicks(await searchPicks(searchInput.value.trim(), result.kind));
    });
    return details;
  }

  // The share link, with copy, share, and preview buttons.
  function renderShareBox(token: string, song: SharedSong): HTMLElement {
    const url = shareUrl(token);
    const box = el("div", "ml-share");
    box.append(el("h2", "ml-section-heading", "Share this link"));
    const row = el("div", "ml-share-row");
    const field = el("input", "ml-share-url");
    field.readOnly = true;
    field.value = url;
    field.setAttribute("aria-label", "Share link");
    field.addEventListener("focus", () => field.select());
    const copy = el("button", "ml-primary", "Copy link");
    copy.type = "button";
    copy.addEventListener("click", () => copyText(copy, url, "Copy link"));
    row.append(field, copy);
    if (typeof navigator.share === "function") {
      const share = el("button", undefined, "Share…");
      share.type = "button";
      share.addEventListener("click", () => {
        navigator.share({ title: [song.t, song.a].filter(Boolean).join(" — "), url }).catch(() => {});
      });
      row.append(share);
    }
    box.append(row);
    const preview = el("a", "ml-preview-link", "Preview what they'll see");
    preview.href = `${url}#preview`;
    preview.target = "_blank";
    preview.rel = "noopener";
    box.append(preview);
    return box;
  }

  // The current result, plus links the sender added by hand and the state of the Qobuz lookup.
  interface SenderState {
    result : LookupResult;
    manual : Partial<Record<PlatformKey, string>>;
    qobuz  : "idle" | "searching" | "failed";
  }
  let state: SenderState | null = null;
  const linksArea = el("div");
  let linksRender = 0;   // Ignore stale renders (encoding the share link is asynchronous)

  // "Add a link from another service": the fallback for services the page can't look up.
  function renderAddLink(current: SenderState): HTMLElement {
    const section = el("div", "ml-add");
    section.append(el("h2", "ml-section-heading", "Add a link from another service"));
    const intro = el("p", "ml-note");
    if (current.qobuz === "failed" && !current.manual.qobuz) {
      const search = el("a", undefined, "Search Qobuz");
      search.href = PLATFORMS.qobuz.search(searchQuery(current.result), current.result.kind);
      search.target = "_blank";
      search.rel = "noopener";
      intro.append("Couldn't find this on Qobuz automatically. ", search, ", open the right result, and paste its link here. ");
    }
    intro.append("Services marked \"Search\" get a search link. Paste the item's link from one of them to share a direct link instead.");
    section.append(intro);

    const addForm = el("form", "ml-field ml-search");
    const addInput = el("input");
    addInput.type = "text";
    addInput.inputMode = "url";
    addInput.placeholder = "https://play.qobuz.com/album/…";
    addInput.setAttribute("aria-label", "Link from another service");
    const addButton = el("button", undefined, "Add");
    addButton.type = "submit";
    addForm.append(addInput, addButton);
    const error = el("p", "ml-message ml-error");
    error.hidden = true;
    const add = () => {
      if (!addInput.value.trim()) return;
      try {
        const { key, url } = parseServiceLink(addInput.value);
        current.manual[key] = url;
        void renderLinks();
      } catch (e) {
        error.textContent = (e as Error).message;
        error.hidden = false;
      }
    };
    addForm.addEventListener("submit", (event) => {
      event.preventDefault();
      add();
    });
    addInput.addEventListener("paste", () => window.setTimeout(add, 0));
    section.append(addForm, error);

    const added = Object.entries(current.manual) as [PlatformKey, string][];
    if (added.length) {
      const list = el("ul", "ml-added");
      for (const [key, url] of added) {
        const item = el("li");
        const link = el("a", undefined, url);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        const remove = el("button", "ml-text-button", "Remove");
        remove.type = "button";
        remove.addEventListener("click", () => {
          delete current.manual[key];
          void renderLinks();
        });
        item.append(el("strong", undefined, `${PLATFORMS[key].name}: `), link, " ", remove);
        list.append(item);
      }
      section.append(list);
    }
    return section;
  }

  async function renderLinks(): Promise<void> {
    if (!state) return;
    const current = state;
    const id = ++linksRender;
    const merged: LookupResult = { ...current.result, links: { ...current.result.links, ...current.manual } };
    const song = toShared(merged);
    const token = await encodeShare(song);
    if (id !== linksRender || current !== state) return;
    linksArea.replaceChildren(
      renderShareBox(token, song),
      el("h2", "ml-section-heading", "Listen on"),
      renderServiceGrid(song, { newTab: true, pending: current.qobuz === "searching" ? ["qobuz"] : [] }),
      renderAddLink(current),
    );
  }

  async function render(result: LookupResult): Promise<void> {
    state = { result, manual: {}, qobuz: "idle" };
    output.replaceChildren(renderCard(result.kind, result.info), renderCorrection(result), linksArea);
    output.hidden = false;
    await renderLinks();
  }

  // Looks the item up on Qobuz after the rest is shown, then updates the links.
  async function addQobuz(id: number): Promise<void> {
    const current = state;
    if (!current || current.result.links.qobuz || current.result.kind === "artist") return;
    current.qobuz = "searching";
    void renderLinks();
    let url: string | undefined;
    try {
      url = await findOnQobuz(current.result);
    } catch {
      url = undefined;
    }
    if (id !== requestId || current !== state) return;
    if (url) {
      current.result.links.qobuz = url;
      current.qobuz = "idle";
    } else {
      current.qobuz = "failed";
    }
    await renderLinks();
  }

  async function run(source: ParsedLink, choice?: Alternate): Promise<void> {
    const id = ++requestId;
    showMessage("Looking it up…", false);
    try {
      const result = await lookup(source, choice);
      if (id !== requestId) return;
      showMessage("", false);
      await render(result);
      void addQobuz(id);
    } catch (error) {
      if (id !== requestId) return;
      output.hidden = true;
      showMessage((error as Error).message || "Something went wrong.", true);
    }
  }

  function submit(): void {
    clearButton.hidden = !input.value;
    if (!input.value.trim()) {
      requestId++;
      output.hidden = true;
      showMessage("", false);
      return;
    }
    let source: ParsedLink;
    try {
      source = parseLink(input.value);
    } catch (error) {
      requestId++;
      output.hidden = true;
      showMessage((error as Error).message, true);
      return;
    }
    // Keep the link in the address bar so the page can be bookmarked or reloaded.
    history.replaceState(null, "", `${location.pathname}?url=${encodeURIComponent(input.value.trim())}`);
    void run(source);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submit();
  });
  // Look up as soon as a link is pasted, without waiting for Enter.
  input.addEventListener("paste", () => window.setTimeout(submit, 0));
  input.addEventListener("input", () => (clearButton.hidden = !input.value));
  clearButton.addEventListener("click", () => {
    input.value = "";
    history.replaceState(null, "", location.pathname);
    submit();
    input.focus();
  });

  initPreferenceSettings();

  const incoming = new URLSearchParams(location.search).get("url");
  if (incoming) {
    input.value = incoming;
    submit();
  }
}

// The "Opening links you receive" settings at the bottom of the sender view.
function initPreferenceSettings(): void {
  const select = document.getElementById("ml-pref-select") as HTMLSelectElement;
  const status = document.getElementById("ml-pref-status") as HTMLElement;
  select.append(new Option("Ask me each time", ""));
  for (const key of Object.keys(PLATFORMS) as PlatformKey[]) {
    select.append(new Option(PLATFORMS[key].name, key));
  }
  const show = () => {
    const preferred = loadPreference();
    select.value = preferred ?? "";
    status.textContent = preferred
      ? `Song links will open in ${PLATFORMS[preferred].name} automatically.`
      : "You'll be asked which service to use each time.";
  };
  select.addEventListener("change", () => {
    savePreference(isPlatformKey(select.value) ? select.value : null);
    show();
  });
  show();
}

// ╭────────────────────────────────────────╮
// │             Receiver view              │
// ╰────────────────────────────────────────╯
// Opening a share link redirects to the receiver's preferred service, if they've set one, after
// briefly showing a notice that can cancel it. Browsers skip pages that navigate away on their own
// when the user presses Back (Chrome's protection against "back button traps"), so Back can't be
// relied on to return here. Instead, opening the same link again within RECENT_MS shows the
// chooser rather than redirecting again. That's where the default can be changed or turned off.

async function initReceiver(token: string): Promise<void> {
  const root = document.getElementById("ml-receive") as HTMLDivElement;
  const isPreview = location.hash === "#preview";   // The sender checking the link: never redirect

  let song: SharedSong;
  try {
    song = await decodeShare(token);
  } catch (error) {
    root.replaceChildren(el("p", "ml-message ml-error", (error as Error).message));
    return;
  }
  document.title = [song.t, song.a].filter(Boolean).join(" — ");

  const status = el("p", "ml-status");
  const remember = el("input");
  remember.type = "checkbox";
  remember.id = "ml-remember";

  function render(): void {
    const preferred = loadPreference();
    remember.checked = preferred !== null;

    const rememberLabel = el("label", "ml-remember");
    rememberLabel.append(remember, document.createTextNode(" Always open song links in the service I pick"));

    const defaultLine = el("p", "ml-default-line");
    if (preferred) {
      defaultLine.append(`Your default is ${PLATFORMS[preferred].name}. Pick another service above to change it, or `);
      const off = el("button", "ml-text-button", "stop opening links automatically");
      off.type = "button";
      off.addEventListener("click", () => {
        savePreference(null);
        status.textContent = "Links will no longer open automatically. Choose a service each time.";
        render();
      });
      defaultLine.append(off, ".");
    }

    const sendOwn = el("a", "ml-send-own", "Share a song of your own");
    sendOwn.href = location.pathname;

    const info: Info = { title: song.t, artist: song.a, album: song.al, releaseDate: song.y, durationSec: song.d, artwork: song.i, previewUrl: song.p, isrc: song.c };
    root.replaceChildren(
      renderCard(song.k, info),
      status,
      el("h2", "ml-section-heading", "Open in"),
      renderServiceGrid(song, {
        newTab    : false,
        preferred,
        onPick    : (key) => {
          if (remember.checked) savePreference(key);
          markRedirected(token);   // Reopening the link shows this chooser again
        },
      }),
      rememberLabel,
      defaultLine,
      sendOwn,
    );
  }

  render();
  const preferred = loadPreference();
  if (isPreview) {
    status.textContent = "Preview: this is what people who open your link will see.";
  } else if (preferred && recentlyRedirected(token)) {
    status.textContent = `This link just opened in ${PLATFORMS[preferred].name}. Pick another service, or change your default below.`;
  } else if (preferred) {
    redirectWithNotice(preferred);
  }

  // Shows a notice for a moment, then opens the preferred service. Cancel stays on this page.
  function redirectWithNotice(key: PlatformKey): void {
    const name = PLATFORMS[key].name;
    const target = serviceUrl(song, key);
    const go = () => markRedirected(token);

    const toast = el("div", "ml-toast");
    toast.setAttribute("role", "status");
    toast.style.setProperty("--ml-brand", PLATFORMS[key].color);
    toast.style.setProperty("--ml-delay", `${REDIRECT_DELAY_MS}ms`);
    const text = el("div", "ml-toast-text");
    text.append(el("strong", undefined, `Opening in ${name}…`));
    const searchNote = song.l[key] ? "" : ` ${name} will search for this ${song.k === "track" ? "song" : song.k}.`;
    text.append(el("span", undefined, `Your default service.${searchNote} Open this link again to choose another.`));
    const openNow = el("a", "ml-toast-open", "Open now");
    openNow.href = target;
    openNow.addEventListener("click", () => {
      clearTimeout(timer);
      go();
    });
    const cancel = el("button", "ml-toast-cancel", "Cancel");
    cancel.type = "button";
    cancel.addEventListener("click", () => {
      clearTimeout(timer);
      toast.remove();
      status.textContent = "Stayed here. Pick a service below, or change your default.";
    });
    toast.append(text, openNow, cancel, el("div", "ml-toast-progress"));
    document.body.append(toast);
    status.textContent = `Opening in ${name}…`;

    const timer = window.setTimeout(() => {
      go();
      location.assign(target);
    }, REDIRECT_DELAY_MS);
  }

  // Where Back does return here (e.g. after tapping "Open now"), the browser may restore this page
  // from its cache without reloading it.
  window.addEventListener("pageshow", (event) => {
    const current = loadPreference();
    if (event.persisted && current && !isPreview) {
      document.querySelector(".ml-toast")?.remove();
      status.textContent = `This link just opened in ${PLATFORMS[current].name}. Pick another service, or change your default below.`;
    }
  });
}

// ╭────────────────────────────────────────╮
// │                 Startup                │
// ╰────────────────────────────────────────╯

function initPage(): void {
  const token = new URLSearchParams(location.search).get("s");
  if (token) {
    void initReceiver(token);
  } else {
    initSender();
  }
}

if (typeof document !== "undefined") {
  // Module scripts are deferred, but guard in case the DOM is still loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}
