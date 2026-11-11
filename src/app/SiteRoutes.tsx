import { Suspense, type ComponentType } from 'react';
import { Route, Routes } from 'react-router';
import App from './App';
import { Seo } from './components/Seo';
import NotFound from './pages/NotFound';

/** Mirrors the archive pages' header and first rows while their chunk loads. */
function PageSkeleton() {
  return <div className="min-h-dvh bg-[var(--paper)]" aria-busy="true" aria-label="Loading page">
    <div className="h-[72px] border-b border-[var(--line)]" />
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-16 md:px-10 md:py-24">
      <div className="skeleton h-3 w-40" />
      <div className="skeleton h-20 w-full max-w-3xl" />
      <div className="skeleton h-4 w-full max-w-xl" />
      <div className="grid gap-px pt-10 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="skeleton h-64" />)}</div>
    </div>
  </div>;
}

export function SiteRoutes({ EventsPage, ProjectsPage, AdminEvents }: {
  EventsPage: ComponentType; ProjectsPage: ComponentType; AdminEvents: ComponentType;
}) {
  return <>
    <Seo />
    <Suspense fallback={<PageSkeleton />}>
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
