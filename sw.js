// =========================================================
// Beta Cattle Tracker — RETIRED
//
// This app moved to:
//   https://johnfreagan.github.io/JFR-Ranch-cattle-management-office-app-/field-app/
//
// This file replaces the old caching service worker with one that
// self-destructs. Browsers re-check sw.js on navigation; because this file
// differs from the old one it installs, activates, wipes every cache this
// origin's old scope created, and unregisters itself.
//
// There is deliberately NO fetch handler — every request goes straight to the
// network, so the stale cached app can never be served again.
// =========================================================

self.addEventListener('install', () => {
    // Take over immediately instead of waiting for the old worker to be released.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // 1. Drop every cache (old shell lived in beta-cattle-v1).
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));

        // 2. Remove this registration so the scope is left clean.
        await self.registration.unregister();

        // 3. Reload any open tab so it picks up the redirect stub from network.
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
            client.navigate(client.url);
        }
    })());
});
