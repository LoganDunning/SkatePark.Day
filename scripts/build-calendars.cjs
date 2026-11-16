#!/usr/bin/env node
// Builds static iCalendar feeds, one per skate park in data/skateparks-on.json, at cal/<slug>.ics.
// Runs in the deploy workflow (every 6 hours and on push to main). Reuses the site's own scoring
// code from app.js, so a feed always agrees with what the page shows. Past weeks' events are carried
// over from the feeds that are live on the site, so history survives without committing anything.
process.env.TZ = process.env.TZ || 'America/Toronto';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, process.env.CAL_OUT || 'cal');
const SITE = (process.env.SITE_URL || 'https://best.skatepark.day/').replace(/\/?$/, '/');
const TZID = 'America/Toronto';
const BATCH = 50;
const KEEP_WEEKS = 104;
// Weather fetched by one build step is reused by the next (the landing pages), so Open-Meteo is asked once.
const CACHE = process.env.FORECAST_CACHE || path.join(os.tmpdir(), 'skatepark-forecasts.json');
const CACHE_MS = 90 * 60 * 1000;

// The site's scoring, loaded the same way the tests load it.
const context = vm.createContext({ document: { addEventListener() {} }, console: { log() {} }, URLSearchParams });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8') + '\nthis.SkateParkDay = SkateParkDay;', context);
const newApp = () => Object.create(context.SkateParkDay.prototype);

const slugify = s => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const GENERIC = /^(skate ?park|skateboard park|skate park|skatepark on .*)$/i;

function parkList() {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/skateparks-on.json'), 'utf8'));
    const parks = raw.map(p => {
        const name = p.n || 'Skatepark', city = p.c || '';
        const hasCity = city && name.toLowerCase().includes(city.toLowerCase());
        const label = hasCity || !city ? name : GENERIC.test(name) ? `${city} ${name}` : `${name}, ${city}`;
        return { name, city, lat: p.lat, lon: p.lon, label, base: slugify(hasCity || !city ? name : `${city} ${name}`) || 'skatepark' };
    });
    // Stable slugs: named parks claim the plain slug first, then north to south, west to east.
    const order = [...parks].sort((a, b) => (GENERIC.test(a.name) - GENERIC.test(b.name)) || b.lat - a.lat || a.lon - b.lon);
    const used = new Map();
    for (const p of order) {
        const n = (used.get(p.base) || 0) + 1;
        used.set(p.base, n);
        p.slug = n === 1 ? p.base : `${p.base}-${n}`;
        if (n > 1) p.label += ` #${n}`;
    }
    return parks;
}

// Open-Meteo sometimes hangs on new connections from one of its servers, so retry patiently.
async function getJson(url, tries = 6) {
    let last;
    for (let i = 0; i < tries; i++) {
        try {
            const r = await fetch(url, { headers: { 'user-agent': 'best.skatepark.day calendar build' }, signal: AbortSignal.timeout(20000) });
            if (r.ok) return await r.json();
            last = new Error(`HTTP ${r.status}`);
            if (r.status < 500 && r.status !== 429) throw last;
        } catch (e) {
            last = e.cause && e.cause.code ? new Error(`${e.message}: ${e.cause.code}`) : e;
            if (/^HTTP 4/.test(e.message) && !/429/.test(e.message)) throw e;
        }
        if (i < tries - 1) await new Promise(res => setTimeout(res, Math.min(20000, 2000 * 2 ** i)));
    }
    throw last;
}

// One Open-Meteo request per batch of ~11 km cells, same fields the page asks for.
async function forecasts(cells) {
    try {
        const c = JSON.parse(fs.readFileSync(CACHE, 'utf8'));
        if (Date.now() - c.at < CACHE_MS && cells.every(cell => c.data[cell.key])) return new Map(Object.entries(c.data));
    } catch (e) {}
    const out = new Map();
    for (let i = 0; i < cells.length; i += BATCH) {
        const batch = cells.slice(i, i + BATCH);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${batch.map(c => c.lat).join(',')}&longitude=${batch.map(c => c.lon).join(',')}`
            + '&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,precipitation_sum,weather_code,uv_index_max,sunshine_duration'
            + `&hourly=wind_speed_10m,temperature_2m,uv_index,precipitation,weather_code&timezone=${encodeURIComponent(TZID)}&forecast_days=7`;
        const data = await getJson(url);
        (Array.isArray(data) ? data : [data]).forEach((d, j) => out.set(batch[j].key, d));
    }
    try { fs.writeFileSync(CACHE, JSON.stringify({ at: Date.now(), data: Object.fromEntries(out) })); } catch (e) {}
    return out;
}

// ISO week, e.g. 2026-W47, for a local calendar date.
function isoWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const year = d.getUTCFullYear();
    const week = Math.ceil(((d - Date.UTC(year, 0, 1)) / 864e5 + 1) / 7);
    return `${year}-W${String(week).padStart(2, '0')}`;
}

// "Nov 16–22" or "Nov 30–Dec 6" for the Monday-to-Sunday week holding a date.
function weekRange(date) {
    const mon = new Date(date); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
    const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
    const md = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return mon.getMonth() === sun.getMonth() ? `${md(mon)}–${sun.getDate()}` : `${md(mon)}–${md(sun)}`;
}

const WEATHER = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow',
    75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' };

// The best skateable two-hour window of each ISO week in the forecast, picked like the page picks its best day.
function weekEvents(park, weather) {
    const app = newApp();
    app.weatherData = weather;
    app.location = { lat: park.lat, lon: park.lon, city: park.city, region: 'Ontario' };
    app.calculateBestDay();
    const weeks = new Map();
    app.days.forEach((day, index) => {
        const win = app.bestWindow(index);
        if (!win || win.none) return;
        const key = isoWeek(day.date);
        if (!weeks.has(key)) weeks.set(key, []);
        weeks.get(key).push({ day, index, win });
    });
    const events = [];
    for (const [week, list] of weeks) {
        const dry = list.filter(c => c.day.precipitation <= 1.0);
        const pick = (dry.length ? dry : list).reduce((b, c) => app.betterDay(c.day, b.day) === c.day ? c : b);
        const { day, index, win } = pick;
        const iso = weather.daily.time[index];
        const factors = app.getDayFactors(day).filter(f => f.reason).map(f => f.reason);
        const short = day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(',', '');
        const link = app.shareLink(index, { block: win, park: { name: park.name, city: park.city, lat: park.lat, lon: park.lon } });
        events.push({
            week, iso, startHour: win.startHour, endHour: win.endHour,
            summary: `Skate day: ${short}, ${win.label} · ${win.score}/100 at ${park.label}`,
            description: [
                `Best time to skate at ${park.label} the week of ${weekRange(day.date)}: ${win.label}, scoring ${win.score}/100 (day score ${Math.round(day.score)}/100).`,
                `Conditions: ${WEATHER[day.weatherCode] || 'Mixed'}, high ${Math.round(day.tempMax)}°C, low ${Math.round(day.tempMin)}°C, wind up to ${Math.round(day.maxHourlyWind)} km/h, gusts ${Math.round(day.windGusts)} km/h, rain ${day.precipitation} mm, UV ${Math.round(day.uvIndex * 10) / 10}.`,
                factors.length ? `Why: ${factors.join(', ')}.` : '',
                `Forecast updates every 6 hours. Full week: ${link}`
            ].filter(Boolean).join('\n'),
            url: link
        });
    }
    return events;
}

// iCalendar text helpers (RFC 5545).
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
function fold(line) {
    const bytes = Buffer.from(line, 'utf8');
    if (bytes.length <= 75) return line;
    const parts = []; let start = 0, limit = 75;
    while (start < bytes.length) {
        let end = Math.min(start + limit, bytes.length);
        while (end < bytes.length && (bytes[end] & 0xC0) === 0x80) end--; // never split a UTF-8 character
        parts.push(bytes.slice(start, end).toString('utf8'));
        start = end; limit = 74;
    }
    return parts.join('\r\n ');
}
const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const local = (iso, hour) => `${iso.replace(/-/g, '')}T${String(hour).padStart(2, '0')}0000`;

const VTIMEZONE = ['BEGIN:VTIMEZONE', `TZID:${TZID}`, 'X-LIC-LOCATION:America/Toronto',
    'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
    'END:VTIMEZONE'];

function vevent(park, e, now) {
    return ['BEGIN:VEVENT', `UID:week-${e.week}-${park.slug}@best.skatepark.day`, `DTSTAMP:${stamp(now)}`,
        `DTSTART;TZID=${TZID}:${local(e.iso, e.startHour)}`, `DTEND;TZID=${TZID}:${local(e.iso, e.endHour)}`,
        `SUMMARY:${esc(e.summary)}`, `DESCRIPTION:${esc(e.description)}`, `LOCATION:${esc(`${park.label}, Ontario`)}`,
        `GEO:${(+park.lat).toFixed(5)};${(+park.lon).toFixed(5)}`, `URL:${e.url}`, 'TRANSP:TRANSPARENT', 'STATUS:CONFIRMED', 'END:VEVENT'].join('\r\n');
}

// Existing events from the live feed: UID -> { raw, start (local wall time as a sortable string) }.
function parseEvents(text) {
    const out = new Map();
    const unfolded = text.replace(/\r?\n[ \t]/g, '');
    for (const m of unfolded.matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g)) {
        const body = m[1];
        const uid = (body.match(/^UID:(.+)$/m) || [])[1];
        const start = (body.match(/^DTSTART[^:]*:(\d{8}T\d{6})/m) || [])[1];
        if (!uid || !start) continue;
        const raw = `BEGIN:VEVENT\r\n${body.replace(/\r?\n/g, '\r\n')}END:VEVENT`.split('\r\n').map(fold).join('\r\n');
        out.set(uid.trim(), { raw, start, week: (uid.match(/week-(\d{4}-W\d{2})-/) || [])[1] });
    }
    return out;
}

async function previousFeed(slug) {
    if (process.env.CAL_NO_HISTORY) return new Map();
    try {
        const r = await fetch(`${SITE}cal/${slug}.ics`, { headers: { 'user-agent': 'best.skatepark.day calendar build' } });
        return r.ok ? parseEvents(await r.text()) : new Map();
    } catch (e) { return new Map(); }
}

function calendar(park, events) {
    return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//best.skatepark.day//Skate day calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        fold(`X-WR-CALNAME:${esc(`Skate days · ${park.label}`)}`),
        fold(`X-WR-CALDESC:${esc(`The best time to skate each week at ${park.label}, from best.skatepark.day.`)}`),
        `X-WR-TIMEZONE:${TZID}`, 'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H',
        ...VTIMEZONE, ...events, 'END:VCALENDAR', ''
    ].join('\r\n');
}

async function pool(items, size, fn) {
    let i = 0;
    await Promise.all(Array.from({ length: size }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } }));
}

async function main() {
    const now = new Date();
    const nowLocal = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}00`;
    const parks = parkList();
    const cells = new Map();
    for (const p of parks) {
        p.cell = cellOf(p);
        if (!cells.has(p.cell)) { const [lat, lon] = p.cell.split(',').map(Number); cells.set(p.cell, { key: p.cell, lat, lon }); }
    }
    let weather = new Map();
    try { weather = await forecasts([...cells.values()]); }
    catch (e) { console.warn(`Weather unavailable (${e.message}); keeping the live feeds' events only.`); }

    fs.mkdirSync(OUT, { recursive: true });
    const stats = { parks: parks.length, cells: cells.size, events: 0, kept: 0, failed: 0 };
    await pool(parks, 8, async park => {
        const previous = await previousFeed(park.slug);
        const fresh = weather.has(park.cell) ? weekEvents(park, weather.get(park.cell)) : [];
        const byWeek = new Map();
        // Events that already started stay as they were; the week they belong to is settled.
        for (const [uid, ev] of previous) if (ev.start <= nowLocal && ev.week) byWeek.set(ev.week, ev.raw);
        // Upcoming weeks with no fresh pick (e.g. no weather this run) also keep their last version.
        if (!weather.has(park.cell)) for (const ev of previous.values()) if (ev.week && !byWeek.has(ev.week)) byWeek.set(ev.week, ev.raw);
        for (const e of fresh) if (!byWeek.has(e.week)) { byWeek.set(e.week, vevent(park, e, now).split('\r\n').map(fold).join('\r\n')); stats.events++; }
        stats.kept += [...byWeek.values()].length;
        const ordered = [...byWeek.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1).slice(-KEEP_WEEKS).map(([, raw]) => raw);
        fs.writeFileSync(path.join(OUT, `${park.slug}.ics`), calendar(park, ordered));
    });
    const index = parks.map(p => ({ slug: p.slug, name: p.label, lat: +(+p.lat).toFixed(5), lon: +(+p.lon).toFixed(5) })).sort((a, b) => a.slug < b.slug ? -1 : 1);
    fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ updated: now.toISOString(), feeds: index }));
    console.log(`Calendar feeds: ${stats.parks} parks, ${stats.cells} weather cells, ${stats.events} upcoming events, ${stats.kept} events written to ${path.relative(ROOT, OUT)}/`);
}

const cellOf = p => `${(Math.round(p.lat * 10) / 10).toFixed(1)},${(Math.round(p.lon * 10) / 10).toFixed(1)}`;

module.exports = { ROOT, SITE, TZID, newApp, slugify, parkList, forecasts, cellOf, isoWeek, weekRange, WEATHER };

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
