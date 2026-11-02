// Builds data/skateparks-on.json from OpenStreetMap (Overpass). Node 18+, no dependencies.
import { writeFileSync, mkdirSync } from 'node:fs';

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
// Ontario bounding box, fetched in tiles so each Overpass query stays small.
const BBOX = { s: 41.6, w: -95.2, n: 56.9, e: -74.3 };
const TILE_LAT = 2.5, TILE_LON = 3.5;
const r5 = (x) => Math.round(x * 1e5) / 1e5;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tile(s, w, n, e, attempt = 0) {
  const q = `[out:json][timeout:90];nwr["leisure"="skatepark"](${s},${w},${n},${e});out center tags;`;
  for (let i = 0; i < MIRRORS.length * 2; i++) {
    const url = MIRRORS[(attempt + i) % MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({ data: q }),
        headers: { 'User-Agent': 'best.skatepark.day data build' },
        signal: AbortSignal.timeout(120000)
      });
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d.elements) && !d.remark?.includes('error')) return d.elements;
      }
      console.error(url, res.status);
    } catch (err) { console.error(url, err.message); }
    await sleep(3000 * (i + 1));
  }
  throw new Error(`Tile ${s},${w} failed on every mirror`);
}

async function fetchData() {
  const out = [];
  let k = 0;
  for (let s = BBOX.s; s < BBOX.n; s += TILE_LAT) {
    for (let w = BBOX.w; w < BBOX.e; w += TILE_LON) {
      const els = await tile(r5(s), r5(w), r5(Math.min(s + TILE_LAT, BBOX.n)), r5(Math.min(w + TILE_LON, BBOX.e)), k++);
      out.push(...els);
      await sleep(1000);
    }
  }
  if (out.length < 50) throw new Error(`Only ${out.length} elements; refusing to overwrite data`);
  return out;
}

const elements = await fetchData();
const seen = new Set();
const parks = elements.map((e) => {
  const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
  if (lat == null || lon == null) return null;
  const t = e.tags || {};
  let n = t.name || t['name:en'] || t.official_name;
  if (!n) n = t['addr:street'] ? `Skatepark on ${t['addr:street']}` : (t['addr:city'] ? `${t['addr:city']} skatepark` : 'Skatepark');
  return { n: n.trim(), lat: r5(lat), lon: r5(lon) };
}).filter(Boolean).filter((p) => {
  const k = `${p.n}|${p.lat.toFixed(3)}|${p.lon.toFixed(3)}`;
  if (seen.has(k)) return false;
  seen.add(k); return true;
}).sort((a, b) => a.lat - b.lat || a.lon - b.lon);

mkdirSync('data', { recursive: true });
writeFileSync('data/skateparks-on.json', '[\n' + parks.map((p) => JSON.stringify(p)).join(',\n') + '\n]\n');
console.log(`Wrote ${parks.length} skate parks`);
