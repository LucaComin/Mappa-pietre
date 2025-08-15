// Variabili globali
let map;
let miniMap;
let allStonesData = {};
let currentMarkers = L.featureGroup();
let currentPolylines = L.featureGroup();
let currentImageMarkers = L.markerClusterGroup();

// Variabili per la riproduzione automatica
let autoplayInterval = null;
let isAutoplaying = false;
let autoplaySpeed = 2000; // 2 secondi

// Configurazione del Google Sheet
/*** SOSTITUISCI QUESTI VALORI CON I TUOI ***/
const GOOGLE_SHEET_ID = '1N91lpYThSuyPY85CkH4EitsPcU1OlL-KjBBFwnH0';
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)

// Nuovo URL per scaricare il foglio come CSV
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTSNKDm2yeKcEZOkXVNsQAcFfLXkxDoq1UlCykMf8JVy5g3yhQsa2ox8_gMFxNuxasgrDktvJRcPJRX/pub?gid=${GOOGLE_SHEET_GID}&single=true&output=csv`;

// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', '#dc2626', '#0f766e', '#9d7700',
    '#db2777', '#0891b2', '#6a00ff', '#4338ca'
];

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadStonesData();
    setupEventListeners();
    initializeMiniMap();
});

// Funzione per inizializzare la mappa Leaflet
function initializeMap() {
    map = L.map('map', {
        center: [42.0, 12.0],
        zoom: 6,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false // Disabilita il controllo zoom predefinito
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Aggiungi il controllo zoom personalizzato in basso a destra
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Aggiungi il controllo scala
    L.control.scale().addTo(map);

    // Gestione del ridimensionamento della finestra
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
}

// Funzione per inizializzare la mini-mappa
function initializeMiniMap() {
    // Implementazione della mini-mappa se necessaria
}

// Funzione per caricare i dati delle pietre dal Google Sheet
function loadStonesData() {
    fetch(GOOGLE_SHEET_CSV_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            processCsvData(csvText);
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati CSV:', error);
            alert('Impossibile caricare i dati delle pietre dal CSV. Controlla la console per i dettagli.');
        });
}

// Funzione per processare i dati CSV
function processCsvData(csvText) {
    const rows = csvText.split('\n');
    allStonesData = {}; // Reset dei dati

    // Salta la prima riga (intestazione)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (row === '') continue; // Salta righe vuote

        // Split by comma, but not inside quotes (regex migliorata per gestire le virgole all'interno delle virgolette)
        const cells = row.split(/,(?=(?:(?:[^"\\]*"){2})[^"\\]*$)/);

        try {
            const name = cells[0] ? cells[0].replace(/"/g, "") : ''; // Nome della pietra
            // MODIFICA QUI: Sostituisci la virgola con il punto per la conversione a float
            const lat = cells[1] ? cells[1].replace(/"/g, "").replace(",", ".") : ''; // Latitudine
            const lon = cells[2] ? cells[2].replace(/"/g, "").replace(",", ".") : ''; // Longitudine
            const description = cells[3] ? cells[3].replace(/"/g, "") : ''; // Descrizione
            const date = cells[4] ? cells[4].replace(/"/g, "") : ''; // Data
            const image = cells[5] ? cells[5].replace(/"/g, "") : ''; // URL immagine
            const colorIndex = cells[6] ? cells[6].replace(/"/g, "") : ''; // Indice colore
            const type = cells[7] ? cells[7].replace(/"/g, "") : ''; // Tipo di pietra

            if (name && lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) { // Assicurati che i dati essenziali siano presenti e validi
                const color = STONE_COLORS[(parseInt(colorIndex) || 0) % STONE_COLORS.length];
                const stone = {
                    name, 
                    lat: parseFloat(lat), 
                    lon: parseFloat(lon), 
                    description, 
                    date, 
                    image, 
                    color, 
                    type
                };

                if (!allStonesData[name]) {
                    allStonesData[name] = [];
                }
                allStonesData[name].push(stone);
            } else {
                console.warn(`Riga ${i} manca di dati essenziali o ha coordinate non valide:`, { name, lat, lon });
            }
        } catch (rowError) {
            console.error(`Errore nel processare la riga CSV ${i}:`, rowError, 'Riga:', row);
        }
    }

    populateStoneSelect();
    displayAllStones();
}

// Funzione per popolare il selettore delle pietre
function populateStoneSelect() {
    const stoneSelect = document.getElementById('stone-select');
    stoneSelect.innerHTML = '<option value="all">Tutte le pietre</option>'; // Opzione predefinita

    const uniqueStoneNames = Object.keys(allStonesData).sort();

    uniqueStoneNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        stoneSelect.appendChild(option);
    });

    stoneSelect.addEventListener('change', function() {
        const selectedStoneName = this.value;
        if (selectedStoneName === 'all') {
            displayAllStones();
        } else {
            displayStone(selectedStoneName);
        }
    });
}

// Funzione per visualizzare tutte le pietre sulla mappa
function displayAllStones() {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    Object.values(allStonesData).forEach(stones => {
        stones.forEach(stone => {
            addStoneToMap(stone);
        });
    });

    map.addLayer(currentMarkers);
    map.addLayer(currentPolylines);
    map.addLayer(currentImageMarkers);

    if (currentMarkers.getLayers().length > 0) {
        map.fitBounds(currentMarkers.getBounds());
    }
    console.log(`Visualizzate ${currentMarkers.getLayers().length} pietre sulla mappa`);
}

// Funzione per visualizzare una singola pietra o un gruppo di pietre con lo stesso nome
function displayStone(stoneName) {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    const stonesToDisplay = allStonesData[stoneName];
    if (stonesToDisplay) {
        stonesToDisplay.forEach(stone => {
            addStoneToMap(stone);
        });
        map.addLayer(currentMarkers);
        map.addLayer(currentPolylines);
        map.addLayer(currentImageMarkers);

        if (currentMarkers.getLayers().length > 0) {
            map.fitBounds(currentMarkers.getBounds());
        }
    }
}

// Funzione per aggiungere una pietra alla mappa
function addStoneToMap(stone) {
    const latlng = [stone.lat, stone.lon];

    // Crea un'icona personalizzata con il colore della pietra
    const stoneIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${stone.color};" class="marker-pin"></div><i class="material-icons">location_on</i>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    const marker = L.marker(latlng, { icon: stoneIcon });

    let popupContent = `<b>${stone.name}</b><br>`;
    if (stone.description) popupContent += `Descrizione: ${stone.description}<br>`;
    if (stone.date) popupContent += `Data: ${stone.date}<br>`;
    if (stone.type) popupContent += `Tipo: ${stone.type}<br>`;

    // Aggiungi immagine al popup se disponibile e l'opzione 
