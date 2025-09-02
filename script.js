// Variabili globali
let map; // La mappa principale
let miniMap; // La mini-mappa nel pannello storia
let allStonesData = {}; // Oggetto per memorizzare i dati delle pietre, raggruppati per nome
let currentMarkers = L.featureGroup(); // Gruppo di marcatori attualmente sulla mappa
let currentPolylines = L.featureGroup(); // Gruppo di polilinee attualmente sulla mappa
let currentImageMarkers = L.markerClusterGroup(); // Gruppo di marcatori per le immagini con clustering

// Variabili per la riproduzione automatica
let autoplayInterval = null;
let isAutoplaying = false;
let autoplaySpeed = 2000; // 2 secondi

// Configurazione del Google Sheet
// *** SOSTITUISCI QUESTI VALORI CON I TUOI ***
const GOOGLE_SHEET_ID = '1N9I1pY7hSuyPY85CkH4EitsPcU101L-KJBBFwHn0'; // L'ID del tuo foglio di calcolo
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
document.addEventListener('DOMContentLoaded', function() {
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

        // Inizializza la guida interattiva (se disponibile)
        if (typeof TutorialGuide !== 'undefined') {
            tutorialGuide = new TutorialGuide();
            console.log('Guida interattiva inizializzata');
        }

        // Nascondi loading overlay dopo l'inizializzazione
        setTimeout(() => {
            hideLoadingOverlay();
            console.log('Loading overlay nascosto');
        }, 3000); // Aumentato a 3 secondi per dare più tempo

    } catch (error) {
        console.error('Errore durante l\'inizializzazione:', error);
    }
});

// Funzione per inizializzare la mappa
function initMap() {
    map = L.map('map', {
        center: [43.0, 12.0],
        zoom: 6,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false // Disabilita il controllo dello zoom predefinito
    });

    // Aggiungi il tile layer di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Aggiungi il controllo dello zoom personalizzato in basso a destra
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Inizializza la mini-mappa
    miniMap = new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), {
        toggleDisplay: true,
        minimized: true,
        position: 'bottomleft'
    }).addTo(map);

    // Aggiungi i layer groups alla mappa
    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);

    // Gestione eventi di zoom per il clustering
    map.on('zoomend', function() {
        updateMarkersVisibility();
    });
}

// Funzione per caricare i dati dal Google Sheet
async function loadData() {
    try {
        // Dati di esempio per il test
        const exampleData = [
            {
                stoneId: 'St001',
                name: 'Pietra del Nord',
                latitude: 45.4642,
                longitude: 9.1900,
                description: 'Una pietra antica trovata nel nord Italia',
                imageUrl: '',
                color: '#2563eb',
                relatedStones: ['St002']
            },
            {
                stoneId: 'St002',
                name: 'Pietra del Sud',
                latitude: 40.8518,
                longitude: 14.2681,
                description: 'Una pietra misteriosa del sud Italia',
                imageUrl: '',
                color: '#dc2626',
                relatedStones: ['St001', 'St003']
            },
            {
                stoneId: 'St003',
                name: 'Pietra del Centro',
                latitude: 41.9028,
                longitude: 12.4964,
                description: 'La pietra centrale del percorso',
                imageUrl: '',
                color: '#059669',
                relatedStones: ['St002']
            }
        ];

        // Popola allStonesData con i dati di esempio
        exampleData.forEach(stone => {
            if (!allStonesData[stone.name]) {
                allStonesData[stone.name] = [];
            }
            allStonesData[stone.name].push(stone);
        });

        console.log('Dati caricati:', allStonesData);
        populateStoneSelector();
        displayMarkers('Mostra tutte');

    } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
    }
}

// Funzione per popolare il selettore delle pietre
function populateStoneSelector() {
    const selector = document.getElementById('stone-selector');
    selector.innerHTML = '<option value="Mostra tutte">Mostra tutte</option>';
    Object.keys(allStonesData).sort().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selector.appendChild(option);
    });
}

// Funzione per visualizzare i marcatori sulla mappa
function displayMarkers(selectedStoneName) {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    let stonesToDisplay = [];
    if (selectedStoneName === 'Mostra tutte') {
        Object.values(allStonesData).forEach(stones => {
            stonesToDisplay = stonesToDisplay.concat(stones);
        });
    } else {
        stonesToDisplay = allStonesData[selectedStoneName] || [];
    }

    stonesToDisplay.forEach(stone => {
        const latLng = [stone.latitude, stone.longitude];
        const marker = L.marker(latLng);

        let popupContent = `<b>${stone.name} (${stone.stoneId})</b><br>${stone.description}`;
        if (stone.imageUrl) {
            popupContent += `<br><img src="${stone.imageUrl}" alt="${stone.name}" style="width:100px;">`;
            const imageMarker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: stone.imageUrl,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                })
            });
            imageMarker.bindPopup(popupContent);
            currentImageMarkers.addLayer(imageMarker);
        }

        marker.bindPopup(popupContent);
        currentMarkers.addLayer(marker);

        // Disegna polilinee per pietre correlate
        stone.relatedStones.forEach(relatedStoneId => {
            const relatedStone = findStoneById(relatedStoneId);
            if (relatedStone) {
                const polyline = L.polyline([
                    [stone.latitude, stone.longitude],
                    [relatedStone.latitude, relatedStone.longitude]
                ], {
                    color: stone.color
                }).addTo(currentPolylines);
            }
        });
    });

    updateMarkersVisibility();
}

// Funzione per trovare una pietra per ID
function findStoneById(stoneId) {
    for (const name in allStonesData) {
        for (const stone of allStonesData[name]) {
            if (stone.stoneId === stoneId) {
                return stone;
            }
        }
    }
    return null;
}

// Funzione per aggiornare la visibilità dei marcatori in base allo zoom
function updateMarkersVisibility() {
    const currentZoom = map.getZoom();
    
    // Nascondi i marker individuali quando sono raggruppati (zoom basso)
    if (currentZoom < 10) {
        // Nascondi i marker individuali
        currentMarkers.eachLayer(function(layer) {
            if (layer.getElement) {
                layer.getElement().style.display = 'none';
            }
        });
        
        // Mostra solo i cluster delle immagini
        currentImageMarkers.eachLayer(function(layer) {
            if (layer.getElement) {
                layer.getElement().style.display = 'block';
            }
        });
    } else {
        // A zoom alto, mostra i marker individuali e nascondi i cluster
        currentMarkers.eachLayer(function(layer) {
            if (layer.getElement) {
                layer.getElement().style.display = 'block';
            }
        });
        
        // Nascondi i cluster delle immagini quando i marker individuali sono visibili
        currentImageMarkers.eachLayer(function(layer) {
            if (layer.getElement) {
                layer.getElement().style.display = 'none';
            }
        });
    }
    
    // Gestione speciale per i cluster: nascondi i marker individuali quando sono raggruppati
    currentImageMarkers.on('clustercreate', function(event) {
        // Quando viene creato un cluster, nascondi i marker individuali che lo compongono
        event.layer.getAllChildMarkers().forEach(function(marker) {
            // Trova il corrispondente marker individuale e nascondilo
            currentMarkers.eachLayer(function(individualMarker) {
                if (individualMarker.getLatLng().equals(marker.getLatLng())) {
                    if (individualMarker.getElement) {
                        individualMarker.getElement().style.display = 'none';
                    }
                }
            });
        });
    });
    
    currentImageMarkers.on('clusterremove', function(event) {
        // Quando un cluster viene rimosso, mostra di nuovo i marker individuali se appropriato
        if (currentZoom >= 10) {
            event.layer.getAllChildMarkers().forEach(function(marker) {
                currentMarkers.eachLayer(function(individualMarker) {
                    if (individualMarker.getLatLng().equals(marker.getLatLng())) {
                        if (individualMarker.getElement) {
                            individualMarker.getElement().style.display = 'block';
                        }
                    }
                });
            });
        }
    });
}

// Funzione per configurare gli event listeners
function setupEventListeners() {
    document.getElementById('stone-selector').addEventListener('change', function(event) {
        displayMarkers(event.target.value);
    });

    document.getElementById('language-selector').addEventListener('change', function(event) {
        setLanguage(event.target.value);
    });

    document.getElementById('show-images-selector').addEventListener('change', function(event) {
        updateImageVisibility(event.target.value);
    });

    document.getElementById('play-button').addEventListener('click', toggleAutoplay);
    document.getElementById('pause-button').addEventListener('click', toggleAutoplay);
    document.getElementById('prev-button').addEventListener('click', showPreviousStone);
    document.getElementById('next-button').addEventListener('click', showNextStone);

    // Event listener per il pulsante di aiuto
    document.getElementById('help-button').addEventListener('click', () => {
        if (tutorialGuide) {
            tutorialGuide.start();
        }
    });
}

// Funzione per aggiornare la visibilità delle immagini
function updateImageVisibility(visibility) {
    currentImageMarkers.eachLayer(function(layer) {
        const img = layer.getElement().querySelector('img');
        if (img) {
            if (visibility === 'None') {
                img.style.display = 'none';
            } else if (visibility === 'All') {
                img.style.display = 'block';
            } else if (visibility === 'Last') {
                // Logica per mostrare solo l'ultima immagine (se applicabile)
                // Questa logica potrebbe richiedere un tracciamento più complesso dell'ultima pietra selezionata
                img.style.display = 'block'; // Per ora, mostra tutte se 'Last' è selezionato
            }
        }
    });
}

// Funzioni per la riproduzione automatica
function toggleAutoplay() {
    if (isAutoplaying) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        isAutoplaying = false;
        console.log('Autoplay interrotto');
    } else {
        isAutoplaying = true;
        console.log('Autoplay avviato');
        showNextStone(); // Mostra subito la prima pietra
        autoplayInterval = setInterval(showNextStone, autoplaySpeed);
    }
    updateAutoplayButtons();
}

function updateAutoplayButtons() {
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    if (isAutoplaying) {
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    } else {
        playButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
    }
}

let currentStoneIndex = 0;

function showNextStone() {
    const stoneNames = Object.keys(allStonesData).sort();
    if (stoneNames.length === 0) return;

    currentStoneIndex = (currentStoneIndex + 1) % stoneNames.length;
    const nextStoneName = stoneNames[currentStoneIndex];
    document.getElementById('stone-selector').value = nextStoneName;
    displayMarkers(nextStoneName);
    map.flyTo([allStonesData[nextStoneName][0].latitude, allStonesData[nextStoneName][0].longitude], 10);
}

function showPreviousStone() {
    const stoneNames = Object.keys(allStonesData).sort();
    if (stoneNames.length === 0) return;

    currentStoneIndex = (currentStoneIndex - 1 + stoneNames.length) % stoneNames.length;
    const prevStoneName = stoneNames[currentStoneIndex];
    document.getElementById('stone-selector').value = prevStoneName;
    displayMarkers(prevStoneName);
    map.flyTo([allStonesData[prevStoneName][0].latitude, allStonesData[prevStoneName][0].longitude], 10);
}

// Funzioni per mostrare/nascondere l'overlay di caricamento
function showLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Funzione per inizializzare il selettore della lingua (da translations.js)
// Questa funzione è definita in translations.js e viene chiamata qui.
// Assicurati che translations.js sia caricato prima di script.js.

// Funzione per impostare la lingua (da translations.js)
// Questa funzione è definita in translations.js e viene chiamata qui.

// Classe TutorialGuide (da tutorial.js)
// Questa classe è definita in tutorial.js e viene istanziata qui.

