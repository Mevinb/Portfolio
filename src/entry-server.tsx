import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { SiteRoutes } from './app/SiteRoutes';
import EventsPage from './app/pages/EventsPage';
import ProjectsPage from './app/pages/ProjectsPage';
export { PUBLIC_PATHS, SITE_URL, renderSeo } from './lib/seo';

export function render(path: string) {
  return renderToString(<StaticRouter location={path}><SiteRoutes EventsPage={EventsPage} ProjectsPage={ProjectsPage} /></StaticRouter>);
}
