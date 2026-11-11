// Renders the branded link preview cards in img/share/ (1200x630 JPEG).
// Usage: node scripts/share-images/build.cjs  (needs Playwright with Chromium installed)
const path = require('node:path');
const { chromium } = require('playwright');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUB = 'Wind, temperature, rain, sun and UV, ranked for skating';
const cards = [
    { file: 'default', kicker: '7-day skate forecast', title: 'best<span class="m">.</span>skatepark<span class="m">.</span>day', sub: 'Find the best day to skate this week, ranked by wind, temperature, rain, sun and UV', nourl: '1' },
    ...DAYS.map(d => ({ file: `day-${d.slice(0, 3).toLowerCase()}`, kicker: 'Skate park day', title: `Skate ${d}`, sub: SUB })),
    ...DAYS.map(d => ({ file: `best-${d.slice(0, 3).toLowerCase()}`, kicker: 'Best day to skate this week', title: d, sub: 'Picked from the 7-day forecast by wind, temperature, rain, sun and UV' })),
];

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const card = 'file://' + path.join(__dirname, 'card.html');
    const out = path.join(__dirname, '..', '..', 'img', 'share');
    for (const c of cards) {
        await page.goto(`${card}?${new URLSearchParams({ kicker: c.kicker, title: c.title, sub: c.sub, ...(c.nourl ? { nourl: c.nourl } : {}) })}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(out, `${c.file}.jpg`), type: 'jpeg', quality: 86 });
        console.log(`img/share/${c.file}.jpg`);
    }
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
