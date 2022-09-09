// Define o nome do cache atual, considerando a sua versão.
var cacheName = 'plates-v1';

self.addEventListener('install', function (event) {
  caches.open(cacheName).then((cache) => {
    cache.addAll([
      '/',
      '/index.html',
      './resources/all.min.css',
      './resources/all.min.js',
      './resources/lodash.min.js',
      '/manifest.webmanifest',
      '/styles.css',
      '/index.js',
      'icons/favicon.ico',
      'icons/android-icon-48x48.png',
      'icons/android-icon-72x72.png',
      'icons/android-icon-96x96.png',
      'icons/android-icon-144x144.png',
      'icons/android-icon-192x192.png',
      'icons/apple-icon-72x72.png',
      'icons/apple-icon-120x120.png',
      'icons/apple-icon-144x144.png',
      'icons/apple-icon-152x152.png',
      'icons/apple-icon-180x180.png',
    ]);
  });
});


self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  let response = caches.open(cacheName).then((cache) => {
    return cache.match(event.request).then((res) => {
      if (res) return res;
      return fetch(event.request).then((res) => {
        cache.put(event.request, res.clone());
        return res;
      });
    });
  });
  event.respondWith(response);
});