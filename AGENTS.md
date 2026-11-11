# Working in this repo

Portfolio site for Mevin Benty: React 19, Vite, Tailwind v4, Motion, three.js (intro only). Public routes are prerendered at build time and hydrated.

## Verify a change

```bash
npm run typecheck   # tsc, strict
npm run build       # client build, SSR build, then scripts/prerender.mjs
npm run check:seo   # asserts on the prerendered dist/ output
```

- `npm run build` fetches public events from Supabase and fails closed if the request fails. To build without it (empty event archive), run `VITE_SUPABASE_URL= npm run build`.
- `check:seo` requires exactly one `<h1>` per public page, and on `/projects` one `<article>` per project whose `id` matches the project id.

## Conventions

- Icons: import from `src/app/components/icons.ts` only; it maps the names used in components onto Tabler icons.
- Colours, fonts and focus rings are tokens in `src/styles/theme.css`. Do not hard-code hex values in components. Blue (`--accent`) is the only interactive colour; red and yellow are structural.
- Scroll entrances use the `reveal` / `reveal-side` classes (scroll-driven CSS), not Motion's `whileInView`, so prerendered content is visible without JS.
- Page links use React Router `<Link viewTransition>`; links to home-page sections (`/#work`) are plain anchors.
- The intro's pacing lives in `src/app/components/cinematicTimeline.ts`, which must not import `three`. three.js stays inside the lazy `CinematicScene` chunk.
- Commits are authored as the repo owner, with no AI co-author or "generated with" lines.
