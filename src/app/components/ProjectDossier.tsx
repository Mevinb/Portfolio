import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, GithubLogo, X } from './icons';
import { Blueprint } from './Blueprint';
import { withViewTransition } from '../../lib/viewTransition';
import type { Project } from '../../lib/projects';

/**
 * Owns which project is open and morphs between the element that opened it and
 * the dialog: the trigger carries the `dossier` transition name for the old
 * snapshot, the dialog (which has it in CSS) carries it for the new one.
 */
export function useDossier() {
  const [project, setProject] = useState<Project | null>(null);
  const origin = useRef<HTMLElement | null>(null);

  const open = useCallback((next: Project, trigger: HTMLElement) => {
    origin.current = trigger;
    withViewTransition(
      () => { trigger.style.viewTransitionName = ''; setProject(next); },
      () => { trigger.style.viewTransitionName = 'dossier'; },
    );
  }, []);

  const close = useCallback(() => {
    const trigger = origin.current;
    withViewTransition(
      () => { setProject(null); if (trigger?.isConnected) trigger.style.viewTransitionName = 'dossier'; },
      undefined,
      () => { if (trigger) trigger.style.viewTransitionName = ''; trigger?.focus({ preventScroll: true }); },
    );
  }, []);

  return { project, open, close };
}

export function ProjectDossier({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Layout effect so the dialog is already open when the transition snapshots the new state.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={dialogRef}
      className="dossier"
      aria-labelledby="dossier-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {project && (
        <div className="p-6 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <p className="label-mono text-[var(--accent)]">{project.category} / dossier</p>
            <button type="button" onClick={onClose} className="-mr-2 -mt-2 border border-[var(--line)] p-2 transition-colors hover:border-[var(--line-strong)]" aria-label="Close project dossier"><X size={18} /></button>
          </div>
          <h2 id="dossier-title" className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{project.title}</h2>
          <p className="mt-2 text-lg text-[var(--accent)]">{project.tagline}</p>
          <p className="mt-7 max-w-[65ch] leading-relaxed text-[var(--ink-soft)]">{project.description}</p>
          <ul className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className="border border-[var(--line)] px-3 py-2 font-mono text-xs">{tag}</li>)}</ul>
          {project.architecture && <div className="mt-10 border-t border-[var(--line)] pt-8"><Blueprint architecture={project.architecture} /></div>}
          <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-[var(--line)] pt-6">
            <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-ink)] transition-transform active:scale-[0.98]">View repository <GithubLogo size={15} /></a>
            <a href={`/projects#${project.id}`} className="group inline-flex items-center gap-1 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--accent)]">Find it in the archive <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          </div>
        </div>
      )}
    </dialog>
  );
}
