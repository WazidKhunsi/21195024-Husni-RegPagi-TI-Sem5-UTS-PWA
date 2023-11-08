// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "index.html",
        "index.js",
        "manifest.json",
        "style.css",
        // Include other assets you want to cache
      ]);
    })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== "my-cache")
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch requests and serve from cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
