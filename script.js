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
const GOOGLE_SHEET_ID = '1N9I1LpY7hSuyPY85CkH4EitsPcU1Oll-KjJBbFFwHn0'; // L'ID del tuo foglio di calcolo
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)

const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
    '#db2777', '#0891b2', '#65a30d', '#c2410c', '#4338ca'
];

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    showLoadingOverlay();
    initMap();
    loadData();
    setupEventListeners();
    
    // Nascondi loading overlay dopo l'inizializzazione
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);
});

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
    const closeHistoryBtn = document.getElementById('close-history');
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHistoryPanel();
            closeFullscreen();
        }
    });
}

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
        ],
        'Pietra_Verde': [
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
                imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
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
        if (filterStoneName === 'all' || filterStoneName === stoneName) {
            const positions = allStonesData[stoneName];
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
                    icon: createCustomIcon(stoneColor, true)
                }).addTo(currentMarkers);
                
                // Formatta la data per il popup
                const formattedDate = lastPosition.dateObj.toLocaleString('it-IT', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                // Contenuto del popup migliorato
                let popupContent = `<div style="text-align: center; font-family: 'Inter', sans-serif;">`;
                popupContent += `<h3 style="margin: 0 0 10px 0; color: ${stoneColor}; font-weight: 600;">${stoneName.replace(/_/g, ' ')}</h3>`;
                popupContent += `<p style="margin: 5px 0; color: #64748b;"><strong>Ultima posizione:</strong><br>${formattedDate}</p>`;
                
                if (lastPosition.imageUrl) {
                    popupContent += `<img src="${lastPosition.imageUrl}" style="max-width:200px; max-height:150px; border-radius: 8px; margin: 10px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`;
                }
                
                popupContent += `<br><button onclick="showStoneHistory('${stoneName}')" style="
                    background: linear-gradient(135deg, ${stoneColor} 0%, ${adjustColor(stoneColor, -20)} 100%); 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    margin-top: 10px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';">📖 Vedi la storia</button>`;
                popupContent += `</div>`;

                marker.bindPopup(popupContent, { maxWidth: 280, className: 'custom-popup' });

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
            width: 60px; 
            height: 60px; 
            border-radius: 50%; 
            border: 4px solid ${stoneColor}; 
            background-image: url('${position.imageUrl}'); 
            background-size: cover; 
            background-position: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></div>`,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });

    const imageMarker = L.marker([position.lat, position.lon], { icon: imageIcon });
    
    const formattedDate = position.dateObj.toLocaleString('it-IT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    let imagePopupContent = `<div style="text-align: center; font-family: 'Inter', sans-serif;">`;
    imagePopupContent += `<h4 style="margin: 0 0 10px 0; color: ${stoneColor}; font-weight: 600;">${stoneName.replace(/_/g, ' ')}</h4>`;
    imagePopupContent += `<img src="${position.imageUrl}" style="max-width: 200px; max-height: 150px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">`;
    imagePopupContent += `<p style="margin: 10px 0 5px 0; font-size: 0.9em; color: #64748b;">${formattedDate}</p>`;
    imagePopupContent += `<br><button onclick="showStoneHistory('${stoneName}')" style="
        background: linear-gradient(135deg, ${stoneColor} 0%, ${adjustColor(stoneColor, -20)} 100%); 
        color: white; 
        border: none; 
        padding: 8px 16px; 
        border-radius: 6px; 
        cursor: pointer; 
        margin-top: 8px;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';">📖 Vedi la storia</button>`;
    imagePopupContent += `</div>`;

    imageMarker.bindPopup(imagePopupContent, { maxWidth: 250, className: 'custom-popup' });

    currentImageMarkers.addLayer(imageMarker);
}

// Funzione per creare icone personalizzate
function createCustomIcon(color, isMain = false) {
    const size = isMain ? 30 : 20;
    const borderWidth = isMain ? 4 : 3;
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%); 
            border: ${borderWidth}px solid white; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: relative;
        ">
            ${isMain ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold;">📍</div>' : ''}
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}

// Funzione helper per regolare il colore
function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// Funzione per mostrare il pannello della storia
function showStoneHistory(stoneName) {
    document.getElementById('history-panel').classList.remove('hidden');
    document.getElementById('history-title').textContent = `Storia di ${stoneName.replace(/_/g, ' ')}`;

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

// Funzione per chiudere il pannello storia
function closeHistoryPanel() {
    stopAutoPlay(); // Ferma l'autoplay quando si chiude il pannello
    document.getElementById('history-panel').classList.add('hidden');
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
    // Event listener per i pulsanti di navigazione
    document.getElementById('prev-button').onclick = () => {
        stopAutoPlay(); // Ferma l'autoplay quando si naviga manualmente
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            updateHistoryPanel();
        }
    };
    
    document.getElementById('next-button').onclick = () => {
        stopAutoPlay(); // Ferma l'autoplay quando si naviga manualmente
        if (currentHistoryIndex < currentStoneHistory.length - 1) {
            currentHistoryIndex++;
            updateHistoryPanel();
        }
    };
}

// Funzione per aggiornare il contenuto del pannello della storia
function updateHistoryPanel() {
    const currentPos = currentStoneHistory[currentHistoryIndex];
    
    // Aggiorna l'immagine con transizione
    const historyImage = document.getElementById('history-image');
    if (currentPos.imageUrl) {
        // Aggiungi effetto di transizione
        historyImage.style.opacity = '0';
        historyImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            historyImage.src = currentPos.imageUrl;
            historyImage.style.display = 'block';
            
            // Anima l'entrata della nuova immagine
            setTimeout(() => {
                historyImage.style.opacity = '1';
                historyImage.style.transform = 'scale(1)';
            }, 50);
        }, 200);
    } else {
        historyImage.style.display = 'none';
    }
    
    // Aggiorna la caption
    const formattedDate = currentPos.dateObj.toLocaleString('it-IT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('history-image-caption').textContent = formattedDate;
    
    // Aggiorna il contatore immagini
    const imageCounter = document.getElementById('image-counter');
    if (imageCounter) {
        imageCounter.textContent = `${currentHistoryIndex + 1} di ${currentStoneHistory.length}`;
    }
    
    // Aggiorna la data corrente nella timeline
    const timelineCurrent = document.getElementById('timeline-current-date');
    if (timelineCurrent) {
        timelineCurrent.textContent = formattedDate;
    }

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
    miniMapPolyline = L.polyline(latlngs, { 
        color: '#2563eb', 
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 5'
    }).addTo(miniMap);

    // Aggiungi tutti i marcatori
    currentStoneHistory.forEach((pos, index) => {
        const isActive = index === currentHistoryIndex;
        const marker = L.circleMarker([pos.lat, pos.lon], {
            radius: isActive ? 10 : 6,
            fillColor: isActive ? '#f59e0b' : '#2563eb',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        
        marker.addTo(miniMapMarkers);
        
        // Aggiungi click handler per navigare
        marker.on('click', () => {
            stopAutoPlay(); // Ferma l'autoplay quando si clicca sulla mini-mappa
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
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = ''; // Pulisci la timeline esistente

    currentStoneHistory.forEach((pos, index) => {
        const point = document.createElement('div');
        point.className = 'timeline-point';
        point.style.left = `${(index / (currentStoneHistory.length - 1)) * 100}%`;
        
        point.addEventListener('click', () => {
            stopAutoPlay(); // Ferma l'autoplay quando si clicca sulla timeline
            currentHistoryIndex = index;
            updateHistoryPanel();
        });
        
        timeline.appendChild(point);
    });
    
    updateTimelineActivePoint();
}

// Funzione per aggiornare il punto attivo della timeline
function updateTimelineActivePoint() {
    const points = document.querySelectorAll('.timeline-point');
    points.forEach((point, index) => {
        if (index === currentHistoryIndex) {
            point.classList.add('active');
        } else {
            point.classList.remove('active');
        }
    });
}

// Funzioni per la riproduzione automatica
function startAutoPlay() {
    if (isAutoPlaying || currentStoneHistory.length <= 1) return;
    
    isAutoPlaying = true;
    updatePlayPauseButton();
    
    autoPlayInterval = setInterval(() => {
        if (currentHistoryIndex < currentStoneHistory.length - 1) {
            currentHistoryIndex++;
            updateHistoryPanel();
        } else {
            // Ricomincia dall'inizio
            currentHistoryIndex = 0;
            updateHistoryPanel();
        }
    }, autoPlaySpeed);
}

function stopAutoPlay() {
    if (!isAutoPlaying) return;
    
    isAutoPlaying = false;
    updatePlayPauseButton();
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        if (isAutoPlaying) {
            playPauseBtn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Pausa</span>';
            playPauseBtn.title = 'Metti in pausa la riproduzione automatica';
        } else {
            playPauseBtn.innerHTML = '<span class="btn-icon">▶️</span><span class="btn-text">Play</span>';
            playPauseBtn.title = 'Avvia la riproduzione automatica';
        }
    }
}

// Funzioni per il fullscreen
function openFullscreen() {
    const historyImage = document.getElementById('history-image');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const fullscreenModal = document.getElementById('fullscreen-modal');
    
    if (historyImage.src && fullscreenImage && fullscreenModal) {
        fullscreenImage.src = historyImage.src;
        fullscreenModal.classList.remove('hidden');
    }
}

function closeFullscreen() {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    if (fullscreenModal) {
        fullscreenModal.classList.add('hidden');
    }
}

// CSS personalizzato per i popup
const style = document.createElement('style');
style.textContent = `
    .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border: none;
    }
    .custom-popup .leaflet-popup-tip {
        background: white;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);
