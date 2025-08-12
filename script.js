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

// Variabili per la galleria immagini
let currentImageIndex = 0;
let currentStoneImages = [];

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
        'title': 'Steinekarte',
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
        'search-placeholder': 'Einen Stein suchen...', 
        'no-results': 'Keine Ergebnisse gefunden',
        'clear-search': 'Suche löschen',
        // Nomi delle pietre
        'Pietra_Rossa': 'Roter Stein',
        'Pietra_Blu': 'Blauer Stein',
        'Pietra_Verde': 'Grüner Stein'
    }
};

// Dati di esempio per le pietre (sostituisci con i tuoi dati reali)
const sampleStonesData = {
    "Pietra_Rossa": [
        {
            "timestamp": "2024-01-15T10:30:00Z",
            "latitude": 45.4642,
            "longitude": 9.1900,
            "image": "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Pietra+Rossa+1"
        },
        {
            "timestamp": "2024-02-20T14:15:00Z",
            "latitude": 45.4700,
            "longitude": 9.1950,
            "image": "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Pietra+Rossa+2"
        },
        {
            "timestamp": "2024-03-10T09:45:00Z",
            "latitude": 45.4750,
            "longitude": 9.2000,
            "image": "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Pietra+Rossa+3"
        }
    ],
    "Pietra_Blu": [
        {
            "timestamp": "2024-01-10T11:00:00Z",
            "latitude": 45.4600,
            "longitude": 9.1850,
            "image": "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Pietra+Blu+1"
        },
        {
            "timestamp": "2024-02-25T16:30:00Z",
            "latitude": 45.4680,
            "longitude": 9.1920,
            "image": "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Pietra+Blu+2"
        }
    ],
    "Pietra_Verde": [
        {
            "timestamp": "2024-01-20T08:20:00Z",
            "latitude": 45.4580,
            "longitude": 9.1800,
            "image": "https://via.placeholder.com/400x300/95e1d3/ffffff?text=Pietra+Verde+1"
        },
        {
            "timestamp": "2024-03-05T13:10:00Z",
            "latitude": 45.4620,
            "longitude": 9.1880,
            "image": "https://via.placeholder.com/400x300/95e1d3/ffffff?text=Pietra+Verde+2"
        },
        {
            "timestamp": "2024-03-15T17:45:00Z",
            "latitude": 45.4660,
            "longitude": 9.1930,
            "image": "https://via.placeholder.com/400x300/95e1d3/ffffff?text=Pietra+Verde+3"
        }
    ]
};

// Funzione per tradurre il testo
function translate(key) {
    return translations[currentLanguage][key] || translations['it'][key] || key;
}

// Funzione per tradurre i nomi delle pietre
function translateStoneName(stoneName) {
    // Controlla se esistono le traduzioni per la lingua corrente
    if (!translations[currentLanguage]) {
        return stoneName.replace(/_/g, ' ');
    }
    
    // Cerca prima nelle traduzioni dirette
    if (translations[currentLanguage][stoneName]) {
        return translations[currentLanguage][stoneName];
    }
    
    // Fallback alle traduzioni italiane
    if (translations['it'][stoneName]) {
        return translations['it'][stoneName];
    }
    
    // Fallback finale: formatta il nome
    return stoneName.replace(/_/g, ' ');
}

// Funzione per aggiornare la lingua dell'interfaccia
function updateLanguage(langCode) {
    currentLanguage = langCode;
    
    // Salva la preferenza nel localStorage
    localStorage.setItem('preferredLanguage', langCode);
    
    // Aggiorna tutti gli elementi con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translate(key);
    });
    
    // Aggiorna i placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = translate(key);
    });
    
    // Aggiorna il titolo della pagina
    document.title = translate('title');
    
    // Aggiorna il documento lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Aggiorna il dropdown delle pietre
    populateStoneSelect();
}

// Funzione per rilevare la lingua del browser
function detectBrowserLanguage() {
    // Controlla se c'è una preferenza salvata
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
    }
    
    // Rileva la lingua del browser
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // es: 'en-US' -> 'en'
    
    // Verifica se la lingua è supportata
    if (translations[langCode]) {
        return langCode;
    }
    
    return 'it'; // Fallback all'italiano
}

// Funzione per inizializzare la mappa
function initializeMap() {
    // Inizializza la mappa principale
    map = L.map('map', {
        center: [45.4642, 9.1900], // Milano come centro predefinito
        zoom: 13,
        zoomControl: true,
        attributionControl: true
    });

    // Aggiungi il layer di base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Aggiungi i gruppi di layer alla mappa
    map.addLayer(currentMarkers);
    map.addLayer(currentPolylines);
    map.addLayer(currentImageMarkers);

    console.log('Mappa inizializzata con successo');
}

// Funzione per caricare i dati delle pietre
function loadStonesData() {
    // Usa i dati di esempio
    allStonesData = sampleStonesData;
    
    console.log('Dati delle pietre caricati:', allStonesData);
    
    // Popola il dropdown delle pietre
    populateStoneSelect();
    
    // Mostra tutte le pietre sulla mappa
    displayFilteredStonesOnMap('all');
}

// Funzione per popolare il select delle pietre
function populateStoneSelect() {
    const stoneSelect = document.getElementById('stone-select');
    if (!stoneSelect) return;
    
    // Pulisci le opzioni esistenti (tranne "Mostra tutte")
    stoneSelect.innerHTML = '<option value="all" data-i18n="show-all">' + translate('show-all') + '</option>';
    
    // Aggiungi le pietre
    for (const stoneName in allStonesData) {
        const option = document.createElement('option');
        option.value = stoneName;
        option.textContent = translateStoneName(stoneName);
        stoneSelect.appendChild(option);
    }
}

// Funzione per visualizzare le pietre filtrate sulla mappa
function displayFilteredStonesOnMap(selectedStone) {
    // Pulisci i layer esistenti
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    const imageDisplayMode = document.getElementById('image-display-select')?.value || 'last';
    
    // Determina quali pietre mostrare
    const stonesToShow = selectedStone === 'all' ? Object.keys(allStonesData) : [selectedStone];
    
    stonesToShow.forEach(stoneName => {
        const stoneData = allStonesData[stoneName];
        if (!stoneData || stoneData.length === 0) return;
        
        // Ordina i dati per timestamp
        const sortedData = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Crea i marcatori per le posizioni
        const positions = sortedData.map(entry => [entry.latitude, entry.longitude]);
        
        // Aggiungi la polilinea per il percorso
        if (positions.length > 1) {
            const polyline = L.polyline(positions, {
                color: getStoneColor(stoneName),
                weight: 3,
                opacity: 0.7
            });
            currentPolylines.addLayer(polyline);
        }
        
        // Aggiungi i marcatori
        sortedData.forEach((entry, index) => {
            const isLast = index === sortedData.length - 1;
            
            // Marcatore per la posizione
            const marker = L.circleMarker([entry.latitude, entry.longitude], {
                radius: isLast ? 10 : 6,
                fillColor: getStoneColor(stoneName),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: isLast ? 1 : 0.7
            });
            
            // Popup con informazioni
            const popupContent = `
                <div class="popup-content">
                    <h3>${translateStoneName(stoneName)}</h3>
                    <p><strong>Data:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
                    <p><strong>Posizione:</strong> ${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}</p>
                    ${isLast ? '<p><em>Ultima posizione</em></p>' : ''}
                    <button onclick="showStoneHistory('${stoneName}')" class="history-btn">
                        ${translate('see-history')}
                    </button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            currentMarkers.addLayer(marker);
            
            // Aggiungi marcatori per le immagini se necessario
            if (shouldShowImage(imageDisplayMode, index, sortedData.length - 1)) {
                const imageMarker = L.marker([entry.latitude, entry.longitude], {
                    icon: L.divIcon({
                        className: 'image-marker',
                        html: '<div class="image-marker-content">📷</div>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                });
                
                imageMarker.bindPopup(`
                    <div class="image-popup">
                        <img src="${entry.image}" alt="${translateStoneName(stoneName)}" style="max-width: 200px; max-height: 150px;">
                        <p>${new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                `);
                
                currentImageMarkers.addLayer(imageMarker);
            }
        });
    });
    
    // Adatta la vista della mappa ai marcatori
    if (currentMarkers.getLayers().length > 0) {
        const group = new L.featureGroup([...currentMarkers.getLayers(), ...currentPolylines.getLayers()]);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Funzione per determinare se mostrare un'immagine
function shouldShowImage(mode, index, lastIndex) {
    switch (mode) {
        case 'all':
            return true;
        case 'last':
            return index === lastIndex;
        case 'none':
            return false;
        default:
            return false;
    }
}

// Funzione per ottenere il colore di una pietra
function getStoneColor(stoneName) {
    const colors = {
        'Pietra_Rossa': '#ff6b6b',
        'Pietra_Blu': '#4ecdc4',
        'Pietra_Verde': '#95e1d3'
    };
    return colors[stoneName] || '#666666';
}

// Funzione per mostrare la storia di una pietra
function showStoneHistory(stoneName) {
    const stoneData = allStonesData[stoneName];
    if (!stoneData || stoneData.length === 0) return;
    
    // Aggiorna il titolo del pannello
    const historyTitle = document.getElementById('history-title');
    if (historyTitle) {
        historyTitle.textContent = translate('history-of') + ' ' + translateStoneName(stoneName);
    }
    
    // Inizializza la galleria immagini
    initializeImageGallery(stoneData, stoneName);
    
    // Inizializza la mini-mappa
    initializeMiniMap(stoneData, stoneName);
    
    // Inizializza la timeline
    initializeTimeline(stoneData);
    
    // Mostra il pannello
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.classList.remove('hidden');
    }
}

// Funzione per inizializzare la galleria immagini
function initializeImageGallery(stoneData, stoneName) {
    currentStoneImages = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    currentImageIndex = 0;
    
    updateImageDisplay();
    updateNavigationButtons();
}

// Funzione per aggiornare la visualizzazione dell'immagine
function updateImageDisplay() {
    if (currentStoneImages.length === 0) return;
    
    const currentImage = currentStoneImages[currentImageIndex];
    const historyImage = document.getElementById('history-image');
    const imageCaption = document.getElementById('history-image-caption');
    const imageCounter = document.getElementById('image-counter');
    
    if (historyImage) {
        historyImage.src = currentImage.image;
        historyImage.alt = 'Immagine ' + (currentImageIndex + 1);
    }
    
    if (imageCaption) {
        imageCaption.textContent = new Date(currentImage.timestamp).toLocaleString();
    }
    
    if (imageCounter) {
        imageCounter.textContent = (currentImageIndex + 1) + ' di ' + currentStoneImages.length;
    }
}

// Funzione per aggiornare i bottoni di navigazione
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    if (prevButton) {
        prevButton.disabled = currentImageIndex === 0;
    }
    
    if (nextButton) {
        nextButton.disabled = currentImageIndex === currentStoneImages.length - 1;
    }
}

// Funzione per andare all'immagine precedente
function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImageDisplay();
        updateNavigationButtons();
        updateMiniMapCurrentPosition();
        updateTimelinePosition();
    }
}

// Funzione per andare all'immagine successiva
function nextImage() {
    if (currentImageIndex < currentStoneImages.length - 1) {
        currentImageIndex++;
        updateImageDisplay();
        updateNavigationButtons();
        updateMiniMapCurrentPosition();
        updateTimelinePosition();
    }
}

// Funzione per attivare/disattivare la riproduzione automatica
function toggleAutoPlay() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const btnIcon = playPauseBtn?.querySelector('.btn-icon');
    const btnText = playPauseBtn?.querySelector('.btn-text');
    
    if (isAutoPlaying) {
        // Ferma la riproduzione
        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        if (btnIcon) btnIcon.textContent = '▶️';
        if (btnText) btnText.textContent = translate('play');
    } else {
        // Avvia la riproduzione
        autoPlayInterval = setInterval(() => {
            if (currentImageIndex < currentStoneImages.length - 1) {
                nextImage();
            } else {
                // Ricomincia dall'inizio
                currentImageIndex = 0;
                updateImageDisplay();
                updateNavigationButtons();
                updateMiniMapCurrentPosition();
                updateTimelinePosition();
            }
        }, autoPlaySpeed);
        
        isAutoPlaying = true;
        if (btnIcon) btnIcon.textContent = '⏸️';
        if (btnText) btnText.textContent = translate('pause');
    }
}

// Funzione per inizializzare la mini-mappa
function initializeMiniMap(stoneData, stoneName) {
    const miniMapContainer = document.getElementById('mini-map');
    if (!miniMapContainer) return;
    
    // Rimuovi la mappa esistente se presente
    if (miniMap) {
        miniMap.remove();
    }
    
    // Crea la nuova mini-mappa
    miniMap = L.map('mini-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    });
    
    // Aggiungi il layer di base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(miniMap);
    
    // Ordina i dati per timestamp
    const sortedData = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Crea il percorso
    const positions = sortedData.map(entry => [entry.latitude, entry.longitude]);
    if (positions.length > 1) {
        L.polyline(positions, {
            color: getStoneColor(stoneName),
            weight: 3,
            opacity: 0.8
        }).addTo(miniMap);
    }
    
    // Aggiungi i marcatori
    sortedData.forEach((entry, index) => {
        const isLast = index === sortedData.length - 1;
        const isCurrent = index === currentImageIndex;
        
        L.circleMarker([entry.latitude, entry.longitude], {
            radius: isCurrent ? 8 : (isLast ? 6 : 4),
            fillColor: isCurrent ? '#ffd700' : getStoneColor(stoneName),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(miniMap);
    });
    
    // Adatta la vista
    if (positions.length > 0) {
        miniMap.fitBounds(L.latLngBounds(positions).pad(0.1));
    }
}

// Funzione per aggiornare la posizione corrente sulla mini-mappa
function updateMiniMapCurrentPosition() {
    if (!miniMap || currentStoneImages.length === 0) return;
    
    // Rimuovi tutti i layer e ricrea la mini-mappa
    miniMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) return; // Mantieni solo il tile layer
        miniMap.removeLayer(layer);
    });
    
    // Ricrea il percorso e i marcatori
    const positions = currentStoneImages.map(entry => [entry.latitude, entry.longitude]);
    if (positions.length > 1) {
        L.polyline(positions, {
            color: getStoneColor(Object.keys(allStonesData).find(name => 
                allStonesData[name].some(entry => entry === currentStoneImages[0])
            )),
            weight: 3,
            opacity: 0.8
        }).addTo(miniMap);
    }
    
    // Aggiungi i marcatori con evidenziazione della posizione corrente
    currentStoneImages.forEach((entry, index) => {
        const isLast = index === currentStoneImages.length - 1;
        const isCurrent = index === currentImageIndex;
        
        L.circleMarker([entry.latitude, entry.longitude], {
            radius: isCurrent ? 8 : (isLast ? 6 : 4),
            fillColor: isCurrent ? '#ffd700' : getStoneColor(Object.keys(allStonesData).find(name => 
                allStonesData[name].some(e => e === entry)
            )),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(miniMap);
    });
}

// Funzione per inizializzare la timeline
function initializeTimeline(stoneData) {
    const timeline = document.getElementById('timeline');
    const timelineCurrentDate = document.getElementById('timeline-current-date');
    
    if (!timeline || !timelineCurrentDate) return;
    
    // Pulisci la timeline esistente
    timeline.innerHTML = '';
    
    // Ordina i dati per timestamp
    const sortedData = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Crea i punti della timeline
    sortedData.forEach((entry, index) => {
        const point = document.createElement('div');
        point.className = 'timeline-point';
        point.style.left = ((index / (sortedData.length - 1)) * 100) + '%';
        point.dataset.index = index;
        
        if (index === currentImageIndex) {
            point.classList.add('active');
        }
        
        point.addEventListener('click', () => {
            currentImageIndex = index;
            updateImageDisplay();
            updateNavigationButtons();
            updateMiniMapCurrentPosition();
            updateTimelinePosition();
        });
        
        timeline.appendChild(point);
    });
    
    // Aggiorna la data corrente
    updateTimelinePosition();
}

// Funzione per aggiornare la posizione della timeline
function updateTimelinePosition() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const timelineCurrentDate = document.getElementById('timeline-current-date');
    
    // Aggiorna i punti attivi
    timelinePoints.forEach((point, index) => {
        if (index === currentImageIndex) {
            point.classList.add('active');
        } else {
            point.classList.remove('active');
        }
    });
    
    // Aggiorna la data corrente
    if (timelineCurrentDate && currentStoneImages[currentImageIndex]) {
        timelineCurrentDate.textContent = new Date(currentStoneImages[currentImageIndex].timestamp).toLocaleDateString();
    }
}

// Funzione per chiudere il pannello della storia
function closeHistoryPanel() {
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.classList.add('hidden');
    }
    
    // Ferma la riproduzione automatica se attiva
    if (isAutoPlaying) {
        toggleAutoPlay();
    }
}

// Funzione per mostrare l'immagine a schermo intero
function showFullscreenImage() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const historyImage = document.getElementById('history-image');
    
    if (fullscreenModal && fullscreenImage && historyImage) {
        fullscreenImage.src = historyImage.src;
        fullscreenImage.alt = historyImage.alt;
        fullscreenModal.classList.remove('hidden');
    }
}

// Funzione per chiudere l'immagine a schermo intero
function closeFullscreenImage() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    if (fullscreenModal) {
        fullscreenModal.classList.add('hidden');
    }
}

// Funzione di inizializzazione principale
function init() {
    // Rileva e imposta la lingua
    const detectedLanguage = detectBrowserLanguage();
    updateLanguage(detectedLanguage);
    
    // Imposta il valore del select della lingua
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = detectedLanguage;
    }
    
    console.log('Applicazione inizializzata con lingua:', detectedLanguage);
}

// Funzione per configurare gli event listener
function setupEventListeners() {
    // Event listener per il cambio lingua
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
    
    // Event listener per il select delle pietre
    const stoneSelect = document.getElementById('stone-select');
    if (stoneSelect) {
        stoneSelect.addEventListener('change', (e) => {
            displayFilteredStonesOnMap(e.target.value);
        });
    }
    
    // Event listener per il select delle immagini
    const imageDisplaySelect = document.getElementById('image-display-select');
    if (imageDisplaySelect) {
        imageDisplaySelect.addEventListener('change', (e) => {
            const currentStone = stoneSelect ? stoneSelect.value : 'all';
            displayFilteredStonesOnMap(currentStone);
        });
    }
    
    // Event listener per la ricerca
    const stoneSearch = document.getElementById('stone-search');
    const clearSearch = document.getElementById('clear-search');
    
    if (stoneSearch) {
        stoneSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterStoneOptions(searchTerm);
            
            if (clearSearch) {
                clearSearch.style.display = searchTerm ? 'block' : 'none';
            }
        });
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (stoneSearch) {
                stoneSearch.value = '';
                stoneSearch.dispatchEvent(new Event('input'));
                stoneSearch.focus();
            }
        });
    }
    
    // Event listener per chiudere il pannello della storia
    const closeHistoryBtn = document.getElementById('close-history');
    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', closeHistoryPanel);
    }
    
    // Event listener per i bottoni di navigazione immagini
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    if (prevButton) {
        prevButton.addEventListener('click', previousImage);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextImage);
    }
    
    // Event listener per il bottone fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', showFullscreenImage);
    }
    
    // Event listener per chiudere il fullscreen
    const closeFullscreenBtn = document.getElementById('close-fullscreen');
    if (closeFullscreenBtn) {
        closeFullscreenBtn.addEventListener('click', closeFullscreenImage);
    }
    
    // Event listener per chiudere il fullscreen con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const fullscreenModal = document.getElementById('fullscreen-modal');
            const historyPanel = document.getElementById('history-panel');
            
            if (fullscreenModal && !fullscreenModal.classList.contains('hidden')) {
                closeFullscreenImage();
            } else if (historyPanel && !historyPanel.classList.contains('hidden')) {
                closeHistoryPanel();
            }
        }
    });
    
    // Chiama la funzione init per inizializzare la lingua
    init();
    
    console.log('Event listeners configurati');
}

// Funzione per filtrare le opzioni delle pietre
function filterStoneOptions(searchTerm) {
    const stoneSelect = document.getElementById('stone-select');
    if (!stoneSelect) return;
    
    const options = stoneSelect.querySelectorAll('option');
    let hasVisibleOptions = false;
    
    options.forEach(option => {
        if (option.value === 'all') {
            option.style.display = 'block';
            hasVisibleOptions = true;
            return;
        }
        
        const stoneName = translateStoneName(option.value);
        const isVisible = stoneName.toLowerCase().includes(searchTerm);
        option.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible) {
            hasVisibleOptions = true;
        }
    });
    
    // Se non ci sono opzioni visibili, mostra tutte
    if (!hasVisibleOptions && searchTerm) {
        options.forEach(option => {
            option.style.display = 'block';
        });
    }
}

// Funzione per nascondere l'overlay di caricamento
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 350); // Aspetta che finisca la transizione
    }
}

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM caricato, inizializzazione in corso...');
    
    // Configura gli event listener
    setupEventListeners();
    
    // Inizializza la mappa
    initializeMap();
    
    // Carica i dati delle pietre
    loadStonesData();
    
    // Nascondi l'overlay di caricamento
    setTimeout(hideLoadingOverlay, 1000);
    
    console.log('Inizializzazione completata');
});

// Gestione degli errori globali
window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
    
    // Nascondi l'overlay di caricamento in caso di errore
    hideLoadingOverlay();
});

// Gestione degli errori di caricamento delle risorse
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rifiutata:', e.reason);
});

// Rendi le funzioni accessibili globalmente
window.showStoneHistory = showStoneHistory;
window.toggleAutoPlay = toggleAutoPlay;

