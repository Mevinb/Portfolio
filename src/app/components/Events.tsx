import { ArrowUpRight, CalendarBlank, GitBranch, MapPin } from './icons';
import { Link } from 'react-router';
import { EVENTS } from '../../lib/events';

const MILESTONES = [
  { year: '2026', title: 'Story Teller multi-agent engine', type: 'Build', text: 'Designed a long-form generation workflow with semantic memory and multiple model backends.', url: 'https://github.com/Mevinb/story-teller-' },
  { year: '2025', title: 'Reactorv4 node suite', type: 'Open source', text: 'Released identity restoration tooling for ComfyUI and Stable Diffusion workflows.', url: 'https://github.com/Mevinb/Reactorv4' },
  { year: '2025', title: 'MediaHub desktop app', type: 'Build', text: 'Shipped a GPU-accelerated media library with AI face recognition, libmpv playback, and SQLite FTS5 search.', url: 'https://github.com/Mevinb/mediaplayer' },
];

const RECENT = EVENTS.slice(0, 3);

export function Events() {
  return (
    <section id="notes" className="scroll-mt-[72px] border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.7fr_1.3fr]">
        <div className="relative overflow-hidden border-b border-[var(--line)] px-5 py-16 md:px-10 lg:border-b-0 lg:border-r lg:py-24">
          <div className="absolute right-8 top-10 h-16 w-16 rotate-6 bg-[var(--signal)]" aria-hidden="true" />
          <div className="absolute right-24 top-26 h-10 w-10 -rotate-12 bg-[var(--highlight)]" aria-hidden="true" />
          <p className="reveal-side label-mono text-[var(--accent)]">Field notes</p>
          <h2 className="reveal mt-5 text-4xl font-semibold leading-[1] tracking-[-0.05em] md:text-6xl">A record of what shipped and what changed.</h2>
          <p className="reveal mt-7 max-w-md leading-relaxed text-[var(--ink-soft)]">Selected releases, infrastructure work, and public activities. The emphasis is on progression, not a manufactured activity feed.</p>
        </div>
        <div>
          {MILESTONES.map((item, index) => (
            <article key={item.title} className="reveal group grid gap-5 border-b border-[var(--line)] bg-[var(--card)] p-6 transition-colors hover:bg-[var(--project-wash)] md:grid-cols-[90px_1fr_auto] md:items-start md:p-8">
              <div><span className={`font-mono text-xl font-semibold ${index === 1 ? 'text-[var(--signal)]' : index === 2 ? 'text-[#b99a00] dark:text-[var(--highlight)]' : 'text-[var(--accent)]'}`}>{item.year}</span><span className="label-mono mt-1 block text-[var(--ink-faint)]">Note 0{index + 1}</span></div>
              <div><div className="label-mono mb-3 flex items-center gap-2 text-[var(--ink-faint)]"><GitBranch size={13} /> {item.type}</div><h3 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">{item.text}</p></div>
              <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className="text-[var(--accent)]"><ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
            </article>
          ))}
          {RECENT.length > 0 && <div className="p-6 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="text-lg font-semibold">Recent public activity</h3><span className="label-mono mt-1 block text-[var(--ink-faint)]">Latest from the event archive</span></div><Link to="/events" viewTransition className="group inline-flex w-fit items-center gap-2 border border-[var(--line-strong)] px-4 py-2.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]">View all events <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div>
            <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">{RECENT.map((event) => <article key={event.id} className="bg-[var(--card)] p-5"><span className="label-mono text-[var(--accent)]">{event.role}</span><h4 className="mt-4 font-semibold">{event.title}</h4><div className="mt-5 space-y-2 text-xs text-[var(--ink-faint)]"><span className="flex items-center gap-2"><CalendarBlank size={13} />{new Date(`${event.event_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>{event.location && <span className="flex items-center gap-2"><MapPin size={13} />{event.location}</span>}</div></article>)}</div>
          </div>}
        </div>
      </div>
    </section>
  );
}
