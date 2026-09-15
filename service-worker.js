// Service worker de Alerta Sísmica México
// Objetivo: que la app sea instalable y abra offline (pantalla base).
// IMPORTANTE: esto NO habilita notificaciones push reales en segundo plano.
// Un service worker solo "despierta" por un evento push, sync o click de
// notificación — no puede sondear el USGS/EMSC por su cuenta cuando la app
// está cerrada. Para alertas de verdad con la app cerrada hace falta un
// servidor propio que monitoree sismos y envíe push (Web Push + VAPID).
// Mientras tanto, la app avisa en tiempo real siempre que esté abierta
// (en una pestaña o como app instalada en primer/segundo plano).

const CACHE = 'sismos-mx-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // El shell de la app: cache primero, para que abra rápido y offline.
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Todo lo demás (USGS, EMSC, mapas, fuentes): siempre red, nunca cache,
  // porque son datos sísmicos en vivo.
});

// Si en el futuro agregas un servidor de push, aquí es donde se recibiría:
// self.addEventListener('push', (event) => {
//   const data = event.data ? event.data.json() : {};
//   event.waitUntil(self.registration.showNotification(data.title || 'Sismo detectado', {
//     body: data.body || '',
//     icon: 'icon-192.png'
//   }));
// });

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(list => {
      if(list.length > 0) return list[0].focus();
      return self.clients.openWindow('./index.html');
    })
  );
});
