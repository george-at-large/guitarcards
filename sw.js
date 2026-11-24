// Offline cache: network-first for app files (instant updates when online), cache fallback offline. Every fetch
// revalidates with the server (no-cache), so a page never mixes a fresh file with a stale one from the browser's
// own cache (GitHub Pages lets files be cached for ten minutes).
const CACHE = 'guitarcards-v1';
// v2: revalidate every fetch
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req.mode === 'navigate' ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(req, { cache: 'no-cache' })).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
// Check-in pings shown by the app: tapping one focuses an open Check-in window (and asks it to start that ping's
// check-in) or opens a new one at the ping's link.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url;
  if (!url) return;
  const prompt = new URL(url).searchParams.get('prompt');
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const win = list.find((c) => new URL(c.url).pathname.endsWith('/checkin.html'));
    if (win) { win.postMessage({ prompt }); return win.focus(); }
    return self.clients.openWindow(url);
  }));
});
