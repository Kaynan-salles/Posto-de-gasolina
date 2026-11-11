/**
 * GRUPO OLIVEIRA — SERVICE WORKER OFICIAL
 * Versão do Cache: go-pwa-v1.0.0
 * 
 * Regra Crítica: NÃO armazenar dados sensíveis, cadastros ou chaves de autenticação
 * em caches públicos. Apenas assets estáticos da casca da aplicação (App Shell).
 */

const CACHE_NAME = 'go-pwa-v1.3.4';

const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/instalar',
  '/instalar.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/qrcode.min.js',
  '/assets/js/jsqr.min.js',
  '/assets/img/brand/clean_logo_white.png',
  '/assets/img/brand/clean_logo_h_purple.png',
  '/assets/img/brand/favicon.png',
  '/assets/img/brand/icon-192.png',
  '/assets/img/brand/icon-512.png',
  '/assets/img/brand/icon-maskable-512.png',
  '/assets/img/brand/symbol_white.png'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Adiciona arquivos individualmente para tolerar arquivos ausentes durante dev
      return Promise.allSettled(
        APP_SHELL_ASSETS.map(url => cache.add(url).catch(err => {
          console.warn('[SW] Falha ao pré-cachear:', url, err.message);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache legado:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar requisições não-GET ou de outros domínios
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // NUNCA cachear rotas de API, Supabase ou dados dinâmicos
  if (url.pathname.startsWith('/api') || url.pathname.includes('/rest/v1') || url.pathname.includes('/auth/v1')) {
    return;
  }

  // Para navegações (páginas HTML) -> Network First sem cache HTTP obsoleto, com fallback offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() => {
        if (url.pathname.startsWith('/instalar')) {
          return caches.match('/instalar.html') || caches.match('/instalar');
        }
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Para arquivos estáticos (CSS, JS, Imagens, Fontes) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, cloned));
        }
        return networkResponse;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
