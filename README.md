# Mappa delle Pietre - Funzionalità di Riconoscimento Fotografico

## Panoramica

Questa versione migliorata della Mappa delle Pietre include una nuova funzionalità di riconoscimento fotografico che permette agli utenti di identificare automaticamente le pietre scattando una foto o selezionandola dalla galleria del dispositivo.

## Nuove Funzionalità Implementate

### 🔍 Pulsante "Trova la mia pietra"

Un nuovo pulsante è stato aggiunto nell'interfaccia principale che avvia il processo di riconoscimento fotografico.

**Posizione**: Barra dei controlli in alto a destra
**Funzione**: Apre il modal di cattura/selezione foto

### 📷 Modal di Cattura/Selezione Foto

Un'interfaccia moderna e intuitiva che offre due opzioni:

1. **Scatta una foto**: Utilizza la fotocamera del dispositivo
   - Accesso alla fotocamera posteriore (se disponibile)
   - Anteprima in tempo reale
   - Controlli per scattare o annullare

2. **Seleziona dalla galleria**: Carica un'immagine esistente
   - Supporta formati: JPG, JPEG, PNG, BMP
   - Anteprima dell'immagine selezionata

### 🤖 Algoritmo di Riconoscimento ORB

Implementazione JavaScript dell'algoritmo ORB (Oriented FAST and Rotated BRIEF) utilizzando OpenCV.js:

**Caratteristiche tecniche**:
- Estrazione di feature robuste alle rotazioni e al ridimensionamento
- Confronto con database di immagini delle pietre pre-calcolate
- Soglia di corrispondenza configurabile (60% di default)
- Ratio test di Lowe per filtrare le corrispondenze false

**Processo di analisi**:
1. Estrazione keypoints e descriptors dall'immagine utente
2. Confronto con tutte le immagini delle pietre nel database
3. Calcolo punteggi di corrispondenza
4. Ordinamento e presentazione dei risultati migliori

### 📊 Visualizzazione Risultati

I risultati dell'analisi vengono presentati in modo chiaro e interattivo:

- **Barre di confidenza**: Indicano la percentuale di corrispondenza
- **Risultato principale evidenziato**: Il miglior match viene mostrato in primo piano
- **Pulsante "È questa!"**: Permette la selezione diretta della pietra identificata

### 🔔 Sistema di Notifiche

Un sistema di notifiche elegante informa l'utente sullo stato delle operazioni:

- Notifiche di successo quando una pietra viene selezionata
- Messaggi di errore in caso di problemi
- Feedback visivo per migliorare l'esperienza utente

### 🎯 Integrazione Automatica

Quando una pietra viene identificata e selezionata:

1. Il dropdown delle pietre viene aggiornato automaticamente
2. La mappa si centra sulla pietra selezionata
3. Viene mostrata una notifica di conferma
4. Il modal si chiude automaticamente

## Architettura Tecnica

### File Aggiunti

1. **photo-capture.js**: Gestione cattura e selezione foto
2. **image-recognition.js**: Algoritmo di riconoscimento con OpenCV.js
3. **notifications.js**: Sistema di notifiche
4. **Stili CSS aggiuntivi**: Design moderno e responsive

### Dipendenze

- **OpenCV.js 4.8.0**: Libreria per computer vision
- **Leaflet.js**: Mappa interattiva (esistente)
- **Browser APIs**: getUserMedia per fotocamera, File API per galleria

### Compatibilità

- **Desktop**: Chrome, Firefox, Safari, Edge (versioni moderne)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Requisiti**: HTTPS per accesso fotocamera, JavaScript abilitato

## Utilizzo

### Per l'Utente Finale

1. Cliccare sul pulsante "🔍 Trova la mia pietra"
2. Scegliere tra "Scatta una foto" o "Seleziona dalla galleria"
3. Fornire l'immagine della pietra da identificare
4. Cliccare "Analizza foto" per avviare il riconoscimento
5. Selezionare "È questa!" sul risultato corretto
6. La mappa si aggiorna automaticamente

### Per lo Sviluppatore

```javascript
// Inizializzazione del sistema di riconoscimento
const imageRecognition = new ImageRecognition();
imageRecognition.initialize();

// Analisi di un'immagine
const results = await imageRecognition.analyzeUserImage(imageBlob);

// Gestione notifiche
window.notificationSystem.success("Operazione completata!");
```

## Configurazione

### Parametri dell'Algoritmo ORB

```javascript
// In image-recognition.js
this.SOGLIA_CORRISPONDENZA = 0.6;  // Soglia minima per considerare una corrispondenza
this.MIN_MATCH_COUNT = 10;         // Numero minimo di keypoints richiesti
this.RATIO_TEST_THRESHOLD = 0.75;  // Soglia per il ratio test di Lowe
```

### Personalizzazione UI

I colori e gli stili possono essere modificati tramite le variabili CSS in `style.css`:

```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --error-color: #ef4444;
    /* ... altre variabili */
}
```

## Performance e Ottimizzazioni

### Pre-calcolo delle Feature

Le feature delle pietre vengono pre-calcolate all'avvio per migliorare le performance:
- Cache in memoria delle feature estratte
- Caricamento asincrono per non bloccare l'interfaccia
- Gestione errori per immagini non valide

### Gestione Memoria

- Pulizia automatica degli oggetti OpenCV
- Rilascio delle risorse della fotocamera
- Gestione ottimale dei blob delle immagini

## Limitazioni e Considerazioni

### Limitazioni Tecniche

1. **Qualità dell'immagine**: Immagini sfocate o con poca luce possono ridurre l'accuratezza
2. **Angolazione**: Angoli molto diversi possono influenzare il riconoscimento
3. **Dimensioni**: Immagini troppo piccole potrebbero non avere abbastanza feature
4. **Connessione**: OpenCV.js richiede il download iniziale (~8MB)

### Considerazioni di Privacy

- Le immagini vengono elaborate localmente nel browser
- Nessun dato viene inviato a server esterni
- La fotocamera viene utilizzata solo quando richiesto dall'utente

## Sviluppi Futuri

### Possibili Miglioramenti

1. **Machine Learning**: Integrazione di modelli di deep learning per maggiore accuratezza
2. **Caching Intelligente**: Salvataggio locale delle feature per sessioni successive
3. **Filtri Avanzati**: Pre-processing delle immagini per migliorare il riconoscimento
4. **Feedback Utente**: Sistema di apprendimento basato sui feedback degli utenti
5. **Supporto Video**: Riconoscimento in tempo reale da stream video

### Estensioni Possibili

- Riconoscimento di multiple pietre in una singola immagine
- Integrazione con servizi di geolocalizzazione
- Export dei risultati in formati standard
- API per integrazione con altre applicazioni

## Supporto e Manutenzione

### Debug e Troubleshooting

La console del browser fornisce log dettagliati per il debug:
- Stato di caricamento di OpenCV.js
- Errori nell'estrazione delle feature
- Performance dell'algoritmo di matching

### Aggiornamenti

Per aggiornare l'algoritmo o aggiungere nuove feature:
1. Modificare i parametri in `image-recognition.js`
2. Aggiornare gli stili in `style.css`
3. Testare con diverse tipologie di immagini
4. Verificare la compatibilità cross-browser

---

**Versione**: 1.0.0  
**Data**: Settembre 2025  
**Compatibilità**: Browsers moderni con supporto ES6+

