// sw.js
// Temporary service worker reset.
// Clears old caches, unregisters itself, then lets the site load from the network.

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      await self.registration.unregister();

      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});