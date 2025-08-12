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
    
    // Aggiorna il dropdown personalizzato
    updateDropdownLanguage();
    
    // Aggiorna il titolo della pagina
    document.title = translate('title');
    
    // Aggiorna il documento lang attribute
    document.documentElement.lang = currentLanguage;
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

// Variabili globali per il dropdown personalizzato
let currentDropdownValue = 'all';
let dropdownSearchTerm = '';
let isDropdownOpen = false;
let filteredStones = []; // Array per memorizzare le pietre filtrate dalla ricerca

// Funzione per inizializzare il dropdown personalizzato
function initializeCustomDropdown() {
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownSearchInput = document.getElementById('dropdown-search-input');
    const clearDropdownSearch = document.getElementById('clear-dropdown-search');
    const dropdownOptions = document.getElementById('dropdown-options');

    // Popola le opzioni del dropdown
    populateDropdownOptions();

    // Event listener per aprire/chiudere il dropdown
    dropdownTrigger.addEventListener('click', toggleDropdown);
    dropdownTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
    });

    // Event listener per la ricerca nel dropdown
    dropdownSearchInput.addEventListener('input', (e) => {
        dropdownSearchTerm = e.target.value.toLowerCase();
        updateDropdownSearchVisibility();
        filterDropdownOptions();
        // Aggiorna anche la mappa in tempo reale durante la ricerca
        updateMapBasedOnSearch();
    });

    // Event listener per il bottone di cancellazione ricerca
    clearDropdownSearch.addEventListener('click', () => {
        dropdownSearchInput.value = '';
        dropdownSearchTerm = '';
        updateDropdownSearchVisibility();
        filterDropdownOptions();
        dropdownSearchInput.focus();
        // Ripristina la visualizzazione completa della mappa
        displayFilteredStonesOnMap('all');
    });

    // Chiudi il dropdown quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!document.getElementById('stone-dropdown').contains(e.target)) {
            closeDropdown();
        }
    });

    // Event listener per le opzioni del dropdown
    dropdownOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.dropdown-option');
        if (option && !option.classList.contains('no-results')) {
            selectDropdownOption(option.dataset.value);
        }
    });
}

// Funzione per aprire/chiudere il dropdown
function toggleDropdown() {
    if (isDropdownOpen) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

// Funzione per aprire il dropdown
function openDropdown() {
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownSearchInput = document.getElementById('dropdown-search-input');

    isDropdownOpen = true;
    dropdownTrigger.setAttribute('aria-expanded', 'true');
    dropdownMenu.classList.add('open');
    
    // Focus sull'input di ricerca quando si apre il dropdown
    setTimeout(() => {
        dropdownSearchInput.focus();
    }, 100);
}

// Funzione per chiudere il dropdown
function closeDropdown() {
    const dropdownTrigger = document.getElementById('dropdown-trigger');
    const dropdownMenu = document.getElementById('dropdown-menu');

    isDropdownOpen = false;
    dropdownTrigger.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.remove('open');
}

// Funzione per selezionare un'opzione del dropdown
function selectDropdownOption(value) {
    const dropdownValue = document.getElementById('dropdown-value');
    const dropdownOptions = document.querySelectorAll('.dropdown-option');

    // Aggiorna la selezione visiva
    dropdownOptions.forEach(option => {
        option.setAttribute('aria-selected', option.dataset.value === value ? 'true' : 'false');
    });

    // Aggiorna il valore mostrato
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
        dropdownValue.textContent = selectedOption.textContent.trim();
    }

    currentDropdownValue = value;
    closeDropdown();

    // Aggiorna la mappa
    displayFilteredStonesOnMap(value);
}

// Funzione per popolare le opzioni del dropdown
function populateDropdownOptions() {
    const dropdownOptions = document.getElementById('dropdown-options');
    
    // Pulisci le opzioni esistenti
    dropdownOptions.innerHTML = `
        <div class="dropdown-option" data-value="all" role="option" aria-selected="true">
            <span data-i18n="show-all">${translate('show-all')}</span>
        </div>
    `;

    // Aggiungi le pietre
    for (const stoneName in allStonesData) {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', stoneName);
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.innerHTML = `<span>${translateStoneName(stoneName)}</span>`;
        dropdownOptions.appendChild(option);
    }
}

// Funzione per filtrare le opzioni del dropdown in base alla ricerca
function filterDropdownOptions() {
    const dropdownOptions = document.getElementById('dropdown-options');
    const options = dropdownOptions.querySelectorAll('.dropdown-option:not(.no-results)');
    let visibleCount = 0;
    filteredStones = []; // Reset dell'array delle pietre filtrate

    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const isVisible = text.includes(dropdownSearchTerm);
        option.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible) {
            visibleCount++;
            // Aggiungi alla lista delle pietre filtrate (escludi "Mostra tutte")
            if (option.dataset.value !== 'all') {
                filteredStones.push(option.dataset.value);
            }
        }
    });

    // Gestisci il messaggio "Nessun risultato"
    let noResultsOption = dropdownOptions.querySelector('.no-results');
    if (visibleCount === 0 && dropdownSearchTerm.trim()) {
        if (!noResultsOption) {
            noResultsOption = document.createElement('div');
            noResultsOption.className = 'dropdown-option no-results';
            noResultsOption.textContent = translate('no-results');
            dropdownOptions.appendChild(noResultsOption);
        }
        noResultsOption.style.display = 'block';
    } else if (noResultsOption) {
        noResultsOption.style.display = 'none';
    }
}

// Nuova funzione per aggiornare la mappa in base alla ricerca
function updateMapBasedOnSearch() {
    if (dropdownSearchTerm.trim() === '') {
        // Se non c'è ricerca, mostra tutto
        displayFilteredStonesOnMap('all');
    } else {
        // Se c'è una ricerca attiva, mostra solo le pietre filtrate
        displayFilteredStonesOnMap('search', filteredStones);
    }
}

// Funzione per aggiornare la visibilità del bottone di cancellazione ricerca
function updateDropdownSearchVisibility() {
    const clearButton = document.getElementById('clear-dropdown-search');
    clearButton.style.display = dropdownSearchTerm ? 'block' : 'none';
}

// Funzione per aggiornare il dropdown quando cambia la lingua
function updateDropdownLanguage() {
    const dropdownValue = document.getElementById('dropdown-value');
    const dropdownSearchInput = document.getElementById('dropdown-search-input');
    
    // Aggiorna il placeholder
    dropdownSearchInput.placeholder = translate('search-placeholder');
    
    // Ripopola le opzioni con le traduzioni aggiornate
    populateDropdownOptions();
    
    // Aggiorna il valore mostrato
    const selectedOption = document.querySelector(`[data-value="${currentDropdownValue}"]`);
    if (selectedOption) {
        dropdownValue.textContent = selectedOption.textContent.trim();
    }
    
    // Riapplica il filtro se c'è una ricerca attiva
    if (dropdownSearchTerm) {
        filterDropdownOptions();
    }
}

// Funzione per mostrare le pietre filtrate sulla mappa
function displayFilteredStonesOnMap(filter, customFilteredStones = null) {
    // Pulisci i marcatori esistenti
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    const imageDisplayMode = document.getElementById('image-display-select').value;
    let stonesToShow = [];

    // Determina quali pietre mostrare
    if (filter === 'all') {
        stonesToShow = Object.keys(allStonesData);
    } else if (filter === 'search' && customFilteredStones) {
        stonesToShow = customFilteredStones;
    } else if (allStonesData[filter]) {
        stonesToShow = [filter];
    }

    // Mostra le pietre selezionate
    stonesToShow.forEach(stoneName => {
        const stoneData = allStonesData[stoneName];
        if (!stoneData || !stoneData.length) return;

        // Ordina i dati per timestamp
        const sortedData = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Crea il percorso (polyline)
        if (sortedData.length > 1) {
            const coordinates = sortedData.map(point => [point.lat, point.lng]);
            const polyline = L.polyline(coordinates, {
                color: getStoneColor(stoneName),
                weight: 3,
                opacity: 0.7
            });
            currentPolylines.addLayer(polyline);
        }

        // Aggiungi marcatori per le posizioni
        sortedData.forEach((point, index) => {
            const isLast = index === sortedData.length - 1;
            
            // Marcatore per la posizione
            const marker = L.marker([point.lat, point.lng], {
                icon: createStoneIcon(stoneName, isLast)
            });

            const popupContent = `
                <div class="popup-content">
                    <h3>${translateStoneName(stoneName)}</h3>
                    <p><strong>${translate('last-position')}</strong> ${new Date(point.timestamp).toLocaleString()}</p>
                    <button onclick="showStoneHistory('${stoneName}')" class="history-button">
                        ${translate('see-history')}
                    </button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            currentMarkers.addLayer(marker);

            // Gestione delle immagini
            if (point.image && imageDisplayMode !== 'none') {
                const shouldShowImage = imageDisplayMode === 'all' || 
                                      (imageDisplayMode === 'last' && isLast);
                
                if (shouldShowImage) {
                    const imageMarker = L.marker([point.lat, point.lng], {
                        icon: createImageIcon()
                    });
                    
                    const imagePopup = `
                        <div class="image-popup">
                            <img src="${point.image}" alt="Immagine di ${translateStoneName(stoneName)}" 
                                 style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px;">
                            <p style="margin-top: 8px; font-size: 0.9em; color: #666;">
                                ${new Date(point.timestamp).toLocaleString()}
                            </p>
                        </div>
                    `;
                    
                    imageMarker.bindPopup(imagePopup);
                    currentImageMarkers.addLayer(imageMarker);
                }
            }
        });
    });

    // Aggiungi i layer alla mappa
    map.addLayer(currentPolylines);
    map.addLayer(currentMarkers);
    map.addLayer(currentImageMarkers);

    // Adatta la vista se ci sono marcatori
    if (currentMarkers.getLayers().length > 0) {
        const group = new L.featureGroup([currentMarkers, currentPolylines]);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
}

// Funzione per ottenere il colore di una pietra
function getStoneColor(stoneName) {
    const colors = {
        'Pietra_Rossa': '#ef4444',
        'Pietra_Blu': '#3b82f6',
        'Pietra_Verde': '#10b981'
    };
    return colors[stoneName] || '#6b7280';
}

// Funzione per creare l'icona di una pietra
function createStoneIcon(stoneName, isLast = false) {
    const color = getStoneColor(stoneName);
    const size = isLast ? 25 : 20;
    const opacity = isLast ? 1 : 0.8;
    
    return L.divIcon({
        className: 'stone-marker',
        html: `<div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            opacity: ${opacity};
            ${isLast ? 'animation: pulse 2s infinite;' : ''}
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}

// Funzione per creare l'icona delle immagini
function createImageIcon() {
    return L.divIcon({
        className: 'image-marker',
        html: `<div style="
            width: 30px;
            height: 30px;
            background-color: #f59e0b;
            border: 2px solid white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 16px;
        ">📷</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Dati di esempio per le pietre
const sampleStonesData = {
    'Pietra_Rossa': [
        {
            lat: 45.4642,
            lng: 9.1900,
            timestamp: '2024-01-15T10:30:00Z',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
        },
        {
            lat: 45.4700,
            lng: 9.1950,
            timestamp: '2024-02-01T14:20:00Z',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
        },
        {
            lat: 45.4750,
            lng: 9.2000,
            timestamp: '2024-02-15T16:45:00Z',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
        }
    ],
    'Pietra_Blu': [
        {
            lat: 45.4600,
            lng: 9.1800,
            timestamp: '2024-01-10T09:15:00Z',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
        },
        {
            lat: 45.4650,
            lng: 9.1850,
            timestamp: '2024-01-25T11:30:00Z',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
        }
    ],
    'Pietra_Verde': [
        {
            lat: 45.4580,
            lng: 9.1750,
            timestamp: '2024-01-05T08:00:00Z',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
        },
        {
            lat: 45.4620,
            lng: 9.1780,
            timestamp: '2024-01-20T12:15:00Z',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
        },
        {
            lat: 45.4680,
            lng: 9.1820,
            timestamp: '2024-02-10T15:30:00Z',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
        }
    ]
};

// Funzione per inizializzare la mappa
function initializeMap() {
    // Crea la mappa principale
    map = L.map('map', {
        center: [45.4642, 9.1900],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
    });

    // Aggiungi il layer di base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Carica i dati di esempio
    allStonesData = sampleStonesData;

    // Inizializza i controlli
    initializeCustomDropdown();
    initializeLanguageSelector();
    initializeImageDisplaySelector();
    initializeHistoryPanel();

    // Mostra tutte le pietre inizialmente
    displayFilteredStonesOnMap('all');

    // Nascondi l'overlay di caricamento
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
    }, 1000);
}

// Funzione per inizializzare il selettore della lingua
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    
    // Imposta la lingua rilevata
    const detectedLang = detectBrowserLanguage();
    languageSelect.value = detectedLang;
    updateLanguage(detectedLang);
    
    // Event listener per il cambio lingua
    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
}

// Funzione per inizializzare il selettore delle immagini
function initializeImageDisplaySelector() {
    const imageDisplaySelect = document.getElementById('image-display-select');
    
    imageDisplaySelect.addEventListener('change', () => {
        // Ricarica la visualizzazione con la nuova modalità immagini
        if (dropdownSearchTerm.trim() === '') {
            displayFilteredStonesOnMap(currentDropdownValue);
        } else {
            updateMapBasedOnSearch();
        }
    });
}

// Funzione per inizializzare il pannello della storia
function initializeHistoryPanel() {
    const closeButton = document.getElementById('close-history');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const closeFullscreen = document.getElementById('close-fullscreen');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const playPauseBtn = document.getElementById('play-pause-btn');

    closeButton.addEventListener('click', closeHistoryPanel);
    fullscreenBtn.addEventListener('click', openFullscreenImage);
    closeFullscreen.addEventListener('click', closeFullscreenImage);
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);
    playPauseBtn.addEventListener('click', toggleAutoPlay);

    // Chiudi il pannello con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!document.getElementById('fullscreen-modal').classList.contains('hidden')) {
                closeFullscreenImage();
            } else if (!document.getElementById('history-panel').classList.contains('hidden')) {
                closeHistoryPanel();
            }
        }
    });
}

// Variabili per la gestione della storia
let currentStoneHistory = [];
let currentImageIndex = 0;

// Funzione per mostrare la storia di una pietra
function showStoneHistory(stoneName) {
    const stoneData = allStonesData[stoneName];
    if (!stoneData || !stoneData.length) return;

    currentStoneHistory = [...stoneData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    currentImageIndex = 0;

    // Aggiorna il titolo
    document.getElementById('history-title').textContent = `${translate('history-of')} ${translateStoneName(stoneName)}`;

    // Mostra la prima immagine
    updateHistoryDisplay();

    // Inizializza la mini-mappa
    initializeMiniMap();

    // Mostra il pannello
    document.getElementById('history-panel').classList.remove('hidden');
}

// Funzione per aggiornare la visualizzazione della storia
function updateHistoryDisplay() {
    if (!currentStoneHistory.length) return;

    const currentPoint = currentStoneHistory[currentImageIndex];
    const historyImage = document.getElementById('history-image');
    const imageCaption = document.getElementById('history-image-caption');
    const imageCounter = document.getElementById('image-counter');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // Aggiorna l'immagine
    historyImage.src = currentPoint.image;
    historyImage.alt = `Immagine ${currentImageIndex + 1}`;

    // Aggiorna la didascalia
    imageCaption.textContent = new Date(currentPoint.timestamp).toLocaleString();

    // Aggiorna il contatore
    imageCounter.textContent = `${currentImageIndex + 1} di ${currentStoneHistory.length}`;

    // Aggiorna i bottoni di navigazione
    prevButton.disabled = currentImageIndex === 0;
    nextButton.disabled = currentImageIndex === currentStoneHistory.length - 1;

    // Aggiorna la mini-mappa
    updateMiniMap();

    // Aggiorna la timeline
    updateTimeline();
}

// Funzione per inizializzare la mini-mappa
function initializeMiniMap() {
    const miniMapContainer = document.getElementById('mini-map');
    
    // Rimuovi la mappa esistente se presente
    if (miniMap) {
        miniMap.remove();
    }

    // Crea la nuova mini-mappa
    miniMap = L.map(miniMapContainer, {
        center: [currentStoneHistory[0].lat, currentStoneHistory[0].lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
    });

    // Aggiungi il layer di base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(miniMap);

    // Aggiungi il percorso completo
    const coordinates = currentStoneHistory.map(point => [point.lat, point.lng]);
    L.polyline(coordinates, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7
    }).addTo(miniMap);

    // Aggiungi tutti i punti
    currentStoneHistory.forEach((point, index) => {
        const isLast = index === currentStoneHistory.length - 1;
        const marker = L.marker([point.lat, point.lng], {
            icon: L.divIcon({
                className: 'mini-map-marker',
                html: `<div style="
                    width: ${isLast ? 12 : 8}px;
                    height: ${isLast ? 12 : 8}px;
                    background-color: ${isLast ? '#f59e0b' : '#3b82f6'};
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [isLast ? 12 : 8, isLast ? 12 : 8],
                iconAnchor: [isLast ? 6 : 4, isLast ? 6 : 4]
            })
        });
        marker.addTo(miniMap);
    });

    // Adatta la vista
    const group = new L.featureGroup(miniMap._layers);
    miniMap.fitBounds(group.getBounds(), { padding: [10, 10] });
}

// Funzione per aggiornare la mini-mappa
function updateMiniMap() {
    if (!miniMap) return;

    const currentPoint = currentStoneHistory[currentImageIndex];
    
    // Rimuovi il marcatore corrente esistente
    miniMap.eachLayer(layer => {
        if (layer.options && layer.options.className === 'current-position-marker') {
            miniMap.removeLayer(layer);
        }
    });

    // Aggiungi il nuovo marcatore corrente
    const currentMarker = L.marker([currentPoint.lat, currentPoint.lng], {
        icon: L.divIcon({
            className: 'current-position-marker',
            html: `<div style="
                width: 16px;
                height: 16px;
                background-color: #ef4444;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                animation: pulse 2s infinite;
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        }),
        className: 'current-position-marker'
    });
    currentMarker.addTo(miniMap);
}

// Funzione per aggiornare la timeline
function updateTimeline() {
    const timeline = document.getElementById('timeline');
    const timelineCurrentDate = document.getElementById('timeline-current-date');
    
    // Pulisci la timeline esistente
    timeline.innerHTML = '';

    // Crea i punti della timeline
    currentStoneHistory.forEach((point, index) => {
        const timelinePoint = document.createElement('div');
        timelinePoint.className = 'timeline-point';
        if (index === currentImageIndex) {
            timelinePoint.classList.add('active');
        }
        
        const percentage = (index / (currentStoneHistory.length - 1)) * 100;
        timelinePoint.style.left = `${percentage}%`;
        
        timelinePoint.addEventListener('click', () => {
            currentImageIndex = index;
            updateHistoryDisplay();
        });
        
        timeline.appendChild(timelinePoint);
    });

    // Aggiorna la data corrente
    const currentDate = new Date(currentStoneHistory[currentImageIndex].timestamp);
    timelineCurrentDate.textContent = currentDate.toLocaleDateString();
}

// Funzioni per la navigazione delle immagini
function showPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateHistoryDisplay();
    }
}

function showNextImage() {
    if (currentImageIndex < currentStoneHistory.length - 1) {
        currentImageIndex++;
        updateHistoryDisplay();
    }
}

// Funzioni per l'autoplay
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    isAutoPlaying = true;
    const playPauseBtn = document.getElementById('play-pause-btn');
    playPauseBtn.querySelector('.btn-icon').textContent = '⏸️';
    playPauseBtn.querySelector('.btn-text').textContent = translate('pause');
    
    autoPlayInterval = setInterval(() => {
        if (currentImageIndex < currentStoneHistory.length - 1) {
            showNextImage();
        } else {
            currentImageIndex = 0;
            updateHistoryDisplay();
        }
    }, autoPlaySpeed);
}

function stopAutoPlay() {
    isAutoPlaying = false;
    const playPauseBtn = document.getElementById('play-pause-btn');
    playPauseBtn.querySelector('.btn-icon').textContent = '▶️';
    playPauseBtn.querySelector('.btn-text').textContent = translate('play');
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Funzioni per il fullscreen
function openFullscreenImage() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const historyImage = document.getElementById('history-image');
    
    fullscreenImage.src = historyImage.src;
    fullscreenModal.classList.remove('hidden');
}

function closeFullscreenImage() {
    document.getElementById('fullscreen-modal').classList.add('hidden');
}

// Funzione per chiudere il pannello della storia
function closeHistoryPanel() {
    document.getElementById('history-panel').classList.add('hidden');
    stopAutoPlay();
    
    // Pulisci la mini-mappa
    if (miniMap) {
        miniMap.remove();
        miniMap = null;
    }
}

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});

// Aggiungi gli stili CSS per l'animazione pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

