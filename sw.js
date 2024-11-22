import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute, Route } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Configurando o cache de páginas
const pageCache = new CacheFirst({
  cacheName: 'primeira-pwa-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
    }),
  ],
});

// Indicando o cache de páginas
warmStrategyCache({
  urls: ['/index.html', '/'], // URLs para pré-cache
  strategy: pageCache,
});

// Registrando a rota para navegação
registerRoute(
  ({ request }) => request.mode === 'navigate',
  pageCache
);

// Configurando o cache de assets
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], 
      }),
    ],
  })
);

offlineFallback({
  pageFallback: '/offline.html', 
});

// Cache para imagens com tempo de expiração
const imageRoute = new Route(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
      }),
    ],
  })
);

registerRoute(imageRoute);
