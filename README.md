
# Professional Portfolio Website

Portfolio site for Mevin Benty, built with React, Vite, Motion, and Tailwind CSS.

## Development

Install dependencies:

```bash
npm install
```

Start local development server:

```bash
npm run dev
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The deployable output is generated in the `dist/` folder.

## Deploy

Deploy the `dist/` output from `npm run build`. The included `vercel.json` configures clean URLs, crawler headers, and static missing-page handling for Vercel. Other hosts need equivalent routing; do not use a catch-all rewrite to the homepage.

## SEO

Public pages are rendered to HTML during the build and hydrated in the browser. Page metadata and structured data live in `src/lib/seo.ts`.

Validate a production build:

```bash
npm run check:seo
```

See [the SEO audit and maintenance guide](docs/SEO.md) for findings, build requirements, deployment checks, and search registration steps.

## Content

The site is fully static, with no backend. Projects live in `src/lib/projects.ts` and events in `src/lib/events.ts`. To add an event, put its certificate preview and PDF in `public/certificates/`, add a record to `events.ts`, and redeploy.
