// The day score shown on cards, the "Why ... scores" header and "Day score" label must agree
// with the two-hour window scores: a day never scores above its best window.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ document: { addEventListener() {} }, console: { log() {} } });
vm.runInContext(fs.readFileSync(require.resolve('../app.js'), 'utf8') + '\nthis.app = Object.create(SkateParkDay.prototype);', context);
const app = context.app;

function day({ winds, temps = 12, precip = 0, uv = 1.4, sunshine = 30000, weatherCode = 3 }) {
    const w = Array.isArray(winds) ? winds : Array(24).fill(winds);
    const t = Array.isArray(temps) ? temps : Array(24).fill(temps);
    const p = Array.isArray(precip) ? precip : Array(24).fill(precip);
    return {
        date: new Date('2026-11-18T12:00:00'), tempMax: Math.max(...t), tempMin: Math.min(...t),
        maxHourlyWind: Math.max(...w), precipitation: +p.reduce((a, b) => a + b, 0).toFixed(1),
        weatherCode, uvIndex: uv, sunshine, reasons: [],
        hourlyData: { times: [], temps: t, winds: w, uvs: Array(24).fill(uv), precipitation: p, weatherCodes: Array(24).fill(weatherCode) }
    };
}
const blocksMax = d => Math.max(...app.computeTimeBlocks(d).map(b => b.score));

// Milton, Wed Nov 18: 21.6 km/h all day, 12.9°C. Every window is 0, so the day is 0 (was 100).
const milton = day({ winds: 21.6, temps: 12.9, uv: 1.35 });
assert.equal(blocksMax(milton), 0);
assert.equal(app.calculateDayScore(milton), 0);
assert.ok(milton.weatherScore > 0, 'whole-day weather rules alone still rate it highly');
assert.deepEqual([...milton.reasons], ['Too windy all day']);

// Oakville, Mon Nov 16: calm-ish breeze, best window well under 100. Day matches the best window.
const oakWinds = Array.from({ length: 24 }, (_, h) => (h >= 14 && h < 16 ? 4 : 8 + (h % 3)));
const oakville = day({ winds: oakWinds, temps: 11 });
const oakBest = blocksMax(oakville);
assert.ok(oakBest > 0 && oakBest < 100, `best window ${oakBest}`);
assert.equal(app.calculateDayScore(oakville), oakBest);
assert.equal(oakville.cappedByWindow, true);

// Property check over many random days: the day score never exceeds the best window or the weather rules.
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 500; i++) {
    const d = day({
        winds: Array.from({ length: 24 }, () => rnd() * 30),
        temps: Array.from({ length: 24 }, () => rnd() * 35),
        precip: Array.from({ length: 24 }, () => (rnd() < 0.1 ? rnd() : 0)),
        uv: rnd() * 10, sunshine: rnd() * 40000, weatherCode: [0, 2, 3, 61][Math.floor(rnd() * 4)]
    });
    const score = app.calculateDayScore(d);
    assert.ok(score >= 0 && score <= 100);
    assert.ok(score <= blocksMax(d) + 1e-9, `day ${score} above best window ${blocksMax(d)}`);
    assert.ok(score <= d.weatherScore + 1e-9);
}

// Best-day pick uses the corrected score: an all-windy day can no longer win over a skateable one.
app.days = [milton, oakville];
app.days.forEach(d => { d.score = app.calculateDayScore(d); });
const lowRain = app.days.filter(d => d.precipitation <= 1);
assert.equal(lowRain.reduce((b, c) => app.betterDay(c, b)), oakville);
console.log('day score consistency checks passed');
