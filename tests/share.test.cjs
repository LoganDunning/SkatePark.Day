const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseShare, previewFor, renderShareHtml, shareUrl } = require('../api/share/meta');
const template = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const tag = (html, re) => (html.match(re) || [])[1];
const og = (html, key) => tag(html, new RegExp(`<meta property="${key}" content="([^"]*)">`));
const tw = (html, key) => tag(html, new RegExp(`<meta name="${key}" content="([^"]*)">`));

// A day shared with a park, time and location.
let s = parseShare({ d: '2026-11-14', t: '14', p: 'Bayfront Park Skatepark', pc: 'Hamilton', plat: '43.27411', plon: '-79.87212', loc: 'Hamilton, ON', lat: '43.2557', lon: '-79.8711' });
let html = renderShareHtml(template, s);
assert.equal(og(html, 'og:title'), 'Skate Saturday, Nov 14 at 2pm-4pm · Bayfront Park Skatepark');
assert.equal(og(html, 'og:description'), 'Meet at Bayfront Park Skatepark, Hamilton. Check the live 7-day skate forecast for Hamilton, ON, ranked by wind, temperature, rain, sun and UV.');
assert.equal(og(html, 'og:image'), 'https://best.skatepark.day/img/share/day-sat.jpg');
assert.equal(og(html, 'og:image:width'), '1200');
assert.equal(og(html, 'og:image:type'), 'image/jpeg');
assert.equal(og(html, 'og:url'), 'https://best.skatepark.day/share?d=2026-11-14&amp;t=14&amp;p=Bayfront%20Park%20Skatepark&amp;pc=Hamilton&amp;plat=43.27411&amp;plon=-79.87212&amp;loc=Hamilton%2C%20ON&amp;lat=43.26&amp;lon=-79.87');
assert.equal(tag(html, /<link rel="canonical" href="([^"]*)">/), og(html, 'og:url'));
assert.equal(tw(html, 'twitter:title'), og(html, 'og:title'));
assert.equal(tw(html, 'twitter:image'), og(html, 'og:image'));
assert.equal(tw(html, 'robots'), 'noindex, follow');
assert.match(html, /<title>Skate Saturday, Nov 14 at 2pm-4pm · Bayfront Park Skatepark \| best\.skatepark\.day<\/title>/);
for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:type', 'og:image:alt']) {
    assert.equal(html.split(`property="${key}"`).length, 2, `one ${key}`);
}

// Best day of the week.
s = parseShare({ d: '2026-11-15', best: '1', t: '12', loc: 'Milton, ON', lat: '43.52', lon: '-79.88', p: 'ignored' });
html = renderShareHtml(template, s);
assert.equal(og(html, 'og:title'), 'Sunday, Nov 15 is the best day to skate near Milton, ON');
assert.equal(og(html, 'og:image'), 'https://best.skatepark.day/img/share/best-sun.jpg');
assert.ok(!og(html, 'og:url').includes('ignored'));

// Hostile input is escaped and trimmed; invalid values are dropped.
s = parseShare({ d: '2026-02-30', t: '99', p: '"><script>alert(1)</script>\u202e&x', lat: '999', lon: '1', loc: 'A'.repeat(200) });
assert.equal(s.date, null);
assert.equal(s.hour, null);
assert.equal(s.lat, null);
assert.ok([...s.loc].length <= 60);
html = renderShareHtml(template, s);
assert.ok(!html.includes('<script>alert(1)'));
assert.ok(og(html, 'og:title').startsWith('Skate &quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt; &amp;x'));
assert.equal(og(html, 'og:image'), 'https://best.skatepark.day/img/share/default.jpg');
assert.ok(!/[\u202e]/.test(html));

// Accents and emoji survive, and the share link round trips through the app's reader.
s = parseShare({ d: '2026-11-13', p: 'Parc de planche à roulettes 🛹', pc: 'Montréal', loc: 'Montréal, QC', lat: '45.5', lon: '-73.57' });
const url = shareUrl(s);
assert.ok(url.includes('p=Parc%20de%20planche%20%C3%A0%20roulettes%20%F0%9F%9B%B9'));
const ctx = vm.createContext({ document: { addEventListener() {} }, URLSearchParams });
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8') + '\nthis.read = readSharedLink;', ctx);
const read = ctx.read(new URL(url).search);
assert.equal(read.date, '2026-11-13');
assert.equal(read.park, 'Parc de planche à roulettes 🛹');
assert.equal(read.location.city, 'Montréal');
assert.equal(read.location.region, 'QC');
assert.equal(read.location.lat, 45.5);
assert.equal(ctx.read('?utm_source=x'), null);

// No share details keeps the regular home page tags.
assert.equal(previewFor(parseShare({})), null);
assert.equal(renderShareHtml(template, parseShare({})), template);
console.log('share preview tests passed');
