#!/usr/bin/env node
// Static landing pages: /skateparks/ (every Ontario city with a skate park) and
// /skateparks/<city>/ (that city's parks, this week's skate forecast baked in,
// calendar feeds and nearby cities), plus sitemap.xml.
// Runs in the deploy job after build-calendars.cjs and reuses its forecast cache.
// The pages are never committed. With no weather, pages still build without the forecast.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, SITE, newApp, slugify, parkList, forecasts, cellOf } = require('./build-calendars.cjs');

const OUT = path.join(ROOT, 'skateparks');
const BRAND = 'best.skatepark.day';
const VERSION = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/app\.css\?v=(\d+)/) || [])[1] || '1';

// The site's own weather icons.
const ctx = vm.createContext({ document: { addEventListener() {} }, console: { log() {} }, URLSearchParams });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'), ctx);
const ICONS = vm.runInContext('ICONS', ctx);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const km = (a, b) => {
    const R = 6371, r = x => x * Math.PI / 180;
    const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
};
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const liveUrl = (label, lat, lon) => `/?loc=${encodeURIComponent(label)}&lat=${(+lat).toFixed(2)}&lon=${(+lon).toFixed(2)}`;
const mapUrl = p => `https://www.openstreetmap.org/?mlat=${(+p.lat).toFixed(5)}&mlon=${(+p.lon).toFixed(5)}#map=17/${(+p.lat).toFixed(5)}/${(+p.lon).toFixed(5)}`;
const fmtHour = h => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
const list = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;

// ---------- data ----------
function cities() {
    const parks = parkList();
    const byCity = new Map();
    for (const p of parks) {
        p.cell = cellOf(p);
        if (!byCity.has(p.city)) byCity.set(p.city, []);
        byCity.get(p.city).push(p);
    }
    const out = [...byCity].map(([name, ps]) => {
        const lat = ps.reduce((s, p) => s + p.lat, 0) / ps.length, lon = ps.reduce((s, p) => s + p.lon, 0) / ps.length;
        ps.sort((a, b) => a.label.localeCompare(b.label));
        const anchor = ps.reduce((b, p) => km(p, { lat, lon }) < km(b, { lat, lon }) ? p : b);
        return { name, slug: slugify(name), parks: ps, lat, lon, cell: anchor.cell };
    }).sort((a, b) => a.name.localeCompare(b.name));
    for (const c of out) {
        c.nearby = out.filter(o => o !== c).map(o => ({ c: o, d: km(c, o) })).sort((a, b) => a.d - b.d).slice(0, 6);
    }
    return { parks, cities: out };
}

// The week as the home page scores it, for one city.
function week(city, weather) {
    if (!weather) return null;
    const app = newApp();
    app.weatherData = weather;
    app.location = { lat: city.lat, lon: city.lon, city: city.name, region: 'Ontario' };
    app.calculateBestDay();
    if (!app.days || !app.days.length) return null;
    const bestIndex = app.days.indexOf(app.bestDay);
    const days = app.days.map((day, i) => {
        const win = app.bestWindow(i);
        return {
            i, day, best: i === bestIndex,
            name: i === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' }),
            long: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.date.toLocaleDateString('en-US', { weekday: 'long' }),
            date: day.date.getDate(),
            score: Math.round(day.score),
            cond: app.conditionText(day.weatherCode),
            icon: app.getWeatherIcon(day.weatherCode),
            when: win && !win.none ? `${fmtHour(win.startHour)} to ${fmtHour(win.endHour)}` : win ? win.reason : 'No time left today',
            factors: app.getDayFactors(day).filter(f => f.reason).map(f => f.reason)
        };
    });
    return { days, best: days[bestIndex] };
}

// ---------- page shell ----------
const ICON_PIN = '<svg class="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const ICON_ARROW = '<svg class="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

function shell({ title, description, canonical, crumbs, body, jsonld }) {
    const url = SITE.replace(/\/$/, '') + canonical;
    return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}img/share/default.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="best.skatepark.day 7-day skate forecast">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@skateparkday">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}img/share/default.jpg">
<meta name="theme-color" content="#0B0B0E">
<meta name="color-scheme" content="dark">
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="SkatePark.Day">
<link rel="manifest" href="/manifest.json">
<link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/pages.css?v=${VERSION}">
${jsonld.map(ld).join('\n')}
</head>
<body class="pg">
<header class="pg-header">
<a class="wordmark" href="/"><strong>best</strong>.skatepark.day</a>
<a class="pg-live" href="/">Live forecast ${ICON_ARROW}</a>
</header>
<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join('')}</ol></nav>
<main>
${body}
</main>
<footer class="pg-foot">
<nav aria-label="More"><a href="/">7-day skate forecast</a><a href="/skateparks/">Ontario skate parks by city</a><a href="/#faq-heading">FAQ</a><a href="https://github.com/LoganDunning/SkatePark.Day" rel="noopener">Source on GitHub</a></nav>
<p>© 2025–2026 Social Dunn Right Inc. Forecast data from Open-Meteo, park locations from OpenStreetMap contributors.</p>
</footer>
</body>
</html>
`;
}

const crumbLd = crumbs => ({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE.replace(/\/$/, '') + c.href })) });

// ---------- city page ----------
function cityPage(city, w, updated) {
    const href = `/skateparks/${city.slug}/`;
    const where = `${city.name}, Ontario`;
    const n = city.parks.length;
    const crumbs = [{ name: 'Home', href: '/' }, { name: 'Skate parks', href: '/skateparks/' }, { name: city.name, href }];
    const title = `${city.name} Skatepark Weather: Best Day to Skate This Week`;
    const description = `When to skate in ${where} this week. A 7-day skate park forecast for ${n === 1 ? city.parks[0].label : `${n} skate parks`}, every day and two-hour window scored by wind, rain, temperature and UV.`;
    const live = liveUrl(where, city.lat, city.lon);

    let forecast;
    if (w) {
        const b = w.best;
        forecast = `
<section class="hl" aria-labelledby="hl-label">
<h2 class="hl-label" id="hl-label">Best time to skate in ${esc(city.name)} this week</h2>
<div class="hl-row">
<p class="hl-when"><span class="hl-day">${esc(b.long)}</span><span class="hl-time">${esc(b.when)}</span></p>
<p class="hl-num"><b>${b.score}</b><small>/100</small></p>
</div>
<p class="hl-wx"><span class="hl-icon">${b.icon}</span><span class="hl-temp">${Math.round(b.day.tempMax)}°C</span><span>${esc(b.cond)}</span><span aria-hidden="true">·</span><span>Wind ${Math.round(b.day.maxHourlyWind)} km/h</span>${b.day.precipitation > 0 ? `<span aria-hidden="true">·</span><span>Rain ${b.day.precipitation} mm</span>` : ''}</p>
${b.factors.length ? `<p class="hl-why">Why: ${esc(b.factors.join(', '))}.</p>` : ''}
</section>
<section class="week" aria-labelledby="week-h">
<div class="week-head"><h2 id="week-h">This week in ${esc(city.name)}</h2><span>Score out of 100</span></div>
<table class="week-table">
<caption class="vh">Daily skate scores for ${esc(where)}, updated ${esc(updated)}</caption>
<thead class="vh"><tr><th scope="col">Day</th><th scope="col">Weather</th><th scope="col">Best time</th><th scope="col">Score</th></tr></thead>
<tbody>
${w.days.map(d => `<tr class="${d.best ? 'best' : ''}${d.score < 30 ? ' no-skate' : ''}"><th scope="row"><span class="row-name">${esc(d.name)}</span> <span class="row-date">${d.date}</span></th><td class="row-wx">${d.icon}<span>${Math.round(d.day.tempMax)}°</span><span class="vh"> ${esc(d.cond)}</span></td><td class="row-when">${esc(d.when)}</td><td class="row-score"><span class="row-bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, d.score))}%"></span></span><b>${d.score}</b></td></tr>`).join('\n')}
</tbody>
</table>
<p class="stamp">Updated ${esc(updated)} Eastern. The forecast refreshes every 6 hours. <a href="${live}">Open the live forecast for ${esc(city.name)}</a> for hour-by-hour scores.</p>
</section>`;
    } else {
        forecast = `
<section class="hl"><p class="lede">This week's skate forecast for ${esc(where)} is on the live page. <a href="${live}">Open the live forecast for ${esc(city.name)}</a>.</p></section>`;
    }

    const parksHtml = city.parks.map(p => `<li class="park" id="${p.slug}">
<div class="park-main"><h3>${esc(p.label)}</h3><p class="park-meta">${(+p.lat).toFixed(4)}, ${(+p.lon).toFixed(4)}</p></div>
<p class="park-links"><a href="${liveUrl(where, p.lat, p.lon)}">Forecast</a><a href="${mapUrl(p)}" rel="noopener">Map</a><a href="webcal://${SITE.replace(/^https?:\/\//, '')}cal/${p.slug}.ics" rel="nofollow">Add to calendar</a><a href="/cal/${p.slug}.ics" rel="nofollow" download>.ics</a></p>
</li>`).join('\n');

    const nearby = city.nearby.map(({ c, d }) => `<li><a href="/skateparks/${c.slug}/">${esc(c.name)}</a><span>${Math.round(d)} km · ${c.parks.length} park${c.parks.length === 1 ? '' : 's'}</span></li>`).join('');
    const nearNames = city.nearby.slice(0, 3).map(x => x.c.name);

    const body = `
<h1>${esc(city.name)} skate park weather</h1>
<p class="lede">${n === 1 ? `${esc(city.parks[0].label)} is the skate park we track in ${esc(city.name)}.` : `${n} skate parks in ${esc(city.name)}, scored together for the best day and time to skate.`} Every day gets a skate score out of 100 from wind, rain, temperature and UV, and the best two-hour window is picked for you.</p>
${forecast}
<section class="parks" aria-labelledby="parks-h">
<h2 id="parks-h">Skate parks in ${esc(city.name)}</h2>
<ul class="park-list">
${parksHtml}
</ul>
<p class="note">Each park has its own calendar feed: subscribe once and your calendar shows the best skate time of every week, updated every 6 hours.</p>
</section>
<section class="nearby" aria-labelledby="near-h">
<h2 id="near-h">Skate parks near ${esc(city.name)}</h2>
<ul class="near-list">${nearby}</ul>
<p class="note">Wind and rain can differ a lot over short distances. If ${esc(city.name)} looks wet or windy, check ${esc(list(nearNames))}.</p>
</section>`;

    const jsonld = [{
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage', '@id': `${SITE.replace(/\/$/, '')}${href}#webpage`, url: SITE.replace(/\/$/, '') + href,
                name: title, description, inLanguage: 'en-CA', dateModified: new Date().toISOString(),
                isPartOf: { '@id': `${SITE}#website` }, about: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'State', name: 'Ontario' } },
                breadcrumb: { '@id': `${SITE.replace(/\/$/, '')}${href}#breadcrumb` },
                mainEntity: { '@id': `${SITE.replace(/\/$/, '')}${href}#parks` }
            },
            { ...crumbLd(crumbs), '@id': `${SITE.replace(/\/$/, '')}${href}#breadcrumb` },
            {
                '@type': 'ItemList', '@id': `${SITE.replace(/\/$/, '')}${href}#parks`, name: `Skate parks in ${where}`, numberOfItems: n,
                itemListElement: city.parks.map((p, i) => ({
                    '@type': 'ListItem', position: i + 1,
                    item: {
                        '@type': 'SportsActivityLocation', '@id': `${SITE.replace(/\/$/, '')}${href}#${p.slug}`, name: p.label, url: `${SITE.replace(/\/$/, '')}${href}#${p.slug}`,
                        address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: 'ON', addressCountry: 'CA' },
                        geo: { '@type': 'GeoCoordinates', latitude: +(+p.lat).toFixed(5), longitude: +(+p.lon).toFixed(5) },
                        hasMap: mapUrl(p), publicAccess: true, isAccessibleForFree: true
                    }
                }))
            }
        ]
    }];
    return shell({ title, description, canonical: href, crumbs, body, jsonld });
}

// ---------- hub ----------
function hubPage(all, weeks, updated) {
    const href = '/skateparks/';
    const crumbs = [{ name: 'Home', href: '/' }, { name: 'Skate parks', href }];
    const parkCount = all.reduce((s, c) => s + c.parks.length, 0);
    const title = 'Ontario Skate Parks by City: Skatepark Weather & Best Day to Skate';
    const description = `Skate park weather for ${all.length} Ontario cities and towns and ${parkCount} skate parks. See the best day and time to skate this week, with calendar feeds for every park.`;
    const groups = new Map();
    for (const c of all) { const k = c.name[0].toUpperCase(); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); }
    const letters = [...groups.keys()];
    const body = `
<h1>Ontario skate parks by city</h1>
<p class="lede">${parkCount} skate parks in ${all.length} Ontario cities and towns. Pick a city for this week's skate forecast, the best two-hour window to skate, and a calendar feed for each park.</p>
<nav class="letters" aria-label="Jump to letter">${letters.map(l => `<a href="#l-${l}">${l}</a>`).join('')}</nav>
${letters.map(l => `<section class="letter" aria-labelledby="l-${l}"><h2 id="l-${l}">${l}</h2><ul class="city-list">${groups.get(l).map(c => {
        const w = weeks.get(c.slug);
        const best = w ? `<span class="city-best"><span>${esc(w.best.name)}</span><b>${w.best.score}</b></span>` : '';
        return `<li><a href="/skateparks/${c.slug}/"><span class="city-name">${esc(c.name)}</span><span class="city-n">${c.parks.length} park${c.parks.length === 1 ? '' : 's'}</span>${best}</a></li>`;
    }).join('')}</ul></section>`).join('\n')}
<p class="stamp">Best day and score per city, updated ${esc(updated)} Eastern.</p>`;
    const jsonld = [{
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'CollectionPage', '@id': `${SITE}skateparks/#webpage`, url: `${SITE}skateparks/`, name: title, description, inLanguage: 'en-CA', isPartOf: { '@id': `${SITE}#website` }, breadcrumb: { '@id': `${SITE}skateparks/#breadcrumb` }, mainEntity: { '@id': `${SITE}skateparks/#cities` } },
            { ...crumbLd(crumbs), '@id': `${SITE}skateparks/#breadcrumb` },
            { '@type': 'ItemList', '@id': `${SITE}skateparks/#cities`, name: 'Ontario cities with skate parks', numberOfItems: all.length, itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name} skate park weather`, url: `${SITE}skateparks/${c.slug}/` })) }
        ]
    }];
    return shell({ title, description, canonical: href, crumbs, body, jsonld });
}

// ---------- sitemap ----------
function sitemap(all, day) {
    const urls = [{ loc: SITE, freq: 'daily', pri: '1.0' }, { loc: `${SITE}skateparks/`, freq: 'daily', pri: '0.8' }]
        .concat(all.map(c => ({ loc: `${SITE}skateparks/${c.slug}/`, freq: 'daily', pri: '0.6' })));
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${day}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`;
}

async function main() {
    const { cities: all } = cities();
    const cells = new Map();
    for (const c of all) for (const p of c.parks) if (!cells.has(p.cell)) { const [lat, lon] = p.cell.split(',').map(Number); cells.set(p.cell, { key: p.cell, lat, lon }); }
    let weather = new Map();
    try { weather = await forecasts([...cells.values()]); }
    catch (e) { console.warn(`Weather unavailable (${e.message}); building pages without the forecast.`); }

    const now = new Date();
    const updated = now.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto' });
    const day = now.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });

    fs.rmSync(OUT, { recursive: true, force: true });
    const weeks = new Map();
    let withForecast = 0;
    for (const c of all) {
        let w = null;
        try { w = week(c, weather.get(c.cell)); } catch (e) { w = null; }
        if (w) { weeks.set(c.slug, w); withForecast++; }
        fs.mkdirSync(path.join(OUT, c.slug), { recursive: true });
        fs.writeFileSync(path.join(OUT, c.slug, 'index.html'), cityPage(c, w, updated));
    }
    fs.writeFileSync(path.join(OUT, 'index.html'), hubPage(all, weeks, updated));
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap(all, day));
    console.log(`Pages: hub plus ${all.length} cities (${withForecast} with a forecast), sitemap with ${all.length + 2} URLs.`);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { cities, week };
