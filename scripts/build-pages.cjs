#!/usr/bin/env node
// Static landing pages: /skateparks/ (every Ontario city with a skate park),
// /skateparks/<city>/ (that city's parks, this week's skate forecast baked in,
// calendar feeds and nearby cities), and /skateparks/<city>/<park>/ (a page
// for every park, with a review video when one is in data/park-videos.json),
// plus sitemap.xml.
// Runs in the deploy job after build-calendars.cjs and reuses its forecast cache.
// The pages are never committed. With no weather, pages still build without the forecast.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, SITE, newApp, slugify, parkList, forecasts, cellOf } = require('./build-calendars.cjs');
const chrome = require('./site-chrome.cjs');

const OUT = path.join(ROOT, 'skateparks');
const BRAND = 'best.skatepark.day';
const VERSION = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/app\.css\?v=(\d+)/) || [])[1] || '1';
const PAGE_CSS = '2026112015';
const ICON_V = '3';

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
const CHANNEL_URL = 'https://www.youtube.com/@LoganDunningSkateboarding';
const VIDEO_FILE = path.join(ROOT, 'data/park-videos.json');
const MATCH_KM = 0.25;
const ytWatch = id => `https://www.youtube.com/watch?v=${id}`;
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const ytEmbed = id => `https://www.youtube-nocookie.com/embed/${id}`;
const parkPath = (city, park) => `${city.slug}/${park.pageSlug || park.slug}`;
const parkHref = (city, park) => `/skateparks/${parkPath(city, park)}/`;
const parkName = park => park.displayName || park.label;
const dirUrl = p => `https://www.google.com/maps/dir/?api=1&destination=${(+p.lat).toFixed(5)},${(+p.lon).toFixed(5)}`;
function isoDuration(sec) {
    if (!sec) return null;
    const s = Math.round(sec), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return 'PT' + (h ? `${h}H` : '') + (h || m ? `${m}M` : '') + `${r}S`;
}

function loadVideoEntries() {
    const raw = JSON.parse(fs.readFileSync(VIDEO_FILE, 'utf8'));
    if (Array.isArray(raw)) return raw.slice();
    return Object.entries(raw).map(([slug, v]) => ({ slug, ...v }));
}

// Attach a review video to a park by coordinates first (within 250 m), then by slug.
function attachVideos(parks, entries = loadVideoEntries()) {
    for (const p of parks) {
        p.video = null;
        p.displayName = p.label;
        p.pageSlug = p.slug;
    }
    const bySlug = new Map(parks.map(p => [p.slug, p]));
    const used = new Set();
    const unmatched = [];
    for (const e of entries) {
        let park = null;
        if (e.lat != null && e.lon != null) {
            const near = parks.map(p => ({ p, d: km(p, e) })).sort((a, b) => a.d - b.d)[0];
            if (near && near.d <= MATCH_KM) park = near.p;
        }
        if (!park && e.slug) park = bySlug.get(e.slug) || null;
        if (!park || used.has(park)) { unmatched.push(e); continue; }
        used.add(park);
        const name = (e.name || e.displayName || '').trim();
        park.video = {
            videoId: e.videoId,
            title: (e.title || name || 'Skate park review').trim(),
            name: name || null,
            duration: e.duration || null,
            googleReviewUrl: e.googleReviewUrl || null
        };
        if (name) park.displayName = name;
        if (e.pageSlug) park.pageSlug = slugify(e.pageSlug);
    }
    return unmatched;
}

function redirectPage(to, name) {
    const url = SITE.replace(/\/$/, '') + to;
    return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Redirecting to ${esc(name)}</title>
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0;url=${to}">
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=${ICON_V}">
</head>
<body>
<p>This skate park page has moved to <a href="${to}">${esc(name)}</a>.</p>
</body>
</html>
`;
}


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
    attachVideos(parks);
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

function shell({ title, description, canonical, crumbs, body, jsonld, image, scripts, cal }) {
    const url = SITE.replace(/\/$/, '') + canonical;
    const ogImage = image || `${SITE}img/share/default.jpg`;
    return `<!DOCTYPE html>
<html lang="en-CA" data-theme="dark">
<head>
<meta charset="UTF-8">
${chrome.themeBootScript()}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
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
<meta property="og:image" content="${esc(ogImage)}">
${image ? '' : `<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`}
<meta property="og:image:alt" content="${esc(image ? title : 'best.skatepark.day 7-day skate forecast')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@skateparkday">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="theme-color" content="#000000">
<meta name="color-scheme" content="dark light">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="icon" type="image/png" href="/favicon-96x96.png?v=${ICON_V}" sizes="96x96">
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=${ICON_V}">
<link rel="shortcut icon" href="/favicon.ico?v=${ICON_V}">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=${ICON_V}">
<meta name="apple-mobile-web-app-title" content="SkatePark.Day">
<link rel="manifest" href="/manifest.json?v=${ICON_V}">
<link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/pages.css?v=${PAGE_CSS}">
${jsonld.map(ld).join('\n')}
</head>
<body class="pg"${chrome.calAttrs(cal)}>
<header class="site-header">
<div class="site-header-inner">
<a class="brand wordmark" href="/" aria-label="best.skatepark.day home"><svg class="brand-mark" viewBox="0 0 42 32" width="34" height="26" aria-hidden="true"><g fill="none" stroke-linecap="butt"><path class="bd-b" stroke="currentColor" stroke-width="1.9" d="M4 3v26h8.5a6.75 6.75 0 0 0 0-13.5H4M4 3h7.5a6.25 6.25 0 0 1 0 12.5"/><path class="bd-d" stroke="currentColor" stroke-width="1.1" opacity=".62" d="M23 3v19M23 3h3a13 13 0 0 1 0 26h-1.5"/></g></svg><span><strong>best</strong>.skatepark.day</span></a>
${chrome.headerActionsHtml()}
</div>
</header>
${chrome.chromeHtml({ home: false })}
<div class="pg-wrap">
<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join('')}</ol></nav>
<main>
${body}
</main>
<footer class="pg-foot">
<nav aria-label="More"><a href="/">7-day skate forecast</a><a href="/skateparks/">Ontario skate parks by city</a><a href="/#faq-heading">FAQ</a><a href="https://github.com/LoganDunning/SkatePark.Day" rel="noopener">Source on GitHub</a></nav>
<p>© 2025–2026 Social Dunn Right Inc. Forecast data from Open-Meteo, park locations from OpenStreetMap contributors.</p>
</footer>
</div>
${scripts || ''}
<script src="/share-snapshot.js?v=${PAGE_CSS}" defer></script>
<script src="/site-chrome.js?v=${PAGE_CSS}" defer></script>
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
<div class="park-main"><h3><a href="${parkHref(city, p)}">${esc(parkName(p))}</a></h3><p class="park-meta">${(+p.lat).toFixed(4)}, ${(+p.lon).toFixed(4)}</p></div>
<p class="park-links"><a href="${parkHref(city, p)}">Park page</a><a href="${liveUrl(where, p.lat, p.lon)}">Forecast</a><a href="${mapUrl(p)}" rel="noopener">Map</a><a href="webcal://${SITE.replace(/^https?:\/\//, '')}cal/${p.slug}.ics" rel="nofollow">Add to calendar</a><a href="/cal/${p.slug}.ics" rel="nofollow" download>.ics</a>${p.video ? `<a href="${parkHref(city, p)}#review">Watch the review</a>` : ''}</p>
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
                        '@type': 'SportsActivityLocation', '@id': `${SITE.replace(/\/$/, '')}${parkHref(city, p)}#park`, name: parkName(p), url: SITE.replace(/\/$/, '') + parkHref(city, p),
                        address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: 'ON', addressCountry: 'CA' },
                        geo: { '@type': 'GeoCoordinates', latitude: +(+p.lat).toFixed(5), longitude: +(+p.lon).toFixed(5) },
                        hasMap: mapUrl(p), publicAccess: true, isAccessibleForFree: true
                    }
                }))
            }
        ]
    }];
    return shell({ title, description, canonical: href, crumbs, body, jsonld, cal: { lat: city.lat, lon: city.lon, label: where } });
}


const ICON_PLAY = '<svg class="ic" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="9,6 19,12 9,18"/></svg>';
const VIDEO_SCRIPT = `<script>
document.addEventListener("click", function (e) {
  var play = e.target.closest && e.target.closest(".video-play");
  if (!play) return;
  var box = play.closest(".review-video");
  var id = box && box.getAttribute("data-yt");
  if (!id) return;
  e.preventDefault();
  var f = document.createElement("iframe");
  f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
  f.title = play.getAttribute("data-title") || "Review video";
  f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  f.setAttribute("allowfullscreen", "");
  // YouTube Error 153 if the embed request has no Referer. The site sends
  // Referrer-Policy: no-referrer, so set a policy on this iframe only.
  f.referrerPolicy = "strict-origin-when-cross-origin";
  box.replaceChildren(f);
}, true);
</script>`;

function reviewSection(video) {
    const id = video.videoId, title = video.title, watch = ytWatch(id);
    const review = video.googleReviewUrl
        ? ` <span aria-hidden="true">·</span> <a href="${esc(video.googleReviewUrl)}" rel="noopener">Read Logan's Google review</a>`
        : '';
    return `
<section class="review" id="review" aria-labelledby="review-h">
<h2 id="review-h">Watch the review</h2>
<p class="lede">A walkthrough of this park from <a href="${CHANNEL_URL}" rel="noopener">Logan Dunning Skateboarding</a>.</p>
<div class="review-video" data-yt="${esc(id)}">
<a class="video-play" href="${watch}" rel="noopener" data-title="${esc(title)}">
<img src="${ytThumb(id)}" alt="${esc(title)}" width="480" height="360" loading="lazy" decoding="async">
<span class="video-btn">${ICON_PLAY}<span class="vh">Play review: ${esc(title)}</span></span>
</a>
</div>
<p class="note"><a href="${watch}" rel="noopener">Watch on YouTube</a>${review}</p>
</section>`;
}

function forecastBlock(name, where, live, w, updated, label) {
    if (!w) {
        return `
<section class="hl"><p class="lede">This week's skate forecast for ${esc(name)} is on the live page. <a href="${live}">Open the live forecast for ${esc(name)}</a>.</p></section>`;
    }
    const b = w.best;
    return `
<section class="hl" aria-labelledby="hl-label">
<h2 class="hl-label" id="hl-label">Best time to skate ${esc(label)} this week</h2>
<div class="hl-row">
<p class="hl-when"><span class="hl-day">${esc(b.long)}</span><span class="hl-time">${esc(b.when)}</span></p>
<p class="hl-num"><b>${b.score}</b><small>/100</small></p>
</div>
<p class="hl-wx"><span class="hl-icon">${b.icon}</span><span class="hl-temp">${Math.round(b.day.tempMax)}°C</span><span>${esc(b.cond)}</span><span aria-hidden="true">·</span><span>Wind ${Math.round(b.day.maxHourlyWind)} km/h</span>${b.day.precipitation > 0 ? `<span aria-hidden="true">·</span><span>Rain ${b.day.precipitation} mm</span>` : ''}</p>
${b.factors.length ? `<p class="hl-why">Why: ${esc(b.factors.join(', '))}.</p>` : ''}
</section>
<section class="week" aria-labelledby="week-h">
<div class="week-head"><h2 id="week-h">This week at ${esc(name)}</h2><span>Score out of 100</span></div>
<table class="week-table">
<caption class="vh">Daily skate scores for ${esc(name)} in ${esc(where)}, updated ${esc(updated)}</caption>
<thead class="vh"><tr><th scope="col">Day</th><th scope="col">Weather</th><th scope="col">Best time</th><th scope="col">Score</th></tr></thead>
<tbody>
${w.days.map(d => `<tr class="${d.best ? 'best' : ''}${d.score < 30 ? ' no-skate' : ''}"><th scope="row"><span class="row-name">${esc(d.name)}</span> <span class="row-date">${d.date}</span></th><td class="row-wx">${d.icon}<span>${Math.round(d.day.tempMax)}°</span><span class="vh"> ${esc(d.cond)}</span></td><td class="row-when">${esc(d.when)}</td><td class="row-score"><span class="row-bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, d.score))}%"></span></span><b>${d.score}</b></td></tr>`).join('\n')}
</tbody>
</table>
<p class="stamp">Updated ${esc(updated)} Eastern. The forecast refreshes every 6 hours. <a href="${live}">Open the live forecast for ${esc(name)}</a> for hour-by-hour scores.</p>
</section>`;
}

// ---------- park page ----------
function parkPage(city, park, w, updated) {
    const href = parkHref(city, park);
    const name = parkName(park);
    const where = `${city.name}, Ontario`;
    const crumbs = [
        { name: 'Home', href: '/' },
        { name: 'Skate parks', href: '/skateparks/' },
        { name: city.name, href: `/skateparks/${city.slug}/` },
        { name, href }
    ];
    const title = `${name}: Best Day to Skate This Week`;
    const description = w
        ? `When to skate at ${name} in ${where} this week. Best window: ${w.best.long}, ${w.best.when}, scoring ${w.best.score}/100.`
        : `Skate park weather for ${name} in ${where}. See this week's best day and two-hour window, scored by wind, rain, temperature and UV.`;
    const live = liveUrl(`${name}, ${where}`, park.lat, park.lon);
    const forecast = forecastBlock(name, where, live, w, updated, `at ${name}`);
    const others = city.parks.filter(x => x !== park).map(x => `<li><a href="${parkHref(city, x)}">${esc(parkName(x))}</a></li>`).join('');
    const body = `
<h1>${esc(name)}</h1>
<p class="lede">A skate park in ${esc(where)}. Every day gets a skate score out of 100 from wind, rain, temperature and UV, and the best two-hour window is picked for you.</p>
<p class="park-links park-actions"><a href="${mapUrl(park)}" rel="noopener">Map</a><a href="${dirUrl(park)}" rel="noopener">Directions</a><a href="${live}">Live forecast</a><a href="webcal://${SITE.replace(/^https?:\/\//, '')}cal/${park.slug}.ics" rel="nofollow">Add to calendar</a><a href="/cal/${park.slug}.ics" rel="nofollow" download>.ics</a></p>
${forecast}
${park.video ? reviewSection(park.video) : ''}
${others ? `<section class="nearby" aria-labelledby="also-h"><h2 id="also-h">Other skate parks in ${esc(city.name)}</h2><ul class="near-list also-list">${others}</ul></section>` : ''}
<p class="note">See every park in <a href="/skateparks/${city.slug}/">${esc(city.name)}</a>, or browse <a href="/skateparks/">Ontario skate parks by city</a>.</p>`;

    const pageUrl = SITE.replace(/\/$/, '') + href;
    const graph = [
        {
            '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl,
            name: title, description, inLanguage: 'en-CA', dateModified: new Date().toISOString(),
            isPartOf: { '@id': `${SITE}#website` },
            breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
            mainEntity: { '@id': `${pageUrl}#park` },
            ...(park.video ? { video: { '@id': `${pageUrl}#video` } } : {})
        },
        { ...crumbLd(crumbs), '@id': `${pageUrl}#breadcrumb` },
        {
            '@type': 'SportsActivityLocation', '@id': `${pageUrl}#park`, name,
            url: pageUrl,
            address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: 'ON', addressCountry: 'CA' },
            geo: { '@type': 'GeoCoordinates', latitude: +(+park.lat).toFixed(5), longitude: +(+park.lon).toFixed(5) },
            hasMap: mapUrl(park), publicAccess: true, isAccessibleForFree: true
        }
    ];
    if (park.video) {
        const v = park.video;
        const vo = {
            '@type': 'VideoObject', '@id': `${pageUrl}#video`,
            name: v.title,
            description: `Skate park review of ${name} in ${where}, from Logan Dunning Skateboarding.`,
            thumbnailUrl: ytThumb(v.videoId),
            contentUrl: ytWatch(v.videoId),
            embedUrl: ytEmbed(v.videoId),
            publisher: { '@type': 'Person', name: 'Logan Dunning', url: CHANNEL_URL }
        };
        const dur = isoDuration(v.duration);
        if (dur) vo.duration = dur;
        graph.push(vo);
    }
    return shell({
        title, description, canonical: href, crumbs, body,
        jsonld: [{ '@context': 'https://schema.org', '@graph': graph }],
        image: park.video ? ytThumb(park.video.videoId) : undefined,
        scripts: park.video ? VIDEO_SCRIPT : '',
        cal: { slug: park.slug, name, lat: park.lat, lon: park.lon, label: name }
    });
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
        .concat(all.map(c => ({ loc: `${SITE}skateparks/${c.slug}/`, freq: 'daily', pri: '0.6' })))
        .concat(all.flatMap(c => c.parks.map(p => ({ loc: `${SITE.replace(/\/$/, '')}${parkHref(c, p)}`, freq: 'daily', pri: '0.5' }))));
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
    let cityForecast = 0, parkForecast = 0, parkCount = 0;
    for (const c of all) {
        let w = null;
        try { w = week(c, weather.get(c.cell)); } catch (e) { w = null; }
        if (w) { weeks.set(c.slug, w); cityForecast++; }
        fs.mkdirSync(path.join(OUT, c.slug), { recursive: true });
        fs.writeFileSync(path.join(OUT, c.slug, 'index.html'), cityPage(c, w, updated));
        for (const p of c.parks) {
            parkCount++;
            let pw = null;
            try { pw = week({ lat: p.lat, lon: p.lon, name: parkName(p) }, weather.get(p.cell)); } catch (e) { pw = null; }
            if (pw) parkForecast++;
            const dir = path.join(OUT, c.slug, p.pageSlug || p.slug);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'index.html'), parkPage(c, p, pw, updated));
            if (p.pageSlug && p.pageSlug !== p.slug) {
                const legacy = path.join(OUT, c.slug, p.slug);
                fs.mkdirSync(legacy, { recursive: true });
                fs.writeFileSync(path.join(legacy, 'index.html'), redirectPage(parkHref(c, p), parkName(p)));
            }
        }
    }
    fs.writeFileSync(path.join(OUT, 'index.html'), hubPage(all, weeks, updated));
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap(all, day));
    console.log(`Pages: hub plus ${all.length} cities (${cityForecast} with a forecast) and ${parkCount} parks (${parkForecast} with a forecast), sitemap with ${all.length + parkCount + 2} URLs.`);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { cities, week, parkPage, cityPage, hubPage, parkHref, parkPath, parkName, attachVideos, loadVideoEntries, isoDuration, redirectPage, MATCH_KM, PAGE_CSS };
