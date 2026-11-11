import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { SiteRoutes } from './app/SiteRoutes';
import EventsPage from './app/pages/EventsPage';
import ProjectsPage from './app/pages/ProjectsPage';
import { seedEvents } from './lib/events';
import type { Event } from './lib/supabase';
export { PUBLIC_PATHS, SITE_URL, renderSeo, safeJson } from './lib/seo';

export function render(path: string, events: Event[]) {
  seedEvents(events);
  return renderToString(<StaticRouter location={path}><SiteRoutes EventsPage={EventsPage} ProjectsPage={ProjectsPage} AdminEvents={() => null} /></StaticRouter>);
}
