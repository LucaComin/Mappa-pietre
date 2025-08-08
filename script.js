// Variabili globali
let map; // La mappa principale
let miniMap; // La mini-mappa nel pannello storia
let allStonesData = {}; // Oggetto per memorizzare i dati delle pietre, raggruppati per nome
let currentMarkers = L.featureGroup(); // Gruppo di marcatori attualmente sulla mappa
let currentPolylines = L.featureGroup(); // Gruppo di polilinee attualmente sulla mappa
let currentImageMarkers = L.markerClusterGroup(); // Gruppo di marcatori per le immagini con clustering

// Configurazione del Google Sheet
// *** SOSTITUISCI QUESTI VALORI CON I TUOI ***
const GOOGLE_SHEET_ID = '1N9I1LpY7hSuyPY85CkH4EitsPcU1Oll-KjJBbFFwHn0'; // L'ID del tuo foglio di calcolo
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)

const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Colori predefiniti per le pietre
const STONE_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

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
    allStonesData = {}; // Reset dei dati

    rows.forEach(row => {
        if (!row.c || row.c.length < 4) return; // Salta righe incomplete

        const name = row.c[0] ? row.c[0].v : null;
        const lat = row.c[1] ? parseFloat(row.c[1].v) : null;
        const lon = row.c[2] ? parseFloat(row.c[2].v) : null;
        const timestamp = row.c[3] ? row.c[3].v : null;
        const imageUrl = row.c[4] ? row.c[4].v : null;

        if (name && lat !== null && lon !== null && timestamp) {
            let date;
            
            // Gestisci diversi formati di data
            if (typeof timestamp === 'string') {
                date = new Date(timestamp);
            } else {
                // Il timestamp da Google Sheets è un formato numerico che rappresenta giorni da 1899-12-30
                date = new Date((timestamp - 25569) * 86400 * 1000);
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
    displayStonesOnMap('all');
}

// Funzione per caricare dati di esempio per test
function loadSampleData() {
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
                imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
            }
        ],
        'Pietra_Blu': [
            {
                lat: 45.4642,
                lon: 9.1900,
                timestamp: '2024-01-20T09:15:00Z',
                dateObj: new Date('2024-01-20T09:15:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop'
            },
            {
                lat: 45.4742,
                lon: 9.2000,
                timestamp: '2024-02-20T11:20:00Z',
                dateObj: new Date('2024-02-20T11:20:00Z'),
                imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop'
            }
        ]
    };

    allStonesData = sampleData;
    populateStoneSelect();
    displayStonesOnMap('all');
}

// Funzione per popolare il menu a tendina delle pietre
function populateStoneSelect() {
    const select = document.getElementById('stone-select');
    select.innerHTML = '<option value="all">Mostra tutte</option>';

    for (const stoneName in allStonesData) {
        const option = document.createElement('option');
        option.value = stoneName;
        option.textContent = stoneName;
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
        if (filterStoneName === 'all' || filterStoneName === stoneName) {
            const positions = allStonesData[stoneName];
            if (positions.length > 0) {
                const stoneColor = STONE_COLORS[colorIndex % STONE_COLORS.length];
                colorIndex++;

                // Disegna la polilinea per il percorso storico
                const latlngs = positions.map(pos => [pos.lat, pos.lon]);
                const polyline = L.polyline(latlngs, { 
                    color: stoneColor, 
                    weight: 3,
                    opacity: 0.7
                }).addTo(currentPolylines);
                
                // Aggiungi l'ultima posizione come marcatore principale
                const lastPosition = positions[positions.length - 1];
                const marker = L.marker([lastPosition.lat, lastPosition.lon], {
                    icon: createCustomIcon(stoneColor)
                }).addTo(currentMarkers);
                
                // Formatta la data per il popup
                const formattedDate = lastPosition.dateObj.toLocaleString('it-IT', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                // Contenuto del popup
                let popupContent = `<div style="text-align: center;">`;
                popupContent += `<h3 style="margin: 0 0 10px 0; color: ${stoneColor};">${stoneName}</h3>`;
                popupContent += `<p style="margin: 5px 0;"><strong>Ultima posizione:</strong><br>${formattedDate}</p>`;
                
                if (lastPosition.imageUrl) {
                    popupContent += `<img src="${lastPosition.imageUrl}" style="max-width:200px; max-height:150px; border-radius: 5px; margin: 10px 0;">`;
                }
                
                popupContent += `<br><button onclick="showStoneHistory('${stoneName}')" style="background: ${stoneColor}; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Vedi la storia</button>`;
                popupContent += `</div>`;

                marker.bindPopup(popupContent, { maxWidth: 250 });

                // Aggiungi le coordinate ai bounds per il fit della mappa
                bounds.push([lastPosition.lat, lastPosition.lon]);

                // Gestione della visualizzazione delle immagini
                addImageMarkers(positions, stoneName, stoneColor);
            }
        }
    }

    // Adatta la mappa per mostrare tutte le pietre filtrate
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Funzione per aggiungere marcatori immagine
function addImageMarkers(positions, stoneName, stoneColor) {
    const imageDisplayMode = document.getElementById('image-display-select').value;
    
    if (imageDisplayMode === 'all') {
        positions.forEach((pos, index) => {
            if (pos.imageUrl) {
                addSingleImageMarker(pos, stoneName, stoneColor, index);
            }
        });
    } else if (imageDisplayMode === 'last') {
        const lastPosition = positions[positions.length - 1];
        if (lastPosition.imageUrl) {
            addSingleImageMarker(lastPosition, stoneName, stoneColor, positions.length - 1);
        }
    }
    // Se imageDisplayMode === 'none', non aggiungiamo marcatori immagine
}

// Funzione per aggiungere un singolo marcatore immagine
function addSingleImageMarker(position, stoneName, stoneColor, index) {
    const imageIcon = L.divIcon({
        className: 'custom-image-marker',
        html: `<div style="
            width: 50px; 
            height: 50px; 
            border-radius: 50%; 
            border: 3px solid ${stoneColor}; 
            background-image: url('${position.imageUrl}'); 
            background-size: cover; 
            background-position: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    const imageMarker = L.marker([position.lat, position.lon], { icon: imageIcon });
    
    const formattedDate = position.dateObj.toLocaleString('it-IT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    imageMarker.bindPopup(`
        <div style="text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: ${stoneColor};">${stoneName}</h4>
            <img src="${position.imageUrl}" style="max-width: 200px; max-height: 150px; border-radius: 5px;">
            <p style="margin: 10px 0 5px 0; font-size: 0.9em;">${formattedDate}</p>
        </div>
    `, { maxWidth: 250 });

    currentImageMarkers.addLayer(imageMarker);
}

// Funzione per creare icone personalizzate
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            background-color: ${color}; 
            border: 3px solid white; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Funzione per mostrare il pannello della storia
function showStoneHistory(stoneName) {
    document.getElementById('history-panel').classList.remove('hidden');
    document.getElementById('history-title').textContent = `Storia di ${stoneName}`;

    // Inizializza la mini-mappa se non è già stata inizializzata
    if (!miniMap) {
        setTimeout(() => {
            miniMap = L.map('mini-map', { 
                zoomControl: false, 
                attributionControl: false, 
                dragging: true, 
                scrollWheelZoom: true, 
                doubleClickZoom: true, 
                boxZoom: false, 
                keyboard: false,
                tap: true,
                touchZoom: true
            }).setView([0, 0], 1);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(miniMap);
            populateHistoryPanel(stoneName);
        }, 100);
    } else {
        populateHistoryPanel(stoneName);
    }
}

// Variabili per il pannello storia
let currentStoneHistory = [];
let currentHistoryIndex = 0;
let miniMapMarkers = L.featureGroup();
let miniMapPolyline;

// Funzione per popolare il pannello della storia
function populateHistoryPanel(stoneName) {
    currentStoneHistory = allStonesData[stoneName];
    currentHistoryIndex = 0; // Inizia sempre dalla prima posizione (la più vecchia)

    updateHistoryPanel();
    populateTimeline();
    setupNavigationButtons();
}

// Funzione per configurare i pulsanti di navigazione
function setupNavigationButtons() {
    document.getElementById('prev-button').onclick = () => {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            updateHistoryPanel();
        }
    };
    
    document.getElementById('next-button').onclick = () => {
        if (currentHistoryIndex < currentStoneHistory.length - 1) {
            currentHistoryIndex++;
            updateHistoryPanel();
        }
    };
}

// Funzione per aggiornare il contenuto del pannello della storia
function updateHistoryPanel() {
    const currentPos = currentStoneHistory[currentHistoryIndex];
    
    // Aggiorna l'immagine
    const historyImage = document.getElementById('history-image');
    if (currentPos.imageUrl) {
        historyImage.src = currentPos.imageUrl;
        historyImage.style.display = 'block';
    } else {
        historyImage.style.display = 'none';
    }
    
    // Aggiorna la caption
    const formattedDate = currentPos.dateObj.toLocaleString('it-IT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('history-image-caption').textContent = formattedDate;

    // Aggiorna lo stato dei pulsanti
    document.getElementById('prev-button').disabled = currentHistoryIndex === 0;
    document.getElementById('next-button').disabled = currentHistoryIndex === currentStoneHistory.length - 1;

    // Aggiorna la mini-mappa
    if (miniMap) {
        updateMiniMap();
    }

    // Aggiorna la timeline
    updateTimelineActivePoint();
}

// Funzione per aggiornare la mini-mappa
function updateMiniMap() {
    if (!miniMap) return;

    // Pulisci i layer esistenti
    miniMapMarkers.clearLayers();
    if (miniMapPolyline) {
        miniMap.removeLayer(miniMapPolyline);
    }

    // Disegna la polilinea del percorso
    const latlngs = currentStoneHistory.map(pos => [pos.lat, pos.lon]);
    miniMapPolyline = L.polyline(latlngs, { color: '#007cba', weight: 3 }).addTo(miniMap);

    // Aggiungi tutti i marcatori
    currentStoneHistory.forEach((pos, index) => {
        const isActive = index === currentHistoryIndex;
        const marker = L.circleMarker([pos.lat, pos.lon], {
            radius: isActive ? 8 : 5,
            fillColor: isActive ? '#ff4444' : '#007cba',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        marker.addTo(miniMapMarkers);
        
        // Aggiungi click handler per navigare
        marker.on('click', () => {
            currentHistoryIndex = index;
            updateHistoryPanel();
        });
    });

    miniMapMarkers.addTo(miniMap);

    // Adatta la vista per mostrare tutto il percorso
    if (latlngs.length > 0) {
        miniMap.fitBounds(miniMapPolyline.getBounds(), { padding: [10, 10] });
    }
}

// Funzione per popolare la timeline
function populateTimeline() {
    const timelineDiv = document.getElementById('timeline');
    timelineDiv.innerHTML = '';

    currentStoneHistory.forEach((pos, index) => {
        const point = document.createElement('div');
        point.classList.add('timeline-point');
        
        // Posiziona i punti in modo proporzionale
        const leftPercent = currentStoneHistory.length === 1 ? 50 : (index / (currentStoneHistory.length - 1)) * 100;
        point.style.left = `${leftPercent}%`;
        
        // Tooltip con la data
        const formattedDate = pos.dateObj.toLocaleDateString('it-IT', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        point.title = formattedDate;
        point.dataset.index = index;
        
        // Click handler
        point.onclick = () => {
            currentHistoryIndex = index;
            updateHistoryPanel();
        };
        
        timelineDiv.appendChild(point);
    });
    
    updateTimelineActivePoint();
}

// Funzione per aggiornare il punto attivo nella timeline
function updateTimelineActivePoint() {
    document.querySelectorAll('.timeline-point').forEach((point, index) => {
        if (parseInt(point.dataset.index) === currentHistoryIndex) {
            point.classList.add('active');
        } else {
            point.classList.remove('active');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadData();
    
    // Event listener per il pulsante di chiusura del pannello storia
    document.getElementById('close-history').addEventListener('click', () => {
        document.getElementById('history-panel').classList.add('hidden');
    });

    // Event listener per il cambio della modalità di visualizzazione immagini
    document.getElementById('image-display-select').addEventListener('change', () => {
        const selectedStone = document.getElementById('stone-select').value;
        displayStonesOnMap(selectedStone);
    });

    // Event listener per chiudere il pannello storia con ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.getElementById('history-panel').classList.add('hidden');
        }
    });
});

// Funzione globale per essere chiamata dai popup
window.showStoneHistory = showStoneHistory;

