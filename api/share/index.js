const fs = require('node:fs');
const path = require('node:path');
const { SITE, parseShare, renderShareHtml } = require('./meta');

// index.html is copied next to this file at deploy time (see the Static Web Apps workflow).
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
let template = null;
let templateAt = 0;

// Previews always point at production, except on this app's own preview environments.
function originFor(req) {
    const host = String((req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '').split(',')[0].trim().toLowerCase();
    return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.azurestaticapps\.net$/.test(host) ? `https://${host}` : SITE;
}

async function loadTemplate(origin) {
    if (template && Date.now() - templateAt < 10 * 60 * 1000) return template;
    try {
        template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    } catch (e) {
        const r = await fetch(`${origin}/index.html`, { headers: { accept: 'text/html' } });
        if (!r.ok) throw new Error(`index.html ${r.status}`);
        template = await r.text();
    }
    templateAt = Date.now();
    return template;
}

module.exports = async function (context, req) {
    const origin = originFor(req);
    let body;
    try {
        body = renderShareHtml(await loadTemplate(origin), parseShare(req.query), origin);
    } catch (error) {
        context.log.error('share preview failed', error);
        context.res = { status: 302, headers: { location: '/', 'cache-control': 'no-store' } };
        return;
    }
    context.res = {
        status: 200,
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
        },
        body: req.method === 'HEAD' ? '' : body,
    };
};
