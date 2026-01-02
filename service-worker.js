const CACHE_NAME = 'fastcopy-v1';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './style.css',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache installation error:', err))
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache the new response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, return from cache
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Offline - Tidak ada cache tersedia', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync untuk pembayaran
self.addEventListener('sync', event => {
  if (event.tag === 'sync-payment') {
    event.waitUntil(syncPayment());
  }
});

async function syncPayment() {
  try {
    const pendingPayments = await getPendingPayments();
    for (const payment of pendingPayments) {
      await submitPayment(payment);
    }
  } catch (error) {
    console.error('Sync payment error:', error);
  }
}

async function getPendingPayments() {
  // Retrieve from IndexedDB atau localStorage
  return JSON.parse(localStorage.getItem('pendingPayments') || '[]');
}

async function submitPayment(payment) {
  // Implement your payment submission logic here
  console.log('Submitting payment:', payment);
}
