import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionValue, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { ArrowDown, FastForward } from './icons';
import { CinematicCopy } from './CinematicCopy';
import { CinematicFallback } from './CinematicFallback';
import { ACTS, CHROME_FADE, CINEMATIC_EXIT_MS, EXIT_END_VH, PORTAL_EXIT_VH, activeActIndex } from './cinematicTimeline';
import '../../styles/cinematic.css';

const CinematicScene = lazy(() => import('./CinematicScene').then((module) => ({ default: module.CinematicScene })));

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function exitStartVh() {
  try {
    return window.matchMedia('(max-width: 760px)').matches ? PORTAL_EXIT_VH.mobile : PORTAL_EXIT_VH.desktop;
  } catch {
    return PORTAL_EXIT_VH.desktop;
  }
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const [activeAct, setActiveAct] = useState(() => activeActIndex(progress.get()));

  useEffect(() => {
    // Seed from the current value — a remount can land at non-zero progress.
    setActiveAct(activeActIndex(progress.get()));
    return progress.on('change', (value) => setActiveAct(activeActIndex(value)));
  }, [progress]);

  return (
    <div
      className="cinematic-progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={ACTS.length}
      aria-valuenow={activeAct + 1}
      aria-valuetext={`Scene ${activeAct + 1} of ${ACTS.length}: ${ACTS[activeAct].verb}`}
    >
      <span aria-hidden="true">{ACTS[activeAct].number}</span>
      <div aria-hidden="true">
        {ACTS.map((act, index) => <i key={act.number} className={index <= activeAct ? 'active' : ''} />)}
      </div>
      <span aria-hidden="true">{ACTS[ACTS.length - 1].number}</span>
    </div>
  );
}

interface CinematicLandingProps {
  onComplete: () => void;
}

export function CinematicLanding({ onComplete }: CinematicLandingProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  // Seeded synchronously: useReducedMotion() is null on first render, which
  // would let the WebGL chunk start downloading before we know to skip it.
  const [fallback, setFallback] = useState(prefersReducedMotion);
  const [leaving, setLeaving] = useState(false);
  const [exitStart] = useState(exitStartVh);
  // The overlay's furniture retires before the whitewash — see CHROME_FADE.
  const chromeOpacity = useTransform(progress, CHROME_FADE, [1, 0]);

  const leavingRef = useRef(false);
  const exitTimer = useRef(0);
  const nameHoldTimer = useRef(0);
  const finishRef = useRef<(immediate?: boolean) => void>(() => {});

  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => {
    setFallback(true);
    setReady(true);
  }, []);

  // `immediate` is true only when the skip button is clicked — scroll-triggered
  // completions pause for 2 s so the finale name has time to be read.
  const finish = useCallback((immediate = false) => {
    if (leavingRef.current) return;
    const startExit = () => {
      if (leavingRef.current) return;
      leavingRef.current = true;
      setLeaving(true);
      exitTimer.current = window.setTimeout(onComplete, CINEMATIC_EXIT_MS);
    };
    if (immediate) {
      startExit();
    } else {
      nameHoldTimer.current = window.setTimeout(startExit, 1000);
    }
  }, [onComplete]);

  useEffect(() => { finishRef.current = finish; }, [finish]);
  useEffect(() => () => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    if (nameHoldTimer.current) window.clearTimeout(nameHoldTimer.current);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollRef.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (reducedMotion) setFallback(true);
  }, [reducedMotion]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    // Cache the scroll range: it only changes on resize, and reading
    // scrollHeight/clientHeight per scroll event forces layout every time.
    let range = 0;
    const measure = () => { range = scroller.scrollHeight - scroller.clientHeight; };
    const update = () => {
      const value = range > 0 ? scroller.scrollTop / range : 0;
      progress.set(value);
      // Pass no argument so the 2-second name-hold applies before the exit wipe.
      if (value > 0.995) finishRef.current();
    };

    measure();
    update();

    const observer = new ResizeObserver(() => {
      // Re-anchor rather than re-derive. The track is sized in svh so iOS URL-bar
      // collapse should not reach here, but rotation, a desktop window resize, or
      // an engine that treats svh differently all rescale `range` while scrollTop
      // stays put — which would recompute progress to a different value and snap
      // the camera. Hold the progress we were at and move scrollTop to match, so
      // the story is independent of the layout it happens to be sized by.
      const held = progress.get();
      measure();
      if (range > 0) scroller.scrollTop = held * range;
      update();
    });
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    scroller.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      scroller.removeEventListener('scroll', update);
    };
  }, [progress]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      // Keyboard shortcuts always skip immediately — they are intentional exits.
      if (event.key === 'Escape') finish(true);
      if (event.key === 'Enter' && reducedMotion) finish(true);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finish, reducedMotion]);

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div key="cinematic" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="cinematic-root">
          <p className="sr-only">A three-scene systems journey through AI vision, secure systems, and GPU infrastructure. Scroll to progress or use the skip intro button.</p>
          <div ref={scrollRef} className="cinematic-scroll" role="region" tabIndex={0} aria-label="Cinematic introduction. Scroll through three scenes or skip intro.">
            <div className="cinematic-track">
              <div className="cinematic-sticky">
                {!fallback && (
                  <Suspense fallback={null}>
                    <CinematicScene progress={progress} onReady={handleReady} onUnavailable={handleUnavailable} />
                  </Suspense>
                )}
                {(fallback || !ready) && <CinematicFallback />}
                <div className="cinematic-vignette" aria-hidden="true" />
                <CinematicCopy progress={progress} />
                <motion.div className="cinematic-chrome-layer" style={{ opacity: chromeOpacity }}>
                  <div className="cinematic-chrome">
                    <div className="cinematic-brand"><span aria-hidden="true">MB</span><p>Mevin Benty<br />Systems journey</p></div>
                    <button type="button" onClick={() => finish(true)} className="cinematic-skip">Skip intro <FastForward size={14} aria-hidden="true" /></button>
                  </div>
                  <ProgressRail progress={progress} />
                  {/* Reduced motion collapses the track to one screen, so a
                      scroll cue would point at nothing — the button is the affordance. */}
                  {!reducedMotion && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="cinematic-scroll-cue" aria-hidden="true"><span>Scroll to travel</span><ArrowDown size={15} /></motion.div>
                  )}
                </motion.div>
                {reducedMotion && <button type="button" onClick={() => finish(true)} className="cinematic-enter">Enter portfolio</button>}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="transition"
          className="cinematic-exit"
          /* Starts at the portal's on-screen radius, so the wipe continues out
             of the ring the camera just arrived at. */
          initial={{ clipPath: `circle(${exitStart}vh at 50% 50%)` }}
          animate={{ clipPath: `circle(${EXIT_END_VH}vh at 50% 50%)` }}
          transition={{ duration: CINEMATIC_EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
