import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const origin = 'https://www.mevin.tech';
const routes = ['/', '/projects', '/events'];
const titles = new Set();
const descriptions = new Set();
for (const path of routes) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
  const root = html.split('<div id="root"')[1];
  assert(root?.includes('data-prerendered="true"'), `${path}: missing prerender`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: expected one primary heading`);
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes(`rel="canonical" href="${origin}${path}"`), `${path}: wrong canonical`);
  assert(!html.includes('noindex'), `${path}: public route is not indexable`);
  assert(!html.includes('<!--seo-head-->'));
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const description = html.match(/name="description" content="([^"]+)"/)[1];
  assert(!titles.has(title)); titles.add(title);
  assert(!descriptions.has(description)); descriptions.add(description);
  const schema = JSON.parse(html.match(/<script id="structured-data" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(schema['@graph'].some((item) => item['@type'] === 'Person'));
  assert(schema['@graph'].some((item) => item['@type'] === (path === '/' ? 'ProfilePage' : 'CollectionPage')));
  assert(html.includes(`content="${origin}/mevin-portfolio-og.png"`));
  if (path === '/') {
    // Featured work must link to its archive entry in the static HTML, not only through a click handler.
    const featured = [...root.matchAll(/href="\/projects#([^"]+)"/g)].map((match) => match[1]);
    assert(featured.length >= 3, 'Homepage does not link to project archive entries');
    const archive = await readFile('dist/projects.html', 'utf8');
    for (const id of featured) assert(archive.includes(`<article id="${id}"`), `Homepage links to a missing archive entry: ${id}`);
  }
  if (path === '/projects') {
    const list = schema['@graph'].find((item) => item['@type'] === 'ItemList');
    assert(list.itemListElement.length > 0);
    assert.equal(list.numberOfItems, list.itemListElement.length);
    assert.equal((root.match(/<article[\s>]/g) || []).length, list.numberOfItems);
    for (const item of list.itemListElement) assert(root.includes(`id="${item.item.url.split('#')[1]}"`));
  }
  if (path === '/events') {
    const records = (root.match(/<article[\s>]/g) || []).length;
    assert(records > 0, 'Event archive is empty in static HTML');
    console.log(`Verified ${records} event records in static HTML`);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|images|certificates|resume)\/[^"#?]+)"/g)) await access(`dist${match[1]}`);
  console.log(`PASS ${path}: content, unique metadata, canonical, schema, assets`);
}
const missing = await readFile('dist/404.html', 'utf8');
assert(missing.includes('noindex'));
assert(!missing.includes('rel="canonical"'));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), routes.map((path) => origin + path));
const robots = await readFile('dist/robots.txt', 'utf8');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.equal(config.cleanUrls, true);
assert(!config.rewrites?.some((rule) => rule.source === '/(.*)'), 'Catch-all rewrite would cause soft 404s');
const png = await readFile('dist/mevin-portfolio-og.png');
assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
console.log('PASS sitemap, crawl rules, 404 exclusion, social image dimensions, Vercel route configuration');
