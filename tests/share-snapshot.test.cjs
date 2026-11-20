const assert = require('node:assert/strict');
const { assembleForecast, assembleBranded, assembleFromApp, assembleFromPage, withUrl, canShareFilesWith, shareOrCopy, htmlForClipboard, SITE } = require('../share-snapshot.js');

function dateOn(offset) {
    const d = new Date(2026, 10, 20, 12, 0, 0);
    d.setDate(d.getDate() + offset);
    return d;
}

function mockApp() {
    const days = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
        date: dateOn(i),
        score: [84, 71, 40, 12, 66, 90, 55][i],
        tempMax: [12, 9, 7, 4, 8, 14, 10][i],
        maxHourlyWind: [8, 12, 18, 28, 10, 6, 11][i],
        precipitation: [0, 0, 1.2, 0, 0, 0, 0][i],
        weatherCode: [2, 3, 61, 3, 1, 0, 2][i],
        hourlyData: { temps: [], winds: [], uvs: [], precipitation: [] }
    }));
    const bestDay = days[0];
    const blocks = [6, 8, 10, 12, 14, 16, 18].map((h, i) => ({
        startHour: h,
        endHour: h + 2,
        score: [20, 40, 55, 60, 70, 84, 30][i]
    }));
    return {
        bestDay,
        days,
        location: { city: 'Milton', region: 'Ontario' },
        locationLabel() { return 'Milton, Ontario'; },
        dayLabel(i) { return i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[i].date.toLocaleDateString('en-US', { weekday: 'long' }); },
        longBlockLabel(start, end) {
            const f = (h) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
            return `${f(start)} to ${f(end)}`;
        },
        conditionText(code) {
            return { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 61: 'Light rain' }[code] || 'Mixed';
        },
        bestWindow(index) {
            if (index !== 0) return { startHour: 14, endHour: 16, score: 70, none: false };
            return { startHour: 16, endHour: 18, score: 84, none: false };
        },
        computeTimeBlocks() { return blocks; }
    };
}

const card = assembleFromApp(mockApp());
assert.equal(card.kind, 'forecast');
assert.equal(card.location, 'Milton, Ontario');
assert.equal(card.heading, 'Best time to skate this week');
assert.equal(card.dayName, 'Today');
assert.equal(card.window, '4pm to 6pm');
assert.equal(card.score, 84);
assert.equal(card.tempC, 12);
assert.equal(card.condition, 'Partly cloudy');
assert.equal(card.wind, 8);
assert.equal(card.rain, null);
assert.equal(card.hours.length, 7);
assert.equal(card.hours[4].label, '2pm');
    // 4pm is the best window and the highest bar
assert.equal(card.hours[5].label, '4pm');
assert.equal(card.hours[5].best, true);
assert.equal(card.hours.filter((h) => h.best).length, 1);
assert.equal(card.week.length, 7);
assert.equal(card.week[0].name, 'Today');
assert.equal(card.week[0].selected, true);
assert.equal(card.week[0].best, true);
assert.equal(card.week[0].score, 84);
assert.equal(card.week[5].score, 90);
assert.equal(card.week[5].best, false);
assert.equal(card.url, SITE);

const empty = assembleFromApp({ days: [] });
assert.equal(empty.kind, 'branded');
assert.match(empty.url, /skatepark\.day/);

const branded = assembleBranded({ title: 'Shell Park Skatepark', subtitle: 'Oakville, Ontario', url: SITE + '/skateparks/oakville/shell-park/' });
assert.equal(branded.kind, 'branded');
assert.equal(branded.title, 'Shell Park Skatepark');

const forecast = assembleForecast({ location: 'Oakville', dayName: 'Saturday', window: '2pm to 4pm', score: '77.4', tempC: '11.2', wind: 9, rain: 0, hours: [], week: [] });
assert.equal(forecast.score, 77);
assert.equal(forecast.tempC, 11);
assert.equal(forecast.rain, null);

function el(text, cls, kids) {
    const classList = { contains: (name) => (cls || '').split(/\s+/).includes(name) };
    const node = {
        textContent: text || '',
        classList,
        childNodes: kids || [],
        querySelector(sel) { return (this._map && this._map[sel]) || null; },
        querySelectorAll(sel) { return (this._map && this._map[sel]) || []; }
    };
    if (cls) node.className = cls;
    return node;
}

const wxKids = [
    el('', 'hl-icon'),
    el('11°C', 'hl-temp'),
    el('Cloudy'),
    el('·'),
    el('Wind 9 km/h'),
    el('·'),
    el('Rain 1.2 mm')
];
const wx = el('11°C Cloudy · Wind 9 km/h · Rain 1.2 mm', 'hl-wx', wxKids);
wx._map = { '.hl-temp': wxKids[1] };

const row = el('', 'best', []);
row.classList = { contains: (n) => n === 'best' };
row._map = {
    '.row-name': el('Today'),
    '.row-date': el('20'),
    '.row-wx': el('11°'),
    '.row-score b': el('84'),
    '.row-score': el('84')
};

const page = {
    title: 'Shell Park Skatepark: Best Day to Skate This Week',
    defaultView: { location: { href: SITE + '/skateparks/oakville/shell-park/' } },
    querySelector(sel) {
        return ({
            '.hl-day': el('Today'),
            '.hl-num b': el('84'),
            '.hl-label': el('Best time to skate at Shell Park Skatepark this week'),
            '#forecast-heading': null,
            '#location-pill-text': el(''),
            'h1': el('Shell Park Skatepark'),
            '.hl-wx': wx,
            '.hl-time': el('4pm to 6pm')
        })[sel] || null;
    },
    querySelectorAll(sel) {
        if (sel === '.week-table tbody tr') return [row];
        return [];
    }
};

const fromPage = assembleFromPage(page);
assert.equal(fromPage.kind, 'forecast');
assert.equal(fromPage.location, 'Shell Park Skatepark');
assert.match(fromPage.heading, /Shell Park/);
assert.equal(fromPage.dayName, 'Today');
assert.equal(fromPage.window, '4pm to 6pm');
assert.equal(fromPage.score, 84);
assert.equal(fromPage.tempC, 11);
assert.equal(fromPage.condition, 'Cloudy');
assert.equal(fromPage.wind, 9);
assert.equal(fromPage.rain, 1.2);
assert.equal(fromPage.hours.length, 0);
assert.equal(fromPage.week.length, 1);
assert.equal(fromPage.week[0].best, true);
assert.equal(fromPage.week[0].score, 84);
assert.equal(fromPage.url, SITE + '/skateparks/oakville/shell-park/');

assert.equal(assembleFromPage({ querySelector() { return null; }, querySelectorAll() { return []; } }), null);

assert.equal(withUrl('Hello', 'https://example.com'), 'Hello\nhttps://example.com');
assert.equal(withUrl('See https://example.com today', 'https://example.com'), 'See https://example.com today');
assert.equal(withUrl('', 'https://example.com'), 'https://example.com');

assert.equal(canShareFilesWith(() => true, { type: 'image/png' }), true);
assert.equal(canShareFilesWith(() => { throw new Error('no'); }, { type: 'image/png' }), false);
assert.equal(canShareFilesWith(() => true, null), false);

class FakeItem {
    constructor(items) { this.items = items; }
}

const file = { type: 'image/png', name: 'best-skatepark-day.png' };
const payload = { title: 'best.skatepark.day', text: 'Best day in Milton', url: 'https://best.skatepark.day/share?best=1', file, dataUrl: 'data:image/png;base64,abc' };

async function main() {
    let shared;
    const shareFiles = await shareOrCopy(payload, {
        canShare: (d) => !!(d && d.files && d.files.length),
        share: async (d) => { shared = d; },
        toast: () => { throw new Error('no toast on share'); }
    });
    assert.equal(shareFiles.method, 'share-files');
    assert.equal(shared.files[0], file);
    assert.equal(shared.url, payload.url);
    assert.match(shared.text, /best\.skatepark\.day\/share/);
    assert.match(shared.text, /Best day in Milton/);

    const aborted = await shareOrCopy(payload, {
        canShare: () => true,
        share: async () => { const e = new Error('nope'); e.name = 'AbortError'; throw e; },
        writeClipboard: async () => { throw new Error('should not copy after abort'); },
        toast: () => { throw new Error('no toast on abort'); }
    });
    assert.equal(aborted.method, 'aborted');

    const toasts = [];
    const written = [];
    const copiedImage = await shareOrCopy(payload, {
        canShare: () => false,
        ClipboardItem: FakeItem,
        writeClipboard: async (items) => { written.push(items); },
        toast: (m) => toasts.push(m)
    });
    assert.equal(copiedImage.method, 'clipboard-image');
    assert.equal(toasts[0], 'Link and snapshot copied');
    assert.equal(written.length, 1);
    assert.ok(written[0][0].items['image/png']);
    assert.ok(written[0][0].items['text/plain']);
    assert.ok(written[0][0].items['text/html']);

    const fallbackToasts = [];
    const textOnly = await shareOrCopy({ title: 't', text: 'Best day', url: payload.url }, {
        writeText: async (t) => { assert.match(t, /best\.skatepark\.day\/share/); },
        toast: (m) => fallbackToasts.push(m)
    });
    assert.equal(textOnly.method, 'clipboard-text');
    assert.equal(fallbackToasts[0], 'Copied to clipboard');

    const failed = await shareOrCopy({ url: payload.url }, { toast: (m) => fallbackToasts.push(m) });
    assert.equal(failed.method, 'failed');
    assert.equal(fallbackToasts[1], 'Could not copy');

    const html = htmlForClipboard(payload.url, 'data:image/png;base64,abc');
    assert.match(html, /<img src="data:image\/png;base64,abc"/);
    assert.match(html, /href="https:\/\/best\.skatepark\.day\/share\?best=1"/);

}

main().then(() => console.log('share snapshot tests passed')).catch((err) => { console.error(err); process.exit(1); });
