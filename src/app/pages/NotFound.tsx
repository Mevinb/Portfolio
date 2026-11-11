import { ArrowUpRight } from '../components/icons';

export default function NotFound() {
  return <main id="main-content" className="grid min-h-dvh bg-[var(--paper)] text-[var(--ink)] lg:grid-cols-[1.2fr_0.8fr]">
    <div className="hero-copy flex flex-col justify-center px-5 py-20 md:px-10">
      <p className="label-mono text-[var(--accent)]">404 / Mevin Benty</p>
      <h1 className="mt-6 text-6xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-8xl">Page not found.</h1>
      <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--ink-soft)]">This address doesn’t match a page in the portfolio. It may have moved, or the link was mistyped.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)] transition-transform active:scale-[0.97]" href="/">Return to the portfolio</a>
        <a className="group inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-strong)] px-6 text-sm font-semibold transition-colors hover:border-[var(--ink)]" href="/projects">Explore the projects <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
      </div>
    </div>
    <div className="relative hidden overflow-hidden bg-[var(--hero-panel)] lg:block" aria-hidden="true">
      <div className="absolute -right-16 top-1/4 h-72 w-72 rotate-12 border-[40px] border-[var(--signal)]" />
      <div className="absolute bottom-24 left-16 h-28 w-28 rounded-full bg-[var(--highlight)]" />
      <span className="absolute bottom-10 right-10 font-mono text-[11rem] font-semibold leading-none text-white/15">404</span>
    </div>
  </main>;
}
