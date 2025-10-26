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

// Configurazione del Google Sheet
// *** SOSTITUISCI QUESTI VALORI CON I TUOI ***
const GOOGLE_SHEET_ID = '1N9I1LpY7hSuyPY85CKH4EitsPcU1O11-KJbBFFwHn0'; // L'ID del tuo foglio di calcolo
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
    '#db2777', '#0891b2', '#65a30d', '#c2410c', '#4338ca'
];

// Variabile globale per la guida
let tutorialGuide;

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function( ) {
    console.log('DOM caricato, inizializzazione in corso...');
    showLoadingOverlay();

    try {
        initMap();
        console.log('Mappa inizializzata');

        loadData();
        console.log('Caricamento dati avviato');

        setupEventListeners();
        console.log('Event listeners configurati');

        // Inizializza il sistema di traduzione
        if (typeof initializeLanguageSelector === 'function') {
            initializeLanguageSelector();
            console.log('Selettore lingua inizializzato');
        }

        // Inizializza la guida interattiva
        tutorialGuide = new TutorialGuide();
        console.log('Guida interattiva inizializzata');

        // Nascondi loading overlay dopo l'inizializzazione
        setTimeout(() => {
            hideLoadingOverlay();
            console.log('Loading overlay nascosto');
        }, 500);

    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
        // Potresti voler mostrare un messaggio di errore all'utente qui
    }
});

// Funzione per inizializzare la mappa Leaflet
function initMap() {
    // Inizializza la mappa principale
    map = L.map('map', {
        center: [45.4642, 9.1900], // Milano
        zoom: 6,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false // Rimuove il controllo zoom predefinito
    });

    // Aggiungi il tile layer di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } ).addTo(map);

    // Aggiungi i controlli di zoom personalizzati
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // Aggiungi i gruppi di feature alla mappa
    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);
}

// Funzione per caricare i dati dal Google Sheet
function loadData() {
    fetch(GOOGLE_SHEET_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // La risposta è in un formato JSONp, dobbiamo estrarre il JSON
            const jsonText = data.substring(data.indexOf('(') + 1, data.lastIndexOf(')'));
            const jsonData = JSON.parse(jsonText);

            processData(jsonData);
            console.log('Dati processati e mappa aggiornata');

            // Dopo aver caricato i dati, aggiorna la lista delle pietre nel selettore
            updateStoneSelector();

            // Se è presente un parametro 'stone' nell'URL, selezionalo
            const urlParams = new URLSearchParams(window.location.search);
            const stoneId = urlParams.get('stone');
            if (stoneId && allStonesData[stoneId]) {
                document.getElementById('stone-selector').value = stoneId;
                updateMapForSelectedStone(stoneId);
            } else {
                // Altrimenti, mostra tutte le pietre
                updateMapForSelectedStone('Show all');
            }
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati:', error);
            // Mostra un messaggio di errore all'utente
            showErrorOverlay('Impossibile caricare i dati delle pietre. Controlla la console per i dettagli.');
        });
}

// Funzione per processare i dati JSON
function processData(jsonData) {
    const rows = jsonData.table.rows;
    const cols = jsonData.table.cols;

    // Mappa i nomi delle colonne per un accesso più facile
    const colMap = {};
    cols.forEach((col, index) => {
        colMap[col.label] = index;
    });

    // Reset dell'oggetto dati
    allStonesData = {};

    rows.forEach(row => {
        const c = row.c;
        if (!c) return; // Salta righe vuote

        // Estrai i dati dalla riga
        const stoneId = c[colMap['ID Pietra']]?.v;
        const name = c[colMap['Nome Pietra']]?.v;
        const lat = c[colMap['Latitudine']]?.v;
        const lon = c[colMap['Longitudine']]?.v;
        const date = c[colMap['Data']]?.f || c[colMap['Data']]?.v;
        const description = c[colMap['Descrizione']]?.v;
        const image = c[colMap['Immagine']]?.v;
        const category = c[colMap['Categoria']]?.v;
        const link = c[colMap['Link']]?.v;

        // Valida i dati minimi
        if (!stoneId || !lat || !lon) return;

        const stoneData = {
            stoneId: stoneId,
            name: name || stoneId,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            date: date,
            description: description,
            image: image,
            category: category,
            link: link,
            // Aggiungi qui altri campi se necessario
        };

        // Raggruppa i dati per ID Pietra
        if (!allStonesData[stoneId]) {
            allStonesData[stoneId] = [];
        }
        allStonesData[stoneId].push(stoneData);
    });

    // Ordina i dati di ogni pietra per data (se presente)
    for (const stoneId in allStonesData) {
        allStonesData[stoneId].sort((a, b) => {
            if (a.date && b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
        });
    }

    console.log('Dati delle pietre caricati:', allStonesData);
}

// Funzione per aggiornare il selettore delle pietre
function updateStoneSelector() {
    const selector = document.getElementById('stone-selector');
    // Salva il valore attualmente selezionato (utile per il cambio lingua)
    const currentSelection = selector.value;

    // Pulisci le opzioni esistenti (tranne la prima 'movedStones' e la seconda 'Show all')
    while (selector.options.length > 2) {
        selector.remove(2);
    }

    // Ordina gli ID delle pietre alfabeticamente
    const sortedStoneIds = Object.keys(allStonesData).sort();

    // Aggiungi le nuove opzioni
    sortedStoneIds.forEach(stoneId => {
        const option = document.createElement('option');
        option.value = stoneId;
        option.textContent = stoneId;
        selector.appendChild(option);
    });

    // Ripristina la selezione precedente se esiste ancora
    if (currentSelection && selector.querySelector(`option[value="${currentSelection}"]`)) {
        selector.value = currentSelection;
    }
}

// Funzione per configurare gli event listeners
function setupEventListeners() {
    // Listener per il selettore della pietra
    document.getElementById('stone-selector').addEventListener('change', function() {
        const selectedStoneId = this.value;
        updateMapForSelectedStone(selectedStoneId);
    });

    // Listener per il selettore della lingua (gestito in translations.js)
    document.getElementById('language-selector').addEventListener('change', function() {
        const newLang = this.value;
        setLanguage(newLang); // Funzione definita in translations.js
        // *** QUESTO È IL PUNTO CHIAVE ***
        // Dopo aver cambiato la lingua, è necessario aggiornare i contenuti
        // che dipendono dalla lingua, come i testi dei popup e la guida.
        // MA, se la lingua cambia, la funzione `updateStoneSelector` che
        // viene chiamata alla fine di `loadData` potrebbe non bastare.
        // Il problema descritto dall'utente è che "inverte tutte le pietre
        // con solo quelle spostate". Questo suggerisce che l'aggiornamento
        // della mappa dopo il cambio lingua non sta ricaricando *tutti* i dati
        // o sta applicando un filtro sbagliato.

        // Correzione: ricaricare la mappa e i marcatori immagine
        // Non è necessario ricaricare i dati dal foglio Google se i dati sono
        // già in `allStonesData`. Dobbiamo solo forzare un aggiornamento
        // della mappa con la pietra attualmente selezionata.
        const currentSelection = document.getElementById('stone-selector').value;
        updateMapForSelectedStone(currentSelection);

        // Aggiorna anche i marcatori immagine, che dipendono dalla lingua per il popup
        updateImageMarkers(document.getElementById('image-selector').value);
    });

    // Listener per il selettore delle immagini
    document.getElementById('image-selector').addEventListener('change', function() {
        const selectedImageOption = this.value;
        updateImageMarkers(selectedImageOption);
    });

    // Altri listener (riproduzione automatica, ecc.)
    document.getElementById('play-button').addEventListener('click', toggleAutoPlay);
    document.getElementById('pause-button').addEventListener('click', toggleAutoPlay);
    document.getElementById('reset-button').addEventListener('click', resetMap);
    document.getElementById('speed-selector').addEventListener('change', updateAutoPlaySpeed);
    document.getElementById('info-button').addEventListener('click', showInfoPanel);
    document.getElementById('close-info-button').addEventListener('click', hideInfoPanel);
    document.getElementById('help-button').addEventListener('click', () => tutorialGuide.start());

    // Listener per il pulsante di ricerca
    document.getElementById('search-button').addEventListener('click', handleSearch);

    // Listener per il campo di ricerca (Enter)
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Listener per il pulsante di chiusura del pannello di ricerca
    document.getElementById('close-search-button').addEventListener('click', hideSearchPanel);
}

// Funzione per aggiornare la mappa in base alla pietra selezionata
function updateMapForSelectedStone(stoneId) {
    // 1. Pulisci la mappa
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();
    map.closePopup(); // Chiudi eventuali popup aperti

    // 2. Determina quali pietre mostrare
    let stonesToShow = [];
    let isFiltered = false;

    if (stoneId === 'Show all') {
        // Mostra tutti i punti di tutte le pietre
        for (const id in allStonesData) {
            stonesToShow.push(...allStonesData[id]);
        }
    } else if (stoneId === 'movedStones') {
        // Mostra solo i punti delle pietre che si sono spostate (hanno più di un punto)
        for (const id in allStonesData) {
            if (allStonesData[id].length > 1) {
                stonesToShow.push(...allStonesData[id]);
            }
        }
        isFiltered = true;
    } else if (allStonesData[stoneId]) {
        // Mostra solo i punti della pietra selezionata
        stonesToShow = allStonesData[stoneId];
        isFiltered = true;
    }

    // 3. Aggiungi i marcatori e le polilinee
    let bounds = [];
    let stonePolylines = {}; // Per raggruppare i punti per polilinea

    stonesToShow.forEach(stoneData => {
        const latlng = [stoneData.lat, stoneData.lon];
        bounds.push(latlng);

        // Crea il popup content tradotto
        const popupContent = createPopupContent(stoneData);

        // Determina il colore
        const stoneIndex = Object.keys(allStonesData).indexOf(stoneData.stoneId);
        const color = STONE_COLORS[stoneIndex % STONE_COLORS.length];

        // Crea il marcatore
        const marker = L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(popupContent);

        // Salva stoneData nel marcatore per l'aggiornamento del popup in translations.js
        marker.stoneData = stoneData;

        currentMarkers.addLayer(marker);

        // Prepara i dati per la polilinea (solo se non è un filtro 'Show all' o 'movedStones')
        if (isFiltered && stoneId !== 'Show all' && stoneId !== 'movedStones') {
            if (!stonePolylines[stoneData.stoneId]) {
                stonePolylines[stoneData.stoneId] = [];
            }
            stonePolylines[stoneData.stoneId].push(latlng);
        }

        // Aggiungi il marcatore per l'immagine (se presente)
        if (stoneData.image) {
            addImageMarker(stoneData);
        }
    });

    // 4. Aggiungi le polilinee
    for (const id in stonePolylines) {
        const polyline = L.polyline(stonePolylines[id], {
            color: STONE_COLORS[Object.keys(allStonesData).indexOf(id) % STONE_COLORS.length],
            weight: 3,
            opacity: 0.7
        });
        currentPolylines.addLayer(polyline);
    }

    // 5. Aggiorna il pannello storia (se necessario)
    updateHistoryPanel(stoneId);

    // 6. Centra la mappa
    if (bounds.length > 0) {
        if (bounds.length === 1) {
            map.setView(bounds[0], 12); // Zoom in su un singolo punto
        } else {
            map.fitBounds(bounds, {
                padding: [50, 50]
            });
        }
    } else {
        // Se non ci sono pietre da mostrare, torna alla vista predefinita
        map.setView([45.4642, 9.1900], 6);
    }

    // 7. Aggiorna i marcatori delle immagini in base alla selezione corrente
    updateImageMarkers(document.getElementById('image-selector').value);
}

// Funzione per creare il contenuto del popup (da tradurre)
function createPopupContent(stoneData) {
    const lang = document.getElementById('language-selector').value;
    const t = getTranslationFunction(lang); // Assumendo che esista una funzione per le traduzioni

    let content = `
        <div class="popup-content">
            <h3>${t('stoneID')}: ${stoneData.stoneId}</h3>
            ${stoneData.name ? `<p><strong>${t('name')}:</strong> ${stoneData.name}</p>` : ''}
            ${stoneData.date ? `<p><strong>${t('date')}:</strong> ${stoneData.date}</p>` : ''}
            ${stoneData.category ? `<p><strong>${t('category')}:</strong> ${stoneData.category}</p>` : ''}
            ${stoneData.description ? `<p><strong>${t('description')}:</strong> ${stoneData.description}</p>` : ''}
            <p><strong>${t('coordinates')}:</strong> ${stoneData.lat.toFixed(4)}, ${stoneData.lon.toFixed(4)}</p>
            ${stoneData.link ? `<p><a href="${stoneData.link}" target="_blank">${t('moreInfo')}</a></p>` : ''}
    `;

    if (stoneData.image) {
        content += `<img src="${stoneData.image}" alt="${t('stoneImage')}" style="max-width: 100%; height: auto; margin-top: 10px;">`;
    }

    content += `</div>`;
    return content;
}

// Funzione per aggiungere un marcatore immagine
function addImageMarker(stoneData) {
    const latlng = [stoneData.lat, stoneData.lon];

    const imageIcon = L.icon({
        iconUrl: 'assets/camera-icon.png', // Assicurati che l'icona esista
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const popupContent = createPopupContent(stoneData);

    const marker = L.marker(latlng, {
        icon: imageIcon,
        title: stoneData.stoneId + ' - ' + stoneData.date
    }).bindPopup(popupContent);

    // Memorizza i dati dell'immagine nel marcatore
    marker.stoneData = stoneData;

    currentImageMarkers.addLayer(marker);
}

// Funzione per aggiornare la visibilità dei marcatori immagine
function updateImageMarkers(option) {
    // Rimuovi tutti i marcatori immagine esistenti
    currentImageMarkers.clearLayers();

    const selectedStoneId = document.getElementById('stone-selector').value;

    let markersToAdd = [];

    if (option === 'None') {
        // Non aggiungere nulla
        return;
    }

    let stonesToProcess = [];

    if (selectedStoneId === 'Show all') {
        // Se è selezionato 'Show all', processa tutti i dati
        for (const id in allStonesData) {
            stonesToProcess.push(...allStonesData[id]);
        }
    } else if (selectedStoneId === 'movedStones') {
        // Se è selezionato 'movedStones', processa solo le pietre con più di un punto
        for (const id in allStonesData) {
            if (allStonesData[id].length > 1) {
                stonesToProcess.push(...allStonesData[id]);
            }
        }
    } else if (allStonesData[selectedStoneId]) {
        // Se è selezionata una singola pietra, processa solo i suoi dati
        stonesToProcess = allStonesData[selectedStoneId];
    }

    // Filtra i dati che hanno un'immagine
    const imageStones = stonesToProcess.filter(stone => stone.image);

    if (option === 'All') {
        // Aggiungi tutti i marcatori immagine
        imageStones.forEach(stoneData => addImageMarker(stoneData));
    } else if (option === 'Last') {
        // Aggiungi solo l'ultima immagine per ogni pietra
        let lastImagePerStone = {};
        imageStones.forEach(stoneData => {
            // L'ordinamento per data è già stato fatto in processData
            // Quindi l'ultimo elemento processato per un dato stoneId sarà il più recente
            lastImagePerStone[stoneData.stoneId] = stoneData;
        });

        for (const id in lastImagePerStone) {
            addImageMarker(lastImagePerStone[id]);
        }
    }
}

// Funzioni per la riproduzione automatica (omesse per brevità)
function toggleAutoPlay() { /* ... */ }
function updateAutoPlaySpeed() { /* ... */ }
function resetMap() { /* ... */ }
function updateHistoryPanel(stoneId) { /* ... */ }
function showInfoPanel() { /* ... */ }
function hideInfoPanel() { /* ... */ }
function showLoadingOverlay() { /* ... */ }
function hideLoadingOverlay() { /* ... */ }
function showErrorOverlay(message) { /* ... */ }
function handleSearch() { /* ... */ }
function hideSearchPanel() { /* ... */ }

// Funzioni per il sistema di traduzione (definite in translations.js)
// getTranslationFunction(lang)
// setLanguage(lang)
// initializeLanguageSelector()
