import { PROJECTS } from './projects';

// Matches the production host after its permanent redirect.
export const SITE_URL = 'https://www.mevin.tech';
export const PUBLIC_PATHS = ['/', '/projects', '/events'];
const personId = `${SITE_URL}/#mevin`;
const websiteId = `${SITE_URL}/#website`;

export function getSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const pages: Record<string, { title: string; description: string; type: string; name: string }> = {
    '/': {
      title: 'Mevin Benty | AI Systems & Software Developer in Kerala',
      description: 'Meet Mevin Benty, a software developer in Thrissur, Kerala building computer vision pipelines, local AI tools, secure backends, and open-source software.',
      type: 'ProfilePage', name: 'Mevin Benty',
    },
    '/projects': {
      title: 'AI, Security & Web Projects | Mevin Benty',
      description: 'Explore Mevin Benty’s open-source projects: ComfyUI face restoration, local AI assistants, voice conversion, security tools, and full-stack web apps.',
      type: 'CollectionPage', name: 'Projects',
    },
    '/events': {
      title: 'Events, Workshops & Certifications | Mevin Benty',
      description: 'Explore Mevin Benty’s conferences, workshops, certifications, and community activities, with participation records and supporting certificates.',
      type: 'CollectionPage', name: 'Events and certifications',
    },
  };
  const page = pages[path];
  const url = `${SITE_URL}${path}`;
  const title = page?.title ?? (path.startsWith('/admin') ? 'Admin | Mevin Benty' : 'Page Not Found | Mevin Benty');
  const description = page?.description ?? 'Return to Mevin Benty’s portfolio to explore projects and public activities.';
  const graph: Record<string, unknown>[] = page ? [
    {
      '@type': 'Person', '@id': personId, name: 'Mevin Benty', alternateName: 'Mevinb',
      url: `${SITE_URL}/`, image: `${SITE_URL}/images/mevin-portrait.jpg`,
      description: pages['/'].description, jobTitle: 'Software Developer & Engineering Student',
      homeLocation: { '@type': 'Place', name: 'Thrissur, Kerala, India' },
      knowsAbout: ['Computer vision', 'Generative AI', 'Python', 'PyTorch', 'ComfyUI', 'Backend development', 'Linux', 'Cybersecurity'],
      sameAs: ['https://github.com/Mevinb', 'https://www.linkedin.com/in/mevin-benty-17305a322'],
    },
    {
      '@type': 'WebSite', '@id': websiteId, url: `${SITE_URL}/`, name: 'Mevin Benty',
      alternateName: 'Mevin Benty Portfolio', inLanguage: 'en', publisher: { '@id': personId },
    },
    {
      '@type': page.type, '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'en',
      isPartOf: { '@id': websiteId }, about: { '@id': personId },
      ...(path === '/' ? { mainEntity: { '@id': personId } } : { breadcrumb: { '@id': `${url}#breadcrumb` } }),
      ...(path === '/projects' ? { mainEntity: { '@id': `${url}#projects` } } : {}),
    },
  ] : [];
  if (page && path !== '/') graph.push({
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Mevin Benty', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.name, item: url },
    ],
  });
  if (path === '/projects') graph.push({
    '@type': 'ItemList', '@id': `${url}#projects`, name: 'Open-source projects by Mevin Benty',
    numberOfItems: PROJECTS.length,
    itemListElement: PROJECTS.map((project, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode', '@id': `${url}#${project.id}`, url: `${url}#${project.id}`,
        name: project.title, description: project.description, codeRepository: project.url,
        keywords: project.tags.join(', '), author: { '@id': personId },
      },
    })),
  });
  return {
    title, description, url, indexable: Boolean(page),
    robots: page ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow',
    image: `${SITE_URL}/mevin-portfolio-og.png`, imageAlt: 'Mevin Benty — software developer, AI pipelines, secure systems, and open-source tools',
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function renderSeo(path: string) {
  const seo = getSeo(path);
  const meta = (attribute: string, key: string, value: string) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta('name', 'description', seo.description), meta('name', 'author', 'Mevin Benty'), meta('name', 'robots', seo.robots),
    ...(seo.indexable ? [`<link rel="canonical" href="${seo.url}" />`] : []),
    meta('property', 'og:type', 'website'), meta('property', 'og:site_name', 'Mevin Benty'), meta('property', 'og:locale', 'en_IN'),
    meta('property', 'og:title', seo.title), meta('property', 'og:description', seo.description), meta('property', 'og:url', seo.url),
    meta('property', 'og:image', seo.image), meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:width', '1200'), meta('property', 'og:image:height', '630'), meta('property', 'og:image:alt', seo.imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'), meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description), meta('name', 'twitter:image', seo.image), meta('name', 'twitter:image:alt', seo.imageAlt),
    `<script id="structured-data" type="application/ld+json">${safeJson(seo.structuredData)}</script>`,
  ].join('\n    ');
}
