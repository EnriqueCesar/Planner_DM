const CACHE='planner-dm-v41';
const ASSETS=['./','./index.html','./css/styles.css','./js/app.js','./data/agenda_base.js','./data/day_plan.js','./data/visit_guide.js','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
