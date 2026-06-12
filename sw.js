const CACHE_NAME = 'hours-app-v2'; // עדכנו לגרסה 2
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// התקנה של הגרסה החדשה
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // הפקודה הזו מכריחה את הטלפון לעבור לגרסה החדשה מיד
  self.skipWaiting(); 
});

// מחיקת הגרסה הישנה (מנקה את הזיכרון התקוע)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // מוחק את v1
          }
        })
      );
    })
  );
  self.clients.claim();
});

// קריאה לקבצים כרגיל כדי שהאפליקציה תעבוד גם בלי אינטרנט
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
