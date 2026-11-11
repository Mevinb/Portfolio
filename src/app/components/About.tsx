import { motion } from 'motion/react';
import { Brain, Code, ShieldCheck, Wrench } from './icons';

const CAPABILITIES = [
  { number: '01', code: 'MODEL', title: 'AI vision systems', text: 'Stable Diffusion, ComfyUI node graphs, LoRA experiments, and identity-preserving pipelines.', icon: Brain, tags: ['ComfyUI', 'PyTorch', 'OpenCV', 'InsightFace'] },
  { number: '02', code: 'API', title: 'Backend execution', text: 'FastAPI and Flask services for streaming workflows, long-running jobs, and structured automation.', icon: Code, tags: ['FastAPI', 'Flask', 'Node.js', 'Postgres'] },
  { number: '03', code: 'AUDIT', title: 'Security utilities', text: 'Network scanners, Windows audit scripts, local reconnaissance helpers, and reportable findings.', icon: ShieldCheck, tags: ['PowerShell', 'Python', 'Sockets', 'Scapy'] },
  { number: '04', code: 'OPS', title: 'Deployment tooling', text: 'Linux GPU setup, dependency scripts, PyInstaller packaging, and reproducible project environments.', icon: Wrench, tags: ['Linux', 'Docker', 'CUDA', 'Git'] },
];

export function About() {
  return (
    <section id="capabilities" className="scroll-mt-[72px] border-b border-[var(--feature-line)] bg-[var(--feature-panel)] text-[var(--feature-ink)]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.75fr_1.25fr]">
        <div className="border-b border-[var(--feature-line)] px-5 py-16 md:px-10 lg:border-b-0 lg:border-r lg:py-24">
          <motion.p initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55 }} className="label-mono text-[var(--highlight)]">Capability map</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl">From experimental model graph to usable system boundary.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65, delay: 0.14 }} className="mt-8 max-w-md text-base leading-relaxed text-[var(--feature-muted)]">The useful part is turning unstable experiments into something that can be run, inspected, and improved. My work sits between AI imaging, system automation, and practical security.</motion.p>
          <div className="mt-12 border-t border-[var(--feature-line)]">
            {['Prototype graph', 'Instrument runtime', 'Package service'].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.18 + index * 0.08 }} className="group flex gap-5 border-b border-[var(--feature-line)] py-4 text-sm"><span className="font-mono text-[var(--highlight)] transition-transform group-hover:translate-x-1">0{index + 1}</span><span className="transition-transform group-hover:translate-x-1">{item}</span></motion.div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;
            return <motion.article key={item.number} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -7, backgroundColor: 'rgba(255,255,255,0.055)' }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }} className="capability-card group min-h-[280px] border-b border-[var(--feature-line)] p-6 last:border-b-0 sm:p-8 sm:nth-[3]:border-b-0 sm:nth-[4]:border-b-0 sm:nth-[odd]:border-r">
              <div className="flex items-start justify-between"><motion.span whileHover={{ rotate: -10, scale: 1.12 }}><Icon size={21} className="text-[var(--highlight)]" /></motion.span><span className="label-mono text-[var(--feature-muted)]">{item.code}</span></div>
              <h3 className="mt-12 text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--feature-muted)]">{item.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">{item.tags.map((tag) => <motion.span key={tag} whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.5)' }} className="border border-[var(--feature-line)] px-2 py-1 font-mono text-[10px] text-[var(--feature-muted)]">{tag}</motion.span>)}</div>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
