/* Hält die Mappe offline verfügbar. Erst das Netz (damit eine neue Version ankommt), sonst der Speicher. */
const C = "belegmappe-v1", DATEIEN = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => { if(e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { if(r.ok && new URL(e.request.url).origin === location.origin){ const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("./index.html")))); });
