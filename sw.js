// Service Worker vuoto per evitare errori 404
// Questo file è opzionale e può essere rimosso se non necessario

self.addEventListener('install', function(event) {
    // Installa il service worker
    console.log('Service Worker installato');
});

self.addEventListener('activate', function(event) {
    // Attiva il service worker
    console.log('Service Worker attivato');
});

self.addEventListener('fetch', function(event) {
    // Gestisce le richieste di rete
    // Per ora non fa nulla, lascia passare tutte le richieste
    return;
});

