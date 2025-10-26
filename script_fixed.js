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
let autoPlaySpeed = 2000; // 2 secondi

// Configurazone del Google Sheet
// *** SOSTITUISCI QUESTI VALORI CON I TUOI ***
const GOOGLE_SHEET_ID = '1N01UHp7hSsyVPB5cW4EltsPCU1O11-KJBBfFWnh0'; // L'ID del tuo foglio di calcolo
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', // blu
    '#ad2626', // rosso
    '#059669', // verde
    '#d97706', // giallo/arancio
    '#7c3aed', // viola
    '#adb2b2', // grigio
    '#00891b2', // verde scuro
    '#d5a308a', // marrone
    '#c2410c', // arancio scuro
    '#4338ca' // indaco
];

// Variabile globale per la guida
let tutorialGuide;

// Funzione per inizializzare la mappa
function initMap() {
    map = L.map('map').setView([41.9028, 12.4964], 6); // Centro iniziale (Roma) e zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Aggiungi i gruppi di layer alla mappa
    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);
}

// Funzione per caricare e processare i dati dal Google Sheet
async function loadData() {
    try {
        // Per test, usiamo dati di esempio se non è configurato il Google Sheet
        if (GOOGLE_SHEET_ID === 'YOUR_GOOGLE_SHEET_ID') {
            loadSampleData();
            return;
        }

        const response = await fetch(GOOGLE_SHEET_URL);
        const text = await response.text();

        // Google Sheets API restituisce un JSON con un wrapper, dobbiamo estrarlo
        const jsonString = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
        const jsonData = JSON.parse(jsonString);

        const rows = jsonData.table.rows;
        processSheetData(rows);
    } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        console.log('Caricamento dati di esempio per test...');
        loadSampleData();
    }
}

// Funzione per processare i dati dal Google Sheet
function processSheetData(rows) {
    // Reset dei dati
    allStonesData = {};

    rows.forEach(row => {
        // Salta righe incomplete
        if (!row.c || row.c.length < 4) return;

        const name = row.c[0]?.v;
        const lat = row.c[1]?.v ? parseFloat(row.c[1].v) : null;
        const lon = row.c[2]?.v ? parseFloat(row.c[2].v) : null;
        let timestamp = row.c[3]?.v;
        const imageUrl = row.c[4]?.v;

        if (name && lat !== null && lon !== null && timestamp) {
            let date;

            // Gestisci diversi formati di data
            if (typeof timestamp === 'string' && timestamp.startsWith('Date(')) {
                // Estrai i valori numerici da 'Date(YYYY,M,D)'
                const dateParts = timestamp.substring(5, timestamp.length - 1).split(',');
                const year = parseInt(dateParts[0]);
                // Mese è 0-based in JS
                const month = parseInt(dateParts[1]); 
                const day = parseInt(dateParts[2]);
                date = new Date(year, month, day);
            } else if (typeof timestamp === 'number') {
                // Il timestamp da Google Sheets è un formato numerico che rappresenta giorni da 1899-12-30
                date = new Date((timestamp - 25569) * 86400 * 1000);
            } else if (typeof timestamp === 'string') {
                date = new Date(timestamp);
            }

            if (!allStonesData[name]) {
                allStonesData[name] = [];
            }

            allStonesData[name].push({
                lat: lat,
                lon: lon,
                timestamp: date.toISOString(),
                dateObj: date,
                imageUrl: imageUrl
            });
        }
    });

    // Ordina le posizioni di ogni pietra per timestamp (dal più vecchio al più recente)
    for (const stoneName in allStonesData) {
        allStonesData[stoneName].sort((a, b) => a.dateObj - b.dateObj);
    }

    populateStoneSelect();
    displayStonesOnMap('moved_stones'); // Imposta la nuova opzione come predefinita
}

// Funzione per caricare dati di esempio per test
function loadSampleData() {
    // Dati di esempio per test
    const sampleData = {
        'Pietra_Rossa': [
            {
                lat: 41.9028,
                lon: 12.4964,
                timestamp: '2024-01-15T10:00:00Z',
                dateObj: new Date('2024-01-15T10:00:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop'
            },
            {
                lat: 41.9128,
                lon: 12.5064,
                timestamp: '2024-02-15T14:30:00Z',
                dateObj: new Date('2024-02-15T14:30:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=300&h=300&fit=crop'
            },
            {
                lat: 41.9228,
                lon: 12.5164,
                timestamp: '2024-03-15T16:45:00Z',
                dateObj: new Date('2024-03-15T16:45:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1506905925346-d4f000000000?w=300&h=300&fit=crop'
            }
        ],
        'Pietra_Blu': [
            {
                lat: 40.8518,
                lon: 14.2681,
                timestamp: '2024-01-25T08:00:00Z',
                dateObj: new Date('2024-01-25T08:00:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=300&h=300&fit=crop'
            },
            {
                lat: 40.8618,
                lon: 14.2781,
                timestamp: '2024-02-25T12:15:00Z',
                dateObj: new Date('2024-02-25T12:15:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1506905925346-d4f000000000?w=300&h=300&fit=crop'
            }
        ],
        'Pietra_Verde': [
            {
                lat: 45.4642,
                lon: 9.1900,
                timestamp: '2024-01-20T09:15:00Z',
                dateObj: new Date('2024-01-20T09:15:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52befd2?w=300&h=300&fit=crop'
            },
            {
                lat: 45.4742,
                lon: 9.2000,
                timestamp: '2024-02-20T11:20:00Z',
                dateObj: new Date('2024-02-20T11:20:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop'
            }
        ],
        'Pietra_Singola': [
            {
                lat: 48.8566,
                lon: 2.3522,
                timestamp: '2024-03-01T10:00:00Z',
                dateObj: new Date('2024-03-01T10:00:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop'
            }
        ]
    };

    allStonesData = sampleData;
    populateStoneSelect();
    displayStonesOnMap('moved_stones'); // Imposta la nuova opzione come predefinita
}


// Funzione per popolare il menu a tendina delle pietre
function populateStoneSelect() {
    const select = document.getElementById('stone-select');
    // Rimuovi tutte le opzioni tranne la prima (che ora è "Pietre con spostamenti")
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Aggiungi le opzioni per le pietre singole
    for (const stoneName in allStonesData) {
        const option = document.createElement('option');
        option.value = stoneName;
        // Sostituisci gli underscore con spazi per il testo visualizzato
        option.textContent = stoneName.replace(/_/g, ' '); 
        select.appendChild(option);
    }

    select.addEventListener('change', (event) => {
        displayStonesOnMap(event.target.value);
    });
}

// Funzione principale per visualizzare le pietre sulla mappa
function displayStonesOnMap(filterStoneName = 'all') {
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    let bounds = [];
    let colorIndex = 0;

    for (const stoneName in allStonesData) {
        const positions = allStonesData[stoneName];

        // LOGICA PER LA NUOVA OPZIONE "Pietre con spostamenti"
        if (filterStoneName === 'moved_stones' && positions.length <= 1) {
            continue; // Salta le pietre che non si sono spostate (hanno una sola posizione)
        }

        if (filterStoneName === 'all' || filterStoneName === stoneName || (filterStoneName === 'moved_stones' && positions.length > 1)) {
            if (positions.length > 0) {
                const stoneColor = STONE_COLORS[colorIndex % STONE_COLORS.length];
                colorIndex++;

                // Disegna la polilinea per il percorso storico
                const latlngs = positions.map(pos => [pos.lat, pos.lon]);
                const polyline = L.polyline(latlngs, {
                    color: stoneColor,
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '10, 5'
                }).addTo(currentPolylines);

                // Aggiungi l'ultima posizione come marcatore principale
                const lastPosition = positions[positions.length - 1];
                const marker = L.marker([lastPosition.lat, lastPosition.lon], {
                    icon: L.divIcon({
                        className: 'stone-marker',
                        html: `<div style="background-color: ${stoneColor};">${stoneName.replace(/_/g, ' ')}</div>`,
                        iconSize: [100, 20],
                        iconAnchor: [50, 20]
                    })
                }).addTo(currentMarkers);

                // Aggiungi un popup al marcatore principale
                marker.bindPopup(`<b>${stoneName.replace(/_/g, ' ')}</b><br>Ultima posizione: ${lastPosition.lat.toFixed(4)}, ${lastPosition.lon.toFixed(4)}<br><button onclick="showHistoryPanel('${stoneName}')">Visualizza Storia</button>`);

                // Aggiungi tutte le posizioni ai bounds per centrare la mappa
                positions.forEach(pos => bounds.push([pos.lat, pos.lon]));
            }
        }
    }

    // Centra la mappa sui marcatori se ce ne sono
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Funzione per mostrare il pannello della storia
function showHistoryPanel(stoneName) {
    const panel = document.getElementById('history-panel');
    const details = document.getElementById('history-details');
    const miniMapContainer = document.getElementById('history-map-container');
    const stoneData = allStonesData[stoneName];

    if (!stoneData || stoneData.length === 0) {
        details.innerHTML = '<p>Nessun dato storico disponibile per questa pietra.</p>';
        panel.classList.remove('hidden');
        return;
    }

    // Popola i dettagli
    let html = `<h2>Storia di ${stoneName.replace(/_/g, ' ')}</h2>`;
    html += '<ul>';
    stoneData.forEach((pos, index) => {
        html += `<li><b>Posizione ${index + 1}:</b> Lat: ${pos.lat.toFixed(4)}, Lon: ${pos.lon.toFixed(4)} - Data: ${new Date(pos.timestamp).toLocaleDateString()} ${new Date(pos.timestamp).toLocaleTimeString()}`;
        if (pos.imageUrl) {
            html += ` <a href="${pos.imageUrl}" target="_blank">Visualizza Immagine</a>`;
        }
        html += '</li>';
    });
    html += '</ul>';
    details.innerHTML = html;

    // Mostra il pannello
    panel.classList.remove('hidden');

    // Inizializza la mini-mappa
    if (miniMap) {
        miniMap.remove();
    }
    miniMap = L.map('mini-map').setView([stoneData[0].lat, stoneData[0].lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(miniMap);

    // Disegna il percorso sulla mini-mappa
    const latlngs = stoneData.map(pos => [pos.lat, pos.lon]);
    L.polyline(latlngs, { color: STONE_COLORS[0], weight: 3, opacity: 0.7 }).addTo(miniMap);

    // Aggiungi i marcatori sulla mini-mappa
    let bounds = [];
    stoneData.forEach((pos, index) => {
        L.marker([pos.lat, pos.lon]).addTo(miniMap)
            .bindPopup(`Posizione ${index + 1}: ${new Date(pos.timestamp).toLocaleDateString()}`);
        bounds.push([pos.lat, pos.lon]);
    });

    // Centra e zooma la mini-mappa sul percorso
    if (bounds.length > 0) {
        miniMap.fitBounds(bounds, { padding: [10, 10] });
    }

    // Invalida la dimensione della mini-mappa per assicurarsi che venga visualizzata correttamente
    setTimeout(() => {
        miniMap.invalidateSize();
    }, 10);
}

// Funzione per chiudere il pannello della storia
function closeHistoryPanel() {
    const panel = document.getElementById('history-panel');
    panel.classList.add('hidden');
    if (miniMap) {
        miniMap.remove();
        miniMap = null;
    }
}

// Funzioni per il loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Setup degli event listeners
function setupEventListeners() {
    // Event listener per il pannello storia
    const closeHistoryBtn = document.getElementById('close-history-btn');
    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', closeHistoryPanel);
    }

    // Event listener per il fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const closeFullscreenBtn = document.getElementById('close-fullscreen');
    const fullscreenModal = document.getElementById('fullscreen-modal');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', openFullscreen);
    }

    if (closeFullscreenBtn) {
        closeFullscreenBtn.addEventListener('click', closeFullscreen);
    }

    if (fullscreenModal) {
        fullscreenModal.addEventListener('click', function(e) {
            if (e.target === fullscreenModal) {
                closeFullscreen();
            }
        });
    }

    // Event listener per i controlli
    const imageDisplaySelect = document.getElementById('image-display-select');
    if (imageDisplaySelect) {
        imageDisplaySelect.addEventListener('change', function() {
            const selectedStone = document.getElementById('stone-select').value;
            displayStonesOnMap(selectedStone);
        });
    }

    // Event listener per il selettore di pietre
    const stoneSelect = document.getElementById('stone-select');
    if (stoneSelect) {
        // L'event listener per il cambio è già aggiunto in populateStoneSelect
        // Ma aggiungiamo qui la logica per la preselezione
        stoneSelect.value = 'moved_stones';
    }


    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHistoryPanel();
            closeFullscreen();
        }
    });

    // Inizializza la guida interattiva
    tutorialGuide = new TutorialGuide();
    const openTutorialBtn = document.getElementById('open-tutorial-btn');
    if (openTutorialBtn) {
        openTutorialBtn.addEventListener('click', () => tutorialGuide.show());
    }

    // Event listeners per il modale foto (da implementare)
    const openPhotoModalBtn = document.getElementById('open-photo-modal-btn');
    const closePhotoModalBtn = document.getElementById('close-photo-modal-btn');
    const photoModal = document.getElementById('photo-modal');

    if (openPhotoModalBtn) {
        openPhotoModalBtn.addEventListener('click', () => photoModal.classList.remove('hidden'));
    }

    if (closePhotoModalBtn) {
        closePhotoModalBtn.addEventListener('click', () => photoModal.classList.add('hidden'));
    }
}

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    showLoadingOverlay();
    initMap();
    loadData();
    setupEventListeners();
    
    // Inizializza la guida interattiva
    if (typeof initializeLanguageSelector === 'function') {
        initializeLanguageSelector();
    }

    // Nascondi loading overlay dopo l'inizializzazione
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);
});

// Funzione per il cambio lingua (da implementare in translations.js)
function changeLanguage(lang) {
    // Logica per cambiare la lingua dell'interfaccia
    console.log('Lingua cambiata in:', lang);
}

// Funzioni per il fullscreen (da implementare)
function openFullscreen() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    if (fullscreenModal) {
        fullscreenModal.classList.remove('hidden');
    }
}

function closeFullscreen() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    if (fullscreenModal) {
        fullscreenModal.classList.add('hidden');
    }
}

// Classe per la Guida Interattiva (TutorialGuide)
class TutorialGuide {
    constructor() {
        this.modal = document.getElementById('tutorial-modal');
        this.content = document.getElementById('tutorial-content');
        this.prevBtn = document.getElementById('tutorial-prev-btn');
        this.nextBtn = document.getElementById('tutorial-next-btn');
        this.skipBtn = document.getElementById('tutorial-skip-btn');
        this.closeBtn = document.getElementById('close-tutorial-btn');
        this.currentPage = 0;
        this.pages = [
            {
                title: "Benvenuto nella Mappa delle Pietre!",
                text: "Questa mappa interattiva ti permette di seguire il viaggio delle pietre nel tempo. Ogni pietra ha la sua storia unica da raccontare.",
                image: "map.png"
            },
            {
                title: "Seleziona una Pietra",
                text: "Usa il menu a tendina 'Seleziona una pietra' per filtrare e visualizzare il percorso di una singola pietra o di un gruppo specifico. La nuova opzione 'Pietre con spostamenti' mostra solo quelle che hanno un percorso storico.",
                image: "select.png"
            },
            {
                title: "Il Percorso",
                text: "Il percorso di una pietra è mostrato con una linea tratteggiata. Il marcatore principale indica l'ultima posizione conosciuta.",
                image: "path.png"
            },
            {
                title: "La Storia",
                text: "Clicca sul marcatore per aprire il pannello della storia, dove puoi vedere tutte le posizioni registrate e la mini-mappa del percorso completo.",
                image: "history.png"
            },
            {
                title: "Aggiungi una Foto",
                text: "Usa il pulsante 'Aggiungi foto' per scattare una foto o caricarne una, e analizzarla per localizzarla sulla mappa.",
                image: "photo.png"
            },
            {
                title: "Fine del Tutorial",
                text: "Sei pronto per esplorare! Divertiti a scoprire le storie delle pietre.",
                image: "end.png"
            }
        ];

        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        this.skipBtn.addEventListener('click', () => this.hide());
        this.closeBtn.addEventListener('click', () => this.hide());
    }

    show() {
        this.currentPage = 0;
        this.updatePage();
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }

    updatePage() {
        const page = this.pages[this.currentPage];
        this.content.innerHTML = `
            <h3 class="tutorial-page-title">${page.title}</h3>
            <p>${page.text}</p>
            <img src="${page.image}" alt="${page.title}" class="tutorial-image">
            <p class="tutorial-page-counter">${this.currentPage + 1} di ${this.pages.length}</p>
        `;

        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.textContent = this.currentPage === this.pages.length - 1 ? 'Inizia' : 'Next';
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePage();
        }
    }

    nextPage() {
        if (this.currentPage < this.pages.length - 1) {
            this.currentPage++;
            this.updatePage();
        } else {
            this.hide();
        }
    }
}
