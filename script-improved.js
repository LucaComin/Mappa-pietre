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

// Variabile globale per la guida
let tutorialGuide;

// Inizializzazione dell'applicazione
document.addEventListener('DOMContentLoaded', function() {
    showLoadingOverlay();
    initMap();
    loadData();
    setupEventListeners();
    
    // Inizializza il sistema di traduzione
    if (typeof initializeLanguageSelector === 'function') {
        initializeLanguageSelector();
    }
    
    // Inizializza la guida interattiva
    if (typeof TutorialGuide === 'function') {
        tutorialGuide = new TutorialGuide();
    }
    
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
    
    // Event listener per la navigazione immagini
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    if (prevButton) {
        prevButton.addEventListener('click', showPreviousImage);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', showNextImage);
    }
    
    // Event listener per i tasti freccia
    document.addEventListener('keydown', function(e) {
        const historyPanel = document.getElementById('history-panel');
        if (historyPanel && !historyPanel.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                showNextImage();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeHistoryPanel();
            }
        }
    });
}

// Inizializzazione della mappa
function initMap() {
    map = L.map('map', {
        zoomControl: true,
        attributionControl: true
    }).setView([41.9028, 12.4964], 6);

    // Tile layer con stile moderno
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Aggiungi i layer groups alla mappa
    currentMarkers.addTo(map);
    currentPolylines.addTo(map);
    currentImageMarkers.addTo(map);
}

// Caricamento dei dati
function loadData() {
    fetch(GOOGLE_SHEET_URL)
        .then(response => response.text())
        .then(data => {
            // Rimuovi il prefisso JSONP per ottenere JSON valido
            const jsonData = JSON.parse(data.substring(47).slice(0, -2));
            processGoogleSheetData(jsonData);
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati:', error);
            console.log('Caricamento dati di esempio...');
            loadSampleData();
        });
}

// Processamento dei dati del Google Sheet
function processGoogleSheetData(data) {
    const rows = data.table.rows;
    const processedData = {};

    rows.forEach(row => {
        if (row.c && row.c.length >= 5) {
            const stoneName = row.c[0]?.v || '';
            const lat = parseFloat(row.c[1]?.v || 0);
            const lon = parseFloat(row.c[2]?.v || 0);
            const timestamp = row.c[3]?.v || '';
            const imageUrl = row.c[4]?.v || '';

            if (stoneName && lat && lon && timestamp) {
                if (!processedData[stoneName]) {
                    processedData[stoneName] = [];
                }

                processedData[stoneName].push({
                    lat: lat,
                    lon: lon,
                    timestamp: timestamp,
                    dateObj: new Date(timestamp),
                    imageUrl: imageUrl
                });
            }
        }
    });

    // Ordina le posizioni per data per ogni pietra
    for (const stoneName in processedData) {
        processedData[stoneName].sort((a, b) => a.dateObj - b.dateObj);
    }

    allStonesData = processedData;
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
        'ST216': [
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
        'ST315': [
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

// Funzione per popolare il menu a tendina delle pietre - MIGLIORATA
function populateStoneSelect() {
    const select = document.getElementById('stone-select');
    if (!select) return;
    
    // Salva la selezione corrente
    const currentSelection = select.value;
    
    // Pulisci e ripopola
    select.innerHTML = '<option value="all">Mostra tutte</option>';

    for (const stoneName in allStonesData) {
        const option = document.createElement('option');
        option.value = stoneName;
        option.textContent = stoneName.replace(/_/g, ' ');
        select.appendChild(option);
    }

    // Ripristina la selezione se era valida
    if (currentSelection && (currentSelection === 'all' || allStonesData[currentSelection])) {
        select.value = currentSelection;
    }

    // Rimuovi listener esistenti per evitare duplicati
    select.removeEventListener('change', handleStoneSelection);
    select.addEventListener('change', handleStoneSelection);
}

// Funzione per gestire la selezione delle pietre - NUOVA
function handleStoneSelection(event) {
    const selectedValue = event.target.value;
    displayStonesOnMap(selectedValue);
    
    // Aggiorna l'URL per mantenere la selezione
    const url = new URL(window.location);
    if (selectedValue === 'all') {
        url.searchParams.delete('stone');
    } else {
        url.searchParams.set('stone', selectedValue);
    }
    window.history.replaceState({}, '', url);
}

// Funzione per selezionare una pietra specifica - NUOVA
function selectStone(stoneName) {
    const select = document.getElementById('stone-select');
    if (!select) return false;
    
    // Cerca l'opzione corrispondente
    const options = Array.from(select.options);
    const matchingOption = options.find(opt => 
        opt.value === stoneName || 
        opt.value.replace(/_/g, ' ') === stoneName ||
        opt.value === stoneName.replace(/ /g, '_') ||
        opt.textContent.trim() === stoneName ||
        opt.textContent.trim() === stoneName.replace(/_/g, ' ')
    );
    
    if (matchingOption) {
        select.value = matchingOption.value;
        
        // Trigger change event per aggiornare la mappa
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
        
        return true;
    }
    
    console.warn('Pietra non trovata nel selettore:', stoneName);
    return false;
}

// Funzione principale per visualizzare le pietre sulla mappa - MIGLIORATA
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
                popupContent += `<p style="margin: 5px 0; color: #64748b;"><strong>${typeof t === 'function' ? t('lastPosition') : 'Ultima posizione:'}:</strong><br>${formattedDate}</p>`;
                
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
                " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)';">📖 ${typeof t === 'function' ? t('seeHistory') : 'Vedi la storia'}</button>`;
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

    const imageMarker = L.marker([position.lat, position.lon], {
        icon: imageIcon
    });

    const formattedDate = position.dateObj.toLocaleString('it-IT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    imageMarker.bindPopup(`
        <div style="text-align: center; font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 10px 0; color: ${stoneColor};">${stoneName.replace(/_/g, ' ')}</h4>
            <img src="${position.imageUrl}" style="max-width: 200px; max-height: 150px; border-radius: 8px; margin-bottom: 10px;">
            <p style="margin: 0; color: #64748b; font-size: 0.9rem;">${formattedDate}</p>
        </div>
    `, { maxWidth: 250 });

    currentImageMarkers.addLayer(imageMarker);
}

// Funzione per creare icone personalizzate
function createCustomIcon(color, isMain = false) {
    const size = isMain ? 25 : 20;
    const html = `<div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        ${isMain ? 'transform: scale(1.2);' : ''}
    "></div>`;

    return L.divIcon({
        html: html,
        className: 'custom-marker',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
    });
}

// Funzione per regolare il colore
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

// Variabili per la gestione della storia
let currentStoneHistory = null;
let currentImageIndex = 0;

// Funzione per mostrare la storia di una pietra
function showStoneHistory(stoneName) {
    const stoneData = allStonesData[stoneName];
    if (!stoneData || stoneData.length === 0) {
        console.error('Dati della pietra non trovati:', stoneName);
        return;
    }

    currentStoneHistory = stoneData;
    currentImageIndex = 0;

    // Aggiorna il titolo
    const historyTitle = document.getElementById('history-title');
    if (historyTitle) {
        historyTitle.textContent = `Storia di ${stoneName.replace(/_/g, ' ')}`;
    }

    // Mostra la prima immagine
    updateHistoryImage();

    // Inizializza la mini-mappa
    initMiniMap(stoneData);

    // Inizializza la timeline
    initTimeline(stoneData);

    // Mostra il pannello
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.classList.remove('hidden');
    }
}

// Funzione per aggiornare l'immagine nella storia
function updateHistoryImage() {
    if (!currentStoneHistory || currentImageIndex >= currentStoneHistory.length) return;

    const currentPosition = currentStoneHistory[currentImageIndex];
    const historyImage = document.getElementById('history-image');
    const historyImageCaption = document.getElementById('history-image-caption');
    const imageCounter = document.getElementById('image-counter');

    if (historyImage && currentPosition.imageUrl) {
        historyImage.src = currentPosition.imageUrl;
        historyImage.alt = `Immagine ${currentImageIndex + 1}`;
    }

    if (historyImageCaption) {
        const formattedDate = currentPosition.dateObj.toLocaleString('it-IT', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        historyImageCaption.textContent = formattedDate;
    }

    if (imageCounter) {
        imageCounter.textContent = `${currentImageIndex + 1} di ${currentStoneHistory.length}`;
    }

    // Aggiorna i pulsanti di navigazione
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    if (prevButton) {
        prevButton.disabled = currentImageIndex === 0;
    }

    if (nextButton) {
        nextButton.disabled = currentImageIndex === currentStoneHistory.length - 1;
    }
}

// Funzioni di navigazione immagini
function showPreviousImage() {
    if (currentStoneHistory && currentImageIndex > 0) {
        currentImageIndex--;
        updateHistoryImage();
        updateMiniMapHighlight();
        updateTimelinePosition();
    }
}

function showNextImage() {
    if (currentStoneHistory && currentImageIndex < currentStoneHistory.length - 1) {
        currentImageIndex++;
        updateHistoryImage();
        updateMiniMapHighlight();
        updateTimelinePosition();
    }
}

// Funzione per inizializzare la mini-mappa
function initMiniMap(stoneData) {
    const miniMapContainer = document.getElementById('mini-map');
    if (!miniMapContainer) return;

    // Rimuovi mappa esistente
    if (miniMap) {
        miniMap.remove();
    }

    // Crea nuova mini-mappa
    miniMap = L.map('mini-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    });

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(miniMap);

    // Aggiungi percorso
    const latlngs = stoneData.map(pos => [pos.lat, pos.lon]);
    L.polyline(latlngs, { color: '#2563eb', weight: 3 }).addTo(miniMap);

    // Aggiungi marcatori
    stoneData.forEach((pos, index) => {
        const isFirst = index === 0;
        const isLast = index === stoneData.length - 1;
        const isCurrent = index === currentImageIndex;

        let color = '#94a3b8'; // grigio per posizioni intermedie
        if (isFirst) color = '#10b981'; // verde per inizio
        if (isLast) color = '#dc2626'; // rosso per fine
        if (isCurrent) color = '#f59e0b'; // arancione per corrente

        const marker = L.circleMarker([pos.lat, pos.lon], {
            color: 'white',
            fillColor: color,
            fillOpacity: 1,
            weight: 2,
            radius: isCurrent ? 8 : 6
        }).addTo(miniMap);

        marker.bindTooltip(`Posizione ${index + 1}`, { permanent: false });
    });

    // Fit bounds
    miniMap.fitBounds(latlngs, { padding: [10, 10] });
}

// Funzione per aggiornare l'evidenziazione nella mini-mappa
function updateMiniMapHighlight() {
    if (miniMap && currentStoneHistory) {
        // Rimuovi tutti i layer e ricrea
        miniMap.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                miniMap.removeLayer(layer);
            }
        });

        // Ricrea i marcatori con l'evidenziazione corretta
        currentStoneHistory.forEach((pos, index) => {
            const isFirst = index === 0;
            const isLast = index === currentStoneHistory.length - 1;
            const isCurrent = index === currentImageIndex;

            let color = '#94a3b8';
            if (isFirst) color = '#10b981';
            if (isLast) color = '#dc2626';
            if (isCurrent) color = '#f59e0b';

            L.circleMarker([pos.lat, pos.lon], {
                color: 'white',
                fillColor: color,
                fillOpacity: 1,
                weight: 2,
                radius: isCurrent ? 8 : 6
            }).addTo(miniMap);
        });
    }
}

// Funzione per inizializzare la timeline
function initTimeline(stoneData) {
    const timeline = document.getElementById('timeline');
    const timelineCurrentDate = document.getElementById('timeline-current-date');
    
    if (!timeline || !timelineCurrentDate) return;

    // Pulisci timeline esistente
    timeline.innerHTML = '';

    // Crea i punti della timeline
    stoneData.forEach((pos, index) => {
        const timelinePoint = document.createElement('div');
        timelinePoint.className = 'timeline-point';
        timelinePoint.style.left = `${(index / (stoneData.length - 1)) * 100}%`;
        
        if (index === currentImageIndex) {
            timelinePoint.classList.add('active');
        }

        timelinePoint.addEventListener('click', () => {
            currentImageIndex = index;
            updateHistoryImage();
            updateMiniMapHighlight();
            updateTimelinePosition();
        });

        timeline.appendChild(timelinePoint);
    });

    updateTimelinePosition();
}

// Funzione per aggiornare la posizione della timeline
function updateTimelinePosition() {
    const timeline = document.getElementById('timeline');
    const timelineCurrentDate = document.getElementById('timeline-current-date');
    
    if (!timeline || !timelineCurrentDate || !currentStoneHistory) return;

    // Aggiorna i punti attivi
    const points = timeline.querySelectorAll('.timeline-point');
    points.forEach((point, index) => {
        point.classList.toggle('active', index === currentImageIndex);
    });

    // Aggiorna la data corrente
    const currentPosition = currentStoneHistory[currentImageIndex];
    const formattedDate = currentPosition.dateObj.toLocaleDateString('it-IT', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    timelineCurrentDate.textContent = formattedDate;
}

// Funzione per chiudere il pannello storia
function closeHistoryPanel() {
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel) {
        historyPanel.classList.add('hidden');
    }

    // Ferma autoplay se attivo
    if (isAutoPlaying) {
        toggleAutoPlay();
    }

    // Reset variabili
    currentStoneHistory = null;
    currentImageIndex = 0;
}

// Funzione per il fullscreen
function openFullscreen() {
    const historyImage = document.getElementById('history-image');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const fullscreenModal = document.getElementById('fullscreen-modal');

    if (historyImage && fullscreenImage && fullscreenModal) {
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

// Funzione per toggle autoplay
function toggleAutoPlay() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (!playPauseBtn) return;

    if (isAutoPlaying) {
        // Ferma autoplay
        clearInterval(autoPlayInterval);
        isAutoPlaying = false;
        playPauseBtn.querySelector('.btn-icon').textContent = '▶️';
        playPauseBtn.querySelector('.btn-text').textContent = 'Play';
    } else {
        // Avvia autoplay
        autoPlayInterval = setInterval(() => {
            if (currentStoneHistory && currentImageIndex < currentStoneHistory.length - 1) {
                showNextImage();
            } else {
                // Fine della sequenza, ricomincia dall'inizio
                currentImageIndex = 0;
                updateHistoryImage();
                updateMiniMapHighlight();
                updateTimelinePosition();
            }
        }, autoPlaySpeed);
        
        isAutoPlaying = true;
        playPauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        playPauseBtn.querySelector('.btn-text').textContent = 'Pausa';
    }
}

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    // Controlla se c'è una pietra selezionata nell'URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedStone = urlParams.get('stone');
    
    if (selectedStone && selectedStone !== 'all') {
        // Aspetta che i dati siano caricati prima di selezionare
        const checkDataLoaded = setInterval(() => {
            if (Object.keys(allStonesData).length > 0) {
                clearInterval(checkDataLoaded);
                selectStone(selectedStone);
            }
        }, 100);
    }
});

// Esporta funzioni globali per l'uso da altri script
window.showStoneHistory = showStoneHistory;
window.selectStone = selectStone;
window.allStonesData = allStonesData;
