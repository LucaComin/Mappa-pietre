// Variabili globali
let map; // La mappa principale
let miniMap; // La mini-mappa nel pannello storia
let allStonesData = {}; // Oggetto per memorizzare i dati delle pietre, raggruppati per nome
let currentMarkers = L.featureGroup(); // Gruppo di marcatori attualmente sulla mappa
let currentPolylines = L.featureGroup(); // Gruppo di polilinee attualmente sulla mappa
let currentImageMarkers = L.markerClusterGroup(); // Gruppo di marcatori per le immagini con clustering

// Variabili per la riproduzione automatica
let autoPlayInterval = null;
let isAutoPlaying = false;
let autoPlaySpeed = 2000; // 2 secondi

// Sistema di internazionalizzazione
let currentLanguage = 'it';
const translations = {
    it: {
        'title': 'Mappa delle Pietre',
        'subtitle': 'Esplora la storia attraverso il tempo',
        'language': 'Lingua:',
        'select-stone': 'Seleziona una pietra:',
        'show-images': 'Mostra immagini:',
        'show-all': 'Mostra tutte',
        'last': 'Ultima',
        'none': 'Nessuna',
        'all': 'Tutte',
        'history-of': 'Storia di',
        'play': 'Play',
        'pause': 'Pausa',
        'previous': 'Precedente',
        'next': 'Successiva',
        'historical-path': 'Percorso storico',
        'current-position': 'Posizione attuale',
        'movements-timeline': 'Timeline degli spostamenti',
        'start': 'Inizio',
        'end': 'Fine',
        'see-history': 'Vedi la storia',
        'last-position': 'Ultima posizione:',
        'loading-map': 'Caricamento mappa...',
        'search': 'Cerca:',
        'search-placeholder': 'Cerca una pietra...',
        'no-results': 'Nessun risultato trovato',
        'clear-search': 'Cancella ricerca',
        // Nomi delle pietre
        'Pietra_Rossa': 'Pietra Rossa',
        'Pietra_Blu': 'Pietra Blu',
        'Pietra_Verde': 'Pietra Verde'
    },
    en: {
        'title': 'Stones Map',
        'subtitle': 'Explore history through time',
        'language': 'Language:',
        'select-stone': 'Select a stone:',
        'show-images': 'Show images:',
        'show-all': 'Show all',
        'last': 'Last',
        'none': 'None',
        'all': 'All',
        'history-of': 'History of',
        'play': 'Play',
        'pause': 'Pause',
        'previous': 'Previous',
        'next': 'Next',
        'historical-path': 'Historical path',
        'current-position': 'Current position',
        'movements-timeline': 'Movements timeline',
        'start': 'Start',
        'end': 'End',
        'see-history': 'See history',
        'last-position': 'Last position:',
        'loading-map': 'Loading map...',
        'search': 'Search:',
        'search-placeholder': 'Search for a stone...',
        'no-results': 'No results found',
        'clear-search': 'Clear search',
        // Nomi delle pietre
        'Pietra_Rossa': 'Red Stone',
        'Pietra_Blu': 'Blue Stone',
        'Pietra_Verde': 'Green Stone'
    },
    es: {
        'title': 'Mapa de Piedras',
        'subtitle': 'Explora la historia a través del tiempo',
        'language': 'Idioma:',
        'select-stone': 'Selecciona una piedra:',
        'show-images': 'Mostrar imágenes:',
        'show-all': 'Mostrar todas',
        'last': 'Última',
        'none': 'Ninguna',
        'all': 'Todas',
        'history-of': 'Historia de',
        'play': 'Reproducir',
        'pause': 'Pausa',
        'previous': 'Anterior',
        'next': 'Siguiente',
        'historical-path': 'Ruta histórica',
        'current-position': 'Posición actual',
        'movements-timeline': 'Cronología de movimientos',
        'start': 'Inicio',
        'end': 'Fin',
        'see-history': 'Ver historia',
        'last-position': 'Última posición:',
        'loading-map': 'Cargando mapa...',
        'search': 'Buscar:',
        'search-placeholder': 'Buscar una piedra...',
        'no-results': 'No se encontraron resultados',
        'clear-search': 'Limpiar búsqueda',
        // Nomi delle pietre
        'Pietra_Rossa': 'Piedra Roja',
        'Pietra_Blu': 'Piedra Azul',
        'Pietra_Verde': 'Piedra Verde'
    },
    fr: {
        'title': 'Carte des Pierres',
        'subtitle': 'Explorez l\'histoire à travers le temps',
        'language': 'Langue:',
        'select-stone': 'Sélectionnez une pierre:',
        'show-images': 'Afficher les images:',
        'show-all': 'Afficher toutes',
        'last': 'Dernière',
        'none': 'Aucune',
        'all': 'Toutes',
        'history-of': 'Histoire de',
        'play': 'Lecture',
        'pause': 'Pause',
        'previous': 'Précédent',
        'next': 'Suivant',
        'historical-path': 'Chemin historique',
        'current-position': 'Position actuelle',
        'movements-timeline': 'Chronologie des mouvements',
        'start': 'Début',
        'end': 'Fin',
        'see-history': 'Voir l\'histoire',
        'last-position': 'Dernière position:',
        'loading-map': 'Chargement de la carte...',
        'search': 'Rechercher:',
        'search-placeholder': 'Rechercher une pierre...',
        'no-results': 'Aucun résultat trouvé',
        'clear-search': 'Effacer la recherche',
        // Nomi delle pietre
        'Pietra_Rossa': 'Pierre Rouge',
        'Pietra_Blu': 'Pierre Bleue',
        'Pietra_Verde': 'Pierre Verte'
    },
    de: {
        'title': 'Steinkarte',
        'subtitle': 'Erkunden Sie die Geschichte durch die Zeit',
        'language': 'Sprache:',
        'select-stone': 'Wählen Sie einen Stein:',
        'show-images': 'Bilder anzeigen:',
        'show-all': 'Alle anzeigen',
        'last': 'Letzte',
        'none': 'Keine',
        'all': 'Alle',
        'history-of': 'Geschichte von',
        'play': 'Abspielen',
        'pause': 'Pause',
        'previous': 'Vorherige',
        'next': 'Nächste',
        'historical-path': 'Historischer Pfad',
        'current-position': 'Aktuelle Position',
        'movements-timeline': 'Bewegungszeitleiste',
        'start': 'Start',
        'end': 'Ende',
        'see-history': 'Geschichte ansehen',
        'last-position': 'Letzte Position:',
        'loading-map': 'Karte wird geladen...',
        'search': 'Suchen:',
        'search-placeholder': 'Nach einem Stein suchen...',
        'no-results': 'Keine Ergebnisse gefunden',
        'clear-search': 'Suche löschen',
        // Nomi delle pietre
        'Pietra_Rossa': 'Roter Stein',
        'Pietra_Blu': 'Blauer Stein',
        'Pietra_Verde': 'Grüner Stein'
    }
};

// Dati delle pietre con posizioni e immagini
const stonesData = [
    {
        name: "Pietra_Rossa",
        lat: 45.4642,
        lng: 9.1900,
        timestamp: "2023-01-15T10:30:00Z",
        image: "https://picsum.photos/400/300?random=1"
    },
    {
        name: "Pietra_Rossa",
        lat: 45.4652,
        lng: 9.1910,
        timestamp: "2023-02-20T14:15:00Z",
        image: "https://picsum.photos/400/300?random=2"
    },
    {
        name: "Pietra_Rossa",
        lat: 45.4662,
        lng: 9.1920,
        timestamp: "2023-03-25T09:45:00Z",
        image: "https://picsum.photos/400/300?random=3"
    },
    {
        name: "Pietra_Blu",
        lat: 45.4672,
        lng: 9.1930,
        timestamp: "2023-01-10T11:00:00Z",
        image: "https://picsum.photos/400/300?random=4"
    },
    {
        name: "Pietra_Blu",
        lat: 45.4682,
        lng: 9.1940,
        timestamp: "2023-02-15T16:30:00Z",
        image: "https://picsum.photos/400/300?random=5"
    },
    {
        name: "Pietra_Verde",
        lat: 45.4692,
        lng: 9.1950,
        timestamp: "2023-01-05T08:20:00Z",
        image: "https://picsum.photos/400/300?random=6"
    }
];

// Funzione per ottenere la traduzione
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Funzione per aggiornare le traduzioni nell'interfaccia
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Funzione per inizializzare la mappa
function initMap() {
    // Crea la mappa principale
    map = L.map('map').setView([45.4642, 9.1900], 13);
    
    // Aggiungi il layer della mappa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Aggiungi i gruppi alla mappa
    map.addLayer(currentMarkers);
    map.addLayer(currentPolylines);
    map.addLayer(currentImageMarkers);
    
    // Processa i dati delle pietre
    processStoneData();
    
    // Carica tutte le pietre inizialmente
    updateMap('all');
    
    // Nascondi l'overlay di caricamento
    hideLoadingOverlay();
}

// Funzione per processare i dati delle pietre
function processStoneData() {
    stonesData.forEach(stone => {
        if (!allStonesData[stone.name]) {
            allStonesData[stone.name] = [];
        }
        allStonesData[stone.name].push(stone);
    });
    
    // Ordina i dati per timestamp
    Object.keys(allStonesData).forEach(stoneName => {
        allStonesData[stoneName].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });
    
    // Popola il dropdown delle pietre
    populateStoneDropdown();
}

// Funzione per popolare il dropdown delle pietre
function populateStoneDropdown() {
    const dropdownOptions = document.getElementById('dropdown-options');
    
    // Mantieni l'opzione "Mostra tutte"
    const showAllOption = dropdownOptions.querySelector('[data-value="all"]');
    dropdownOptions.innerHTML = '';
    dropdownOptions.appendChild(showAllOption);
    
    // Aggiungi le opzioni per ogni pietra
    Object.keys(allStonesData).forEach(stoneName => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', stoneName);
        option.setAttribute('role', 'option');
        option.innerHTML = `<span>${t(stoneName)}</span>`;
        
        option.addEventListener('click', () => {
            selectDropdownOption(stoneName, t(stoneName));
        });
        
        dropdownOptions.appendChild(option);
    });
}

// Funzione per aggiornare la mappa
function updateMap(selectedStone) {
    // Pulisci i marcatori e le linee esistenti
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();
    
    const imageDisplayMode = document.getElementById('image-display-select').value;
    
    if (selectedStone === 'all') {
        // Mostra tutte le pietre
        Object.keys(allStonesData).forEach(stoneName => {
            const stoneData = allStonesData[stoneName];
            addStoneToMap(stoneName, stoneData, imageDisplayMode);
        });
    } else {
        // Mostra solo la pietra selezionata
        const stoneData = allStonesData[selectedStone];
        if (stoneData) {
            addStoneToMap(selectedStone, stoneData, imageDisplayMode);
        }
    }
}

// Funzione per aggiungere una pietra alla mappa
function addStoneToMap(stoneName, stoneData, imageDisplayMode) {
    const color = getStoneColor(stoneName);
    
    // Aggiungi marcatori per ogni posizione
    stoneData.forEach((position, index) => {
        // Marcatore principale
        const marker = L.circleMarker([position.lat, position.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: 8
        });
        
        // Popup con informazioni
        const popupContent = `
            <div class="popup-content">
                <h3>${t(stoneName)}</h3>
                <p><strong>${t('last-position')}:</strong> ${new Date(position.timestamp).toLocaleString()}</p>
                <button onclick="showStoneHistory('${stoneName}')" class="history-btn">${t('see-history')}</button>
            </div>
        `;
        marker.bindPopup(popupContent);
        currentMarkers.addLayer(marker);
        
        // Aggiungi marcatori per le immagini se necessario
        if (imageDisplayMode !== 'none') {
            if (imageDisplayMode === 'all' || index === stoneData.length - 1) {
                const imageMarker = L.marker([position.lat, position.lng], {
                    icon: L.divIcon({
                        className: 'image-marker',
                        html: '📷',
                        iconSize: [20, 20]
                    })
                });
                
                imageMarker.bindPopup(`
                    <div class="image-popup">
                        <img src="${position.image}" alt="${t(stoneName)}" style="max-width: 200px; max-height: 150px;">
                        <p>${new Date(position.timestamp).toLocaleString()}</p>
                    </div>
                `);
                
                currentImageMarkers.addLayer(imageMarker);
            }
        }
    });
    
    // Aggiungi linee che collegano le posizioni
    if (stoneData.length > 1) {
        const latlngs = stoneData.map(pos => [pos.lat, pos.lng]);
        const polyline = L.polyline(latlngs, {
            color: color,
            weight: 3,
            opacity: 0.7
        });
        currentPolylines.addLayer(polyline);
    }
}

// Funzione per ottenere il colore di una pietra
function getStoneColor(stoneName) {
    const colors = {
        'Pietra_Rossa': '#e74c3c',
        'Pietra_Blu': '#3498db',
        'Pietra_Verde': '#2ecc71'
    };
    return colors[stoneName] || '#95a5a6';
}

// Funzione per mostrare la storia di una pietra
function showStoneHistory(stoneName) {
    const stoneData = allStonesData[stoneName];
    if (!stoneData || stoneData.length === 0) return;
    
    // Aggiorna il titolo del pannello
    document.getElementById('history-title').textContent = `${t('history-of')} ${t(stoneName)}`;
    
    // Inizializza la galleria immagini
    initImageGallery(stoneData);
    
    // Inizializza la mini mappa
    initMiniMap(stoneData);
    
    // Inizializza la timeline
    initTimeline(stoneData);
    
    // Mostra il pannello
    document.getElementById('history-panel').classList.remove('hidden');
}

// Funzione per inizializzare la galleria immagini
function initImageGallery(stoneData) {
    window.currentImageIndex = 0;
    window.currentStoneData = stoneData;
    
    updateImageDisplay();
}

// Funzione per aggiornare la visualizzazione dell'immagine
function updateImageDisplay() {
    const data = window.currentStoneData[window.currentImageIndex];
    const img = document.getElementById('history-image');
    const caption = document.getElementById('history-image-caption');
    const counter = document.getElementById('image-counter');
    
    img.src = data.image;
    caption.textContent = new Date(data.timestamp).toLocaleString();
    counter.textContent = `${window.currentImageIndex + 1} di ${window.currentStoneData.length}`;
    
    // Aggiorna i pulsanti
    document.getElementById('prev-button').disabled = window.currentImageIndex === 0;
    document.getElementById('next-button').disabled = window.currentImageIndex === window.currentStoneData.length - 1;
}

// Funzione per inizializzare la mini mappa
function initMiniMap(stoneData) {
    // Rimuovi la mappa esistente se presente
    if (miniMap) {
        miniMap.remove();
    }
    
    // Crea la nuova mini mappa
    miniMap = L.map('mini-map').setView([stoneData[0].lat, stoneData[0].lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(miniMap);
    
    // Aggiungi marcatori e linee
    const latlngs = stoneData.map(pos => [pos.lat, pos.lng]);
    
    // Linea del percorso
    L.polyline(latlngs, {
        color: '#3498db',
        weight: 3,
        opacity: 0.7
    }).addTo(miniMap);
    
    // Marcatori per ogni posizione
    stoneData.forEach((pos, index) => {
        const isLast = index === stoneData.length - 1;
        L.circleMarker([pos.lat, pos.lng], {
            color: isLast ? '#e74c3c' : '#3498db',
            fillColor: isLast ? '#e74c3c' : '#3498db',
            fillOpacity: 0.7,
            radius: isLast ? 8 : 6
        }).addTo(miniMap);
    });
    
    // Adatta la vista per mostrare tutti i punti
    if (latlngs.length > 1) {
        miniMap.fitBounds(latlngs);
    }
}

// Funzione per inizializzare la timeline
function initTimeline(stoneData) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    stoneData.forEach((pos, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.left = `${(index / (stoneData.length - 1)) * 100}%`;
        
        timelineItem.addEventListener('click', () => {
            window.currentImageIndex = index;
            updateImageDisplay();
        });
        
        timeline.appendChild(timelineItem);
    });
    
    // Aggiorna le date di inizio e fine
    document.getElementById('timeline-current-date').textContent = new Date(stoneData[0].timestamp).toLocaleDateString();
    document.querySelector('.timeline-start').textContent = new Date(stoneData[0].timestamp).toLocaleDateString();
    document.querySelector('.timeline-end').textContent = new Date(stoneData[stoneData.length - 1].timestamp).toLocaleDateString();
}

// Funzione per nascondere l'overlay di caricamento
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

// Funzioni per la navigazione delle immagini
function nextImage() {
    if (window.currentImageIndex < window.currentStoneData.length - 1) {
        window.currentImageIndex++;
        updateImageDisplay();
    }
}

function prevImage() {
    if (window.currentImageIndex > 0) {
        window.currentImageIndex--;
        updateImageDisplay();
    }
}

// Funzione per la riproduzione automatica
function toggleAutoPlay() {
    const btn = document.getElementById('play-pause-btn');
    const icon = btn.querySelector('.btn-icon');
    const text = btn.querySelector('.btn-text');
    
    if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        icon.textContent = '▶️';
        text.textContent = t('play');
    } else {
        autoPlayInterval = setInterval(() => {
            if (window.currentImageIndex < window.currentStoneData.length - 1) {
                nextImage();
            } else {
                window.currentImageIndex = 0;
                updateImageDisplay();
            }
        }, autoPlaySpeed);
        isAutoPlaying = true;
        icon.textContent = '⏸️';
        text.textContent = t('pause');
    }
}

// Funzioni per il dropdown personalizzato
function toggleDropdown() {
    const dropdown = document.getElementById('stone-dropdown');
    const menu = document.getElementById('dropdown-menu');
    const trigger = document.getElementById('dropdown-trigger');
    
    const isOpen = menu.style.display === 'block';
    
    if (isOpen) {
        menu.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
    } else {
        menu.style.display = 'block';
        trigger.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('open');
        document.getElementById('dropdown-search-input').focus();
    }
}

function selectDropdownOption(value, text) {
    document.getElementById('dropdown-value').textContent = text;
    document.getElementById('dropdown-menu').style.display = 'none';
    document.getElementById('dropdown-trigger').setAttribute('aria-expanded', 'false');
    document.getElementById('stone-dropdown').classList.remove('open');
    
    // Aggiorna la mappa
    updateMap(value);
    
    // Pulisci la ricerca
    document.getElementById('dropdown-search-input').value = '';
    filterDropdownOptions('');
}

function filterDropdownOptions(searchTerm) {
    const options = document.querySelectorAll('.dropdown-option');
    let hasVisibleOptions = false;
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        
        option.style.display = matches ? 'block' : 'none';
        if (matches) hasVisibleOptions = true;
    });
    
    // Mostra/nascondi il messaggio "Nessun risultato"
    let noResultsMsg = document.querySelector('.no-results-message');
    if (!hasVisibleOptions && searchTerm) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message dropdown-option';
            noResultsMsg.textContent = t('no-results');
            document.getElementById('dropdown-options').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

function clearDropdownSearch() {
    const searchInput = document.getElementById('dropdown-search-input');
    searchInput.value = '';
    filterDropdownOptions('');
    searchInput.focus();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza la mappa
    initMap();
    
    // Event listener per il cambio di lingua
    document.getElementById('language-select').addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        updateTranslations();
        populateStoneDropdown();
    });
    
    // Event listener per il cambio di modalità immagini
    document.getElementById('image-display-select').addEventListener('change', function() {
        const selectedStone = document.getElementById('dropdown-value').textContent === t('show-all') ? 'all' : 
                             Object.keys(allStonesData).find(key => t(key) === document.getElementById('dropdown-value').textContent) || 'all';
        updateMap(selectedStone);
    });
    
    // Event listeners per il dropdown personalizzato
    document.getElementById('dropdown-trigger').addEventListener('click', toggleDropdown);
    
    // Event listener per la ricerca nel dropdown
    document.getElementById('dropdown-search-input').addEventListener('input', function(e) {
        filterDropdownOptions(e.target.value);
    });
    
    // Event listener per il pulsante di cancellazione ricerca
    document.getElementById('clear-dropdown-search').addEventListener('click', clearDropdownSearch);
    
    // Event listeners per la navigazione delle immagini
    document.getElementById('next-button').addEventListener('click', nextImage);
    document.getElementById('prev-button').addEventListener('click', prevImage);
    
    // Event listener per chiudere il pannello storia
    document.getElementById('close-history').addEventListener('click', function() {
        document.getElementById('history-panel').classList.add('hidden');
        if (isAutoPlaying) {
            toggleAutoPlay();
        }
    });
    
    // Event listener per il fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        const img = document.getElementById('history-image');
        const modal = document.getElementById('fullscreen-modal');
        const fullscreenImg = document.getElementById('fullscreen-image');
        
        fullscreenImg.src = img.src;
        modal.classList.remove('hidden');
    });
    
    document.getElementById('close-fullscreen').addEventListener('click', function() {
        document.getElementById('fullscreen-modal').classList.add('hidden');
    });
    
    // Chiudi dropdown quando si clicca fuori
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('stone-dropdown');
        if (!dropdown.contains(e.target)) {
            document.getElementById('dropdown-menu').style.display = 'none';
            document.getElementById('dropdown-trigger').setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('open');
        }
    });
    
    // Chiudi modal fullscreen con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('fullscreen-modal').classList.add('hidden');
            document.getElementById('history-panel').classList.add('hidden');
        }
    });
    
    // Supporto per i tasti freccia nella navigazione immagini
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('history-panel').classList.contains('hidden')) return;
        
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAutoPlay();
        }
    });
});

