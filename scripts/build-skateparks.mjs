// Builds data/skateparks-on.json from OpenStreetMap (Overpass). Node 18+, no dependencies.
import { writeFileSync, mkdirSync } from 'node:fs';

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
const QUERY = '[out:json][timeout:180];area["ISO3166-2"="CA-ON"]->.on;nwr["leisure"="skatepark"](area.on);out center tags;';
const r5 = (x) => Math.round(x * 1e5) / 1e5;

async function fetchData() {
  for (const url of MIRRORS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({ data: QUERY }),
        headers: { 'User-Agent': 'best.skatepark.day data build' },
        signal: AbortSignal.timeout(240000)
      });
      if (!res.ok) { console.error(url, res.status); continue; }
      const d = await res.json();
      if (Array.isArray(d.elements) && d.elements.length > 50) return d.elements;
      console.error(url, 'too few elements');
    } catch (e) { console.error(url, e.message); }
  }
  throw new Error('All Overpass mirrors failed');
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
