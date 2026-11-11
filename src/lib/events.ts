import { supabase, type Event } from './supabase';

const SESSION_CACHE_KEY = 'portfolio_events_cache_v1';

let memoryCache: Event[] | null = null;
let inFlight: Promise<Event[]> | null = null;

// The same public snapshot is used by the static page and its first client render.
export function seedEvents(events: Event[]) { memoryCache = events; }

function readSessionCache() {
  if (memoryCache) return memoryCache;
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!Array.isArray(parsed)) return null;
    memoryCache = parsed as Event[];
    return memoryCache;
  } catch {
    return null;
  }
}

function writeSessionCache(events: Event[]) {
  memoryCache = events;
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(events));
  } catch {
    // A memory cache still avoids duplicate requests when storage is blocked.
  }
}

export function getCachedEvents() {
  return readSessionCache();
}

export async function fetchEvents(forceRefresh = false) {
  const cached = readSessionCache();
  if (!forceRefresh && cached) return cached;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;
    const events = data ?? [];
    writeSessionCache(events);
    return events;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export function prefetchEvents() {
  void fetchEvents().catch(() => undefined);
}
