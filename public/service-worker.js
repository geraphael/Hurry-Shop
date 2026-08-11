const cacheName = 'hury-shop-shell-v1'
const staticAssets = ['/', '/index.html', '/manifest.webmanifest', '/favicon.ico']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(staticAssets)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }
      return fetch(event.request).catch(() => caches.match('/index.html'))
    }),
  )
})
