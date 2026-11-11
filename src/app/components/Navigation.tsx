import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowUpRight, List, Moon, Sun, X } from './icons';
import { Link, useLocation } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { prefetchEvents } from '../../lib/events';

// `route` items are pages; the rest are sections of the home page.
const NAV_ITEMS = [
  { id: 'capabilities', label: 'Capabilities', href: '/#capabilities' },
  { id: 'work', label: 'Selected work', href: '/#work' },
  { id: 'projects', label: 'Projects', href: '/projects', route: true },
  { id: 'notes', label: 'Field notes', href: '/#notes' },
  { id: 'events', label: 'Events', href: '/events', route: true },
  { id: 'contact', label: 'Contact', href: '/#contact' },
];

type NavItem = (typeof NAV_ITEMS)[number];

/** Pages navigate in-app with a view transition; sections are plain anchors. */
function NavLink({ item, className, onClick, children }: { item: NavItem; className: string; onClick?: () => void; children: React.ReactNode }) {
  if (!item.route) return <a href={item.href} className={className} onClick={onClick}>{children}</a>;
  const prefetch = item.id === 'events' ? prefetchEvents : undefined;
  return <Link to={item.href} viewTransition className={className} onClick={onClick} onMouseEnter={prefetch} onFocus={prefetch}>{children}</Link>;
}

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const currentPage = pathname === '/events' ? 'events' : pathname === '/projects' ? 'projects' : '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(currentPage);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => setIsScrolled(latest > 24));

  useEffect(() => {
    if (currentPage) {
      setActive(currentPage);
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
  }, [currentPage]);

  return (
    <header
      className={`site-header sticky top-0 z-50 border-b border-[var(--line)] backdrop-blur-xl transition-[background-color,box-shadow] duration-500 ${
        isScrolled
          ? 'bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] shadow-[0_10px_35px_var(--shadow-tint)]'
          : 'bg-[color-mix(in_srgb,var(--paper)_96%,transparent)]'
      }`}
    >
      <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-500 md:px-10 ${isScrolled ? 'h-16' : 'h-[72px]'}`}>
        <a href={currentPage ? '/' : '#main-content'} className="group flex items-center gap-3" aria-label={currentPage ? 'Mevin Benty, home' : 'Mevin Benty, back to top'}>
          <span className="grid h-9 w-9 place-items-center bg-[var(--accent)] font-mono text-[13px] font-semibold text-[var(--accent-ink)] transition-transform duration-300 group-hover:-rotate-6">MB</span>
          <span className="leading-none">
            <span className="nav-brand block text-[15px] font-bold tracking-[-0.025em]">Mevin Benty</span>
            <span className="mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">AI systems engineer</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--card)_80%,transparent)] p-1.5 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <NavLink key={item.id} item={item} className={`nav-link relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors ${isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
                {isActive && <motion.span layoutId="nav-active-pill" className="absolute inset-0 -z-10 rounded-full bg-[var(--paper-strong)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span aria-current={isActive && item.route ? 'page' : undefined}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] transition-[border-color,transform] hover:border-[var(--line-strong)] active:scale-95"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="/#contact" className="shine-button group relative hidden h-10 items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--accent-ink)] transition-transform active:scale-[0.97] sm:flex">
            <span className="relative z-10">Let's talk</span>
            <ArrowUpRight size={15} className="relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--card)] transition-transform active:scale-95 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
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
            className="absolute inset-x-0 top-full overflow-hidden border-t border-[var(--line)] bg-[var(--paper)] shadow-[0_18px_40px_var(--shadow-tint)] lg:hidden"
          >
            <div className="grid px-5 py-4">
              {NAV_ITEMS.map((item, index) => (
                <NavLink key={item.id} item={item} onClick={() => setMenuOpen(false)} className="nav-brand group flex items-center justify-between border-b border-[var(--line)] py-4 text-lg font-semibold tracking-[-0.025em]">
                  <span className="transition-transform group-hover:translate-x-1">{item.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--accent)]">0{index + 1}</span>
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="page-progress absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]" aria-hidden="true" />
    </header>
  );
}
