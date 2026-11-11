import { useEffect, useState } from 'react';
import { Cpu, Database, HardDrives, Lightning, Play, Pulse, TerminalWindow } from './icons';

export interface ArchNode { id: string; name: string; type: 'input' | 'process' | 'model' | 'storage' | 'output'; description: string; tech: string; latency?: string; vram?: string }
export interface ProjectArchitecture { projectId: string; projectTitle: string; pipelineDescription: string; nodes: ArchNode[]; connections: { from: string; to: string; label?: string }[] }

const ICONS = { input: TerminalWindow, process: Lightning, model: Cpu, storage: Database, output: HardDrives };
const STEP_MS = 700;

/** A project's pipeline as an inline, steppable diagram. */
export function Blueprint({ architecture }: { architecture: ProjectArchitecture }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const last = active >= architecture.nodes.length - 1;
    const timer = window.setTimeout(() => (last ? setRunning(false) : setActive((step) => step + 1)), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [active, architecture, running]);

  const selected = architecture.nodes[active];

  return (
    <div className="@container">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-mono text-[var(--ink-faint)]">{architecture.pipelineDescription}</span>
        <button type="button" disabled={running} onClick={() => { setActive(0); setRunning(true); }} className="inline-flex items-center gap-2 border border-[var(--line-strong)] px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98] disabled:opacity-60">
          <Play size={13} /> {running ? `Running step ${active + 1}` : 'Run pipeline'}
        </button>
      </div>

      <ol className="mt-4 grid gap-px border border-[var(--line)] bg-[var(--line)] @xl:grid-cols-4">
        {architecture.nodes.map((node, index) => {
          const Icon = ICONS[node.type];
          const isActive = active === index;
          return (
            <li key={node.id} className="contents">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => { setActive(index); setRunning(false); }}
                className={`relative flex items-center gap-4 p-4 text-left transition-colors @xl:block @xl:min-h-36 ${isActive ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--card)] hover:bg-[var(--paper-strong)]'}`}
              >
                <span className="flex items-center justify-between @xl:w-full">
                  <Icon size={18} className={isActive ? '' : 'text-[var(--accent)]'} />
                  <span className={`label-mono hidden @xl:block ${isActive ? 'opacity-70' : 'text-[var(--ink-faint)]'}`}>0{index + 1}</span>
                </span>
                <span className="block @xl:mt-8">
                  <span className="block text-sm font-semibold">{node.name}</span>
                  <span className={`label-mono mt-1 block ${isActive ? 'opacity-80' : 'text-[var(--ink-faint)]'}`}>{node.tech}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border border-t-0 border-[var(--line)] bg-[var(--card)] p-4" aria-live="polite">
        <p className="max-w-[48ch] text-sm leading-relaxed text-[var(--ink-soft)]"><span className="font-semibold text-[var(--ink)]">{selected.name}.</span> {selected.description}</p>
        {(selected.latency || selected.vram) && (
          <div className="flex gap-5 font-mono text-xs text-[var(--ink-soft)]">
            {selected.latency && <span className="flex items-center gap-2"><Pulse size={14} className="text-[var(--accent)]" /> {selected.latency}</span>}
            {selected.vram && <span className="flex items-center gap-2"><Cpu size={14} className="text-[var(--accent)]" /> {selected.vram}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
