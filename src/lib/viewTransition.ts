import { flushSync } from 'react-dom';

/**
 * Runs a state update inside a view transition when the browser supports it
 * and the visitor has not asked for reduced motion; otherwise just runs it.
 * `prepare` runs before the old snapshot is taken, `settle` once it has ended.
 */
export function withViewTransition(update: () => void, prepare?: () => void, settle?: () => void) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) {
    update();
    settle?.();
    return;
  }
  prepare?.();
  const transition = document.startViewTransition(() => flushSync(update));
  // Skipped transitions reject `finished`'s sibling promises; cleanup must still run.
  void transition.finished.finally(() => settle?.());
}
