import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { prefetchEvents } from '../../lib/events';

const NAV_ITEMS = [
  { id: 'capabilities', label: 'Capabilities', href: '/#capabilities' },
  { id: 'work', label: 'Selected work', href: '/#work' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'notes', label: 'Field notes', href: '/#notes' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isEventsPage = pathname === '/events';
  const isProjectsPage = pathname === '/projects';
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(isEventsPage ? 'events' : isProjectsPage ? 'projects' : '');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.25 });

  useMotionValueEvent(scrollY, 'change', (latest) => setIsScrolled(latest > 24));

  useEffect(() => {
    if (isEventsPage || isProjectsPage) {
      setActive(isEventsPage ? 'events' : 'projects');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-30% 0px -60%' },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [isEventsPage, isProjectsPage]);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b border-[var(--line)] transition-[background-color,box-shadow] duration-500 ${
        isEventsPage || isProjectsPage
          ? `bg-[var(--paper)] ${isScrolled ? 'shadow-[0_10px_35px_rgba(10,18,40,0.08)]' : ''}`
          : `backdrop-blur-xl ${
              isScrolled
                ? 'bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] shadow-[0_10px_35px_rgba(10,18,40,0.08)]'
                : 'bg-[color-mix(in_srgb,var(--paper)_96%,transparent)]'
            }`
      }`}
    >
      <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-500 md:px-10 ${isScrolled ? 'h-16' : 'h-[72px]'}`}>
        <motion.a
          href={isEventsPage || isProjectsPage ? '/' : '#main-content'}
          className="group flex items-center gap-3"
          aria-label="Mevin Benty, back to top"
          whileHover="hover"
        >
          <motion.span
            variants={{ hover: { rotate: -7, scale: 1.06 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--accent)] font-mono text-[13px] font-semibold text-[var(--accent-ink)] shadow-[0_6px_18px_color-mix(in_srgb,var(--accent)_28%,transparent)]"
          >
            MB
          </motion.span>
          <span className="leading-none">
            <span className="nav-brand block text-[15px] font-bold tracking-[-0.025em]">Mevin Benty</span>
            <span className="mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">AI systems engineer</span>
          </span>
        </motion.a>

        <nav className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--card)_80%,transparent)] p-1.5 shadow-[0_8px_30px_rgba(10,18,40,0.05)] lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              item.id === 'events' ? <Link key={item.id} to={item.href} onMouseEnter={prefetchEvents} onFocus={prefetchEvents} className={`nav-link relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors ${isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--paper-strong)] shadow-[0_3px_12px_rgba(10,18,40,0.08)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {item.label}
              </Link> : <a key={item.id} href={item.href} className={`nav-link relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors ${isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
                {isActive && <motion.span layoutId="nav-active-pill" className="absolute inset-0 -z-10 rounded-full bg-[var(--paper-strong)] shadow-[0_3px_12px_rgba(10,18,40,0.08)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ rotate: 8, scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] transition-colors hover:border-[var(--line-strong)]"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -45, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: 0.6 }} transition={{ duration: 0.2 }}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.a
            href={isEventsPage || isProjectsPage ? '/#contact' : '#contact'}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            className="shine-button group relative hidden h-10 items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--accent-ink)] sm:flex"
          >
            <span className="relative z-10">Let's talk</span>
            <motion.span variants={{ hover: { x: 2, y: -2 } }} className="relative z-10"><ArrowUpRight size={15} /></motion.span>
          </motion.a>
          <motion.button
            onClick={() => setMenuOpen((value) => !value)}
            whileTap={{ scale: 0.92 }}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={menuOpen ? 'close' : 'open'} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            /* No height on exit: a concurrent height animation makes Chrome
               cancel any in-flight smooth scroll started by the link tap. The
               panel is an absolute overlay, so fading it out shifts nothing. */
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            /* Absolute, not in flow: collapsing an in-flow panel inside the
               sticky header shifts the document mid-scroll, which makes the
               browser abort the anchor's smooth scroll and the tap look dead. */
            className="absolute inset-x-0 top-full overflow-hidden border-t border-[var(--line)] bg-[var(--paper)] shadow-[0_18px_40px_rgba(10,18,40,0.14)] lg:hidden"
          >
            <div className="grid px-5 py-4">
              {NAV_ITEMS.map((item, index) => (
                item.id === 'events' ? <motion.div key={item.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.045 }}><Link to={item.href} onMouseEnter={prefetchEvents} onFocus={prefetchEvents} onClick={() => setMenuOpen(false)} className="nav-brand group flex items-center justify-between border-b border-[var(--line)] py-4 text-lg font-semibold tracking-[-0.025em]">
                  <span className="transition-transform group-hover:translate-x-1">{item.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--accent)]">0{index + 1}</span>
                </Link></motion.div> : <motion.a key={item.id} href={item.href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.045 }} className="nav-brand group flex items-center justify-between border-b border-[var(--line)] py-4 text-lg font-semibold tracking-[-0.025em]">
                  <span className="transition-transform group-hover:translate-x-1">{item.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--accent)]">0{index + 1}</span>
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--accent)]" style={{ scaleX: progressScale }} />
    </motion.header>
  );
}
