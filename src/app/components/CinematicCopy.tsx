import { cubicBezier, motion, type MotionStyle, MotionValue, useTransform } from 'motion/react';
import { ACTS, CinematicAct, COPY_FADE, FINALE, PROLOGUE, copyStops } from './cinematicTimeline';

/** The site's motion signature, reused here so the intro matches the sections. */
const EASE = cubicBezier(0.22, 1, 0.36, 1);

function ActCopy({ act, progress }: { act: CinematicAct; progress: MotionValue<number> }) {
  const stops = copyStops(act);
  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  const scale = useTransform(progress, [act.enter, act.exit], [0.985, 1.03]);
  const exitY = useTransform(progress, [act.exit - COPY_FADE, act.exit], [0, -55], { ease: EASE });

  // Staggered arrival: index, then the verb, then the outlined discipline last
  // and slowest, then the line of detail. Each is its own transform off the same
  // progress value, so the whole block stays compositor-only.
  const indexY = useTransform(progress, [act.enter, act.enter + 0.045], [26, 0], { ease: EASE });
  const verbY = useTransform(progress, [act.enter + 0.008, act.enter + 0.062], [82, 0], { ease: EASE });
  const disciplineY = useTransform(progress, [act.enter + 0.024, act.enter + 0.09], [104, 0], { ease: EASE });
  const detailY = useTransform(progress, [act.enter + 0.036, act.enter + 0.095], [38, 0], { ease: EASE });
  const detailOpacity = useTransform(progress, [act.enter + 0.036, act.enter + 0.08], [0, 1]);

  return (
    <motion.div
      style={{ opacity, scale, y: exitY, '--act-accent': act.accent } as MotionStyle & { '--act-accent': string }}
      className="cinematic-scene-copy"
      aria-hidden="true"
    >
      <motion.div style={{ y: indexY }} className="cinematic-scene-index">
        <span>{act.number}</span>
        <span>Systems journey</span>
      </motion.div>
      <div className="cinematic-scene-title">
        <motion.span style={{ y: verbY }}>{act.verb}</motion.span>
        <motion.strong style={{ y: disciplineY }}>{act.discipline}</motion.strong>
      </div>
      <motion.p style={{ y: detailY, opacity: detailOpacity }}>{act.detail}</motion.p>
    </motion.div>
  );
}

export function CinematicCopy({ progress }: { progress: MotionValue<number> }) {
  const prologueOpacity = useTransform(progress, [PROLOGUE.fadeOut[0], PROLOGUE.fadeOut[1]], [1, 0]);
  const prologueScale = useTransform(progress, PROLOGUE.zoom, [1, 1.12]);
  const finaleOpacity = useTransform(progress, [FINALE.enter, FINALE.settled], [0, 1]);
  const finaleY = useTransform(progress, [FINALE.enter, FINALE.settled], [50, 0], { ease: EASE });

  return (
    <div className="cinematic-copy-layer">
      {/* Not aria-hidden: Hero is unmounted while the intro plays, so this is
          the document's only heading. */}
      <motion.div style={{ opacity: prologueOpacity, scale: prologueScale }} className="cinematic-prologue">
        <span className="cinematic-kicker">{PROLOGUE.kicker}</span>
        <h1>{PROLOGUE.heading}</h1>
        <p aria-hidden="true">{PROLOGUE.hint}</p>
      </motion.div>

      {ACTS.map((act) => (
        <ActCopy key={act.number} act={act} progress={progress} />
      ))}

      <motion.div style={{ opacity: finaleOpacity, y: finaleY }} className="cinematic-finale" aria-hidden="true">
        <span className="cinematic-kicker">{FINALE.kicker}</span>
        <h2>{FINALE.name}</h2>
        <p>{FINALE.roles}</p>
      </motion.div>
    </div>
  );
}
