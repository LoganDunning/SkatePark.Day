// Park detail slugs and the review-video mapping in data/park-videos.json.
const assert = require('node:assert/strict');
const { parkList, slugify } = require('../scripts/build-calendars.cjs');
const { cities, parkHref, parkName, parkPage, attachVideos, loadVideoEntries, redirectPage, MATCH_KM } = require('../scripts/build-pages.cjs');

const parks = parkList();
assert.equal(new Set(parks.map(p => p.slug)).size, parks.length, 'park slugs are unique');

const entries = loadVideoEntries();
assert.ok(entries.length > 0, 'park-videos.json has entries');

const { cities: all, parks: located } = cities();
assert.equal(located.length, parks.length);

const attached = located.filter(p => p.video);
assert.equal(attached.length, entries.length, 'every mapping attaches to exactly one park');

const bySlug = new Map(located.map(p => [p.slug, p]));
const used = new Set();
for (const e of entries) {
    assert.ok(e.videoId && /^[A-Za-z0-9_-]{11}$/.test(e.videoId), `videoId ${e.videoId}`);
    assert.ok(e.title && e.title.trim(), 'title is present');
    assert.equal(typeof e.lat, 'number');
    assert.equal(typeof e.lon, 'number');
    const park = located.map(p => ({ p, d: Math.hypot(p.lat - e.lat, p.lon - e.lon) }))
        .sort((a, b) => a.d - b.d)[0].p;
    // Re-check with the same haversine helper used at build time, via attachVideos.
    assert.ok(park.video, `${e.slug || e.videoId} should attach`);
    assert.equal(park.video.videoId, e.videoId);
    assert.ok(!used.has(park.slug), `slug ${park.slug} is only used once`);
    used.add(park.slug);
    if (e.slug) assert.equal(park.slug, e.slug, `stored slug still matches ${e.slug}`);
    if (e.pageSlug) assert.equal(park.pageSlug, e.pageSlug, `page slug ${e.pageSlug}`);
    const city = all.find(c => c.parks.includes(park));
    assert.ok(city, 'attached park belongs to a city');
    assert.equal(city.slug, slugify(city.name));
    assert.equal(parkHref(city, park), `/skateparks/${city.slug}/${park.pageSlug || park.slug}/`);
    assert.ok(!parkHref(city, park).includes('//skateparks'));
    if (e.name) assert.equal(parkName(park), e.name);
    if (e.googleReviewUrl) assert.equal(park.video.googleReviewUrl, e.googleReviewUrl);
}

// Videos are matched to parks, with friendly page slugs and review links only where Logan left a review.
const expect = {
    '608y7y1GXlw': { slug: 'oakville-skatepark-3', pageSlug: 'shell-park', city: 'oakville', review: false },
    'geYIZc8NitU': { slug: 'oakville-skatepark-2', pageSlug: 'sixteen-mile', city: 'oakville', review: true },
    'RfWpYMLHO4g': { slug: 'burlington-skatepark-on-new-street', pageSlug: 'nelson-park', city: 'burlington', review: false },
    '1lunxcoQ02U': { slug: 'vaughan-skatepark-4', pageSlug: 'stanley-greene', city: 'vaughan', review: true },
    'Obsfl_wrgR8': { slug: 'toronto-earl-bales-skate-park', pageSlug: 'earl-bales', city: 'toronto', review: true },
    '8GwjW7BtW4c': { slug: 'caledon-southfields-skatepark', pageSlug: 'southfields', city: 'caledon', review: false },
    'FJDmjoLQjEo': { slug: 'mississauga-zonta-meadows-skate-park', pageSlug: 'zonta-meadows', city: 'mississauga', review: true }
};
for (const [id, exp] of Object.entries(expect)) {
    const park = attached.find(p => p.video.videoId === id);
    assert.ok(park, `video ${id} is mapped`);
    assert.equal(park.slug, exp.slug);
    assert.equal(park.pageSlug, exp.pageSlug);
    const city = all.find(c => c.parks.includes(park));
    assert.equal(city.slug, exp.city);
    assert.equal(parkHref(city, park), `/skateparks/${exp.city}/${exp.pageSlug}/`);
    assert.equal(Boolean(park.video.googleReviewUrl), exp.review, `review url for ${id}`);
}

// A park page with a video has a lazy, privacy-friendly embed and VideoObject; others do not.
const oak = all.find(c => c.slug === 'oakville');
const shell = oak.parks.find(p => p.slug === 'oakville-skatepark-3');
const glen = oak.parks.find(p => p.slug === 'oakville-glen-abbey-skatepark');
assert.equal(shell.pageSlug, 'shell-park');
const shellHtml = parkPage(oak, shell, null, 'Mon Nov 16, 6:00 PM');
assert.match(shellHtml, /rel="canonical" href="https:\/\/best\.skatepark\.day\/skateparks\/oakville\/shell-park\//);
assert.match(shellHtml, /Watch the review/);
assert.match(shellHtml, /data-yt="608y7y1GXlw"/);
assert.match(shellHtml, /youtube-nocookie\.com\/embed\/608y7y1GXlw/);
assert.match(shellHtml, /i\.ytimg\.com\/vi\/608y7y1GXlw\/hqdefault\.jpg/);
assert.match(shellHtml, /"@type":"VideoObject"/);
assert.match(shellHtml, /Shell Park Skate Park/);
assert.doesNotMatch(shellHtml, /Read Logan's Google review/);
assert.match(shellHtml, /<iframe[\s\S]*<\/iframe>|replaceChildren\(f\)/);

const sixteen = oak.parks.find(p => p.slug === 'oakville-skatepark-2');
const sixteenHtml = parkPage(oak, sixteen, null, 'Mon Nov 16, 6:00 PM');
assert.match(sixteenHtml, /Read Logan's Google review/);
assert.match(sixteenHtml, /Sixteen\+Mile\+Sports\+Park\+Playground/);

const glenHtml = parkPage(oak, glen, null, 'Mon Nov 16, 6:00 PM');
assert.doesNotMatch(glenHtml, /Watch the review/);
assert.doesNotMatch(glenHtml, /VideoObject/);
assert.doesNotMatch(glenHtml, /data-yt=/);

// attachVideos is idempotent.
const before = attached.map(p => p.video.videoId).sort().join(',');
attachVideos(located, entries);
assert.equal(located.filter(p => p.video).map(p => p.video.videoId).sort().join(','), before);
assert.ok(MATCH_KM <= 0.25);

// Old generic URLs get a canonical + refresh page so existing links keep working.
const shellRedirect = redirectPage('/skateparks/oakville/shell-park/', 'Shell Park Skate Park');
assert.match(shellRedirect, /rel="canonical" href="https:\/\/best\.skatepark\.day\/skateparks\/oakville\/shell-park\//);
assert.match(shellRedirect, /http-equiv="refresh" content="0;url=\/skateparks\/oakville\/shell-park\//);
assert.match(shellRedirect, /href="\/skateparks\/oakville\/shell-park\/"/);

// Friendly page slugs are unique within a city and do not collide with another park's slug.
for (const city of all) {
    const pageSlugs = city.parks.map(p => p.pageSlug);
    assert.equal(new Set(pageSlugs).size, pageSlugs.length, `page slugs unique in ${city.slug}`);
    for (const p of city.parks) {
        assert.ok(!city.parks.some(o => o !== p && o.slug === p.pageSlug), `page slug ${p.pageSlug} is free in ${city.slug}`);
    }
}

// Manual parks (not in OSM) are in the dataset and would not be dropped by a merge.
const manual = require('../data/manual-parks.json');
assert.ok(manual.parks.length >= 3);
for (const m of manual.parks) {
    const hit = located.find(p => Math.abs(p.lat - m.lat) < 1e-4 && Math.abs(p.lon - m.lon) < 1e-4);
    assert.ok(hit, `${m.n} is in the park list`);
    assert.equal(hit.city, m.c);
}

console.log(`park video mapping checks passed (${entries.length} videos, ${located.length} parks)`);
