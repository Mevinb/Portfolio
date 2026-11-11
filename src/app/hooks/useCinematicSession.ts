import { useCallback, useEffect, useRef, useState } from 'react';

const CINEMATIC_SESSION_KEY = 'portfolio_cinematic_v1';

/**
 * Storage access throws outright in hardened contexts (Safari private browsing,
 * cookie-blocked iframes). This is read inside a useState initializer, so an
 * unguarded throw would white-screen the whole app rather than skip the intro.
 * Fail closed: if we cannot remember, do not replay the intro.
 */
function readSession() {
  try {
    return sessionStorage.getItem(CINEMATIC_SESSION_KEY);
  } catch {
    return 'complete';
  }
}

function writeSession(value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(CINEMATIC_SESSION_KEY);
    else sessionStorage.setItem(CINEMATIC_SESSION_KEY, value);
  } catch {
    /* storage unavailable — the intro simply replays next session */
  }
}

function shouldPlayCinematic() {
  if (typeof window === 'undefined') return false;
  if (window.location.hash && window.location.hash !== '#main-content') return false;
  return readSession() !== 'complete';
}

export function useCinematicSession() {
  const [isActive, setIsActive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const focusTimer = useRef(0);

  // Match the prerendered page on first render; the intro is an enhancement.
  useEffect(() => { setIsActive(shouldPlayCinematic()); }, []);

  useEffect(() => () => { if (focusTimer.current) window.clearTimeout(focusTimer.current); }, []);

  const complete = useCallback(() => {
    writeSession('complete');
    setIsActive(false);
    focusTimer.current = window.setTimeout(() => {
      focusTimer.current = 0;
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }, 50);
  }, []);

  const replay = useCallback(() => {
    writeSession(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
    setReplayKey((key) => key + 1);
    setIsActive(true);
  }, []);

  return { isActive, replayKey, complete, replay };
}
