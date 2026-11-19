#!/usr/bin/env node
// Shared site header actions, menu flyout and calendar popover.
// Home (index.html) and the pages built by build-pages.cjs both use this
// so the menu cannot drift. 404.html is checked against it in tests too.
'use strict';

const THEME_KEY = 'skatepark-theme';

function indent(html, n) {
    const pad = ' '.repeat(n);
    return html.trim().split('\n').map(line => (line ? pad + line : line)).join('\n');
}

function themeBootScript() {
    return `<script>(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>`;
}

function headerActionsHtml(pad, shareLabel) {
    const label = shareLabel || 'Share this page';
    return indent(`<div class="header-actions">
    <button type="button" id="page-share" class="hd-btn page-share" aria-label="${label}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="ic"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>
    <button type="button" class="hd-btn hamburger-menu" id="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-menu" aria-haspopup="dialog"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="ic"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg></button>
</div>`, pad || 0);
}

function menuAttrs(home) {
    return {
        forecast: home ? 'href="#top" data-menu="forecast"' : 'href="/#top"',
        about: home ? 'href="#about-heading" data-info="about-heading"' : 'href="/#about-heading"',
        faq: home ? 'href="#faq-heading" data-info="faq-heading"' : 'href="/#faq-heading"'
    };
}

function chromeHtml({ home, pad } = {}) {
    const a = menuAttrs(!!home);
    return indent(`<div class="cal-pop" id="cal-pop" role="dialog" aria-labelledby="cal-title" hidden>
    <p class="cal-title" id="cal-title">Skate days in your calendar</p>
    <p class="cal-park" id="cal-park">Finding the nearest park…</p>
    <p class="cal-note" id="cal-note" hidden></p>
    <div class="cal-actions">
        <a class="cal-btn primary" id="cal-subscribe" href="#">Subscribe</a>
        <a class="cal-btn" id="cal-download" href="#" download>Download .ics</a>
    </div>
    <p class="cal-help">Subscribing adds each week's best skate time and keeps it updated every 6 hours.</p>
</div>
<div class="flyout-backdrop" id="flyout-backdrop" hidden></div>
<aside class="flyout site-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" inert>
    <div class="flyout-head"><span class="kicker">Menu</span><button type="button" class="flyout-close" data-close aria-label="Close menu">&times;</button></div>
    <nav class="flyout-nav" aria-label="Site">
        <a ${a.forecast}><span class="menu-num">01</span>Forecast</a>
        <a ${a.about}><span class="menu-num">02</span>How it works</a>
        <a ${a.faq}><span class="menu-num">03</span>FAQ</a>
        <a href="/skateparks/"><span class="menu-num">04</span>Skate parks by city</a>
        <button type="button" class="menu-row cal-toggle" id="cal-toggle" aria-expanded="false" aria-controls="cal-pop" aria-haspopup="dialog"><span class="menu-num">05</span>Add to calendar</button>
        <button type="button" class="menu-row theme-toggle" id="theme-toggle" aria-label="Toggle dark or light theme"><span class="menu-num">06</span><span><span class="theme-toggle-label">Light</span> mode</span></button>
        <a href="https://github.com/LoganDunning/SkatePark.Day" target="_blank" rel="noopener noreferrer" class="github-icon"><span class="menu-num">07</span>Source on GitHub ↗</a>
        <a href="https://www.logandunning.com/" target="_blank" rel="noopener noreferrer" class="ld-logo" title="Lets Do Fun Things Everyday"><span class="menu-num">08</span>Logan Dunning ↗</a>
    </nav>
    <div class="flyout-foot">
        <button type="button" class="btn btn-solid flyout-login">Log in</button>
        <p>&copy; 2025–2026 Social Dunn Right Inc.</p>
    </div>
</aside>`, pad || 0);
}

function calAttrs(cal) {
    if (!cal) return '';
    const out = [];
    if (cal.slug) out.push(`data-cal-slug="${String(cal.slug).replace(/"/g, '&quot;')}"`);
    if (cal.name) out.push(`data-cal-name="${String(cal.name).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"`);
    if (cal.lat != null && cal.lon != null) {
        out.push(`data-cal-lat="${(+cal.lat).toFixed(5)}"`);
        out.push(`data-cal-lon="${(+cal.lon).toFixed(5)}"`);
    }
    if (cal.label) out.push(`data-cal-label="${String(cal.label).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"`);
    return out.length ? ' ' + out.join(' ') : '';
}

module.exports = { THEME_KEY, themeBootScript, headerActionsHtml, chromeHtml, menuAttrs, calAttrs };
