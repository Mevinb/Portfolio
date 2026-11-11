# SEO audit and maintenance

Audited September 5, 2026 and re-checked November 12, 2026 after the redesign and the move to a fully static site. Deployment and search-engine indexing are separate steps.

## Findings and fixes

| Area | Before | Implemented |
| --- | --- | --- |
| Initial HTML | Empty React root; portfolio depended on JavaScript and completing the intro | Build-time rendering of the actual public React pages, followed by hydration; intro overlays the mounted portfolio |
| Canonical host | `https://mevin.tech/`, which redirected permanently to `https://www.mevin.tech/` during the audit | All public canonicals, social URLs, entity identifiers, and sitemap URLs use the final `www` host |
| Public routes | Homepage metadata reused on `/projects` and `/events` | Unique titles, descriptions, canonical URLs, and structured data in each page’s original HTML; metadata follows client navigation |
| Projects | Dossiers opened through click handlers; discovery depended on rendering | All 11 projects in the initial archive HTML, stable fragment targets, and homepage title links to the archive entries |
| Events | API request required to show records | Event records are static data in `src/lib/events.ts`, rendered into the page HTML; certificates are served from the site itself |
| Social previews | Portrait used for a wide sharing card | Existing 1200×630 PNG, image dimensions, alternative text, and matching Open Graph/Twitter tags |
| Structured data | Person and WebSite only | Person, WebSite, homepage ProfilePage, archive CollectionPages, breadcrumbs, and a project ItemList of SoftwareSourceCode entries |
| Sitemap | Homepage only | All three public canonical pages |
| Missing URLs | Catch-all rewrite returned the homepage | Standard static files with Vercel clean URLs, no catch-all rewrite, and a custom noindex 404 page |

Content and schema use the portfolio’s existing claims and public records. No fabricated endorsements, review ratings, credentials, or traffic claims were added. The admin UI and its database were removed in November 2026; the site now has no backend.

## Build and maintain

```bash
npm run build
npm run check:seo
```

The build creates the browser bundle, a temporary server bundle, and then the static HTML in `dist/`. The temporary server bundle is removed after successful generation. The metadata source of truth is `src/lib/seo.ts`; project content remains in `src/lib/projects.ts`.

Production outputs include `index.html`, `projects.html`, `events.html`, and `404.html`. Vercel’s `cleanUrls` setting serves public routes without `.html`. Preserve the repository’s `vercel.json`; restoring a catch-all SPA rewrite would defeat the route-specific HTML and missing-page handling. Other static hosts need equivalent clean-URL and 404 configuration.

The build needs no environment variables or network access. Events are edited in `src/lib/events.ts`, with their certificate previews and PDFs in `public/certificates/`; redeploy after changing them.

## November 2026 re-check

- The redesign had replaced the homepage's project links with click handlers. Featured projects link to their archive entries in the static HTML again, and `check:seo` now fails if they do not.
- Section entrances moved from JavaScript to scroll-driven CSS, so prerendered content below the fold is no longer hidden by inline styles.
- Fonts are bundled with the site instead of requested from Google Fonts.
- `check:seo` also verifies that every certificate and résumé link in the HTML points at a file in the build.
- At the time of the re-check the deployed site still served the pre-September build: canonical URLs on the non-www host and HTTP 200 for unknown URLs. Both are fixed in this repository and take effect on deployment.

## Validation completed (September 2026)

- Production browser build and static generation passed, with 11 projects and 8 public event records in this snapshot.
- `npm run check:seo` passed: original HTML content, one primary heading per public page, unique metadata, canonical URLs, JSON-LD, local assets, sitemap, noindex exclusions, image dimensions, and hosting configuration.
- TypeScript passed for both browser and server entry points using `--noEmit --jsx react-jsx --moduleResolution bundler --module esnext --target es2022 --allowImportingTsExtensions --skipLibCheck --types vite/client`.
- Headless Chrome checked all three public routes with JavaScript enabled and disabled. Titles, canonicals, readable headings, and expected project/event counts passed.
- Browser interactions passed: project category filtering, client navigation, browser Back, mobile navigation at 390px, and first-visit cinematic intro skipping. No hydration, page, or browser-console errors were recorded.
- Mobile checks identified horizontal overflow from off-screen entry animations. The site shell now clips horizontal overflow while preserving sticky navigation; the retest passed.
- Desktop and mobile screenshots were inspected. `git diff --check` passed.

Live deployment headers, HTTP 404 behavior, search-engine indexing, field Core Web Vitals, and ranking improvements have not been verified or claimed. Browser QA used the local production preview. No production deployment or account submission was performed.

## Release and search registration

1. Deploy the `dist/` output to the existing site using `npm run build`, then run `npm run check:seo` in the build pipeline.
2. Confirm `/`, `/projects`, and `/events` return 200 with their own content and canonicals. Confirm a made-up URL returns HTTP 404 and the non-www domain still redirects to the www domain. Vercel headers and status codes need verification on the deployed host; Vite preview does not emulate all hosting behavior.
3. Verify the `mevin.tech` domain property in [Google Search Console](https://search.google.com/search-console/about) using the owner’s account and DNS access. Submit `https://www.mevin.tech/sitemap.xml` and inspect the three public URLs. No verification token was supplied or invented.
4. Use [Google’s Rich Results Test](https://search.google.com/test/rich-results) on the deployed homepage and archives, and inspect rendered HTML in Search Console. Schema validity does not guarantee a rich result.
5. Import the verified site into [Bing Webmaster Tools](https://www.bing.com/webmasters/about) and submit the same sitemap.
6. Keep the GitHub and LinkedIn profile website links pointed at the canonical site. Profile edits, account submissions, and deployment were not performed by this local SEO change.

## Building recognition over time

Use Search Console to establish an actual baseline of branded queries (Mevin Benty, Mevinb), impressions, clicks, and indexed pages. Compare equivalent 28-day periods; do not treat a handful of daily movements as evidence of a trend.

Publish a substantive project case study when there is enough evidence to help another developer: the problem, architecture, setup instructions, reproducible results, limitations, and source code. Start with Reactorv4, Story Teller, or MediaHub using real screenshots and measurements. Give each substantial case study its own URL when written, link it from the project archive and its repository README, and add it to the sitemap. The present patch keeps short project summaries together instead of creating numerous nearly empty pages.

Share useful releases and technical write-ups through your own profiles and relevant communities, following their rules. For each release, explain what changed and include a working example. Consistent public work and relevant links can build recognition; metadata alone cannot promise rankings or fame.

## References

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) — rendering, crawlable links, route metadata, and status codes.
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — consistent canonical signals.
- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) — crawlers must be able to access a page to read its noindex instruction.
- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page) — profile identity markup.
- [Vercel: project configuration](https://vercel.com/docs/project-configuration) — clean URLs, headers, and hosting configuration.
