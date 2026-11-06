const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ document: { addEventListener() {} } });
vm.runInContext(fs.readFileSync(require.resolve('../app.js'), 'utf8') + '\nthis.app = Object.create(SkateParkDay.prototype);', context);
const app = context.app;
const base = { tempMax: 20, maxHourlyWind: 5, precipitation: 0, uvIndex: 2, sunshine: 28800, weatherCode: 0 };
const cases = [
    [base, 100],
    [{ ...base, tempMax: 31, maxHourlyWind: 20, precipitation: 1, uvIndex: 9, sunshine: 0, weatherCode: 61 }, 0],
    [{ ...base, tempMax: 9, maxHourlyWind: 15, uvIndex: 4, sunshine: 0, weatherCode: 3 }, 60],
    [{ ...base, tempMax: 10, maxHourlyWind: 10, uvIndex: 3, sunshine: 25200, weatherCode: 3 }, 100],
    [{ ...base, tempMax: 18, maxHourlyWind: 25, precipitation: 0.1, uvIndex: 8, sunshine: 0, weatherCode: 3 }, 60],
    [{ ...base, tempMax: 30, maxHourlyWind: 25.1 }, 0],
    [{ ...base, tempMax: 10, maxHourlyWind: 15.1, precipitation: 0.11, uvIndex: 8.1, sunshine: 25201, weatherCode: 61 }, 29.7]
];
for (const [day, expected] of cases) {
    assert.ok(Math.abs(app.calculateDayScore(day) - expected) < 1e-9, `${JSON.stringify(day)} expected ${expected}`);
    const factors = app.getDayFactors(day);
    assert.equal(factors.length, 6);
    for (const factor of factors) {
        assert.ok(factor.percent >= 0 && factor.percent <= 100);
        assert.ok(factor.value && factor.label);
    }
    if (day.maxHourlyWind > 25) {
        assert.equal(factors.filter(f => f.inactive).length, 5);
    } else {
        assert.equal(factors.filter(f => f.inactive).length, 0);
        assert.ok(Math.abs(Math.max(0, Math.min(100, 100 + factors.reduce((sum, f) => sum + f.points, 0))) - expected) < 1e-9);
    }
}
console.log(`${cases.length} score/factor boundary cases passed`);
