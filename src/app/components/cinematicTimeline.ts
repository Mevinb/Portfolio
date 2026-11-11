/**
 * Single source of truth for the cinematic intro's pacing.
 *
 * CinematicCopy, CinematicScene and CinematicLanding's progress rail all read
 * their beats from here so the camera, the type and the rail move together.
 * Deliberately free of any `three` import — CinematicCopy and CinematicLanding
 * pull from this module, and three.js must stay confined to the lazy chunk.
 */

/**
 * How long the exit wipe runs. Kept short deliberately: by the time it fires the
 * scene has already bloomed to `--paper`, which is the colour the site mounts on,
 * so anything longer is a hold on a blank plate.
 */
export const CINEMATIC_EXIT_MS = 520;

export interface CinematicAct {
  number: string;
  verb: string;
  discipline: string;
  detail: string;
  /** Drives --act-accent on the copy, and the matching pulse light in the scene. */
  accent: string;
  /** Copy fades in over [enter, enter + COPY_FADE]. */
  enter: number;
  /** Copy fades out over [exit - COPY_FADE, exit]. */
  exit: number;
}

/** How long the copy takes to arrive and leave, in progress units. */
export const COPY_FADE = 0.05;

export const ACTS: CinematicAct[] = [
  {
    number: '01',
    verb: 'Imagine',
    discipline: 'AI Vision',
    detail: 'Turn latent possibility into visual intelligence.',
    accent: '#79a2ff',
    enter: 0.075,
    exit: 0.31,
  },
  {
    number: '02',
    verb: 'Engineer',
    discipline: 'Secure Systems',
    detail: 'Give every experiment a dependable system boundary.',
    accent: '#ff7167',
    enter: 0.36,
    exit: 0.585,
  },
  {
    number: '03',
    verb: 'Deploy',
    discipline: 'GPU Infrastructure',
    detail: 'Move the pipeline from a local graph into repeatable execution.',
    accent: '#ffe268',
    enter: 0.635,
    exit: 0.85,
  },
];

export const PROLOGUE = {
  kicker: 'Mevin Benty presents',
  heading: 'Building beyond the prototype.',
  hint: 'Scroll to enter the system.',
  /** Holds, then hands off to act one. */
  fadeOut: [0.035, 0.085] as [number, number],
  zoom: [0, 0.1] as [number, number],
};

export const FINALE = {
  kicker: 'The system is live',
  name: 'Mevin Benty',
  roles: 'AI systems engineer / secure execution / GPU infrastructure',
  /**
   * The scene whitewashes to `--paper` over this window, and the copy only
   * arrives afterwards. That ordering is what lets the finale type be `--ink`:
   * it is always over a committed plate, so it reads in both themes instead of
   * being white-on-white in light mode.
   */
  bloom: [0.78, 0.9] as [number, number],
  /**
   * A DOM plate in the exact `--paper` colour closes over the canvas across
   * this window. The scene is tone-mapped, so it can approach paper but never
   * match it; the plate is what makes the handoff to the site seamless.
   */
  plate: [0.83, 0.9] as [number, number],
  enter: 0.925,
  settled: 0.985,
};

/**
 * Camera choreography. The scene flies one spline through these keys, so each
 * is a pose the path passes through rather than a stop: approach the eye
 * arcing left as it resolves, cut across its face as it scatters, enter the
 * vault corridor, swing wide around the guarded core, descend between the rack
 * rows, then hold at the threshold of the portal so the exit wipe can continue
 * out of it.
 *
 * Scene-space landmarks: eye at the origin (radius 2.3), security z=-18 (gates
 * to ~-39, guarded core at z=-28, radius ~2), deploy z=-43 (racks recede past
 * -95), portal ring z=-75 radius 5.5.
 */
export interface CameraKey {
  at: number;
  pos: [number, number, number];
  look: [number, number, number];
}

export const CAMERA_KEYS: CameraKey[] = [
  // Opens craned up and pushed back, looking above the cloud, so the sculpture
  // sits in the lower third and the title card has a clean field to land in.
  { at: 0.0, pos: [0, 1, 21], look: [0, 5.2, 0] },
  { at: 0.13, pos: [-2.6, 0.9, 8.2], look: [0.2, 0, 0] },
  { at: 0.25, pos: [3.6, -0.5, 5.4], look: [-0.4, 0.1, -3] },
  // Close enough to the corridor that act two's copy arrives on a full frame
  // rather than on a small shape in the middle distance.
  { at: 0.36, pos: [-0.4, 0.2, -10.5], look: [0.3, 0, -18] },
  // Wide of the guarded core on the way past (it is solid, not a wireframe),
  // and to its left, so it sits on the side of the frame the copy leaves free.
  { at: 0.46, pos: [-2.3, 0.9, -21.5], look: [0.7, -0.1, -28] },
  { at: 0.53, pos: [-2.7, 0.4, -28.5], look: [1.4, 0, -38] },
  { at: 0.585, pos: [0.6, 0.5, -34], look: [-0.3, 0.1, -44] },
  { at: 0.69, pos: [0.2, 1.7, -46], look: [0, -0.6, -60] },
  { at: 0.8, pos: [-0.3, 0.6, -56], look: [0.1, -0.1, -70] },
  { at: 0.9, pos: [0, 0.15, -61], look: [0, 0, -76] },
  { at: 0.96, pos: [0, 0.04, -62.8], look: [0, 0, -77.4] },
  { at: 1.0, pos: [0, 0, -63.5], look: [0, 0, -78] },
];

/**
 * Act one's sculpture: latent noise settles into the eye over `form`, then
 * scatters past the camera over `scatter` as the corridor takes over.
 */
export const RESOLVE = {
  form: [0.015, 0.2] as [number, number],
  scatter: [0.235, 0.37] as [number, number],
};

/** The corridor's gates swing square one after another across this window. */
export const GATE_UNLOCK = [0.33, 0.56] as [number, number];

/**
 * The overlay's own furniture — brand, skip, rail, scroll cue — retreats before
 * the whitewash. Two reasons: arriving should feel like the frame clearing, and
 * this chrome is styled light-on-dark, so it would be stranded on the plate.
 */
export const CHROME_FADE = [0.76, 0.87] as [number, number];

/**
 * On-screen radius of the portal ring at the final camera pose, as a percentage
 * of viewport height. The exit wipe starts here instead of at zero, so it reads
 * as passing through the ring rather than as an unrelated cut.
 *
 * A perspective camera's projection is viewport-size independent, so this is a
 * constant fraction of height — only the fov differs between breakpoints.
 * radius / (distance * tan(fov / 2)) * 50, with the ring 11.5 units ahead.
 */
export const PORTAL_EXIT_VH = { desktop: 43, mobile: 37 };

/** Radius that clears the corners on every reasonable aspect ratio. */
export const EXIT_END_VH = 150;

/**
 * Cross-dissolve windows per scene group, so acts hand off instead of popping.
 * `in` ramps 0→1, `out` ramps 1→0; the gaps sit inside the copy's dead air.
 */
export interface GroupWindow {
  in: [number, number];
  out: [number, number];
}

export const GROUP_WINDOWS: Record<'core' | 'security' | 'deploy', GroupWindow> = {
  core: { in: [-0.01, 0], out: [0.3, 0.385] },
  security: { in: [0.27, 0.37], out: [0.55, 0.64] },
  deploy: { in: [0.57, 0.66], out: [1.01, 1.02] },
};

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

/** 1 while the group is on stage, ramping at each end of its window. */
export function windowAlpha(window: GroupWindow, progress: number) {
  const rising = smoothstep(window.in[0], window.in[1], progress);
  const falling = 1 - smoothstep(window.out[0], window.out[1], progress);
  return rising * falling;
}

/** Keyframes for a copy block's opacity: [0, 1, 1, 0] across these stops. */
export function copyStops(act: CinematicAct) {
  return [act.enter, act.enter + COPY_FADE, act.exit - COPY_FADE, act.exit];
}

/** Which act the progress rail should highlight. Holds the last act through the gaps. */
export function activeActIndex(progress: number) {
  let index = 0;
  for (let i = 0; i < ACTS.length; i += 1) {
    if (progress >= ACTS[i].enter) index = i;
  }
  return index;
}
