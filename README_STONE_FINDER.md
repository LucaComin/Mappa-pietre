# Funzionalità "Trova la mia pietra"

## Panoramica

È stata aggiunta una nuova funzionalità alla **Mappa Interattiva delle Pietre** che permette agli utenti di identificare una pietra tramite fotografia. La funzionalità utilizza l'intelligenza artificiale per analizzare l'immagine caricata e suggerire le pietre più simili presenti nel database.

## Come utilizzare la funzionalità

### 1. Accesso alla funzione
- Nella barra dei controlli in alto, clicca sul pulsante **"🔍 Trova la mia pietra"**
- Si aprirà un modal dedicato alla ricerca

### 2. Caricamento dell'immagine
Hai due opzioni per fornire l'immagine della pietra:

#### Opzione A: Carica da dispositivo
- Clicca sull'area di upload tratteggiata
- Seleziona un'immagine dal tuo dispositivo (JPG, PNG, WEBP)
- Oppure trascina direttamente l'immagine nell'area di upload

#### Opzione B: Scatta una foto
- Clicca sul pulsante **"📷 Scatta foto"**
- Autorizza l'accesso alla fotocamera quando richiesto
- Scatta una foto della pietra

### 3. Analisi dell'immagine
- Dopo aver caricato l'immagine, vedrai un'anteprima
- Clicca su **"🔍 Analizza foto"** per avviare il riconoscimento
- L'analisi richiederà alcuni secondi

### 4. Risultati e selezione
- Il sistema mostrerà le pietre più simili con una percentuale di confidenza
- Per ogni risultato puoi:
  - **"✓ È questa la mia pietra"**: Seleziona automaticamente la pietra nella mappa
  - **"✗ Non è questa"**: Scarta il risultato e fornisci feedback

### 5. Selezione automatica
- Quando confermi una pietra, questa viene automaticamente selezionata nel menu a tendina
- La mappa si centra sulla posizione della pietra selezionata
- Riceverai una notifica di conferma

## Caratteristiche tecniche

### Integrazione API
- Utilizza l'API Gradio di Hugging Face per l'analisi delle immagini
- Endpoint: `llllluuuuucccccaaaaa/AnalisiPietre`
- Non richiede token di autenticazione (pubblico)

### Formati supportati
- **Immagini**: JPG, PNG, WEBP
- **Dimensioni**: Ottimizzate automaticamente per l'analisi
- **Qualità**: Raccomandato almeno 300x300 pixel

### Compatibilità browser
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Supporto completo con accesso fotocamera
- **Responsive**: Interfaccia ottimizzata per tutti i dispositivi

## Funzionalità avanzate

### Drag & Drop
- Trascina direttamente le immagini nell'area di upload
- Feedback visivo durante il trascinamento

### Gestione errori
- Messaggi di errore chiari e informativi
- Possibilità di riprovare in caso di problemi
- Validazione automatica dei formati file

### Feedback utente
- Sistema di conferma/rifiuto per migliorare l'accuratezza
- Notifiche di successo per le azioni completate
- Indicatori di caricamento durante l'analisi

### Integrazione mappa
- Selezione automatica nel selettore pietre
- Centratura automatica della mappa
- Animazioni fluide per una migliore UX

## Risoluzione problemi

### L'analisi non funziona
1. Verifica la connessione internet
2. Controlla che l'immagine sia in un formato supportato
3. Prova con un'immagine di qualità migliore

### La fotocamera non si apre
1. Autorizza l'accesso alla fotocamera nel browser
2. Verifica che il dispositivo abbia una fotocamera
3. Prova a ricaricare la pagina

### Nessun risultato trovato
1. Prova con un'immagine più chiara
2. Assicurati che la pietra sia ben visibile
3. Prova con angolazioni diverse

## File modificati

### Nuovi file
- `stone-finder.js`: Logica principale della funzionalità
- `README_STONE_FINDER.md`: Questa documentazione

### File modificati
- `index.html`: Aggiunto pulsante e modal
- `style.css`: Stili per la nuova interfaccia

### Struttura del codice
```
stone-finder.js
├── StoneFinder class
├── Modal management
├── File upload handling
├── Camera integration
├── API communication
├── Results display
└── Map integration
```

## Personalizzazione

### Modifica dell'API
Per utilizzare un'API diversa, modifica la funzione `callAnalysisAPI()` in `stone-finder.js`:

```javascript
async callAnalysisAPI(imageFile) {
    // Sostituisci con la tua API
    const client = await Client.connect("TUO_ENDPOINT");
    // ...
}
```

### Personalizzazione UI
Gli stili sono definiti in `style.css` nelle sezioni:
- `.stone-finder-modal`
- `.find-stone-button`
- `.result-item`

### Aggiunta lingue
I testi sono attualmente in italiano. Per aggiungere altre lingue, integra con il sistema di traduzione esistente in `translations.js`.

## Supporto

Per problemi o suggerimenti relativi alla funzionalità "Trova la mia pietra", verifica:
1. La console del browser per errori JavaScript
2. La connettività di rete
3. La compatibilità del browser

La funzionalità è progettata per essere robusta e user-friendly, con gestione automatica degli errori e feedback continuo all'utente.
