import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { render, renderSeo, PUBLIC_PATHS, SITE_URL } from '../.prerender/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--seo-head-->')) throw new Error('Missing SEO template marker');

for (const path of [...PUBLIC_PATHS, '/404']) {
  let html = template.replace('<!--seo-head-->', renderSeo(path));
  // Only the home route uses the portrait above the fold.
  if (path !== '/') html = html.replace(/<link\s+rel="preload"[\s\S]*?\/>/, '');
  html = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${render(path)}</div>`);
  const target = path === '/' ? 'dist/index.html' : `dist${path}.html`;
  await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  await writeFile(target, html);
  console.log(`Prerendered ${path}`);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_PATHS.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
await rm('.prerender', { recursive: true, force: true });
