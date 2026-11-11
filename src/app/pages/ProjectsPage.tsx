import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Cpu, GithubLogo, Stack, ShieldCheck } from '../components/icons';
import { ThemeProvider } from '../context/ThemeContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ArchitectureModal } from '../components/ArchitectureModal';
import { PROJECTS, PROJECT_CATEGORIES, type Project, type ProjectCategory } from '../../lib/projects';

type Category = 'All' | ProjectCategory;

function CategoryIcon({ category }: { category: ProjectCategory }) {
  return category === 'AI vision' || category === 'AI systems' ? <Cpu size={15} /> : category === 'Security' ? <ShieldCheck size={15} /> : <Stack size={15} />;
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <motion.article
      id={project.id}
      style={{ scrollMarginTop: 96 }}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex min-h-[330px] cursor-pointer flex-col justify-between overflow-hidden bg-[var(--card)] p-6 transition-colors hover:bg-[var(--paper-strong)] md:p-7"
      onClick={onOpen}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[var(--signal)]" />
      <div>
        <div className="flex items-center justify-between text-[var(--accent)]">
          <span className="label-mono flex items-center gap-2"><CategoryIcon category={project.category} /> {project.category}</span>
          <a href={project.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Open ${project.title} on GitHub`} className="border border-[var(--line)] p-2 text-[var(--ink-soft)] hover:text-[var(--accent)]"><GithubLogo size={15} /></a>
        </div>
        <h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em] transition-colors group-hover:text-[var(--accent)]">{project.title}</h2>
        <p className="mt-2 text-sm font-medium text-[var(--accent)]">{project.tagline}</p>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">{project.description}</p>
      </div>
      <div className="flex items-end justify-between gap-3 border-t border-[var(--line)] pt-5"><div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="border border-[var(--line)] px-2 py-1 font-mono text-[10px] text-[var(--ink-faint)]">{tag}</span>)}</div><span className="label-mono flex shrink-0 items-center gap-1 text-[var(--ink-soft)]">Dossier <ArrowUpRight size={13} /></span></div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const [category, setCategory] = useState<Category>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const [architecture, setArchitecture] = useState<Project['architecture']>();
  const visible = useMemo(() => PROJECTS.filter((project) => category === 'All' || project.category === category), [category]);

  return (
    <ThemeProvider>
      <div className="site-shell min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-300">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          <section className="border-b border-[var(--line)] bg-[var(--paper)]">
            <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-[var(--line)] px-5 py-16 md:px-10 md:py-24 lg:border-b-0 lg:border-r">
                <motion.a href="/#work" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="label-mono inline-flex items-center gap-2 text-[var(--ink-faint)] hover:text-[var(--accent)]"><ArrowLeft size={13} /> Back to selected work</motion.a>
                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="label-mono mt-12 text-[var(--accent)]">Projects / working archive</motion.p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-7xl lg:text-8xl">Systems built to be used.</h1>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">Explore Mevin Benty’s open-source projects in computer vision, local AI, cybersecurity, and full-stack web development. Each project includes its purpose, technology stack, and source code.</p>
              </div>
              <div className="flex min-h-[330px] flex-col justify-between overflow-hidden bg-[var(--accent)] p-6 text-[var(--accent-ink)] md:p-10">
                <span className="label-mono text-white/70">Archive status</span>
                <div className="grid grid-cols-2 gap-px border border-white/35 bg-white/35">
                  <div className="bg-[var(--accent)] p-5"><span className="block font-mono text-4xl font-semibold">{PROJECTS.length}</span><span className="label-mono mt-2 block text-white/65">Project records</span></div>
                  <div className="bg-[var(--accent)] p-5"><span className="block font-mono text-4xl font-semibold">{PROJECTS.filter((project) => project.featured).length}</span><span className="label-mono mt-2 block text-white/65">Featured on home</span></div>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-[var(--project-wash)]">
            <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-20">
              <div className="flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-end"><div><p className="label-mono text-[var(--accent)]">Complete project ledger</p><p className="mt-2 text-sm text-[var(--ink-soft)]">Featured work and newer systems, grouped by what they prove.</p></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1 no-scrollbar">{PROJECT_CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(item)} className={`label-mono whitespace-nowrap border px-3 py-2 transition-colors ${category === item ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-strong)]'}`}>{item}</button>)}</div></div>
              <div className="mt-8 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3"><AnimatePresence mode="popLayout">{visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelected(project)} />)}</AnimatePresence></div>
            </div>
          </section>
        </main>
        <Footer />
        <AnimatePresence>{selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(0,0,0,0.65)] p-4"><motion.div initial={{ y: 16 }} animate={{ y: 0 }} onClick={(event) => event.stopPropagation()} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--line-strong)] bg-[var(--paper)] p-6 md:p-10"><button onClick={() => setSelected(null)} className="absolute right-5 top-5 p-2" aria-label="Close project dossier">×</button><p className="label-mono text-[var(--accent)]">{selected.category} / dossier</p><h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{selected.title}</h2><p className="mt-2 text-lg text-[var(--accent)]">{selected.tagline}</p><p className="mt-8 leading-relaxed text-[var(--ink-soft)]">{selected.description}</p><div className="mt-8 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="border border-[var(--line)] px-3 py-2 font-mono text-xs">{tag}</span>)}</div><div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--line)] pt-6"><a href={selected.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-ink)]">View repository <GithubLogo size={15} /></a>{selected.architecture && <button onClick={() => { setArchitecture(selected.architecture); setSelected(null); }} className="inline-flex items-center gap-2 border border-[var(--line-strong)] px-4 py-3 text-sm font-semibold">Open blueprint <Stack size={15} /></button>}</div></motion.div></motion.div>}</AnimatePresence>
        <ArchitectureModal isOpen={Boolean(architecture)} onClose={() => setArchitecture(undefined)} architecture={architecture} />
      </div>
    </ThemeProvider>
  );
}
