import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { renderSeo } from '../../lib/seo';

export function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Replace only owned metadata, also on client-side navigation and Back.
    document.head.querySelectorAll('title, meta[name="description"], meta[name="author"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], #structured-data').forEach((node) => node.remove());
    const template = document.createElement('template');
    template.innerHTML = renderSeo(pathname);
    document.head.append(template.content);
  }, [pathname]);
  return null;
}
