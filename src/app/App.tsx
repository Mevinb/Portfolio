import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MotionConfig } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Events } from './components/Events';
import { Footer } from './components/Footer';
import { TechTicker } from './components/TechTicker';
import { useCinematicSession } from './hooks/useCinematicSession';

// Split at the landing, not just the WebGL scene: returning visitors in the
// same session never render the intro, so its shell, copy layer and stylesheet
// should stay out of the entry chunk.
const CinematicLanding = lazy(() => import('./components/CinematicLanding').then((module) => ({ default: module.CinematicLanding })));

export default function App() {
  const { isActive, replayKey, complete, replay } = useCinematicSession();

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        {isActive && (
          <Suspense fallback={<div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#050711' }} />}>
            <CinematicLanding key={replayKey} onComplete={complete} />
          </Suspense>
        )}
        <div inert={isActive} className="site-shell min-h-dvh bg-[var(--paper)] text-[var(--ink)] transition-colors duration-300">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navigation />
          <main id="main-content" tabIndex={-1}>
            <Hero />
            <TechTicker />
            <About />
            <Projects />
            <Events />
          </main>
          <Footer onReplayIntro={replay} />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
