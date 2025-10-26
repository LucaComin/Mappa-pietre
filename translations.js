// Sistema di traduzione multilingue per la Mappa delle Pietre
const translations = {
    it: {
        // Header
        title: "Mappa delle Pietre",
        subtitle: "Esplora la storia attraverso il tempo",

        // Controls
        selectStone: "Seleziona una pietra:",
        showAll: "Mostra tutte",
        showImages: "Mostra immagini:",
        lastImage: "Ultima",
        noImages: "Nessuna",
        allImages: "Tutte",

        // Loading
        loadingMap: "Caricamento mappa...",

        // History Panel
        historyOf: "Storia di",
        close: "Chiudi",
        historicalPath: "Percorso storico",
        currentPosition: "Posizione attuale",
        historicalRoute: "Percorso storico",
        timelineMovements: "Timeline degli spostamenti",
        start: "Inizio",
        currentDate: "Data attuale",
        end: "Fine",

        // Navigation buttons
        play: "Play",
        pause: "Pausa",
        previous: "Precedente",
        next: "Successiva",

        // Popup
        lastPosition: "Ultima posizione",
        seeHistory: "Vedi la storia",

        // Counter
        of: "di",

        // Accessibility
        selectStoneAriaLabel: "Seleziona una pietra da visualizzare",
        selectImagesAriaLabel: "Seleziona modalità visualizzazione immagini",
        mapAriaLabel: "Mappa interattiva delle pietre",
        closeHistoryAriaLabel: "Chiudi pannello storia",
        fullscreenAriaLabel: "Visualizza a schermo intero",
        closeFullscreenAriaLabel: "Chiudi visualizzazione a schermo intero",
        playPauseAriaLabel: "Riproduci/Pausa automatica",
        previousAriaLabel: "Immagine precedente",
        nextAriaLabel: "Immagine successiva",
        miniMapAriaLabel: "Mini mappa del percorso",
        timelineAriaLabel: "Timeline degli spostamenti della pietra",

        // Language selector
        selectLanguage: "Seleziona lingua",

        // Popup content
        stoneID: "ID Pietra",
        name: "Nome",
        date: "Data",
        category: "Categoria",
        description: "Descrizione",
        coordinates: "Coordinate",
        moreInfo: "Maggiori Info",
        stoneImage: "Immagine della Pietra",

        // Tutorial
        tutorialTitle: "Benvenuto nella Mappa delle Pietre!",
        tutorialSubtitle: "Esplora la storia attraverso il tempo",
        tutorialStep1Title: "Esplora la Mappa",
        tutorialStep1Text: "Questa mappa interattiva ti permette di seguire il viaggio delle pietre nel tempo. Ogni pietra ha la sua storia unica da raccontare.",
        tutorialStep2Title: "Seleziona una Pietra",
        tutorialStep2Text: "Usa il selettore in alto per filtrare le pietre. Puoi scegliere di vedere tutte le pietre, solo quelle spostate, o una pietra specifica.",
        tutorialStep3Title: "Visualizza la Storia",
        tutorialStep3Text: "Clicca su un marcatore per vedere i dettagli e l'opzione per visualizzare il percorso storico completo della pietra.",
        tutorialStep4Title: "Pannello Storia",
        tutorialStep4Text: "Il pannello storia mostra la sequenza temporale dei movimenti della pietra. Puoi usare i controlli per riprodurre o navigare lungo il percorso.",
        tutorialStep5Title: "Immagini e Dettagli",
        tutorialStep5Text: "Seleziona la modalità 'Mostra immagini' per vedere i marcatori delle foto scattate in quel punto, o la modalità 'Ultima' per vedere solo l'ultima foto di ogni pietra.",
        tutorialStep6Title: "Ricerca",
        tutorialStep6Text: "Usa la funzione di ricerca per trovare pietre o posizioni specifiche sulla mappa.",
        tutorialEndTitle: "Pronto per Iniziare!",
        tutorialEndText: "Divertiti ad esplorare la storia delle pietre. Chiudi questa guida per iniziare.",
    },
    en: {
        // Header
        title: "Stone Map",
        subtitle: "Explore history through time",

        // Controls
        selectStone: "Select a stone:",
        showAll: "Show all",
        showImages: "Show images:",
        lastImage: "Last",
        noImages: "None",
        allImages: "All",

        // Loading
        loadingMap: "Loading map...",

        // History Panel
        historyOf: "History of",
        close: "Close",
        historicalPath: "Historical path",
        currentPosition: "Current position",
        historicalRoute: "Historical route",
        timelineMovements: "Movement timeline",
        start: "Start",
        currentDate: "Current date",
        end: "End",

        // Navigation buttons
        play: "Play",
        pause: "Pause",
        previous: "Previous",
        next: "Next",

        // Popup
        lastPosition: "Last position",
        seeHistory: "See history",

        // Counter
        of: "of",

        // Accessibility
        selectStoneAriaLabel: "Select a stone to visualize",
        selectImagesAriaLabel: "Select image visualization mode",
        mapAriaLabel: "Interactive stone map",
        closeHistoryAriaLabel: "Close history panel",
        fullscreenAriaLabel: "View in fullscreen",
        closeFullscreenAriaLabel: "Close fullscreen view",
        playPauseAriaLabel: "Auto Play/Pause",
        previousAriaLabel: "Previous image",
        nextAriaLabel: "Next image",
        miniMapAriaLabel: "Mini map of the route",
        timelineAriaLabel: "Timeline of the stone's movements",

        // Language selector
        selectLanguage: "Select language",

        // Popup content
        stoneID: "Stone ID",
        name: "Name",
        date: "Date",
        category: "Category",
        description: "Description",
        coordinates: "Coordinates",
        moreInfo: "More Info",
        stoneImage: "Stone Image",

        // Tutorial
        tutorialTitle: "Welcome to the Stone Map!",
        tutorialSubtitle: "Explore history through time",
        tutorialStep1Title: "Explore the Map",
        tutorialStep1Text: "This interactive map allows you to follow the journey of stones through time. Each stone has its own unique story to tell.",
        tutorialStep2Title: "Select a Stone",
        tutorialStep2Text: "Use the selector at the top to filter the stones. You can choose to see all stones, only moved stones, or a specific stone.",
        tutorialStep3Title: "View History",
        tutorialStep3Text: "Click on a marker to see the details and the option to view the stone's complete historical path.",
        tutorialStep4Title: "History Panel",
        tutorialStep4Text: "The history panel shows the timeline of the stone's movements. You can use the controls to play or navigate along the path.",
        tutorialStep5Title: "Images and Details",
        tutorialStep5Text: "Select the 'Show images' mode to see the markers of the photos taken at that point, or the 'Last' mode to see only the last photo of each stone.",
        tutorialStep6Title: "Search",
        tutorialStep6Text: "Use the search function to find specific stones or locations on the map.",
        tutorialEndTitle: "Ready to Start!",
        tutorialEndText: "Enjoy exploring the history of the stones. Close this guide to begin.",
    },
    // Aggiungere altre lingue qui
};

let currentLanguage = 'it'; // Lingua predefinita

// Funzione per ottenere la traduzione
function t(key) {
    return translations[currentLanguage][key] || key;
}

// Funzione per impostare la lingua e aggiornare l'interfaccia
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('mapLanguage', lang); // Salva la lingua in localStorage
        updateInterfaceText();
    } else {
        console.warn(`Lingua ${lang} non supportata.`);
    }
}

// Funzione per aggiornare tutti i testi nell'interfaccia
function updateInterfaceText() {
    // Aggiorna il titolo e sottotitolo
    document.getElementById('map-title').textContent = t('title');
    document.getElementById('map-subtitle').textContent = t('subtitle');

    // Aggiorna i testi dei selettori
    document.getElementById('language-label').textContent = t('selectLanguage');
    document.getElementById('stone-label').textContent = t('selectStone');
    document.getElementById('image-label').textContent = t('showImages');

    // Aggiorna le opzioni del selettore pietra (solo le opzioni fisse)
    document.querySelector('#stone-selector option[value="movedStones"]').textContent = t('movedStones');
    document.querySelector('#stone-selector option[value="Show all"]').textContent = t('showAll');

    // Aggiorna le opzioni del selettore immagini
    document.querySelector('#image-selector option[value="Last"]').textContent = t('lastImage');
    document.querySelector('#image-selector option[value="None"]').textContent = t('noImages');
    document.querySelector('#image-selector option[value="All"]').textContent = t('allImages');

    // Aggiorna i testi del pannello storia (se visibile)
    const historyPanel = document.getElementById('history-panel');
    if (historyPanel.style.display !== 'none') {
        updateHistoryPanelText(); // Funzione da definire in script.js
    }

    // Aggiorna i testi del tutorial (se visibile o se deve essere re-inizializzato)
    if (typeof tutorialGuide !== 'undefined') {
        tutorialGuide.updateText();
    }

    // Aggiorna i testi dei pulsanti e degli elementi con attributo data-i18n-key
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (key) {
            element.textContent = t(key);
        }
    });

    // Aggiorna gli attributi aria-label
    document.getElementById('stone-selector').setAttribute('aria-label', t('selectStoneAriaLabel'));
    document.getElementById('image-selector').setAttribute('aria-label', t('selectImagesAriaLabel'));
    document.getElementById('map').setAttribute('aria-label', t('mapAriaLabel'));
    // Aggiungere altri aggiornamenti aria-label qui...

    // Aggiorna i popup dei marcatori esistenti
    // Questo è fondamentale per tradurre i popup dopo il cambio lingua
    if (typeof currentMarkers !== 'undefined') {
        currentMarkers.eachLayer(layer => {
            if (layer.getPopup()) {
                // Accedi a layer.stoneData
                const stoneData = layer.stoneData;
                if (stoneData) {
                    const newContent = createPopupContent(stoneData); // Funzione da script.js
                    layer.setPopupContent(newContent);
                }
            }
        });
    }
}

// Funzione per inizializzare il selettore lingua
function initializeLanguageSelector() {
    const selector = document.getElementById('language-selector');
    // Pulisci le opzioni esistenti
    selector.innerHTML = '';

    // Aggiungi le opzioni per ogni lingua disponibile
    for (const langCode in translations) {
        const option = document.createElement('option');
        option.value = langCode;
        // Usa il nome della lingua in italiano per la visualizzazione nel selettore
        option.textContent = getLanguageName(langCode);
        selector.appendChild(option);
    }

    // Imposta la lingua iniziale
    const savedLang = localStorage.getItem('mapLanguage');
    const initialLang = savedLang && translations[savedLang] ? savedLang : 'it';
    selector.value = initialLang;
    setLanguage(initialLang);
}

// Funzione di utilità per ottenere il nome della lingua
function getLanguageName(langCode) {
    const names = {
        it: "Italiano",
        en: "English",
        // Aggiungere qui i nomi delle altre lingue supportate
    };
    return names[langCode] || langCode;
}

// Funzione di utilità per ottenere la funzione di traduzione (per l'uso in script.js)
function getTranslationFunction(lang) {
    return (key) => translations[lang][key] || key;
}
