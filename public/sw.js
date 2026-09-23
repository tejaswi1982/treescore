// Never cache civic metrics, HTML or RSC responses. Offline is explicit.
const CACHE = 'treescore-static-v2';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/offline.html','/icons/icon-192.png','/icons/icon-512.png'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('treescore-') && key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin) return;
  if(event.request.mode==='navigate') {
    event.respondWith(fetch(event.request).catch(async()=>await caches.match('/offline.html') || new Response('TreeScore is offline. Reconnect to view reviewed estimates.',{status:503,headers:{'Content-Type':'text/plain'}})));
  }
});
