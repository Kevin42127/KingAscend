const CACHE_NAME = 'kings-ascend-v2'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)

  if (url.pathname === '/' || url.pathname === '/index.html' || 
      url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        return response
      }).catch(() => {
        if (url.pathname === '/' || url.pathname === '/index.html') {
          return caches.match('/index.html')
        }
        return new Response('', { status: 404 })
      })
    )
    return
  }

  if (event.request.destination === 'image' || 
      url.pathname.includes('.png') || 
      url.pathname.includes('.svg') ||
      url.pathname.includes('.ico') ||
      url.pathname.includes('.jpg') ||
      url.pathname.includes('.jpeg') ||
      url.pathname.includes('.webp')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        }).catch(() => {
          return new Response('', { status: 404 })
        })
      })
    )
    return
  }

  event.respondWith(fetch(event.request))
})

