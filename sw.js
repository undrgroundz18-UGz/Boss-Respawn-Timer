const CACHE_VERSION = "v3";
const CACHE_NAME = `boss-respawn-cache-${CACHE_VERSION}`;

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// =====================
// FIREBASE (REQUIRED FIRST)
// =====================
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBbINsazxCJkEHBwySyrQ4FLZhdHC85Cyw",
  authDomain: "boss-respawn-timer.firebaseapp.com",
  projectId: "boss-respawn-timer",
  messagingSenderId: "767083470052",
  appId: "1:767083470052:web:17d7453fe66700321760f1"
});

const messaging = firebase.messaging();

// 🔔 BACKGROUND NOTIF
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(
    payload.notification?.title || "Boss Alert",
    {
      body: payload.notification?.body || "",
      icon: "./icon-192.png"
    }
  );
});

// =====================
// SERVICE WORKER CACHE
// =====================

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(ASSETS);
      } catch (err) {
        console.log("Cache failed:", err);
      }
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
