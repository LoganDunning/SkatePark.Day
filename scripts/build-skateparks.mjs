// Builds data/skateparks-on.json from OpenStreetMap (Overpass). Node 18+, no dependencies.
// Queries are kept light (leisure=skatepark only, centre points + tags) and the whole run has a time budget.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';

const OUT = 'data/skateparks-on.json';
const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
const BUDGET_MS = 10 * 60 * 1000;       // overall budget, well under the job timeout
const REQUEST_MS = 75 * 1000;           // per-request timeout
const ATTEMPTS = 4;                     // per tile, rotating mirrors
const started = Date.now();

// [s, w, n, e]: populated southern Ontario in finer tiles, the north in coarse ones.
const TILES = [];
for (let s = 41.6; s < 46.0; s += 1.1) {
  for (let w = -83.6; w < -74.3; w += 1.9) {
    TILES.push([s, w, Math.min(s + 1.1, 46.0), Math.min(w + 1.9, -74.3)]);
  }
}
TILES.push([46.0, -84.8, 49.0, -74.3], [46.0, -90.0, 49.0, -84.8], [46.0, -95.2, 49.0, -90.0],
  [49.0, -95.2, 56.9, -85.0], [49.0, -85.0, 56.9, -74.3]);

const r5 = (x) => Math.round(x * 1e5) / 1e5;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const left = () => BUDGET_MS - (Date.now() - started);

async function tile([s, w, n, e], k) {
  // Most Ontario parks are mapped as leisure=pitch + sport=skateboard, so include both forms.
  const bb = `(${r5(s)},${r5(w)},${r5(n)},${r5(e)})`;
  const q = `[out:json][timeout:60];(nwr["leisure"="skatepark"]${bb};nwr["sport"~"(^|;)skateboard(;|$)"]${bb};node["place"~"^(city|town|village)$"]${bb};);out center tags qt;`;
  for (let i = 0; i < ATTEMPTS; i++) {
    if (left() < 5000) throw new Error('Time budget exhausted');
    const url = MIRRORS[(k + i) % MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({ data: q }),
        headers: { 'User-Agent': 'best.skatepark.day data build' },
        signal: AbortSignal.timeout(Math.min(REQUEST_MS, left()))
      });
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d.elements) && !(d.remark || '').match(/error|timed out/i)) return d.elements;
        console.error(url, 'remark:', d.remark);
      } else console.error(url, res.status);
    } catch (err) { console.error(url, err.message); }
    await sleep(2000 * (i + 1));
  }
  throw new Error(`Tile ${s},${w} failed on ${ATTEMPTS} attempts`);
}

// Fallback: `node build-skateparks.mjs parks.geojsonseq` reads an osmium export of a Geofabrik OSM extract.
function fromGeojson(file) {
  return readFileSync(file, 'utf8').split('\n').map((l) => l.replace(/^\x1e/, '').trim()).filter(Boolean).map((l) => {
    const f = JSON.parse(l);
    const pts = [];
    const walk = (c) => (typeof c[0] === 'number' ? pts.push(c) : c.forEach(walk));
    if (f.geometry) walk(f.geometry.coordinates);
    if (!pts.length) return null;
    const lons = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
    return { center: { lat: (Math.min(...lats) + Math.max(...lats)) / 2, lon: (Math.min(...lons) + Math.max(...lons)) / 2 }, tags: f.properties || {} };
  }).filter(Boolean);
}

const elements = [];
if (process.argv[2]) elements.push(...fromGeojson(process.argv[2]));
else for (let k = 0; k < TILES.length; k++) {
  const els = await tile(TILES[k], k);
  console.log(`tile ${k + 1}/${TILES.length}: ${els.length}`);
  elements.push(...els);
  await sleep(1000);
}

// Place nodes (city/town/village) give each park a city when it has no addr:city tag.
const isPlace = (e) => /^(city|town|village)$/.test(e.tags?.place || '') && !e.tags?.leisure && !e.tags?.sport;
const places = elements.filter(isPlace).map((e) => ({ name: e.tags.name, lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon, rank: { city: 0, town: 1, village: 2 }[e.tags.place] }))
  .filter((p) => p.name && p.lat != null);
const km = (a, b) => {
  const R = 6371, rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
// Nearest place, with towns/cities counted as a little closer than villages; nothing beyond 20 km.
function nearestCity(pt) {
  let best = null, bestD = Infinity;
  for (const p of places) {
    const d = km(pt, p) - (p.rank === 0 ? 3 : p.rank === 1 ? 1 : 0);
    if (d < bestD && km(pt, p) <= 20) { best = p; bestD = d; }
  }
  return best ? best.name : '';
}
const isInCity = (v) => (v || '').split(/[;,]/)[0].trim();

const seen = new Set();
const parks = elements.filter((e) => !isPlace(e)).map((e) => {
  const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
  if (lat == null || lon == null) return null;
  const t = e.tags || {};
  let n = t.name || t['name:en'] || t.official_name;
  if (!n) n = t['addr:street'] ? `Skatepark on ${t['addr:street']}` : (t['addr:city'] ? `${t['addr:city']} skatepark` : 'Skatepark');
  const c = t['addr:city'] || isInCity(t['is_in:city'] || t.is_in) || nearestCity({ lat, lon });
  return { n: n.trim(), lat: r5(lat), lon: r5(lon), ...(c ? { c } : {}) };
}).filter(Boolean).filter((p) => {
  const k = `${p.n}|${p.lat.toFixed(3)}|${p.lon.toFixed(3)}`;
  if (seen.has(k)) return false;
  seen.add(k); return true;
}).sort((a, b) => a.lat - b.lat || a.lon - b.lon);

let prev = 0;
if (existsSync(OUT)) { try { prev = JSON.parse(readFileSync(OUT, 'utf8')).length; } catch {} }
if (parks.length < 50 || parks.length < prev / 2) {
  console.error(`Only ${parks.length} parks (existing file has ${prev}); refusing to overwrite`);
  process.exit(1);
}
mkdirSync('data', { recursive: true });
writeFileSync(OUT, '[\n' + parks.map((p) => JSON.stringify(p)).join(',\n') + '\n]\n');
console.log(`Wrote ${parks.length} skate parks in ${Math.round((Date.now() - started) / 1000)}s`);
