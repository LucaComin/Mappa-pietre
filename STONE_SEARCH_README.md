# Funzionalità Ricerca Pietra tramite Foto

## Descrizione

È stata aggiunta una nuova funzionalità che permette agli utenti di cercare la propria pietra tramite fotografia. Il sistema utilizza l'intelligenza artificiale per analizzare l'immagine caricata e trovare le pietre più simili nel database.

## Funzionalità Implementate

### 1. Cattura/Caricamento Foto
- **Scatta Foto**: Utilizza la fotocamera del dispositivo per scattare una foto della pietra
- **Carica Foto**: Carica un'immagine esistente dal dispositivo

### 2. Analisi Immagine
- L'immagine viene inviata al server Hugging Face (llllluuuuucccccaaaaa/AnalisiPietre)
- Il server analizza l'immagine e restituisce le pietre più simili con percentuali di accuratezza

### 3. Selezione Pietra
- L'utente visualizza i risultati ordinati per accuratezza
- Per ogni risultato viene mostrato:
  - Nome della pietra (es. ST216, ST354, ST110)
  - Percentuale di accuratezza (es. 92.9%, 84.6%, 72.7%)
- L'utente può selezionare la pietra corretta tra i risultati

### 4. Visualizzazione
- Una volta confermata la pietra, viene mostrata la prima immagine della pietra dal database
- L'utente può visualizzare la pietra sulla mappa cliccando sul pulsante "Visualizza sulla Mappa"
- Il sistema seleziona automaticamente la pietra nel selettore e apre il pannello della storia

## File Aggiunti/Modificati

### Nuovi File
1. **stone-search.css** - Stili per l'interfaccia di ricerca
2. **stone-search.js** - Logica JavaScript per la funzionalità di ricerca
3. **STONE_SEARCH_README.md** - Questo file di documentazione

### File Modificati
1. **index.html** - Aggiunto il modale di ricerca e i riferimenti ai nuovi file CSS/JS

## Come Usare

### Per l'Utente Finale

1. **Aprire la Ricerca**
   - Cliccare sul pulsante verde con l'icona 🔍 in basso a destra (sopra il pulsante di aiuto)

2. **Catturare/Caricare una Foto**
   - Scegliere tra "Scatta Foto" o "Carica Foto"
   - Se si scatta una foto, autorizzare l'accesso alla fotocamera
   - Scattare la foto o caricare un'immagine esistente

3. **Analizzare la Foto**
   - Visualizzare l'anteprima della foto
   - Cliccare su "Analizza" per inviare l'immagine al server
   - Attendere l'analisi (alcuni secondi)

4. **Selezionare la Pietra**
   - Visualizzare i risultati ordinati per accuratezza
   - Cliccare su "Seleziona" per la pietra corretta

5. **Visualizzare sulla Mappa**
   - Confermare la selezione
   - Cliccare su "Visualizza sulla Mappa" per vedere la pietra sulla mappa
   - Il sistema aprirà automaticamente il pannello della storia della pietra

### Per lo Sviluppatore

#### Struttura del Codice

**StoneSearchManager Class** (stone-search.js)
```javascript
class StoneSearchManager {
    constructor()           // Inizializza il manager
    init()                  // Setup iniziale
    setupElements()         // Riferimenti agli elementi DOM
    setupEventListeners()   // Event listeners
    openModal()             // Apre il modale
    closeModal()            // Chiude il modale
    showStep(stepName)      // Mostra uno step specifico
    startCamera()           // Avvia la fotocamera
    stopCamera()            // Ferma la fotocamera
    capturePhoto()          // Scatta la foto
    handleFileUpload()      // Gestisce il caricamento file
    analyzePhoto()          // Analizza la foto tramite API
    processResults()        // Processa i risultati dell'API
    displayResults()        // Mostra i risultati all'utente
    selectStone()           // Gestisce la selezione della pietra
    getStoneFirstImage()    // Recupera la prima immagine della pietra
    viewStoneOnMap()        // Visualizza la pietra sulla mappa
}
```

#### Integrazione con il Sistema Esistente

Il modulo si integra con il sistema esistente attraverso:

1. **Accesso ai dati globali**:
   ```javascript
   window.allStonesData  // Dati delle pietre caricati dal Google Sheet
   ```

2. **Funzioni globali**:
   ```javascript
   window.showStoneHistory(stoneName)  // Mostra il pannello della storia
   ```

3. **Elementi DOM**:
   ```javascript
   document.getElementById('stone-select')  // Selettore delle pietre
   ```

#### API Hugging Face

**Endpoint**: `llllluuuuucccccaaaaa/AnalisiPietre`

**Funzione**: `/analizza_immagine`

**Input**: 
- `template_img_input`: File immagine (JPEG, PNG, ecc.)

**Output**:
```javascript
{
    data: [
        "File: 215 ST216 (Accuratezza: 92.9%)\nFile: 335 ST354 (Accuratezza: 84.6%)\nFile: 118 ST110 (Accuratezza: 72.7%)",
        { url: "https://..." }  // Immagine della migliore corrispondenza (opzionale)
    ]
}
```

#### Parsing dei Risultati

Il sistema estrae le informazioni dai risultati usando regex:
```javascript
const stoneMatch = line.match(/ST\d+/);           // Estrae il nome (es. ST216)
const accuracyMatch = line.match(/Accuratezza:\s*([\d.]+)%/);  // Estrae l'accuratezza
```

## Personalizzazione

### Modificare i Colori

Nel file `stone-search.css`, modificare:
```css
.floating-search-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

### Modificare la Posizione del Pulsante

Nel file `stone-search.css`:
```css
.floating-search-btn {
    bottom: 100px;  /* Distanza dal basso */
    right: 30px;    /* Distanza da destra */
}
```

### Modificare il Server API

Nel file `stone-search.js`, modificare:
```javascript
const client = await Client.connect("llllluuuuucccccaaaaa/AnalisiPietre");
```

## Compatibilità

- **Browser**: Chrome, Firefox, Safari, Edge (versioni recenti)
- **Dispositivi**: Desktop, Tablet, Smartphone
- **Fotocamera**: Richiede autorizzazione dell'utente per l'accesso alla fotocamera

## Note Tecniche

### Sicurezza
- Il token di accesso Hugging Face è stato rimosso (sistema pubblico)
- La fotocamera richiede HTTPS in produzione

### Performance
- Le immagini vengono compresse a JPEG con qualità 0.9 prima dell'invio
- Il caricamento è asincrono per non bloccare l'interfaccia

### Accessibilità
- Tutti i pulsanti hanno `aria-label` appropriati
- Il modale ha `role="dialog"` e `aria-modal="true"`
- Supporto completo per la navigazione da tastiera

## Risoluzione Problemi

### La fotocamera non si avvia
- Verificare i permessi del browser
- Assicurarsi che il sito sia servito tramite HTTPS
- Controllare che il dispositivo abbia una fotocamera

### L'analisi fallisce
- Verificare la connessione internet
- Controllare che il server Hugging Face sia online
- Verificare che l'immagine sia in un formato supportato

### La pietra non viene trovata
- Assicurarsi che `window.allStonesData` sia popolato
- Verificare che il nome della pietra corrisponda esattamente
- Controllare la console del browser per errori

## Sviluppi Futuri

Possibili miglioramenti:
1. Cache locale dei risultati
2. Supporto per più lingue
3. Filtri avanzati sui risultati
4. Cronologia delle ricerche
5. Condivisione dei risultati
6. Modalità offline con Service Worker

## Licenza

Questo codice è parte del progetto "Mappa Interattiva delle Pietre" e segue la stessa licenza del progetto principale.
