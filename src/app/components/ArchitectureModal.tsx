import { useEffect, useState } from 'react';
import { Pulse, Cpu, Database, Play, HardDrives, TerminalWindow, X, Lightning } from './icons';

export interface ArchNode { id: string; name: string; type: 'input' | 'process' | 'model' | 'storage' | 'output'; description: string; tech: string; latency?: string; vram?: string; details?: string[] }
export interface ProjectArchitecture { projectId: string; projectTitle: string; pipelineDescription: string; nodes: ArchNode[]; connections: { from: string; to: string; label?: string }[] }

const ICONS = { input: TerminalWindow, process: Lightning, model: Cpu, storage: Database, output: HardDrives };

export function ArchitectureModal({ isOpen, onClose, architecture }: { isOpen: boolean; onClose: () => void; architecture?: ProjectArchitecture }) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!running || !architecture) return;
    if (active >= architecture.nodes.length - 1) {
      const end = window.setTimeout(() => setRunning(false), 700);
      return () => window.clearTimeout(end);
    }
    const next = window.setTimeout(() => setActive((step) => step + 1), 700);
    return () => window.clearTimeout(next);
  }, [active, architecture, running]);

  if (!isOpen || !architecture) return null;
  const selected = architecture.nodes[active];
  const SelectedIcon = ICONS[selected.type];

  return <div className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(0,0,0,0.72)] p-3 md:p-8" role="dialog" aria-modal="true" aria-labelledby="blueprint-title" onClick={onClose}>
    <div className="mx-auto my-4 max-w-6xl border border-[var(--line-strong)] bg-[var(--paper)]" onClick={(event) => event.stopPropagation()}>
      <header className="flex items-start justify-between gap-5 border-b border-[var(--line)] p-5 md:p-7">
        <div><p className="label-mono text-[var(--accent)]">System blueprint / interactive</p><h2 id="blueprint-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{architecture.projectTitle}</h2><p className="mt-1 text-sm text-[var(--ink-soft)]">{architecture.pipelineDescription}</p></div>
        <button onClick={onClose} className="border border-[var(--line)] p-2" aria-label="Close blueprint"><X size={18} /></button>
      </header>
      <div className="p-5 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><span className="label-mono text-[var(--ink-faint)]">Execution graph / select a node</span><button disabled={running} onClick={() => { setActive(0); setRunning(true); }} className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] disabled:opacity-60"><Play size={13} /> {running ? `Running 0${active + 1}` : 'Run pipeline'}</button></div>
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
          {architecture.nodes.map((node, index) => { const Icon = ICONS[node.type]; return <button key={node.id} onClick={() => { setActive(index); setRunning(false); }} className={`min-h-48 bg-[var(--card)] p-5 text-left transition-colors ${active === index ? 'shadow-[inset_0_-4px_0_var(--accent)]' : 'hover:bg-[var(--paper-strong)]'}`}><div className="flex justify-between"><Icon size={18} className="text-[var(--accent)]" /><span className="label-mono text-[var(--ink-faint)]">0{index + 1}</span></div><h3 className="mt-10 font-semibold">{node.name}</h3><p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">{node.description}</p><span className="label-mono mt-5 block text-[var(--accent)]">{node.tech}</span></button>; })}
        </div>
        <div className="mt-5 grid border border-[var(--line)] bg-[var(--card)] md:grid-cols-[1fr_auto]">
          <div className="p-5 md:p-7"><div className="flex items-center gap-3"><SelectedIcon size={20} className="text-[var(--accent)]" /><div><span className="label-mono text-[var(--ink-faint)]">Selected {selected.type}</span><h3 className="font-semibold">{selected.name}</h3></div></div><p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">{selected.description}</p></div>
          <div className="flex min-w-56 flex-col justify-center border-t border-[var(--line)] p-5 md:border-l md:border-t-0">{selected.latency && <span className="mb-3 flex items-center gap-2 font-mono text-xs"><Pulse size={14} className="text-[var(--accent)]" /> Latency {selected.latency}</span>}{selected.vram && <span className="flex items-center gap-2 font-mono text-xs"><Cpu size={14} className="text-[var(--accent)]" /> VRAM {selected.vram}</span>}<span className="label-mono mt-4 text-[var(--ink-faint)]">Runtime telemetry</span></div>
        </div>
      </div>
    </div>
  </div>;
}
