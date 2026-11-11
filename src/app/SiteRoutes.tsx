import { Suspense, type ComponentType } from 'react';
import { Route, Routes } from 'react-router';
import App from './App';
import { Seo } from './components/Seo';
import NotFound from './pages/NotFound';

export function SiteRoutes({ EventsPage, ProjectsPage, AdminEvents }: {
  EventsPage: ComponentType; ProjectsPage: ComponentType; AdminEvents: ComponentType;
}) {
  return <>
    <Seo />
    <Suspense fallback={<div className="grid min-h-screen place-items-center">Loading archive…</div>}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/admin" element={<AdminEvents />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>;
}
