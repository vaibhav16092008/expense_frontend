// ExpenseIQ Production-Grade Service Worker (F8.7 Cache Safety)
// Cache strategy: Static Assets & App-Shell ONLY.
// Sensitive financial data, API responses, and authenticated routes are strictly network-only.

const STATIC_CACHE_NAME = 'expenseiq-static-v1';

// Static app-shell resources to precache during SW installation
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
];

/**
 * Strict request classifier to determine if a request MUST bypass Cache Storage.
 * Guarantees zero caching of authenticated financial API data.
 */
function isBypassedRequest(request) {
  // 1. Non-GET methods (POST, PUT, DELETE, PATCH) must never be cached
  if (request.method !== 'GET') {
    return true;
  }

  // 2. Any request bearing an Authorization header is network-only
  if (request.headers.has('Authorization')) {
    return true;
  }

  // 3. Any request asking for or returning JSON API responses is network-only
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return true;
  }

  const url = new URL(request.url);

  // 4. Exclude API endpoints & backend origin (port 4000, port 5000, or /api/* paths)
  if (
    url.pathname.startsWith('/api/') ||
    url.port === '4000' ||
    url.port === '5000' ||
    url.hostname.includes('api.')
  ) {
    return true;
  }

  // 5. Exclude explicit financial feature routes
  if (
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/transactions') ||
    url.pathname.includes('/categories') ||
    url.pathname.includes('/budgets') ||
    url.pathname.includes('/goals') ||
    url.pathname.includes('/recurring') ||
    url.pathname.includes('/dashboard') ||
    url.pathname.includes('/notifications') ||
    url.pathname.includes('/profile')
  ) {
    return true;
  }

  return false;
}

// Service Worker Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ExpenseIQ SW] Precache partial fallback:', err);
      });
    })
  );
});

// Service Worker Activation & Cache Storage Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('expenseiq-') && name !== STATIC_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Interception Handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Bypass cache completely for all API, auth, non-GET, or financial requests
  if (isBypassedRequest(request)) {
    return;
  }

  const url = new URL(request.url);

  // Strategy 1: Cache-First for static build assets (_next/static, icons, images, fonts)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 2: Network-First with Safe App-Shell Fallback for HTML Page Navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/');
        })
    );
  }
});
