import { createRoot, hydrateRoot } from 'react-dom/client';
import { lazy } from 'react';
import { BrowserRouter } from 'react-router';
import { SiteRoutes } from './app/SiteRoutes';
import './styles/index.css';

const loaders = {
  EventsPage: () => import('./app/pages/EventsPage'),
  ProjectsPage: () => import('./app/pages/ProjectsPage'),
};

async function start() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  // Resolve the initial route before hydration so it matches the static HTML.
  const EventsPage = path === '/events' ? (await loaders.EventsPage()).default : lazy(loaders.EventsPage);
  const ProjectsPage = path === '/projects' ? (await loaders.ProjectsPage()).default : lazy(loaders.ProjectsPage);
  const app = <BrowserRouter><SiteRoutes EventsPage={EventsPage} ProjectsPage={ProjectsPage} /></BrowserRouter>;
  const root = document.getElementById('root')!;
  if (root.dataset.prerendered === 'true') hydrateRoot(root, app);
  else createRoot(root).render(app);
}

void start();
