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
const GOOGLE_SHEET_ID = '1N91lpY7hSuyPY85CkH4E1tsPcUI01L-KjJBBFfWnH0';
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)

// Nuovo URL per scaricare il foglio come CSV
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTSNKDm2yeKcEZOkXVNsQAcFfLXkxDoq1UlCykMf8JVy5g3yhQsa2ox8_gMFxNuxasgrDktvJRcPJRX/pub?gid=0&single=true&output=csv';
// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', '#dc2626', '#0f766e', '#9d7706',
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
    miniMap = new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }), { 
        toggleDisplay: true, 
        minimized: true,
        position: 'bottomleft'
    }).addTo(map);
}

// Funzione per caricare i dati delle pietre dal Google Sheet (ora da CSV)
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

        const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma, but not inside quotes

        try {
            const name = cells[0].replace(/"/g, ""); // Nome della pietra
            const lat = cells[1].replace(/"/g, ""); // Latitudine
            const lon = cells[2].replace(/"/g, ""); // Longitudine
            const description = cells[3]; // Descrizione
            const date = cells[4]; // Data
            const image = cells[5]; // URL immagine
            const colorIndex = cells[6]; // Indice colore
            const type = cells[7]; // Tipo di pietra

            if (name && lat && lon) { // Assicurati che i dati essenziali siano presenti
                const color = STONE_COLORS[(parseInt(colorIndex) || 0) % STONE_COLORS.length];
                const stone = {
                    name, 
                    lat: parseFloat(String(lat).replace(',', '.')), 
                    lon: parseFloat(String(lon).replace(',', '.')), 
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
                console.warn(`Riga ${i} manca di dati essenziali:`, { name, lat, lon });
            }
        } catch (rowError) {
            console.error(`Errore nel processare la riga CSV ${i}:`, rowError);
        }
    }

    populateStoneSelect();
    displayAllStones();
}

// Funzione per popolare il menu a tendina delle pietre
function populateStoneSelect() {
    const selectElement = document.getElementById('stone-select');
    if (!selectElement) {
        console.error('Elemento stone-select non trovato');
        return;
    }
    
    selectElement.innerHTML = '<option value="">Seleziona una pietra:</option>'; // Reset

    Object.keys(allStonesData).sort().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
    });
}

// Funzione per visualizzare tutte le pietre sulla mappa
function displayAllStones() {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    let totalStones = 0;
    Object.values(allStonesData).forEach(stones => {
        stones.forEach(stone => {
            addStoneToMap(stone);
            totalStones++;
        });
    });

    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);
    
    if (currentMarkers.getLayers().length > 0) {
        map.fitBounds(currentMarkers.getBounds());
    }
    
    console.log(`Visualizzate ${totalStones} pietre sulla mappa`);
}

// Funzione per aggiungere una singola pietra alla mappa
function addStoneToMap(stone) {
    const marker = L.circleMarker([stone.lat, stone.lon], {
        radius: 8,
        fillColor: stone.color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(currentMarkers);

    let popupContent = `<b>${stone.name}</b><br>`;
    if (stone.description) popupContent += `Descrizione: ${stone.description}<br>`;
    if (stone.date) popupContent += `Data: ${stone.date}<br>`;
    if (stone.type) popupContent += `Tipo: ${stone.type}<br>`;
    if (stone.image) {
        popupContent += `<img src="${stone.image}" alt="${stone.name}" style="width:100px; height:auto;"><br>`;
        const imageMarker = L.marker([stone.lat, stone.lon], {
            icon: L.icon({
                iconUrl: stone.image,
                iconSize: [50, 50] // Dimensione dell'icona
            })
        });
        currentImageMarkers.addLayer(imageMarker);
    }

    marker.bindPopup(popupContent);
}

// Funzione per gestire la selezione di una pietra dal menu a tendina
function handleStoneSelect() {
    const selectedStoneName = document.getElementById('stone-select').value;
    if (selectedStoneName) {
        displayStoneDetails(selectedStoneName);
    } else {
        displayAllStones();
    }
}

// Funzione per visualizzare i dettagli di una pietra selezionata
function displayStoneDetails(stoneName) {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    const stones = allStonesData[stoneName];
    if (stones) {
        stones.forEach(stone => {
            addStoneToMap(stone);
        });
        currentMarkers.addTo(map);
        currentPolylines.addTo(map);
        currentImageMarkers.addTo(map);
        if (currentMarkers.getLayers().length > 0) {
            map.fitBounds(currentMarkers.getBounds());
        }
    }
}

// Funzione per gestire la ricerca di una pietra
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    Object.values(allStonesData).forEach(stones => {
        stones.forEach(stone => {
            if (stone.name.toLowerCase().includes(searchTerm) ||
                (stone.description && stone.description.toLowerCase().includes(searchTerm)) ||
                (stone.type && stone.type.toLowerCase().includes(searchTerm))) {
                addStoneToMap(stone);
            }
        });
    });

    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);
    if (currentMarkers.getLayers().length > 0) {
        map.fitBounds(currentMarkers.getBounds());
    } else {
        alert('Nessuna pietra trovata con il termine di ricerca specificato.');
    }
}

// Funzione per mostrare/nascondere le immagini
function toggleImageMarkers() {
    const showImagesCheckbox = document.getElementById('show-images-checkbox');
    if (showImagesCheckbox.checked) {
        currentImageMarkers.addTo(map);
    } else {
        currentImageMarkers.remove();
    }
}

// Funzione per mostrare tutte le pietre (pulsante "Mostra tutto")
function showAllStones() {
    displayAllStones();
    document.getElementById('stone-select').value = '';
    document.getElementById('search-input').value = '';
}

// Funzione per impostare i listener degli eventi
function setupEventListeners() {
    document.getElementById('stone-select').addEventListener('change', handleStoneSelect);
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('show-images-checkbox').addEventListener('change', toggleImageMarkers);
    document.getElementById('show-all-button').addEventListener('click', showAllStones);
    document.getElementById('autoplay-button').addEventListener('click', toggleAutoplay);
    document.getElementById('language-select').addEventListener('change', changeLanguage);
}

// Funzione per avviare/fermare la riproduzione automatica
function toggleAutoplay() {
    const autoplayButton = document.getElementById('autoplay-button');
    if (isAutoplaying) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        isAutoplaying = false;
        autoplayButton.textContent = 'Avvia Riproduzione Automatica';
    } else {
        isAutoplaying = true;
        autoplayButton.textContent = 'Ferma Riproduzione Automatica';
        startAutoplay();
    }
}

// Funzione per avviare la riproduzione automatica
function startAutoplay() {
    const stoneNames = Object.keys(allStonesData).sort();
    let currentIndex = 0;

    if (stoneNames.length === 0) {
        alert('Nessuna pietra da riprodurre.');
        toggleAutoplay();
        return;
    }

    autoplayInterval = setInterval(() => {
        const stoneName = stoneNames[currentIndex];
        document.getElementById('stone-select').value = stoneName;
        displayStoneDetails(stoneName);

        currentIndex = (currentIndex + 1) % stoneNames.length;
    }, autoplaySpeed);
}

// Funzione per cambiare la lingua (funzionalità di esempio)
function changeLanguage() {
    const selectedLanguage = document.getElementById('language-select').value;
    alert(`Lingua cambiata in: ${selectedLanguage}`);
    // Qui potresti caricare file di lingua o aggiornare il DOM con i testi tradotti
}

// Funzione per esportare i dati in JSON (simulazione)
function exportDataToJson() {
    const jsonData = JSON.stringify(allStonesData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stones_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Dati esportati in stones_data.json');
}

// Aggiungi un pulsante per l'esportazione dei dati (per test)
// document.addEventListener('DOMContentLoaded', function() {
//     const exportButton = document.createElement('button');
//     exportButton.textContent = 'Esporta Dati JSON';
//     exportButton.addEventListener('click', exportDataToJson);
//     document.body.appendChild(exportButton);
// });


