// Shared menu, theme, share and calendar popover for static pages.
// The home forecast app keeps its own handlers in app.js; this file is
// loaded on city, park, hub and 404 pages that use the same markup.
(function () {
    'use strict';
    var THEME_KEY = 'skatepark-theme';

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function initTheme() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var lbl = btn.querySelector('.theme-toggle-label');
        function sync() {
            var t = currentTheme();
            if (lbl) lbl.textContent = t === 'dark' ? 'Light' : 'Dark';
        }
        btn.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
            sync();
        });
        sync();
    }

    function showToast(msg) {
        var t = document.getElementById('toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            t.className = 'toast';
            t.setAttribute('role', 'status');
            t.setAttribute('aria-live', 'polite');
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(function () { t.classList.remove('show'); }, 2200);
    }

    function initShare() {
        var btn = document.getElementById('page-share');
        if (!btn) return;
        btn.addEventListener('click', async function () {
            var title = document.title || 'best.skatepark.day';
            var desc = document.querySelector('meta[name="description"]');
            var data = { title: title, text: (desc && desc.content) || title, url: location.href };
            if (navigator.share) {
                try { await navigator.share(data); return; }
                catch (err) { if (err && err.name === 'AbortError') return; }
            }
            try {
                await navigator.clipboard.writeText(data.url);
                showToast('Copied to clipboard');
            } catch (e) {
                var ta = document.createElement('textarea');
                ta.value = data.url;
                document.body.appendChild(ta);
                ta.select();
                var ok = false;
                try { ok = document.execCommand('copy'); } catch (err) {}
                ta.remove();
                showToast(ok ? 'Copied to clipboard' : 'Could not copy');
            }
        });
    }

    var Flyouts = {
        current: null,
        opener: null,

        init: function () {
            var self = this;
            var backdrop = document.getElementById('flyout-backdrop');
            if (backdrop) backdrop.onclick = function () { self.close(); };
            var toggle = document.getElementById('menu-toggle');
            if (toggle) toggle.onclick = function () { self.isOpen('site-menu') ? self.close() : self.open('site-menu', toggle); };
            document.querySelectorAll('.flyout [data-close]').forEach(function (b) {
                b.addEventListener('click', function () { self.close(); });
            });
            document.querySelectorAll('#site-menu a').forEach(function (a) {
                a.addEventListener('click', function () { self.close(false); });
            });
            document.addEventListener('keydown', function (e) {
                if (!self.current) return;
                if (e.key === 'Escape') { e.preventDefault(); self.close(); return; }
                if (e.key !== 'Tab') return;
                var items = Array.prototype.slice.call(self.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(function (el) {
                    return el.offsetParent !== null || el === document.activeElement;
                });
                if (!items.length) return;
                var first = items[0], last = items[items.length - 1];
                if (e.shiftKey && (document.activeElement === first || !self.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && (document.activeElement === last || !self.current.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
            });
        },

        isOpen: function (id) { return !!this.current && this.current.id === id; },

        open: function (id, opener) {
            var panel = document.getElementById(id);
            if (!panel) return;
            if (this.current && this.current !== panel) this.close(false, true);
            var backdrop = document.getElementById('flyout-backdrop');
            this.opener = opener || document.activeElement;
            this.current = panel;
            panel.inert = false;
            panel.removeAttribute('inert');
            if (backdrop) { backdrop.hidden = false; void backdrop.offsetWidth; backdrop.classList.add('open'); }
            panel.classList.add('open');
            document.documentElement.classList.add('flyout-lock');
            var toggle = document.getElementById('menu-toggle');
            var header = document.querySelector('.site-header');
            if (toggle) {
                toggle.setAttribute('aria-expanded', String(id === 'site-menu'));
                if (header) header.classList.toggle('menu-open', id === 'site-menu');
            }
            var focusTarget = panel.querySelector('.flyout-close');
            setTimeout(function () { if (focusTarget) focusTarget.focus({ preventScroll: true }); }, 30);
        },

        close: function (restoreFocus, switching) {
            if (restoreFocus === undefined) restoreFocus = true;
            var panel = this.current;
            if (!panel) return;
            var self = this;
            panel.classList.remove('open');
            panel.inert = true;
            panel.setAttribute('inert', '');
            this.current = null;
            var toggle = document.getElementById('menu-toggle');
            var header = document.querySelector('.site-header');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                if (header) header.classList.remove('menu-open');
            }
            if (switching) return;
            var backdrop = document.getElementById('flyout-backdrop');
            if (backdrop) {
                backdrop.classList.remove('open');
                setTimeout(function () { if (!self.current) backdrop.hidden = true; }, 260);
            }
            document.documentElement.classList.remove('flyout-lock');
            if (restoreFocus && this.opener && this.opener.focus) this.opener.focus({ preventScroll: true });
        }
    };

    function distanceKm(a, b) {
        var R = 6371, toRad = function (d) { return d * Math.PI / 180; };
        var dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
        var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    var CalendarFeed = {
        init: function () {
            var self = this;
            this.btn = document.getElementById('cal-toggle');
            this.pop = document.getElementById('cal-pop');
            if (!this.btn || !this.pop) return;
            this.btn.addEventListener('click', function () { self.pop.hidden ? self.open() : self.close(); });
            document.addEventListener('click', function (e) {
                if (!self.pop.hidden && !self.pop.contains(e.target) && !self.btn.contains(e.target)) self.close(false);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && !self.pop.hidden) { e.stopPropagation(); self.close(); }
            }, true);
        },

        feeds: function () {
            if (!this.list) {
                this.list = fetch('/cal/index.json', { cache: 'no-cache' })
                    .then(function (r) { return r.ok ? r.json() : null; })
                    .then(function (d) { return d && Array.isArray(d.feeds) ? d.feeds : []; })
                    .catch(function () { return []; });
            }
            return this.list;
        },

        open: function () {
            var self = this;
            if (Flyouts.isOpen('site-menu')) Flyouts.close(false);
            this.pop.hidden = false;
            this.btn.setAttribute('aria-expanded', 'true');
            this.update().then(function () {
                var first = self.pop.querySelector('.cal-btn:not([hidden])');
                if (first && !self.pop.hidden) first.focus();
            });
        },

        close: function (restoreFocus) {
            if (restoreFocus === undefined) restoreFocus = true;
            this.pop.hidden = true;
            this.btn.setAttribute('aria-expanded', 'false');
            if (restoreFocus) {
                var back = (this.btn.offsetParent ? this.btn : document.getElementById('menu-toggle'));
                if (back) back.focus();
            }
        },

        pickFrom: function (feeds, from) {
            var feed = null, km = Infinity;
            for (var i = 0; i < feeds.length; i++) {
                var d = distanceKm(from, feeds[i]);
                if (d < km) { km = d; feed = feeds[i]; }
            }
            return { feed: feed, km: km };
        },

        update: function () {
            var park = document.getElementById('cal-park');
            var note = document.getElementById('cal-note');
            var sub = document.getElementById('cal-subscribe');
            var dl = document.getElementById('cal-download');
            var body = document.body;
            var slug = body.getAttribute('data-cal-slug');
            var name = body.getAttribute('data-cal-name');
            var lat = parseFloat(body.getAttribute('data-cal-lat'));
            var lon = parseFloat(body.getAttribute('data-cal-lon'));
            var label = body.getAttribute('data-cal-label');

            function show(feed, extraNote) {
                if (!feed) {
                    park.textContent = extraNote || 'Calendar feeds aren\'t available right now.';
                    note.hidden = true;
                    sub.hidden = dl.hidden = true;
                    return;
                }
                park.textContent = feed.name;
                if (extraNote) { note.hidden = false; note.textContent = extraNote; }
                else note.hidden = true;
                var path = '/cal/' + feed.slug + '.ics';
                sub.href = 'webcal://' + location.host + path;
                dl.href = path;
                dl.setAttribute('download', feed.slug + '.ics');
                sub.hidden = dl.hidden = false;
            }

            return this.feeds().then(function (feeds) {
                if (slug) {
                    var match = null;
                    for (var i = 0; i < feeds.length; i++) if (feeds[i].slug === slug) { match = feeds[i]; break; }
                    show(match || { slug: slug, name: name || slug });
                    return;
                }
                var from = (isFinite(lat) && isFinite(lon)) ? { lat: lat, lon: lon } : null;
                if (!from) {
                    try {
                        var saved = JSON.parse(localStorage.getItem('skatepark-location') || 'null');
                        if (saved && saved.lat != null && saved.lon != null) {
                            from = saved;
                            label = label || [saved.city, saved.region].filter(Boolean).join(', ') || 'your location';
                        }
                    } catch (e) {}
                }
                if (!feeds.length) { show(null, 'Calendar feeds aren\'t available right now.'); return; }
                if (!from) {
                    park.textContent = 'Open a park page to add its calendar, or use the live forecast.';
                    note.hidden = true;
                    sub.hidden = dl.hidden = true;
                    return;
                }
                var picked = CalendarFeed.pickFrom(feeds, from);
                var exact = picked.km < 0.3;
                var place = label || name || 'this place';
                var away = picked.km < 10 ? picked.km.toFixed(1) : Math.round(picked.km);
                show(picked.feed, exact ? '' : 'No feed for ' + place + ' itself, so this is the nearest park\'s feed (' + away + ' km away).');
            });
        }
    };

    onReady(function () {
        initTheme();
        initShare();
        Flyouts.init();
        CalendarFeed.init();
    });
})();
