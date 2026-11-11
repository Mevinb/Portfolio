import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { render, renderSeo, PUBLIC_PATHS, SITE_URL, safeJson } from '../.prerender/entry-server.js';

const env = loadEnv('production', process.cwd(), 'VITE_');
const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--seo-head-->')) throw new Error('Missing SEO template marker');
let events = [];
if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY && !env.VITE_SUPABASE_URL.includes('placeholder')) {
  // Read only the already-public event fields, using the same anonymous access as the site.
  const url = new URL('/rest/v1/events', env.VITE_SUPABASE_URL);
  url.searchParams.set('select', 'id,title,description,event_date,location,role,image_url,tags,certificate_url,created_at');
  url.searchParams.set('order', 'event_date.desc');
  const response = await fetch(url, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Public event snapshot failed (${response.status}); refusing to publish an incomplete archive.`);
  events = await response.json();
  if (!Array.isArray(events)) throw new Error('Invalid public event snapshot');
} else {
  console.warn('Supabase is not configured: generating an empty event archive. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for production.');
}

for (const path of [...PUBLIC_PATHS, '/404', '/admin', '/admin/events']) {
  const admin = path.startsWith('/admin');
  let html = template.replace('<!--seo-head-->', renderSeo(path));
  // Only the home route uses the portrait above the fold.
  if (path !== '/') html = html.replace(/<link\s+rel="preload"[\s\S]*?\/>/, '');
  html = html.replace('<div id="root"></div>', admin
    ? '<div id="root"></div>'
    : `<div id="root" data-prerendered="true">${render(path, events)}</div>\n<script id="initial-events" type="application/json">${safeJson(events)}</script>`);
  const target = path === '/' ? 'dist/index.html' : `dist${path}.html`;
  await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  await writeFile(target, html);
  console.log(`Prerendered ${path}${admin ? ' (noindex client shell)' : ''}`);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_PATHS.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await rm('.prerender', { recursive: true, force: true });
console.log(`Static HTML contains ${events.length} public event records; event data still refreshes in the browser.`);
