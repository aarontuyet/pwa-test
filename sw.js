const CACHE_PREFIX = "pwa-studio-";
const SHELL_CACHE = `${CACHE_PREFIX}shell-2026-07-28-1`;
const MEDIA_CACHE = `${CACHE_PREFIX}media-1`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./quotes.html",
  "./art.html",
  "./movies.html",
  "./style.css",
  "./pwa.js",
  "./quoteapp.js",
  "./art-reference.js",
  "./movies.js",
  "./manifest.json",
  "./data.json",
  "./images.json",
  "./art-references.json",
  "./TAOPROJECT_Master_Table - PWA.csv",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shellCache = await caches.open(SHELL_CACHE);
      await shellCache.addAll(SHELL_ASSETS);
      await cacheQuoteImages();
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const currentCaches = new Set([SHELL_CACHE, MEDIA_CACHE]);
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(CACHE_PREFIX) &&
              !currentCaches.has(cacheName)
          )
          .map((cacheName) => caches.delete(cacheName))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    request.headers.has("range")
  ) {
    return;
  }

  event.respondWith(networkFirst(request));
});

async function cacheQuoteImages() {
  try {
    const response = await fetch("./images.json", { cache: "reload" });
    if (!response.ok) return;

    const imagePaths = await response.json();
    const mediaCache = await caches.open(MEDIA_CACHE);

    await Promise.allSettled(
      imagePaths.map(async (path) => {
        const imageUrl = new URL(path, self.registration.scope);
        const imageResponse = await fetch(imageUrl);

        if (imageResponse.ok) {
          await mediaCache.put(imageUrl, imageResponse);
        }
      })
    );
  } catch (error) {
    console.warn("Quote images will be cached as they are viewed.", error);
  }
}

async function networkFirst(request) {
  const cacheName =
    request.destination === "image" ? MEDIA_CACHE : SHELL_CACHE;
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response.ok) {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        console.warn("The response loaded but could not be cached.", error);
      }
    }

    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    if (request.mode === "navigate") {
      return caches.match("./index.html");
    }

    throw error;
  }
}
