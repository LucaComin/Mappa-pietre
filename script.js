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
const GOOGLE_SHEET_ID = '1N9I1Lp7hSuyPY85CKH4E1tsPcU1O1l-KJJBbFFwHn0'; // L'ID del tuo foglio di calcolo
const GOOGLE_SHEET_GID = '0'; // Il GID del foglio specifico (solitamente 0 per il primo foglio)
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&gid=${GOOGLE_SHEET_GID}`;

// Colori predefiniti per le pietre con palette moderna
const STONE_COLORS = [
    '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
    '#db2777', '#0891b2', '#65a30d', '#c2410c', '#4338ca'
];

// Variabile globale per la guida
let tutorialGuide;

// Funzione per caricare i dati dal Google Sheet
function loadData() {
    console.log('Caricamento dati in corso...');
    showLoadingOverlay(translate('Caricamento mappa...'));

    fetch(GOOGLE_SHEET_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore di rete: ${response.statusText}`);
            }
            return response.text();
        })
        .then(text => {
            // Rimuove il prefisso e il suffisso per ottenere il JSON puro
            const jsonText = text.substring(47).slice(0, -2);
            const data = JSON.parse(jsonText);
            processData(data);
            initMap();
            setupEventListeners();
            console.log('Dati caricati e mappa inizializzata.');
            hideLoadingOverlay();
        })
        .catch(error => {
            console.error('Errore nel caricamento dei dati:', error);
            showErrorOverlay(translate('Errore nel caricamento dei dati:') + ' ' + error.message);
        });
}

// Funzione per processare i dati del Google Sheet
function processData(data) {
    const rows = data.table.rows;
    allStonesData = {};

    rows.forEach(row => {
        const stoneId = row.c[0] ? row.c[0].v : null;
        const lat = row.c[1] ? row.c[1].v : null;
        const lon = row.c[2] ? row.c[2].v : null;
        const timestamp = row.c[3] ? row.c[3].v : null;
        const imageUrl = row.c[4] ? row.c[4].v : null;
        const description = row.c[5] ? row.c[5].v : '';
        const category = row.c[6] ? row.c[6].v : 'Default';

        if (stoneId && lat !== null && lon !== null && timestamp) {
            if (!allStonesData[stoneId]) {
                allStonesData[stoneId] = {
                    movements: [],
                    category: category,
                    description: description,
                    color: STONE_COLORS[Object.keys(allStonesData).length % STONE_COLORS.length]
                };
            }

            allStonesData[stoneId].movements.push({
                lat: lat,
                lon: lon,
                timestamp: timestamp,
                dateObj: new Date(timestamp),
                imageUrl: imageUrl
            });
        }
    });

    // Ordina i movimenti per data
    for (const stoneId in allStonesData) {
        allStonesData[stoneId].movements.sort((a, b) => a.dateObj - b.dateObj);
    }
}

// Funzione per inizializzare la mappa
function initMap() {
    // Inizializza la mappa Leaflet
    map = L.map('map', {
        center: [45.4408, 12.3155], // Venezia
        zoom: 13,
        zoomControl: false // Disabilita il controllo di zoom predefinito
    });

    // Aggiunge un layer di piastrelle (tile layer)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Aggiunge i controlli di zoom personalizzati
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Aggiunge i dati alla mappa
    updateMapMarkers();

    // Inizializza la mini-mappa
    miniMap = L.map('mini-map', {
        center: [45.4408, 12.3155],
        zoom: 13,
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(miniMap);

    // Sincronizza il movimento della mini-mappa con la mappa principale
    map.on('moveend', function() {
        miniMap.setView(map.getCenter(), map.getZoom());
    });
}

// Funzione per aggiornare i marcatori e le polilinee sulla mappa
function updateMapMarkers(stoneId = 'all', imageDisplay = 'last') {
    // Rimuove i layer esistenti
    currentMarkers.clearLayers();
    currentPolylines.clearLayers();
    currentImageMarkers.clearLayers();

    const stonesToDisplay = stoneId === 'all' ? Object.keys(allStonesData) : [stoneId];

    stonesToDisplay.forEach(id => {
        const stone = allStonesData[id];
        const color = stone.color;
        const movements = stone.movements;

        if (movements.length > 0) {
            const latlngs = movements.map(m => [m.lat, m.lon]);

            // Aggiunge la polilinea
            L.polyline(latlngs, {
                color: color,
                weight: 5,
                opacity: 0.6
            }).addTo(currentPolylines);

            // Aggiunge i marcatori
            movements.forEach((movement, index) => {
                const isFirst = index === 0;
                const isLast = index === movements.length - 1;
                const isMovement = movements.length > 1;

                let markerColor;
                if (isMovement) {
                    if (isFirst) markerColor = 'blue';
                    else if (isLast) markerColor = 'red';
                    else markerColor = 'orange';
                } else {
                    markerColor = 'green';
                }

                const icon = L.ExtraMarkers.icon({
                    icon: 'fa-map-marker-alt',
                    markerColor: markerColor,
                    shape: 'circle',
                    prefix: 'fa'
                });

                const marker = L.marker([movement.lat, movement.lon], {
                    icon: icon
                }).bindPopup(`
                    <b>${id}</b><br>
                    ${translate('Data')}: ${new Date(movement.timestamp).toLocaleDateString(localStorage.getItem('selectedLanguage') || 'it')}<br>
                    ${translate('Descrizione')}: ${stone.description}<br>
                    ${movement.imageUrl ? `<img src="${movement.imageUrl}" style="width:100px; height:auto;">` : ''}
                `);

                marker.on('click', () => {
                    openHistoryPanel(id, index);
                });

                currentMarkers.addLayer(marker);

                // Gestione delle immagini
                if (movement.imageUrl) {
                    if (imageDisplay === 'all' || (imageDisplay === 'last' && isLast)) {
                        const imageIcon = L.icon({
                            iconUrl: '4.png', // Icona placeholder, l'immagine verrà visualizzata nel popup
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                            popupAnchor: [0, -32]
                        });

                        const imageMarker = L.marker([movement.lat, movement.lon], {
                            icon: imageIcon
                        }).bindPopup(`
                            <b>${id}</b><br>
                            ${translate('Data')}: ${new Date(movement.timestamp).toLocaleDateString(localStorage.getItem('selectedLanguage') || 'it')}<br>
                            ${translate('Descrizione')}: ${stone.description}<br>
                            <img src="${movement.imageUrl}" style="width:200px; height:auto;">
                        `);
                        currentImageMarkers.addLayer(imageMarker);
                    }
                }
            });
        }
    });

    currentPolylines.addTo(map);
    currentMarkers.addTo(map);
    currentImageMarkers.addTo(map);

    // Centra la mappa su tutti i marcatori se non è selezionata una singola pietra
    if (stoneId === 'all' && currentMarkers.getLayers().length > 0) {
        map.fitBounds(currentMarkers.getBounds());
    }
}

// Funzione per popolare il selettore delle pietre
function populateStoneSelector() {
    const stoneSelect = document.getElementById('stone-select');
    if (!stoneSelect) return;

    // Pulisce le opzioni esistenti
    stoneSelect.innerHTML = '';

    // Aggiunge l'opzione "Mostra tutte"
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = translate('Mostra tutte');
    stoneSelect.appendChild(allOption);

    // Aggiunge l'opzione "Pietre con spostamenti"
    const movedOption = document.createElement('option');
    movedOption.value = 'moved_stones';
    movedOption.textContent = translate('Pietre con spostamenti');
    stoneSelect.appendChild(movedOption);

    // Aggiunge le opzioni per ogni pietra
    const stoneIds = Object.keys(allStonesData).sort();
    stoneIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        stoneSelect.appendChild(option);
    });
}

// Funzione per popolare il selettore delle lingue
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'it';

    if (languageSelect) {
        // Imposta la lingua salvata
        languageSelect.value = savedLanguage;
        updateUIText(savedLanguage);

        // Aggiunge l'event listener per il cambio lingua
        languageSelect.addEventListener('change', function() {
            const newLanguage = this.value;
            localStorage.setItem('selectedLanguage', newLanguage);
            // *** MODIFICA EFFETTUATA QUI ***
            // Rimuove window.location.reload() e chiama updateUIText per aggiornare la UI dinamicamente
            updateUIText(newLanguage);
            // Inoltre, è necessario ripopolare il selettore delle pietre per aggiornare le traduzioni
            populateStoneSelector();
            // E aggiornare i marcatori sulla mappa per aggiornare i popup
            const stoneSelect = document.getElementById('stone-select');
            const imageDisplaySelect = document.getElementById('image-display-select');
            updateMapMarkers(stoneSelect.value, imageDisplaySelect.value);
            // E aggiornare il titolo della pagina
            document.title = translate('Mappa Interattiva delle Pietre');
        });
    }
}

// Funzione per aggiornare il testo dell'interfaccia utente
function updateUIText(language) {
    // Funzione di utilità per la traduzione (definita in translations.js)
    // Assumiamo che la funzione 'translate' sia disponibile globalmente
    if (typeof translate !== 'function') {
        console.error('La funzione translate non è definita. Assicurati che translations.js sia caricato.');
        return;
    }

    // Aggiorna tutti gli elementi con l'attributo data-translate-key
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        element.textContent = translate(key);
    });

    // Aggiorna gli attributi aria-label e title per i pulsanti
    document.getElementById('close-history-btn').setAttribute('aria-label', translate('Chiudi pannello storia'));
    document.getElementById('close-history-btn').setAttribute('title', translate('Chiudi pannello storia'));

    document.getElementById('open-tutorial-btn').setAttribute('aria-label', translate('Apri tutorial'));
    document.getElementById('open-tutorial-btn').setAttribute('title', translate('Apri tutorial'));

    document.getElementById('open-photo-modal-btn').setAttribute('aria-label', translate('Aggiungi foto'));
    document.getElementById('open-photo-modal-btn').setAttribute('title', translate('Aggiungi foto'));

    document.getElementById('close-photo-modal-btn').setAttribute('aria-label', translate('Chiudi modale foto'));
    document.getElementById('close-photo-modal-btn').setAttribute('title', translate('Chiudi modale foto'));

    document.getElementById('photo-modal-title').textContent = translate('Aggiungi Foto');
    document.getElementById('take-photo-btn').textContent = translate('Scatta Foto');
    document.getElementById('upload-photo-btn').textContent = translate('Carica Foto');
    document.getElementById('photo-description-input').setAttribute('placeholder', translate('Descrizione (opzionale)'));
    document.getElementById('capture-btn').textContent = translate('Scatta');
    document.getElementById('cancel-capture-btn').textContent = translate('Annulla');
    document.getElementById('analyze-photo-btn').textContent = translate('Analizza');
    document.getElementById('retry-analysis-btn').textContent = translate('Riprova');
    document.getElementById('view-on-map-btn').textContent = translate('Visualizza sulla Mappa');

    // Aggiorna i testi nel pannello di storia
    document.getElementById('history-title').textContent = translate('Storia della Pietra');

    // Aggiorna i testi nel tutorial
    document.getElementById('tutorial-modal-title').textContent = translate('Benvenuto nella Mappa delle Pietre!');
    document.getElementById('tutorial-prev-btn').textContent = translate('Previous');
    document.getElementById('tutorial-skip-btn').textContent = translate('Skip');
    document.getElementById('tutorial-next-btn').textContent = translate('Next');

    // Aggiorna i testi dei selettori
    document.querySelector('label[for="language-select"]').textContent = translate('Seleziona lingua:');
    document.querySelector('label[for="stone-select"]').textContent = translate('Seleziona una pietra:');
    document.querySelector('label[for="image-display-select"]').textContent = translate('Mostra immagini:');

    // Aggiorna i testi delle opzioni del selettore pietra (richiede ripopolamento)
    // Questo viene gestito nella funzione initializeLanguageSelector dopo la modifica
    // e nella funzione populateStoneSelector.
    // Qui aggiorniamo solo le opzioni del selettore di visualizzazione immagini
    const imageDisplaySelect = document.getElementById('image-display-select');
    if (imageDisplaySelect) {
        imageDisplaySelect.querySelector('option[value="last"]').textContent = translate('Ultima');
        imageDisplaySelect.querySelector('option[value="none"]').textContent = translate('Nessuna');
        imageDisplaySelect.querySelector('option[value="all"]').textContent = translate('Tutte');
    }

    // Aggiorna il titolo della pagina
    document.title = translate('Mappa Interattiva delle Pietre');

    // Aggiorna il testo del caricamento
    document.getElementById('loading-text').textContent = translate('Caricamento mappa...');
}

// Funzione per impostare gli event listener
function setupEventListeners() {
    // Event listener per il selettore delle pietre
    document.getElementById('stone-select').addEventListener('change', function() {
        const imageDisplaySelect = document.getElementById('image-display-select');
        updateMapMarkers(this.value, imageDisplaySelect.value);
    });

    // Event listener per il selettore di visualizzazione immagini
    document.getElementById('image-display-select').addEventListener('change', function() {
        const stoneSelect = document.getElementById('stone-select');
        updateMapMarkers(stoneSelect.value, this.value);
    });

    // Event listener per i pulsanti del pannello storia
    document.getElementById('close-history-btn').addEventListener('click', closeHistoryPanel);

    // Event listener per i pulsanti del tutorial
    document.getElementById('open-tutorial-btn').addEventListener('click', openTutorialModal);
    document.getElementById('close-tutorial-btn').addEventListener('click', closeTutorialModal);
    document.getElementById('tutorial-skip-btn').addEventListener('click', closeTutorialModal);
    document.getElementById('tutorial-prev-btn').addEventListener('click', () => tutorialGuide.prev());
    document.getElementById('tutorial-next-btn').addEventListener('click', () => tutorialGuide.next());

    // Event listener per i pulsanti del modale foto
    document.getElementById('open-photo-modal-btn').addEventListener('click', openPhotoModal);
    document.getElementById('close-photo-modal-btn').addEventListener('click', closePhotoModal);
    document.getElementById('take-photo-btn').addEventListener('click', openCamera);
    document.getElementById('upload-photo-btn').addEventListener('click', () => document.getElementById('photo-file-input').click());
    document.getElementById('photo-file-input').addEventListener('change', handleFileUpload);
    document.getElementById('capture-btn').addEventListener('click', capturePhoto);
    document.getElementById('cancel-capture-btn').addEventListener('click', closeCamera);
    document.getElementById('analyze-photo-btn').addEventListener('click', analyzePhoto);
    document.getElementById('retry-analysis-btn').addEventListener('click', retryAnalysis);
    document.getElementById('view-on-map-btn').addEventListener('click', viewOnMap);

    console.log('Event listeners configurati');

    // Inizializza il sistema di traduzione
    if (typeof initializeLanguageSelector === 'function') {
        initializeLanguageSelector();
        console.log('Selettore lingua inizializzato');
    }

    // Inizializza il tutorial
    initializeTutorial();
}

// Funzione per mostrare l'overlay di caricamento
function showLoadingOverlay(message) {
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-overlay').classList.remove('hidden');
}

// Funzione per nascondere l'overlay di caricamento
function hideLoadingOverlay() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// Funzione per mostrare l'overlay di errore
function showErrorOverlay(message) {
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-overlay').classList.remove('hidden');
    // Potresti voler aggiungere un pulsante per ricaricare o chiudere
}

// Funzione per aprire il pannello di storia
function openHistoryPanel(stoneId, movementIndex) {
    const historyPanel = document.getElementById('history-panel');
    const stone = allStonesData[stoneId];
    const movement = stone.movements[movementIndex];

    // Aggiorna il contenuto del pannello
    document.getElementById('history-title').textContent = `${translate('Storia della Pietra')} - ${stoneId}`;
    document.getElementById('history-details').innerHTML = `
        <p><strong>${translate('Categoria')}</strong>: ${stone.category}</p>
        <p><strong>${translate('Descrizione')}</strong>: ${stone.description}</p>
        <p><strong>${translate('Data')}</strong>: ${movement.dateObj.toLocaleDateString(localStorage.getItem('selectedLanguage') || 'it')}</p>
        <p><strong>${translate('Posizione')}</strong>: ${movement.lat.toFixed(4)}, ${movement.lon.toFixed(4)}</p>
        ${movement.imageUrl ? `<img src="${movement.imageUrl}" style="width:100%; height:auto; margin-top: 10px;">` : ''}
    `;

    // Aggiorna la mini-mappa
    miniMap.setView([movement.lat, movement.lon], 15);
    // Aggiunge un marcatore sulla mini-mappa
    L.marker([movement.lat, movement.lon], {
        icon: L.ExtraMarkers.icon({
            icon: 'fa-map-marker-alt',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
        })
    }).addTo(miniMap);

    // Mostra il pannello
    historyPanel.classList.remove('hidden');
}

// Funzione per chiudere il pannello di storia
function closeHistoryPanel() {
    document.getElementById('history-panel').classList.add('hidden');
    // Pulisce i marcatori dalla mini-mappa
    miniMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            miniMap.removeLayer(layer);
        }
    });
}

// Funzioni per il modale foto (simulazione)
function openPhotoModal() {
    document.getElementById('photo-modal').classList.remove('hidden');
}

function closePhotoModal() {
    document.getElementById('photo-modal').classList.add('hidden');
    closeCamera();
    hideAnalysisResults();
}

function openCamera() {
    // Simulazione di apertura fotocamera
    document.getElementById('photo-upload-controls').classList.add('hidden');
    document.getElementById('photo-preview-container').classList.remove('hidden');
    document.getElementById('photo-preview').src = 'placeholder-camera.jpg'; // Immagine placeholder
    document.getElementById('photo-actions').classList.remove('hidden');
    document.getElementById('capture-btn').classList.remove('hidden');
    document.getElementById('cancel-capture-btn').classList.remove('hidden');
    document.getElementById('analyze-photo-btn').classList.add('hidden');
    document.getElementById('retry-analysis-btn').classList.add('hidden');
    document.getElementById('view-on-map-btn').classList.add('hidden');
    document.getElementById('analysis-results').classList.add('hidden');
}

function closeCamera() {
    // Simulazione di chiusura fotocamera
    document.getElementById('photo-upload-controls').classList.remove('hidden');
    document.getElementById('photo-preview-container').classList.add('hidden');
    document.getElementById('photo-preview').src = '';
    document.getElementById('photo-actions').classList.add('hidden');
    document.getElementById('capture-btn').classList.add('hidden');
    document.getElementById('cancel-capture-btn').classList.add('hidden');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photo-upload-controls').classList.add('hidden');
            document.getElementById('photo-preview-container').classList.remove('hidden');
            document.getElementById('photo-preview').src = e.target.result;
            document.getElementById('photo-actions').classList.remove('hidden');
            document.getElementById('capture-btn').classList.add('hidden');
            document.getElementById('cancel-capture-btn').classList.remove('hidden');
            document.getElementById('analyze-photo-btn').classList.remove('hidden');
            document.getElementById('retry-analysis-btn').classList.add('hidden');
            document.getElementById('view-on-map-btn').classList.add('hidden');
            document.getElementById('analysis-results').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function capturePhoto() {
    // Simulazione di cattura foto
    document.getElementById('capture-btn').classList.add('hidden');
    document.getElementById('analyze-photo-btn').classList.remove('hidden');
}

function analyzePhoto() {
    // Simulazione di analisi
    document.getElementById('analyze-photo-btn').classList.add('hidden');
    document.getElementById('cancel-capture-btn').classList.add('hidden');
    document.getElementById('analysis-results').classList.remove('hidden');
    document.getElementById('retry-analysis-btn').classList.remove('hidden');
    document.getElementById('view-on-map-btn').classList.remove('hidden');
    document.getElementById('analysis-results').innerHTML = `<p>${translate('Risultato analisi')}: ${translate('Pietra identificata')}: SST001</p>`;
}

function retryAnalysis() {
    // Simulazione di riprova analisi
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('retry-analysis-btn').classList.add('hidden');
    document.getElementById('view-on-map-btn').classList.add('hidden');
    document.getElementById('analyze-photo-btn').classList.remove('hidden');
    document.getElementById('cancel-capture-btn').classList.remove('hidden');
}

function viewOnMap() {
    // Simulazione di visualizzazione sulla mappa
    closePhotoModal();
    // Centra la mappa sulla posizione della pietra analizzata (simulata)
    map.setView([45.4408, 12.3155], 15);
}

function hideAnalysisResults() {
    document.getElementById('analysis-results').innerHTML = '';
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('retry-analysis-btn').classList.add('hidden');
    document.getElementById('view-on-map-btn').classList.add('hidden');
}

// Funzioni per il tutorial (simulazione)
function initializeTutorial() {
    const steps = [{
        title: translate('Benvenuto'),
        content: translate('Questo tutorial ti guiderà attraverso le funzionalità principali della Mappa delle Pietre.')
    }, {
        title: translate('Selettore Lingua'),
        content: translate('Utilizza il selettore in alto a sinistra per cambiare la lingua dell\'interfaccia.')
    }, {
        title: translate('Selettore Pietra'),
        content: translate('Seleziona una pietra specifica dal menu a tendina per visualizzarne i movimenti sulla mappa.')
    }, {
        title: translate('Pannello Storia'),
        content: translate('Clicca su un marcatore per aprire il pannello di storia e vedere i dettagli del movimento.')
    }, {
        title: translate('Aggiungi Foto'),
        content: translate('Utilizza il pulsante della fotocamera per scattare o caricare una foto e analizzarla.')
    }];

    tutorialGuide = {
        currentStep: 0,
        steps: steps,
        update: function() {
            const current = this.steps[this.currentStep];
            document.getElementById('tutorial-modal-title').textContent = current.title;
            document.getElementById('tutorial-content').textContent = current.content;

            document.getElementById('tutorial-prev-btn').disabled = this.currentStep === 0;
            document.getElementById('tutorial-next-btn').disabled = this.currentStep === this.steps.length - 1;
            document.getElementById('tutorial-next-btn').textContent = this.currentStep === this.steps.length - 1 ? translate('Fine') : translate('Next');
        },
        next: function() {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.update();
            } else {
                closeTutorialModal();
            }
        },
        prev: function() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.update();
            }
        }
    };

    // Aggiorna il contenuto iniziale del tutorial
    tutorialGuide.update();
}

function openTutorialModal() {
    document.getElementById('tutorial-modal').classList.remove('hidden');
    tutorialGuide.currentStep = 0;
    tutorialGuide.update();
}

function closeTutorialModal() {
    document.getElementById('tutorial-modal').classList.add('hidden');
}

// Avvia l'applicazione
document.addEventListener('DOMContentLoaded', loadData);

