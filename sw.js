/**
 * ALMA Kids - Service Worker PWA
 * Cache inteligente y funcionalidad offline
 */

const CACHE_NAME = 'almakids-v1.3.1';
const STATIC_CACHE = 'almakids-static-v1.3.1';
const DYNAMIC_CACHE = 'almakids-dynamic-v1.3.1';
const IMAGE_CACHE = 'almakids-images-v1.3.1';

// Archivos críticos para cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/eventos.html',
    '/globos-metalizados.html',
    '/faq.html',
    '/styles.css',
    '/animations.css',
    '/visual-fixes.css',
    '/layout-fixes.css',
    '/image-optimizer.js',
    '/form-enhancer.js',
    '/accessibility-enhancer.js',
    '/imagenes/ALMA kids Logo web.png',
    '/imagenes/castillo-3d-profesional.png',
    '/imagenes/castillo-inflable.png',
    '/imagenes/plaza-blanda.png',
    '/manifest.json'
];

// Imágenes de globos más populares para pre-cache
const POPULAR_BALLOON_IMAGES = [
    '/imagenes globos decoracion/globo-metalico-iron-man-31x58cm.png',
    '/imagenes globos decoracion/globo-metalico-corona-princesa-rosa-76x75cm.png',
    '/imagenes globos decoracion/globo-metalico-pokemon-charmander-37x58cm.png',
    '/imagenes globos decoracion/globo-metalico-leon-sombrero-76x49cm.png',
    '/imagenes globos decoracion/globo-metalico-dinosaurio-117x60cm.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('🎪 ALMA Kids SW: Instalando...');
    
    event.waitUntil(
        Promise.all([
            // Cache estático
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Cacheando archivos estáticos...');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Cache de imágenes populares
            caches.open(IMAGE_CACHE).then(cache => {
                console.log('🖼️ Cacheando imágenes populares...');
                return cache.addAll(POPULAR_BALLOON_IMAGES);
            })
        ])
    );
    
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('🎪 ALMA Kids SW: Activando...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Limpiar caches antiguos
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== IMAGE_CACHE) {
                        console.log('🗑️ Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Solo manejar requests del mismo origen
    if (url.origin !== location.origin) {
        return;
    }

    // Estrategia: Network First para HTML, Cache First para el resto
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(STATIC_CACHE).then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then(resp => resp || getOfflineFallback(request)))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                if (shouldUpdateInBackground(request)) {
                    updateInBackground(request);
                }
                return cachedResponse;
            }

            return fetch(request).then(response => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    const cacheToUse = getCacheForRequest(request);
                    caches.open(cacheToUse).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => getOfflineFallback(request));
        })
    );
});

function shouldUpdateInBackground(request) {
    // Actualizar archivos HTML y CSS en background
    return request.url.includes('.html') || 
           request.url.includes('.css') ||
           request.url.includes('.js');
}

function updateInBackground(request) {
    fetch(request).then(response => {
        if (response.status === 200) {
            const cacheToUse = getCacheForRequest(request);
            caches.open(cacheToUse).then(cache => {
                cache.put(request, response);
            });
        }
    }).catch(() => {
        // Silently fail background updates
    });
}

function getCacheForRequest(request) {
    const url = request.url;
    
    if (url.includes('globos decoracion') || 
        url.includes('.png') || 
        url.includes('.jpg') || 
        url.includes('.webp')) {
        return IMAGE_CACHE;
    }
    
    if (STATIC_ASSETS.some(asset => url.includes(asset))) {
        return STATIC_CACHE;
    }
    
    return DYNAMIC_CACHE;
}

function getOfflineFallback(request) {
    const url = request.url;
    
    // Fallback para páginas HTML
    if (request.headers.get('accept').includes('text/html')) {
        return caches.match('/index.html');
    }
    
    // Fallback para imágenes
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) {
        return caches.match('/imagenes/ALMA kids Logo web.png');
    }
    
    // Fallback genérico
    return new Response('Contenido no disponible offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// Sincronización en background
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Sincronizar datos pendientes cuando hay conexión
    return Promise.resolve();
}

// Push notifications (para futuro)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || '¡Nueva actualización de ALMA Kids!',
            icon: '/imagenes/ALMA kids Logo web.png',
            badge: '/imagenes/ALMA kids Logo web.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver Catálogo',
                    icon: '/imagenes/ALMA kids Logo web.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/imagenes/ALMA kids Logo web.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification('ALMA Kids', options)
        );
    }
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/globos-metalizados.html')
        );
    }
});

console.log('🎪 ALMA Kids Service Worker cargado correctamente');