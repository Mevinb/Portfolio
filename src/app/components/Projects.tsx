import { Link } from 'react-router';
import { ArrowUpRight, GithubLogo } from './icons';
import { Blueprint } from './Blueprint';
import { ProjectDossier, useDossier } from './ProjectDossier';
import { PROJECTS } from '../../lib/projects';

const FEATURED = PROJECTS.filter((project) => project.featured);
// The lead slot goes to the first featured project that has a pipeline to show.
const LEAD = FEATURED.find((project) => project.architecture) ?? FEATURED[0];
const INDEX = FEATURED.filter((project) => project !== LEAD);

export function Projects() {
  const dossier = useDossier();

  return (
    <section id="work" className="scroll-mt-[72px] border-b border-[var(--line)] bg-[var(--project-wash)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="reveal max-w-3xl">
          <p className="label-mono text-[var(--accent)]">Project dossiers</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.05em] md:text-6xl">Repositories grouped by the systems they prove.</h2>
        </div>

        <article className="reveal mt-12 grid border border-[var(--line-strong)] bg-[var(--card)] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-between gap-10 border-b border-[var(--line)] p-6 md:p-10 lg:border-b-0 lg:border-r">
            <div>
              <p className="label-mono flex items-center gap-3 text-[var(--accent)]"><span className="h-2 w-2 bg-[var(--signal)]" aria-hidden="true" />Lead dossier / {LEAD.category}</p>
              <h3 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-7xl"><a href={`/projects#${LEAD.id}`} className="transition-colors hover:text-[var(--accent)]">{LEAD.title}</a></h3>
              <p className="mt-3 text-lg font-medium text-[var(--accent)]">{LEAD.tagline}</p>
              <p className="mt-6 max-w-[46ch] leading-relaxed text-[var(--ink-soft)]">{LEAD.description}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-5">
              <ul className="flex flex-wrap gap-2">{LEAD.tags.map((tag) => <li key={tag} className="border border-[var(--line)] px-2 py-1 font-mono text-[10px] text-[var(--ink-faint)]">{tag}</li>)}</ul>
              <a href={LEAD.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)]">Repository <GithubLogo size={16} /></a>
            </div>
          </div>
          <div className="p-6 md:p-10">{LEAD.architecture && <Blueprint architecture={LEAD.architecture} />}</div>
        </article>

        <ol className="mt-12 border-t border-[var(--line-strong)]">
          {INDEX.map((project, index) => (
            <li key={project.id} className="reveal group relative grid items-baseline gap-x-8 gap-y-2 border-b border-[var(--line)] py-6 transition-colors hover:bg-[var(--card)] md:grid-cols-[48px_minmax(0,0.9fr)_minmax(0,1.3fr)_auto] md:px-4">
              <span className="font-mono text-xs text-[var(--ink-faint)]">{String(index + 2).padStart(2, '0')}</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                  {/* A real link to the archive entry, so crawlers and no-JS visitors can
                      follow it; a plain click opens the dossier in place instead.
                      Stretched over the row, so the whole line is the target. */}
                  <a
                    href={`/projects#${project.id}`}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      dossier.open(project, event.currentTarget.closest('li')!);
                    }}
                    className="transition-colors after:absolute after:inset-0 group-hover:text-[var(--accent)]"
                  >{project.title}</a>
                </h3>
                <p className="label-mono mt-2 text-[var(--ink-faint)]">{project.category}</p>
              </div>
              <div>
                <p className="font-medium">{project.tagline}</p>
                <p className="mt-1 hidden max-w-[60ch] text-sm leading-relaxed text-[var(--ink-soft)] md:block">{project.description}</p>
              </div>
              <div className="flex items-center gap-4 text-[var(--ink-soft)]">
                <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`} className="relative z-10 p-1 transition-colors hover:text-[var(--accent)]"><GithubLogo size={18} /></a>
                <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col justify-between gap-4 text-sm text-[var(--ink-soft)] sm:flex-row">
          <span>{PROJECTS.length - FEATURED.length} more experiments live in the archive.</span>
          <Link to="/projects" viewTransition className="group font-semibold text-[var(--accent)] hover:underline">Open the project archive <ArrowUpRight className="ml-1 inline transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={14} /></Link>
        </div>
      </div>
      <ProjectDossier project={dossier.project} onClose={dossier.close} />
    </section>
  );
}
