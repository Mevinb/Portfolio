import { Brain, Code, ShieldCheck, Wrench } from './icons';

const STAGES = [
  { name: 'Prototype graph', text: 'Get the model graph producing the right output once, on one machine.' },
  { name: 'Instrument runtime', text: 'Add timing, logging and failure handling until a bad run explains itself.' },
  { name: 'Package service', text: 'Wrap it in an API or installer so someone else can run it without me.' },
];

const CAPABILITIES = [
  { code: 'MODEL', title: 'AI vision systems', text: 'Stable Diffusion, ComfyUI node graphs, LoRA experiments, and identity-preserving pipelines.', icon: Brain, tags: ['ComfyUI', 'PyTorch', 'OpenCV', 'InsightFace'] },
  { code: 'API', title: 'Backend execution', text: 'FastAPI and Flask services for streaming workflows, long-running jobs, and structured automation.', icon: Code, tags: ['FastAPI', 'Flask', 'Node.js', 'Postgres'] },
  { code: 'AUDIT', title: 'Security utilities', text: 'Network scanners, Windows audit scripts, local reconnaissance helpers, and reportable findings.', icon: ShieldCheck, tags: ['PowerShell', 'Python', 'Sockets', 'Scapy'] },
  { code: 'OPS', title: 'Deployment tooling', text: 'Linux GPU setup, dependency scripts, PyInstaller packaging, and reproducible project environments.', icon: Wrench, tags: ['Linux', 'Docker', 'CUDA', 'Git'] },
];

export function About() {
  return (
    <section id="capabilities" className="on-dark scroll-mt-[72px] border-b border-[var(--feature-line)] bg-[var(--feature-panel)] text-[var(--feature-ink)]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.75fr_1.25fr]">
        <div className="border-b border-[var(--feature-line)] px-5 py-16 md:px-10 lg:border-b-0 lg:border-r lg:py-24">
          <div className="lg:sticky lg:top-28">
            <p className="reveal-side label-mono text-[var(--highlight)]">Capability map</p>
            <h2 className="reveal mt-6 max-w-lg text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-6xl">From experimental model graph to usable system boundary.</h2>
            <p className="reveal mt-8 max-w-md text-base leading-relaxed text-[var(--feature-muted)]">The useful part is turning unstable experiments into something that can be run, inspected, and improved. My work sits between AI imaging, system automation, and practical security.</p>
          </div>
        </div>

        <div>
          {/* The three stages every project goes through, drawn as one pipeline. */}
          <div className="relative border-b border-[var(--feature-line)] px-5 py-12 md:px-10 md:py-16">
            <p className="label-mono text-[var(--feature-muted)]">How a project moves</p>
            <div className="relative mt-10">
              <svg className="absolute left-0 top-[11px] hidden h-px w-full overflow-visible md:block" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--feature-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line className="draw-on-scroll" pathLength={1} x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--highlight)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
                {STAGES.map((stage, index) => (
                  <li key={stage.name} className="reveal relative border-l border-[var(--feature-line)] pl-5 md:border-l-0 md:pl-0">
                    <span className="relative grid h-6 w-6 place-items-center bg-[var(--highlight)] font-mono text-[11px] font-semibold text-[var(--contact-ink)]">{index + 1}</span>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{stage.name}</h3>
                    <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-[var(--feature-muted)]">{stage.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ul>
            {CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.code} className="reveal group grid gap-x-8 gap-y-4 border-b border-[var(--feature-line)] px-5 py-8 transition-colors last:border-b-0 hover:bg-white/[0.04] md:grid-cols-[88px_minmax(0,1fr)_minmax(0,0.8fr)] md:px-10">
                  <div className="flex items-center gap-3 md:block">
                    <Icon size={20} className="text-[var(--highlight)]" />
                    <span className="label-mono text-[var(--feature-muted)] md:mt-3 md:block">{item.code}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-[var(--feature-muted)]">{item.text}</p>
                  </div>
                  <ul className="flex flex-wrap content-start gap-2 md:justify-end">
                    {item.tags.map((tag) => <li key={tag} className="border border-[var(--feature-line)] px-2 py-1 font-mono text-[10px] text-[var(--feature-muted)]">{tag}</li>)}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
