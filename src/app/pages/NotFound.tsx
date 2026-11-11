export default function NotFound() {
  return <main id="main-content" className="grid min-h-screen place-content-center gap-6 bg-[var(--paper)] p-8 text-[var(--ink)]">
    <p className="label-mono">404 / Mevin Benty</p>
    <h1 className="text-5xl font-semibold">Page not found.</h1>
    <p>This address doesn’t match a page in the portfolio.</p>
    <a className="text-[var(--accent)] underline" href="/">Return to the portfolio</a>
    <a className="text-[var(--accent)] underline" href="/projects">Explore the projects</a>
  </main>;
}
