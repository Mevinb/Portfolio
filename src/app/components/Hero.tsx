import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, GithubLogo, MapPin } from './icons';

const PROFILE = {
  github: 'https://github.com/Mevinb',
  linkedin: 'https://www.linkedin.com/in/mevin-benty-17305a322',
};

const headline = ['I build AI systems', 'that survive', 'the real world.'];
const EASE = [0.22, 1, 0.36, 1] as const;

/** Portrait as a stack of real 3D layers that tilts toward the pointer. */
function PortraitStage() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-13, 13]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), spring);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };
  const release = () => { pointerX.set(0); pointerY.set(0); };

  return (
    <div className="tilt-stage hero-art-drift relative z-10 my-10" onPointerMove={track} onPointerLeave={release}>
      <motion.div
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.95, delay: 0.35, ease: EASE }}
        className="tilt-body relative mx-auto aspect-[4/5] w-full max-w-[430px]"
      >
        <div className="tilt-layer-back absolute inset-0 bg-[var(--highlight)]" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden border border-[var(--hero-line)] bg-[var(--project-wash)]">
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
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(8,12,24,0.78),transparent)]" aria-hidden="true" />
        </div>
        <div className="tilt-layer-front absolute bottom-4 left-4 right-4 flex justify-between border-t border-white/25 pt-3 text-white">
          <span className="label-mono">Mevin Benty</span>
          <span className="label-mono text-[var(--highlight)]">AI / Systems</span>
        </div>
        <div className="tilt-layer-float absolute -right-5 -top-5 h-14 w-14 border-[10px] border-[var(--signal)]" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-[1440px] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="hero-copy flex flex-col justify-between px-5 py-16 md:px-10 md:py-20 lg:border-r lg:border-[var(--line)] lg:py-24">
          <div className="hero-drift">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
              className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[var(--accent)]"
            >
              <span className="label-mono flex items-center gap-2"><MapPin size={13} /> Thrissur, Kerala</span>
              <span className="label-mono flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--signal)]" aria-hidden="true" />Available for engineering roles</span>
            </motion.div>

            <h1 className="max-w-5xl text-[clamp(3.1rem,7.9vw,8.25rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
              {headline.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={{ y: '115%', rotate: 2 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 0.85, delay: 0.18 + index * 0.11, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.7, ease: EASE }} className="mt-16 grid gap-8 md:grid-cols-[minmax(0,560px)_auto] md:items-end md:justify-between">
            <div>
              <p className="max-w-xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">I’m Mevin Benty, a software developer and engineering student in Thrissur, Kerala. I build generative imaging pipelines, secure backend systems, and Linux GPU automation.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#work" className="shine-button group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)] transition-transform active:scale-[0.97]">
                  <span className="relative z-10">View selected work</span><ArrowDownRight size={16} className="relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
                <a href={PROFILE.github} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-6 text-sm font-semibold transition-[transform,border-color] hover:-translate-y-0.5 hover:border-[var(--ink)] active:scale-[0.97]">GitHub <GithubLogo size={16} /></a>
              </div>
            </div>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="label-mono group inline-flex items-center gap-2 text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]">LinkedIn <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          </motion.div>
        </div>

        <div className="on-accent relative flex min-h-[620px] flex-col justify-between overflow-hidden bg-[var(--hero-panel)] p-5 text-[var(--hero-ink)] md:p-10 lg:min-h-0">
          <div className="hero-shape-turn absolute -right-24 top-24 h-64 w-64 border-[36px] border-[var(--signal)] opacity-90" aria-hidden="true" />
          <div className="absolute -left-7 bottom-32 h-24 w-24 rounded-full bg-[var(--highlight)]" aria-hidden="true" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }} className="relative z-10 flex items-center justify-between border-b border-[var(--hero-line)] pb-4">
            <span className="label-mono text-[var(--highlight)]">Profile study / 2026</span><span className="label-mono text-white/65">Frame 01</span>
          </motion.div>
          <PortraitStage />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82, duration: 0.65 }} className="relative z-10 grid grid-cols-3 border border-[var(--hero-line)] bg-black/20">
            {[['AI', 'Vision pipelines'], ['SEC', 'Systems audit'], ['OPS', 'GPU deployment']].map(([code, label]) => (
              <div key={code} className="border-r border-[var(--hero-line)] p-4 last:border-r-0"><span className="font-mono text-sm font-semibold text-[var(--highlight)]">{code}</span><span className="mt-2 block text-xs leading-snug text-white/75">{label}</span></div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
