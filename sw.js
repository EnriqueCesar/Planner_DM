const CACHE='planner-dm-v6';
const ASSETS=['./','./index.html','./css/styles.css','./js/app.js','./data/agenda_base.js','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
