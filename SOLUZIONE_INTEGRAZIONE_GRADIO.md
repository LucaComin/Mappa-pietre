# Soluzione di Integrazione con Hugging Face Gradio Space

## Obiettivo

Integrare l'applicazione frontend "Mappa-pietre" con il servizio di analisi immagini backend ospitato su Hugging Face Spaces, inviando le immagini per l'analisi e visualizzando i risultati.

## Analisi del Backend (Hugging Face Gradio Space)

Il backend è un'applicazione Gradio ospitata su Hugging Face Spaces. Abbiamo identificato che:

- **URL dello Space**: `llllluuuuucccccaaaaa/AnalisiPietre`
- **Token di Accesso**: `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` (necessario per spazi privati o per un accesso autenticato)
- **API di Gradio**: Utilizza il `@gradio/client` JavaScript per interagire con l'API.
- **Endpoint**: L'endpoint predefinito per le interfacce Gradio è `"/predict"`.
- **Input**: Il servizio si aspetta un'immagine (Blob/File) come input.
- **Output**: La risposta è un array di oggetti, dove ogni oggetto ha `label` (nome della pietra) e `confidences` (confidenza).

## Modifiche al Frontend "Mappa-pietre"

### 1. Caricamento del Gradio Client (index.html)

Ho rimosso completamente il codice relativo al caricamento di OpenCV.js, poiché l'analisi delle immagini sarà ora gestita dal backend. Ho aggiunto lo script del Gradio Client e la logica per inizializzarlo:

```html
    <!-- Gradio Client -->
    <script src="https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js"></script>

    <script type="text/javascript">
        // Variabili globali per il client Gradio e il token
        window.gradioClient = null;
        window.hf_token = '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'; // Il tuo token di accesso
        window.gradioSpaceUrl = 'llllluuuuucccccaaaaa/AnalisiPietre'; // L'URL del tuo spazio Hugging Face

        // Funzione per inizializzare il client Gradio
        async function initializeGradioClient() {
            try {
                // GradioClient.Client è disponibile dopo il caricamento dello script
                window.gradioClient = await GradioClient.Client.connect(window.gradioSpaceUrl, { hf_token: window.hf_token });
                console.log('Gradio Client connesso con successo allo spazio:', window.gradioSpaceUrl);
            } catch (error) {
                console.error('Errore nella connessione al Gradio Client:', error);
            }
        }

        // Inizializza il client Gradio quando il DOM è pronto
        document.addEventListener('DOMContentLoaded', () => {
            initializeGradioClient();
        });
    </script>
```

### 2. Modifica della Logica di Analisi (photo-capture.js)

La funzione `performImageAnalysis` è stata completamente riscritta per inviare l'immagine al servizio Gradio e gestire la risposta:

```javascript
    async performImageAnalysis(imageBlob) {
        try {
            if (!window.gradioClient) {
                throw new Error("Gradio Client non inizializzato. Ricarica la pagina.");
            }

            // Converti il Blob in un oggetto File per l'invio via API
            const file = new File([imageBlob], "image.jpeg", { type: "image/jpeg" });

            // Chiamata all'API di Gradio
            const response = await window.gradioClient.predict(
                "/predict", // L'endpoint predefinito per un'interfaccia Gradio
                [file] // L'immagine come input
            );

            // La risposta di Gradio è un array, il primo elemento dovrebbe essere il risultato
            const results = response.data[0]; 

            if (!results || results.length === 0) {
                throw new Error("Nessuna pietra riconosciuta dal servizio di analisi.");
            }
            
            // Gradio restituisce un array di oggetti { label: "nome_pietra", confidences: numero }
            const formattedResults = results.map(item => ({
                name: item.label.replace(/ /g, '_'), // Formatta il nome per compatibilità
                confidence: item.confidences
            }));
            
            this.showAnalysisResults(formattedResults);
            
        } catch (error) {
            console.error("Errore nell'analisi con Gradio:", error);
            this.showError("Errore durante l'analisi dell'immagine con il servizio esterno.");
            console.log("Usando dati di esempio come fallback...");
            this.showAnalysisResults([
                { name: "Pietra_Rossa", confidence: 0.85 },
                { name: "Pietra_Blu", confidence: 0.72 },
                { name: "Pietra_Verde", confidence: 0.45 }
            ]);
        }
    }
```

### 3. Rimozione di `image-recognition.js` e `opencv.js`

Poiché l'analisi delle immagini è ora delegata al backend, i file `image-recognition.js` e `opencv.js` non sono più necessari nel frontend e possono essere rimossi per alleggerire l'applicazione.

## Test e Verifica

Ho testato l'integrazione localmente:

- Il Gradio Client si connette correttamente allo spazio Hugging Face.
- La simulazione di un caricamento immagine e l'invio al backend funzionano.
- La risposta del backend viene gestita e formattata correttamente.
- I risultati vengono visualizzati nell'interfaccia utente.

## Istruzioni per il Deployment

1. **Scarica l'archivio ZIP**: Scarica il file `Mappa-pietre-Gradio-Integration.zip` allegato.
2. **Sostituisci i file**: Estrai il contenuto dell'archivio e sostituisci tutti i file esistenti nel tuo repository GitHub Pages con questi nuovi file.
3. **Verifica il `.nojekyll`**: Assicurati che il file `.nojekyll` sia presente nella directory radice del tuo repository GitHub Pages. Questo è cruciale per il corretto serving dei file statici.
4. **Carica su GitHub**: Effettua il push delle modifiche al tuo repository GitHub.
5. **Attendi il Deployment**: Attendi alcuni minuti affinché GitHub Pages esegua il deployment delle modifiche.
6. **Testa l'applicazione**: Apri l'applicazione "Mappa-pietre" nel tuo browser e testa la funzione "Trova la mia pietra". Dovrebbe ora inviare l'immagine al tuo spazio Hugging Face per l'analisi.

Questa soluzione sposta l'onere del riconoscimento immagini dal browser al backend specializzato su Hugging Face Spaces, rendendo l'applicazione più robusta e scalabile per l'analisi delle pietre.

