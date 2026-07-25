// Service Worker pour Karyy's Food PWA
const CACHE_NAME = "karyys-food-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/"]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handling Push Notifications
self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.message || "Mise à jour sur votre commande !",
        icon: "/Karyys_Logo.jpg",
        badge: "/Karyys_Logo.jpg",
        vibrate: [100, 50, 100],
        data: {
          url: data.url || "/",
        },
      };

      event.waitUntil(
        self.registration.showNotification(data.title || "Karyy's Food", options)
      );
    } catch (e) {
      console.error("Error parsing push payload:", e);
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
