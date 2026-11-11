import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Github, MapPin } from 'lucide-react';

const PROFILE = {
  github: 'https://github.com/Mevinb',
  linkedin: 'https://www.linkedin.com/in/mevin-benty-17305a322',
};

const headline = ['I build AI systems', 'that survive', 'the real world.'];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const shapeRotate = useTransform(scrollYProgress, [0, 1], [12, 48]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <motion.div style={{ y: copyY }} className="hero-copy flex flex-col justify-between px-5 py-16 will-change-transform md:px-10 md:py-20 lg:border-r lg:border-[var(--line)] lg:py-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[var(--accent)]"
            >
              <span className="label-mono flex items-center gap-2"><MapPin size={13} /> Thrissur, Kerala</span>
              <span className="label-mono flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal)] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--signal)]" /></span>Available for engineering roles</span>
            </motion.div>

            <h1 className="max-w-5xl text-[clamp(3.3rem,8.2vw,8.5rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
              {headline.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={{ y: '115%', rotate: 2 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 0.85, delay: 0.18 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-16 grid gap-8 md:grid-cols-[minmax(0,560px)_auto] md:items-end md:justify-between">
            <div>
              <p className="max-w-xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">I’m Mevin Benty, a software developer and engineering student in Thrissur, Kerala. I build generative imaging pipelines, secure backend systems, and Linux GPU automation.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <motion.a href="#work" whileHover="hover" whileTap={{ scale: 0.97 }} className="shine-button group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)]">
                  <span className="relative z-10">View selected work</span><motion.span variants={{ hover: { x: 3, y: 3 } }} className="relative z-10"><ArrowDownRight size={16} /></motion.span>
                </motion.a>
                <motion.a href={PROFILE.github} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-6 text-sm font-semibold shadow-[0_7px_20px_rgba(10,18,40,0.06)]">GitHub <Github size={16} /></motion.a>
              </div>
            </div>
            <motion.a href={PROFILE.linkedin} target="_blank" rel="noreferrer" whileHover={{ x: 4 }} className="label-mono inline-flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--accent)]">LinkedIn <ArrowUpRight size={14} /></motion.a>
          </motion.div>
        </motion.div>

        <div className="relative flex min-h-[620px] flex-col justify-between overflow-hidden bg-[var(--hero-panel)] p-5 text-[var(--hero-ink)] md:p-10 lg:min-h-0">
          <motion.div style={{ rotate: shapeRotate }} className="absolute -right-24 top-24 h-64 w-64 border-[36px] border-[var(--signal)] opacity-90 will-change-transform" aria-hidden="true" />
          <motion.div animate={{ y: [0, 12, 0], x: [0, -7, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-7 bottom-32 h-24 w-24 rounded-full bg-[var(--highlight)] opacity-95" aria-hidden="true" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }} className="relative z-10 flex items-center justify-between border-b border-[var(--hero-line)] pb-4">
            <span className="label-mono text-[var(--highlight)]">Profile study / 2026</span><span className="label-mono text-white/65">Frame 01</span>
          </motion.div>
          <motion.div
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.018, rotate: -0.6 }}
            className="group relative z-10 mx-auto my-10 aspect-[4/5] w-full max-w-[430px] overflow-hidden border border-[var(--hero-line)] bg-[#dbe4ff] shadow-[18px_18px_0_var(--highlight)] will-change-transform"
          >
            <picture>
              <source
                type="image/webp"
                srcSet="/images/mevin-portrait-400.webp 400w, /images/mevin-portrait.webp 706w"
                sizes="(min-width: 1024px) 430px, 90vw"
              />
              <img
                src="/images/mevin-portrait.jpg"
                alt="Mevin Benty"
                width={706}
                height={882}
                {...{ fetchpriority: 'high' }}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </picture>
            <motion.div animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-[linear-gradient(135deg,transparent_48%,rgba(21,87,255,0.14)_48%,rgba(21,87,255,0.14)_52%,transparent_52%)] bg-[length:30px_30px] opacity-40 mix-blend-soft-light" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(8,12,24,0.78),transparent)]" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between border-t border-white/25 pt-3 text-white"><span className="label-mono">Mevin Benty</span><span className="label-mono text-[var(--highlight)]">AI / Systems</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.65 }} className="relative z-10 grid grid-cols-3 border border-[var(--hero-line)] bg-black/20">
            {[['AI', 'Vision pipelines'], ['SEC', 'Systems audit'], ['OPS', 'GPU deployment']].map(([code, label], index) => (
              <motion.div key={code} whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }} className="border-r border-[var(--hero-line)] p-4 last:border-r-0"><motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, delay: index * 0.35, repeat: Infinity }} className="font-mono text-sm font-semibold text-[var(--highlight)]">{code}</motion.span><span className="mt-2 block text-xs leading-snug text-white/75">{label}</span></motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
