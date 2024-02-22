import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
  ...build,
  ...files,
  '/daily/letters',
  '/daily/numbers',
  '/infinite/letters',
  '/infinite/numbers',
  '/arcade/letters',
  '/arcade/numbers',
  'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&display=swap',
  'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2'
];

self.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET') return;

  async function respond() {
    const url = new URL(event.request.url);

    if (url.pathname === '/') return Response.redirect('/infinite/letters', 302);

    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return cache.match(url.pathname);
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      if (response.status === 200) {
          cache.put(event.request, response.clone());
      }
      
      return response;
    } catch {
      return cache.match(event.request);
    }
  }

  event.respondWith(respond());
});
