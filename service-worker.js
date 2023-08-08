self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('cache-v1').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          '/icone-192x192.png',
          '/maskable-icon-512x512',
          '/icon-512x512.png',
          '/icon-515x515.png'
          // Adicione todos os outros arquivos necessários
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  