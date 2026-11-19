// The home menu must appear on generated park, city and hub pages, and stay in sync.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { cities, parkPage, cityPage, hubPage, PAGE_CSS } = require('../scripts/build-pages.cjs');
const chrome = require('../scripts/site-chrome.cjs');

const ROOT = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const notFound = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
const { cities: all } = cities();
const oak = all.find(c => c.slug === 'oakville');
assert.ok(oak, 'oakville is in the city list');
const shell = oak.parks.find(p => (p.pageSlug || p.slug) === 'shell-park');
assert.ok(shell, 'Shell Park is in Oakville');

function assertMenu(html, { home, calSlug, script } = {}) {
    assert.match(html, /id="menu-toggle"/);
    assert.match(html, /id="site-menu"/);
    assert.match(html, /aria-label="Site menu"/);
    assert.match(html, /id="page-share"/);
    assert.match(html, /class="brand-mark"/);
    assert.match(html, /<span class="kicker">Menu<\/span>/);
    assert.match(html, /id="flyout-backdrop"/);
    assert.match(html, /id="cal-pop"/);
    assert.match(html, /id="cal-toggle"/);
    assert.match(html, /id="theme-toggle"/);
    assert.match(html, /<span class="menu-num">01<\/span>Forecast/);
    assert.match(html, /<span class="menu-num">02<\/span>How it works/);
    assert.match(html, /<span class="menu-num">03<\/span>FAQ/);
    assert.match(html, /<span class="menu-num">04<\/span>Skate parks by city/);
    assert.match(html, /<span class="menu-num">05<\/span>Add to calendar/);
    assert.match(html, /<span class="menu-num">06<\/span>/);
    assert.match(html, /theme-toggle-label">Light<\/span> mode/);
    assert.match(html, /<span class="menu-num">07<\/span>Source on GitHub/);
    assert.match(html, /<span class="menu-num">08<\/span>Logan Dunning/);
    assert.match(html, /href="\/skateparks\/"/);
    assert.match(html, /class="btn btn-solid flyout-login">Log in<\/button>/);
    assert.match(html, /Social Dunn Right Inc/);
    assert.doesNotMatch(html, /class="pg-live"/);
    if (home) {
        assert.match(html, /href="#top" data-menu="forecast"/);
        assert.match(html, /href="#about-heading" data-info="about-heading"/);
        assert.match(html, /href="#faq-heading" data-info="faq-heading"/);
        assert.doesNotMatch(html, /href="\/#top"/);
        assert.doesNotMatch(html, /site-chrome\.js/);
    } else {
        assert.match(html, /href="\/#top"/);
        assert.match(html, /href="\/#about-heading"/);
        assert.match(html, /href="\/#faq-heading"/);
        assert.doesNotMatch(html, /data-menu="forecast"/);
        assert.doesNotMatch(html, /data-info="/);
        if (script !== false) {
            assert.match(html, new RegExp(`site-chrome\\.js\\?v=${PAGE_CSS}`));
            assert.match(html, new RegExp(`pages\\.css\\?v=${PAGE_CSS}`));
        }
    }
    if (calSlug) assert.match(html, new RegExp(`data-cal-slug="${calSlug}"`));
}

assert.equal(chrome.THEME_KEY, 'skatepark-theme');
assert.match(chrome.themeBootScript(), /localStorage\.getItem\('skatepark-theme'\)/);
assert.match(indexHtml, /localStorage\.getItem\('skatepark-theme'\)/);
assert.match(indexHtml, /localStorage\.setItem\('skatepark-theme'/);
assert.doesNotMatch(indexHtml, /setAttribute\('data-theme','dark'\)/);

assertMenu(indexHtml, { home: true });

// The committed home menu is the shared home markup (whitespace-insensitive).
function squash(s) { return s.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(); }
assert.ok(squash(indexHtml).includes(squash(chrome.chromeHtml({ home: true }))), 'index.html menu matches scripts/site-chrome.cjs');
assert.ok(squash(indexHtml).includes(squash(chrome.headerActionsHtml(0, 'Share this forecast'))), 'index.html header actions match the shared source');

const parkHtml = parkPage(oak, shell, null, 'Mon Nov 16, 6:00 PM');
assertMenu(parkHtml, { calSlug: shell.slug });
assert.match(parkHtml, /data-cal-name="[^"]*Shell Park/);
assert.match(parkHtml, /class="site-header"/);
assert.match(parkHtml, /<div class="pg-wrap">/);

const cityHtml = cityPage(oak, null, 'Mon Nov 16, 6:00 PM');
assertMenu(cityHtml);
assert.match(cityHtml, /data-cal-lat="/);
assert.match(cityHtml, /data-cal-lon="/);
assert.match(cityHtml, /data-cal-label="Oakville, Ontario"/);
assert.ok(squash(cityHtml).includes(squash(chrome.chromeHtml({ home: false }))), 'city page menu matches shared source');

const hubHtml = hubPage(all.slice(0, 3), new Map(), 'Mon Nov 16, 6:00 PM');
assertMenu(hubHtml);
assert.ok(squash(hubHtml).includes(squash(chrome.chromeHtml({ home: false }))), 'hub page menu matches shared source');

assertMenu(notFound);
assert.ok(squash(notFound).includes(squash(chrome.chromeHtml({ home: false }))), '404 menu matches shared source');
assert.match(notFound, /localStorage\.getItem\('skatepark-theme'\)/);

const chromeJs = fs.readFileSync(path.join(ROOT, 'site-chrome.js'), 'utf8');
assert.match(chromeJs, /skatepark-theme/);
assert.match(chromeJs, /navigator\.share/);
assert.match(chromeJs, /\/cal\/index\.json/);
assert.match(chromeJs, /flyout-lock/);
assert.match(chromeJs, /Escape/);

console.log('site menu checks passed (home, park, city, hub, 404)');
