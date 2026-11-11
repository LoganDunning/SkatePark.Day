// Builds link preview tags for shared skate days (/share?d=…).
// The forecast itself is never baked in, so cached previews do not go stale.
const SITE = 'https://best.skatepark.day';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEFAULT_TITLE = 'Best Skate Park Day - 7-Day Skateboarding Weather Forecast';

function first(v) { return Array.isArray(v) ? v[0] : v; }

// Plain single-line text with a length cap; drops control and bidi override characters.
function cleanText(v, max) {
    v = first(v);
    if (v == null) return '';
    const s = String(v).normalize('NFC')
        .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ')
        .replace(/\s+/g, ' ').trim();
    const chars = [...s];
    return chars.length > max ? chars.slice(0, max - 1).join('').trimEnd() + '…' : s;
}

function cleanNumber(v, min, max, digits) {
    v = first(v);
    if (v == null || !/^-?\d{1,3}(\.\d+)?$/.test(String(v).trim())) return null;
    const n = +v;
    return n >= min && n <= max ? +n.toFixed(digits) : null;
}

function cleanDate(v) {
    v = first(v);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || '').trim());
    if (!m) return null;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
    return { iso: m[0], weekday: DAYS[d.getUTCDay()], label: `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}` };
}

// Same labels as the app's two-hour time blocks, e.g. 14 -> "2pm-4pm".
function blockLabel(start) {
    const h = (x) => x === 12 ? '12pm' : x === 24 ? '12am' : x > 12 ? `${x - 12}pm` : `${x}am`;
    return `${h(start)}-${h(start + 2)}`;
}

function parseShare(query) {
    query = query || {};
    const date = cleanDate(query.d);
    const hourRaw = first(query.t);
    const hour = date && /^\d{1,2}$/.test(String(hourRaw || '')) && +hourRaw <= 22 ? +hourRaw : null;
    const s = {
        date,
        hour,
        best: !!date && first(query.best) === '1',
        park: cleanText(query.p, 80),
        parkCity: cleanText(query.pc, 60),
        plat: cleanNumber(query.plat, -90, 90, 5),
        plon: cleanNumber(query.plon, -180, 180, 5),
        loc: cleanText(query.loc, 60),
        lat: cleanNumber(query.lat, -90, 90, 2),
        lon: cleanNumber(query.lon, -180, 180, 2),
    };
    if (s.plat == null || s.plon == null) s.plat = s.plon = null;
    if (s.lat == null || s.lon == null) s.lat = s.lon = null;
    if (s.best) s.park = s.parkCity = '';
    if (!s.park) { s.parkCity = ''; s.plat = s.plon = null; }
    return s;
}

// The canonical form of a share link, rebuilt only from validated values.
function shareUrl(s, origin) {
    const q = new URLSearchParams();
    if (s.date) q.set('d', s.date.iso);
    if (s.best) q.set('best', '1');
    if (s.hour != null) q.set('t', String(s.hour));
    if (s.park) q.set('p', s.park);
    if (s.parkCity) q.set('pc', s.parkCity);
    if (s.plat != null) { q.set('plat', String(s.plat)); q.set('plon', String(s.plon)); }
    if (s.loc) q.set('loc', s.loc);
    if (s.lat != null) { q.set('lat', String(s.lat)); q.set('lon', String(s.lon)); }
    const qs = q.toString().replace(/\+/g, '%20');
    return `${origin || SITE}/share${qs ? '?' + qs : ''}`;
}

function previewFor(s, origin) {
    origin = origin || SITE;
    const time = s.date && s.hour != null ? ` at ${blockLabel(s.hour)}` : '';
    const place = s.loc ? ` for ${s.loc}` : '';
    const tail = `Check the live 7-day skate forecast${place}, ranked by wind, temperature, rain, sun and UV.`;
    let title, description, image, alt;
    if (s.best) {
        title = `${s.date.label} is the best day to skate${s.loc ? ' near ' + s.loc : ''}`;
        description = `${s.date.weekday}${time} is the pick of this week's skate forecast. ${tail}`;
        image = `best-${s.date.weekday.slice(0, 3).toLowerCase()}`;
        alt = `Best day to skate this week: ${s.date.weekday}`;
    } else if (s.date) {
        title = `Skate ${s.date.label}${time}${s.park ? ' · ' + s.park : s.loc ? ' in ' + s.loc : ''}`;
        description = s.park ? `Meet at ${s.park}${s.parkCity ? ', ' + s.parkCity : ''}. ${tail}` : `Who's in? ${tail}`;
        image = `day-${s.date.weekday.slice(0, 3).toLowerCase()}`;
        alt = `Skate ${s.date.weekday}`;
    } else if (s.park) {
        title = `Skate ${s.park}${s.parkCity ? ', ' + s.parkCity : ''}`;
        description = `Find the best day this week to skate ${s.park}. ${tail}`;
        image = 'default';
        alt = 'best.skatepark.day 7-day skate forecast';
    } else {
        return null;
    }
    return {
        title, description, alt,
        url: shareUrl(s, origin),
        image: `${origin}/img/share/${image}.jpg`,
    };
}

function escapeAttr(v) {
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function setTag(html, pattern, tag) {
    return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', () => `    ${tag}\n</head>`);
}

// Rewrites the head of index.html for one shared link. Untrusted text is escaped once, here.
function renderShareHtml(template, s, origin) {
    const p = previewFor(s, origin);
    if (!p) return template;
    const e = {
        title: escapeAttr(p.title), description: escapeAttr(p.description), url: escapeAttr(p.url),
        image: escapeAttr(p.image), alt: escapeAttr(p.alt),
    };
    const meta = (attr, key, value) => [new RegExp(`<meta\\s+${attr}="${key.replace(/:/g, '\\:')}"[^>]*>`), `<meta ${attr}="${key}" content="${value}">`];
    const edits = [
        [/<title>[\s\S]*?<\/title>/, `<title>${e.title} | best.skatepark.day</title>`],
        meta('name', 'description', e.description),
        meta('name', 'robots', 'noindex, follow'),
        [/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${e.url}">`],
        meta('property', 'og:title', e.title),
        meta('property', 'og:description', e.description),
        meta('property', 'og:url', e.url),
        meta('property', 'og:image', e.image),
        meta('property', 'og:image:width', '1200'),
        meta('property', 'og:image:height', '630'),
        meta('property', 'og:image:type', 'image/jpeg'),
        meta('property', 'og:image:alt', e.alt),
        meta('name', 'twitter:title', e.title),
        meta('name', 'twitter:description', e.description),
        meta('name', 'twitter:image', e.image),
        meta('name', 'twitter:image:alt', e.alt),
    ];
    let html = template;
    for (const [pattern, tag] of edits) html = setTag(html, pattern, tag);
    return html;
}

module.exports = { SITE, DEFAULT_TITLE, parseShare, previewFor, renderShareHtml, shareUrl, escapeAttr, blockLabel, cleanText };
