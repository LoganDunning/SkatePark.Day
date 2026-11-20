// Builds a portrait PNG of the current forecast and shares or copies it
// together with the page link. No dependencies: the card is drawn on a
// <canvas> from forecast data, not captured from the DOM.
(function (root) {
    'use strict';

    var SITE = 'https://best.skatepark.day';
    var WIDTH = 780;
    var HEIGHT = 1688;
    var BRANDED_HEIGHT = 1000;
    var FILE_NAME = 'best-skatepark-day.png';
    var COLORS = {
        bg: '#0B0B0E',
        ink: '#F3F1EA',
        muted: '#A09E98',
        mid: '#6B6A65',
        line: '#222226',
        line2: '#2E2E33',
        sel: '#1A1A1E',
        accent: '#E8B55A',
        panel: '#141417'
    };
    var FONT = '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
    var PATH_B = 'M4 3v26h8.5a6.75 6.75 0 0 0 0-13.5H4M4 3h7.5a6.25 6.25 0 0 1 0 12.5';
    var PATH_D = 'M23 3v19M23 3h3a13 13 0 0 1 0 26h-1.5';
    var PATH_PIN = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z';
    // Same 24x24 strokes as the site's weather SVGs in app.js.
    var WX_ICONS = {
        sun: { circle: [12, 12, 4], paths: ['M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'] },
        partly: { paths: ['M8 3v1.5M3.5 8H5M4.8 4.8l1 1M11.2 4.8l-1 1', 'M5.6 10.6A3 3 0 1 1 10.9 7.6', 'M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.4 14 3 3 0 0 0 9 20z'] },
        cloud: { paths: ['M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 11 3.5 3.5 0 0 0 7 18z'] },
        fog: { paths: ['M4 9h16M3 13h18M5 17h14M8 21h8'] },
        drizzle: { paths: ['M7 15h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 8 3.5 3.5 0 0 0 7 15z', 'M9 18v1M13 18v1M17 18v1'] },
        rain: { paths: ['M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z', 'M8 17l-1 3M12 17l-1 3M16 17l-1 3'] },
        snow: { paths: ['M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z', 'M8 18h.01M12 20h.01M16 18h.01M10 22h.01M14 22h.01'] },
        storm: { paths: ['M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z', 'M12.5 14L10 18h4l-2.5 4'] }
    };
    var SCORE_SUFFIX = '/100';
    var SCORE_SUFFIX_GAP = 6;
    var FOOTER_GAP = 56;
    var FOOTER_BOTTOM = 48;

    function withUrl(text, url) {
        if (!url) return text || '';
        if (!text) return url;
        return text.indexOf(url) >= 0 ? text : text + '\n' + url;
    }

    function num(v) {
        var n = Math.round(Number(v));
        return isFinite(n) ? n : 0;
    }

    function textOf(el) {
        return el && el.textContent ? String(el.textContent).replace(/\s+/g, ' ').trim() : '';
    }

    function shortHour(h) {
        return (h % 12 === 0 ? 12 : h % 12) + (h < 12 ? 'am' : 'pm');
    }

    function dayName(app, index, longName) {
        if (index === 0) return 'Today';
        if (longName && index === 1) return 'Tomorrow';
        if (!app.days || !app.days[index] || !app.days[index].date) return '';
        return app.days[index].date.toLocaleDateString('en-US', { weekday: longName ? 'long' : 'short' });
    }

    function locationFromApp(app) {
        try {
            var pill = typeof document !== 'undefined' && document.getElementById && document.getElementById('location-pill-text');
            var pillText = textOf(pill);
            if (pillText && !/finding|loading/i.test(pillText)) return pillText;
        } catch (e) {}
        try { if (app.locationLabel) return app.locationLabel(); } catch (e) {}
        var l = app.location || {};
        return l.city ? [l.city, l.region].filter(Boolean).join(', ') : '';
    }

    function assembleForecast(fields) {
        fields = fields || {};
        return {
            kind: 'forecast',
            location: fields.location || '',
            heading: fields.heading || 'Best time to skate this week',
            dayName: fields.dayName || '',
            window: fields.window || '',
            score: num(fields.score),
            tempC: fields.tempC == null || fields.tempC === '' ? null : num(fields.tempC),
            condition: fields.condition || '',
            wind: fields.wind == null || fields.wind === '' ? null : num(fields.wind),
            rain: fields.rain == null || fields.rain === '' || Number(fields.rain) <= 0 ? null : Number(fields.rain),
            chartTitle: fields.chartTitle || '',
            hours: Array.isArray(fields.hours) ? fields.hours : [],
            week: Array.isArray(fields.week) ? fields.week : [],
            url: fields.url || SITE
        };
    }

    function assembleBranded(fields) {
        fields = fields || {};
        return {
            kind: 'branded',
            title: fields.title || 'best.skatepark.day',
            subtitle: fields.subtitle || 'Find the best day to skate this week',
            url: fields.url || SITE
        };
    }

    function assembleFromApp(app) {
        if (!app || !app.bestDay || !app.days || !app.days.length) {
            return assembleBranded({ title: 'best.skatepark.day', url: SITE + '/' });
        }
        var days = app.days;
        var bestIndex = days.indexOf(app.bestDay);
        if (bestIndex < 0) bestIndex = 0;
        var day = days[bestIndex];
        var win = app.bestWindow ? app.bestWindow(bestIndex) : null;
        var windowLabel = win && !win.none && app.longBlockLabel
            ? app.longBlockLabel(win.startHour, win.endHour)
            : win && win.reason ? win.reason : (win ? 'No time left today' : '');
        var name = app.dayLabel ? app.dayLabel(bestIndex) : dayName(app, bestIndex, true);
        var nowHour = new Date().getHours();
        var blocks = app.computeTimeBlocks ? app.computeTimeBlocks(day) : [];
        var hours = (blocks || []).map(function (b) {
            return {
                label: shortHour(b.startHour),
                score: num(b.score),
                best: !!(win && !win.none && b.startHour === win.startHour),
                past: bestIndex === 0 && b.endHour <= nowHour
            };
        });
        var week = days.map(function (d, i) {
            return {
                name: i === 0 ? 'Today' : d.date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.date.getDate(),
                temp: num(d.tempMax),
                condition: app.conditionText ? app.conditionText(d.weatherCode) : '',
                score: num(d.score),
                best: i === bestIndex,
                selected: i === bestIndex
            };
        });
        var cond = app.conditionText ? app.conditionText(day.weatherCode) : '';
        return assembleForecast({
            location: locationFromApp(app),
            heading: 'Best time to skate this week',
            dayName: name,
            window: windowLabel,
            score: day.score,
            tempC: day.tempMax,
            condition: cond,
            wind: day.maxHourlyWind,
            rain: day.precipitation,
            chartTitle: name + ', hour by hour',
            hours: hours,
            week: week,
            url: SITE
        });
    }

    function parseTemp(text) {
        var m = String(text || '').match(/(-?\d+)\s*°/);
        return m ? +m[1] : null;
    }

    function parseWxLine(wx) {
        var raw = textOf(wx);
        var tempEl = wx && wx.querySelector && wx.querySelector('.hl-temp');
        var tempC = parseTemp(textOf(tempEl) || raw);
        var wind = null;
        var rain = null;
        var condition = '';
        var wm = raw.match(/Wind\s+(-?\d+)\s*km\/h/i);
        if (wm) wind = +wm[1];
        var rm = raw.match(/Rain\s+([\d.]+)\s*mm/i);
        if (rm) rain = +rm[1];
        if (wx) {
            var parts = [];
            var nodes = wx.childNodes ? Array.prototype.slice.call(wx.childNodes) : [];
            nodes.forEach(function (node) {
                if (!node) return;
                if (node.classList && (node.classList.contains('hl-icon') || node.classList.contains('hl-temp'))) return;
                var t = textOf(node);
                if (!t || t === '·') return;
                if (/^Wind\s/i.test(t) || /^Rain\s/i.test(t)) return;
                parts.push(t);
            });
            condition = parts.join(' ').trim();
        }
        return { tempC: tempC, wind: wind, rain: rain, condition: condition };
    }

    function assembleFromPage(doc) {
        doc = doc || (typeof document !== 'undefined' ? document : null);
        if (!doc || !doc.querySelector) return null;
        var dayEl = doc.querySelector('.hl-day');
        var scoreEl = doc.querySelector('.hl-num b');
        if (!dayEl || !scoreEl) return null;
        var heading = textOf(doc.querySelector('.hl-label') || doc.querySelector('#forecast-heading'));
        var location = textOf(doc.querySelector('#location-pill-text'));
        if (!location || /finding|loading/i.test(location)) {
            location = textOf(doc.querySelector('h1'));
        }
        var wx = parseWxLine(doc.querySelector('.hl-wx'));
        var week = [];
        var rows = doc.querySelectorAll('.week-table tbody tr');
        if (rows && rows.length) {
            Array.prototype.forEach.call(rows, function (tr) {
                var scoreText = textOf(tr.querySelector('.row-score b') || tr.querySelector('.row-score'));
                var sm = String(scoreText).match(/-?\d+/);
                week.push({
                    name: textOf(tr.querySelector('.row-name')),
                    date: num(textOf(tr.querySelector('.row-date'))),
                    temp: parseTemp(textOf(tr.querySelector('.row-wx'))),
                    condition: '',
                    score: sm ? +sm[0] : 0,
                    best: !!(tr.classList && tr.classList.contains('best')),
                    selected: !!(tr.classList && tr.classList.contains('best'))
                });
            });
        }
        var pageUrl = SITE;
        try {
            if (doc.defaultView && doc.defaultView.location && doc.defaultView.location.href) pageUrl = doc.defaultView.location.href;
            else if (typeof location !== 'undefined' && location.href) pageUrl = location.href;
        } catch (e) {}
        return assembleForecast({
            location: location,
            heading: heading || 'Best time to skate this week',
            dayName: textOf(dayEl),
            window: textOf(doc.querySelector('.hl-time')),
            score: textOf(scoreEl),
            tempC: wx.tempC,
            condition: wx.condition,
            wind: wx.wind,
            rain: wx.rain,
            hours: [],
            week: week,
            url: pageUrl
        });
    }

    function cardForPage(doc) {
        return assembleFromPage(doc) || assembleBranded({
            title: (doc && (textOf(doc.querySelector && doc.querySelector('h1')) || doc.title)) || 'best.skatepark.day',
            subtitle: 'Find the best day to skate this week',
            url: (typeof location !== 'undefined' && location.href) || SITE
        });
    }

    function dataUrlToBlob(dataUrl) {
        var parts = String(dataUrl).split(',');
        var mime = (parts[0].match(/data:([^;]+)/) || [])[1] || 'image/png';
        var bin = atob(parts[1] || '');
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return new Blob([arr], { type: mime });
    }

    function fileFromBlob(blob, name) {
        try { return new File([blob], name || FILE_NAME, { type: 'image/png' }); }
        catch (e) { return blob; }
    }

    function roundRect(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function fitText(ctx, text, font, maxWidth) {
        ctx.font = font;
        var s = String(text || '');
        if (!s || ctx.measureText(s).width <= maxWidth) return s;
        var ell = '…';
        while (s.length && ctx.measureText(s + ell).width > maxWidth) s = s.slice(0, -1);
        return s + ell;
    }

    function wrapText(ctx, text, font, maxWidth, maxLines) {
        ctx.font = font;
        var words = String(text || '').split(/\s+/).filter(Boolean);
        var lines = [];
        var line = '';
        words.forEach(function (word) {
            var next = line ? line + ' ' + word : word;
            if (line && ctx.measureText(next).width > maxWidth) {
                lines.push(line);
                line = word;
            } else line = next;
        });
        if (line) lines.push(line);
        if (!lines.length) return [''];
        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            lines[maxLines - 1] = fitText(ctx, lines[maxLines - 1], font, maxWidth);
        }
        return lines.map(function (l) { return fitText(ctx, l, font, maxWidth); });
    }

    function fontSpec(weight, size) {
        return weight + ' ' + size + 'px ' + FONT;
    }

    function drawBdLogo(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = COLORS.ink;
        if (typeof Path2D === 'function') {
            ctx.lineWidth = 1.9;
            ctx.stroke(new Path2D(PATH_B));
            ctx.globalAlpha = 0.62;
            ctx.lineWidth = 1.1;
            ctx.stroke(new Path2D(PATH_D));
        } else {
            ctx.lineWidth = 2;
            ctx.strokeRect(4, 3, 14, 26);
        }
        ctx.restore();
    }

    function drawPin(ctx, x, y, size, color) {
        ctx.save();
        ctx.translate(x, y);
        var s = size / 24;
        ctx.scale(s, s);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (typeof Path2D === 'function') ctx.stroke(new Path2D(PATH_PIN));
        ctx.beginPath();
        ctx.arc(12, 10, 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    function iconKind(condition) {
        var c = String(condition || '').toLowerCase();
        if (/storm/.test(c)) return 'storm';
        if (/snow/.test(c)) return 'snow';
        if (/drizzle/.test(c)) return 'drizzle';
        if (/rain|shower/.test(c)) return 'rain';
        if (/fog/.test(c)) return 'fog';
        if (/cloud/.test(c) && /partly|mostly/.test(c)) return 'partly';
        if (/cloud/.test(c)) return 'cloud';
        if (/clear/.test(c)) return 'sun';
        return 'partly';
    }

    function drawWxIcon(ctx, x, y, size, condition) {
        var kind = iconKind(condition);
        var icon = WX_ICONS[kind] || WX_ICONS.partly;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 24, size / 24);
        ctx.strokeStyle = COLORS.muted;
        ctx.fillStyle = COLORS.muted;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (icon.circle) {
            ctx.beginPath();
            ctx.arc(icon.circle[0], icon.circle[1], icon.circle[2], 0, Math.PI * 2);
            ctx.stroke();
        }
        if (typeof Path2D === 'function') {
            (icon.paths || []).forEach(function (d) { ctx.stroke(new Path2D(d)); });
        } else if (icon.circle) {
            // Path2D unavailable: the circle already drawn is enough of a mark.
        } else {
            ctx.beginPath();
            ctx.arc(12, 12, 6, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    function weatherItems(card) {
        var items = [];
        if (card.tempC != null) items.push({ text: card.tempC + '°C', tone: 'ink', dot: false });
        if (card.condition) items.push({ text: card.condition, tone: 'muted', dot: false });
        if (card.wind != null) items.push({ text: 'Wind ' + card.wind + ' km/h', tone: 'muted', dot: items.length > 0 });
        if (card.rain != null) items.push({ text: 'Rain ' + card.rain + ' mm', tone: 'muted', dot: items.length > 0 });
        return items;
    }

    function weatherLine(card) {
        return weatherItems(card).map(function (item) { return item.text; });
    }

    // Right-aligned score + "/100", baseline-aligned, with a gap so the suffix
    // sits to the right of the numeral instead of on top of it.
    function scorePlacement(suffixWidth, gap, rightX) {
        gap = gap == null ? SCORE_SUFFIX_GAP : gap;
        return { scoreX: rightX - suffixWidth - gap, suffixX: rightX };
    }

    function forecastContentBottom(card) {
        var y = 52 + 110;
        if (card && card.location) y += 80 + 48;
        y += 44 + 186;
        if (weatherLine(card || {}).length) y += 64;
        if (card && card.hours && card.hours.length) y += 16 + 16 + 220 + 36;
        else y += 28;
        y += 28 + 24;
        y += ((card && card.week) || []).length * 80;
        return y;
    }

    function cardHeight(card) {
        if (!card || card.kind !== 'forecast') return BRANDED_HEIGHT;
        return forecastContentBottom(card) + FOOTER_GAP + FOOTER_BOTTOM;
    }

    function drawWordmark(ctx, x, y, size) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.ink;
        ctx.font = fontSpec('700', size);
        ctx.fillText('best', x, y);
        var w = ctx.measureText('best').width;
        ctx.fillStyle = COLORS.muted;
        ctx.font = fontSpec('400', size);
        ctx.fillText('.skatepark.day', x + w, y);
    }

    function drawCard(card) {
        card = card || assembleBranded({});
        var forecast = card.kind === 'forecast';
        var w = WIDTH;
        var h = cardHeight(card);
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, w, h);

        var pad = 56;
        var x = pad;
        var y = 52;
        var contentW = w - pad * 2;

        drawBdLogo(ctx, x, y, 2.15);
        drawWordmark(ctx, x + 104, y + 34, 26);
        y += 110;

        if (!forecast) {
            y += 80;
            ctx.fillStyle = COLORS.ink;
            ctx.font = fontSpec('600', 64);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            var titleLines = wrapText(ctx, card.title || 'best.skatepark.day', ctx.font, contentW, 3);
            titleLines.forEach(function (line, i) { ctx.fillText(line, x, y + i * 76); });
            y += titleLines.length * 76 + 20;
            ctx.fillStyle = COLORS.muted;
            ctx.font = fontSpec('400', 30);
            var sub = fitText(ctx, card.subtitle || '', ctx.font, contentW);
            if (sub) ctx.fillText(sub, x, y);
            ctx.fillStyle = COLORS.ink;
            ctx.font = fontSpec('400', 24);
            ctx.textBaseline = 'bottom';
            var footer = String(card.url || SITE).replace(/^https?:\/\//, '');
            var footLines = wrapText(ctx, footer, ctx.font, contentW, 2);
            footLines.forEach(function (line, i) {
                ctx.fillText(line, x, h - 56 + (i - (footLines.length - 1)) * 32);
            });
            return canvas;
        }

        if (card.location) {
            var pillH = 80;
            var pillPad = 28;
            ctx.font = fontSpec('400', 28);
            var loc = fitText(ctx, card.location, ctx.font, contentW - pillPad * 2 - 48);
            var locW = Math.min(contentW, ctx.measureText(loc).width + pillPad * 2 + 48);
            roundRect(ctx, x, y, locW, pillH, 40);
            ctx.strokeStyle = COLORS.line2;
            ctx.lineWidth = 2;
            ctx.stroke();
            drawPin(ctx, x + pillPad - 4, y + 16, 44, COLORS.muted);
            ctx.fillStyle = COLORS.ink;
            ctx.font = fontSpec('400', 28);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(loc, x + pillPad + 44, y + pillH / 2);
            y += pillH + 48;
        }

        ctx.fillStyle = COLORS.muted;
        ctx.font = fontSpec('400', 26);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(fitText(ctx, card.heading || 'Best time to skate this week', ctx.font, contentW), x, y);
        y += 44;

        var dayFont = fontSpec('600', 96);
        var timeFont = fontSpec('300', 56);
        ctx.font = dayFont;
        var dayText = fitText(ctx, card.dayName || '', dayFont, contentW * 0.62);
        ctx.font = timeFont;
        var timeText = fitText(ctx, card.window || '', timeFont, contentW * 0.62);

        ctx.fillStyle = COLORS.ink;
        ctx.font = dayFont;
        ctx.textBaseline = 'top';
        ctx.fillText(dayText, x, y);
        ctx.font = timeFont;
        ctx.fillText(timeText, x, y + 102);

        var score = String(num(card.score));
        var scoreFont = fontSpec('600', 96);
        var suffixFont = fontSpec('400', 28);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'alphabetic';
        ctx.font = scoreFont;
        var ascent = 76;
        try {
            var sm = ctx.measureText(score);
            if (sm && sm.actualBoundingBoxAscent) ascent = sm.actualBoundingBoxAscent;
        } catch (e) {}
        var scoreBase = y + ascent;
        ctx.font = suffixFont;
        var suffixW = ctx.measureText(SCORE_SUFFIX).width;
        var place = scorePlacement(suffixW, SCORE_SUFFIX_GAP, x + contentW);
        ctx.font = scoreFont;
        ctx.fillStyle = COLORS.accent;
        ctx.fillText(score, place.scoreX, scoreBase);
        ctx.fillStyle = COLORS.muted;
        ctx.font = suffixFont;
        ctx.fillText(SCORE_SUFFIX, place.suffixX, scoreBase);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        y += 186;

        var wx = weatherItems(card);
        if (wx.length) {
            drawWxIcon(ctx, x, y - 4, 40, card.condition);
            var wxX = x + 48;
            ctx.textBaseline = 'middle';
            ctx.font = fontSpec('400', 28);
            wx.forEach(function (item) {
                if (item.dot) {
                    ctx.fillStyle = COLORS.muted;
                    ctx.fillText('·', wxX, y + 18);
                    wxX += ctx.measureText('·').width + 14;
                }
                ctx.fillStyle = item.tone === 'ink' ? COLORS.ink : COLORS.muted;
                ctx.fillText(item.text, wxX, y + 18);
                wxX += ctx.measureText(item.text).width + 14;
            });
            y += 64;
        }

        if (card.hours && card.hours.length) {
            y += 16;
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = COLORS.muted;
            ctx.font = fontSpec('400', 24);
            ctx.textAlign = 'left';
            ctx.fillText(card.chartTitle || 'Hour by hour', x, y);
            ctx.textAlign = 'right';
            ctx.font = fontSpec('400', 20);
            ctx.fillText('100', x + contentW, y);
            ctx.textAlign = 'left';
            y += 16;
            ctx.strokeStyle = COLORS.line2;
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 8]);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + contentW, y);
            ctx.stroke();
            ctx.setLineDash([]);

            var chartH = 220;
            var labelH = 36;
            var gap = 16;
            var n = card.hours.length;
            var barW = (contentW - gap * (n - 1)) / n;
            card.hours.forEach(function (hour, i) {
                var bx = x + i * (barW + gap);
                var scoreH = Math.max(6, (Math.max(0, Math.min(100, num(hour.score))) / 100) * (chartH - 8));
                var by = y + (chartH - labelH - scoreH);
                if (hour.best) ctx.fillStyle = COLORS.accent;
                else if (hour.past) ctx.fillStyle = COLORS.line2;
                else ctx.fillStyle = COLORS.mid;
                roundRect(ctx, bx, by, barW, scoreH, 8);
                ctx.fill();
                ctx.fillStyle = hour.best ? COLORS.ink : COLORS.muted;
                ctx.font = fontSpec(hour.best ? '600' : '400', 22);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(hour.label, bx + barW / 2, y + chartH - 10);
            });
            ctx.textAlign = 'left';
            y += chartH + 36;
        } else {
            y += 28;
        }

        ctx.strokeStyle = COLORS.line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + contentW, y);
        ctx.stroke();
        y += 28;
        ctx.fillStyle = COLORS.muted;
        ctx.font = fontSpec('400', 24);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('This week', x, y);
        ctx.textAlign = 'right';
        ctx.font = fontSpec('400', 22);
        ctx.fillText('Score out of 100', x + contentW, y);
        ctx.textAlign = 'left';
        y += 24;

        var rows = card.week || [];
        var rowH = 80;
        var nameW = 150;
        rows.forEach(function (row) {
            if (row.selected || row.best) {
                ctx.fillStyle = COLORS.sel;
                roundRect(ctx, x - 16, y, contentW + 32, rowH, 16);
                ctx.fill();
            }
            var midY = y + rowH / 2;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = COLORS.ink;
            ctx.font = fontSpec(row.selected ? '700' : '500', 28);
            ctx.fillText(row.name, x, midY);
            ctx.fillStyle = COLORS.muted;
            ctx.font = fontSpec('400', 26);
            ctx.fillText(String(row.date != null ? row.date : ''), x + nameW - 36, midY);
            if (row.best && !row.selected) {
                ctx.beginPath();
                ctx.fillStyle = COLORS.accent;
                ctx.arc(x + nameW - 10, midY - 12, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            if (row.condition) drawWxIcon(ctx, x + nameW + 8, midY - 18, 36, row.condition);
            var tempX = x + nameW + (row.condition ? 50 : 8);
            ctx.fillStyle = COLORS.muted;
            ctx.font = fontSpec('400', 26);
            ctx.textAlign = 'left';
            if (row.temp != null && row.temp !== '') ctx.fillText(num(row.temp) + '°', tempX, midY);

            var scoreText = String(num(row.score));
            ctx.font = fontSpec(row.selected ? '700' : '600', 28);
            ctx.textAlign = 'right';
            ctx.fillStyle = row.selected ? COLORS.accent : (num(row.score) < 30 ? COLORS.muted : COLORS.ink);
            ctx.fillText(scoreText, x + contentW, midY);
            var sw = ctx.measureText(scoreText).width;
            ctx.textAlign = 'left';

            var barX = x + nameW + 130;
            var barR = x + contentW - sw - 24;
            var barW2 = barR - barX;
            if (barW2 > 40) {
                ctx.fillStyle = row.selected ? COLORS.line2 : COLORS.line;
                roundRect(ctx, barX, midY - 6, barW2, 12, 6);
                ctx.fill();
                var fillW = Math.max(4, barW2 * (Math.max(0, Math.min(100, num(row.score))) / 100));
                ctx.fillStyle = row.selected ? COLORS.accent : COLORS.mid;
                roundRect(ctx, barX, midY - 6, fillW, 12, 6);
                ctx.fill();
            }
            y += rowH;
        });

        ctx.fillStyle = COLORS.ink;
        ctx.font = fontSpec('400', 24);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        var footer = String(card.url || SITE).replace(/^https?:\/\//, '');
        ctx.fillText(fitText(ctx, footer, ctx.font, contentW), x, h - 48);
        return canvas;
    }

    function snapshotPng(card) {
        return drawCard(card).toDataURL('image/png');
    }

    function snapshotFile(card) {
        var dataUrl = snapshotPng(card);
        return fileFromBlob(dataUrlToBlob(dataUrl), FILE_NAME);
    }

    function canShareFilesWith(canShare, file) {
        if (!file || !canShare) return false;
        try { return !!canShare({ files: [file] }); }
        catch (e) { return false; }
    }

    function htmlForClipboard(url, dataUrl) {
        var safeUrl = String(url || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        var img = dataUrl ? '<img src="' + dataUrl + '" alt="Skate forecast" width="390">' : '';
        return '<div>' + img + (img ? '<br>' : '') + '<a href="' + safeUrl + '">' + safeUrl + '</a></div>';
    }

    function blobOf(type, text) {
        return new Blob([text], { type: type });
    }

    // Build the object passed to navigator.share.
    // iOS iMessage unfurls both the `url` field and any URL inside `text`,
    // which produced two identical preview cards. For file shares, put the
    // URL in `text` once and omit `url`. If the platform rejects that shape,
    // fall back to `url` plus URL-free `text` — still one occurrence.
    function shareFields(payload, mode) {
        payload = payload || {};
        var title = payload.title || 'best.skatepark.day';
        var url = payload.url || '';
        var text = payload.text || '';
        var file = payload.file || null;
        var data = { title: title };
        if (mode === 'files-url') {
            data.text = text;
            if (url) data.url = url;
        } else {
            data.text = withUrl(text, url);
        }
        if (file && mode !== 'text') data.files = [file];
        return data;
    }

    async function shareOrCopy(payload, env) {
        env = env || {};
        var title = payload.title || 'best.skatepark.day';
        var url = payload.url || '';
        var text = withUrl(payload.text || '', url);
        var file = payload.file || null;
        var dataUrl = payload.dataUrl || '';
        var toast = env.toast || function () {};
        var share = env.share;
        var canShare = env.canShare;
        var writeClipboard = env.writeClipboard;
        var writeText = env.writeText;
        var execCopy = env.execCopy;
        var ClipboardItemCtor = env.ClipboardItem || (typeof ClipboardItem === 'function' ? ClipboardItem : null);

        if (file && share && canShareFilesWith(canShare, file)) {
            var modes = ['files-text', 'files-url'];
            for (var mi = 0; mi < modes.length; mi++) {
                var data = shareFields(payload, modes[mi]);
                var allowed = true;
                if (canShare) {
                    try { allowed = !!canShare(data); }
                    catch (e) { allowed = false; }
                }
                if (!allowed) continue;
                try {
                    await share(data);
                    return { method: 'share-files', fields: data };
                } catch (err) {
                    if (err && err.name === 'AbortError') return { method: 'aborted' };
                }
            }
        }

        if (writeClipboard && ClipboardItemCtor && file) {
            var typeMap = {
                'image/png': Promise.resolve(file),
                'text/plain': Promise.resolve(blobOf('text/plain', url || text)),
                'text/html': Promise.resolve(blobOf('text/html', htmlForClipboard(url, dataUrl)))
            };
            var attempts = [
                typeMap,
                { 'image/png': typeMap['image/png'], 'text/plain': typeMap['text/plain'] },
                { 'image/png': typeMap['image/png'] }
            ];
            for (var i = 0; i < attempts.length; i++) {
                try {
                    await writeClipboard([new ClipboardItemCtor(attempts[i])]);
                    toast('Link and snapshot copied');
                    return { method: 'clipboard-image' };
                } catch (e) {}
            }
        }

        var copied = false;
        var full = text || url;
        if (writeText) {
            try { await writeText(full); copied = true; } catch (e) {}
        }
        if (!copied && execCopy) {
            try { copied = !!execCopy(full); } catch (e) {}
        }
        toast(copied ? 'Copied to clipboard' : 'Could not copy');
        return { method: copied ? 'clipboard-text' : 'failed' };
    }

    function execCommandCopy(text) {
        if (typeof document === 'undefined') return false;
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        ta.remove();
        return ok;
    }

    async function share(payload, env) {
        payload = payload || {};
        env = env || {};
        var card = payload.card;
        var file = payload.file || null;
        var dataUrl = payload.dataUrl || '';
        if (!file && card) {
            try {
                dataUrl = snapshotPng(card);
                file = fileFromBlob(dataUrlToBlob(dataUrl), FILE_NAME);
            } catch (e) {
                file = null;
                dataUrl = '';
            }
        }
        var nav = env.navigator || (typeof navigator !== 'undefined' ? navigator : {});
        return shareOrCopy({
            title: payload.title,
            text: payload.text,
            url: payload.url,
            file: file,
            dataUrl: dataUrl
        }, {
            toast: env.toast,
            share: env.share || (nav.share ? function (data) { return nav.share(data); } : null),
            canShare: env.canShare || (nav.canShare ? function (data) { return nav.canShare(data); } : null),
            writeClipboard: env.writeClipboard || (nav.clipboard && nav.clipboard.write ? function (items) { return nav.clipboard.write(items); } : null),
            writeText: env.writeText || (nav.clipboard && nav.clipboard.writeText ? function (t) { return nav.clipboard.writeText(t); } : null),
            execCopy: env.execCopy || execCommandCopy,
            ClipboardItem: env.ClipboardItem
        });
    }

    var api = {
        SITE: SITE,
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        FILE_NAME: FILE_NAME,
        COLORS: COLORS,
        withUrl: withUrl,
        shareFields: shareFields,
        scorePlacement: scorePlacement,
        weatherItems: weatherItems,
        cardHeight: cardHeight,
        assembleForecast: assembleForecast,
        assembleBranded: assembleBranded,
        assembleFromApp: assembleFromApp,
        assembleFromPage: assembleFromPage,
        cardForPage: cardForPage,
        drawCard: drawCard,
        snapshotPng: snapshotPng,
        snapshotFile: snapshotFile,
        dataUrlToBlob: dataUrlToBlob,
        canShareFilesWith: canShareFilesWith,
        shareOrCopy: shareOrCopy,
        share: share,
        htmlForClipboard: htmlForClipboard
    };

    if (typeof module === 'object' && module.exports) module.exports = api;
    root.ShareSnapshot = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
