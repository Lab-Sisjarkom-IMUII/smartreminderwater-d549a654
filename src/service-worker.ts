/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute, NavigationRouter } from "workbox-routing";
import {
  CacheFirst,
  StaleWhileRevalidate,
  NetworkFirst,
} from "workbox-strategies";

clientsClaim();

// Clean up outdated caches
cleanupOutdatedCaches();

// Precache files from Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache CSS and JS files with CacheFirst strategy
registerRoute(
  ({ request }) =>
    request.destination === "style" || request.destination === "script",
  new CacheFirst({
    cacheName: "static-resources",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses with NetworkFirst strategy (for better UX with fallback)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Navigation route for SPA
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigations",
    networkTimeoutSeconds: 3,
  }),
  {
    denylist: [/^\/api\//],
  }
);

self.router.registerRoute(navigationRoute);

// Handle messages from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
