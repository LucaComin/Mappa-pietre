# Istruzioni per il Deployment su GitHub Pages

## Problema Identificato

L'errore 404 per `opencv.js` era causato da due fattori principali:

1. **Jekyll Processing**: GitHub Pages utilizza Jekyll per default, che può interferire con il serving di file statici
2. **Percorsi dei file locali**: I file locali possono non essere serviti correttamente su GitHub Pages

## Soluzione Implementata

### 1. File `.nojekyll`
Ho aggiunto un file vuoto chiamato `.nojekyll` nella directory radice del progetto. Questo file disabilita Jekyll e forza GitHub Pages a servire i file statici così come sono, senza processarli.

### 2. Utilizzo di CDN Affidabili
Ho modificato il codice per utilizzare solo CDN esterni affidabili per caricare OpenCV.js:

- **JSDelivr**: `https://cdn.jsdelivr.net/npm/opencv.js@4.8.0/opencv.js`
- **unpkg**: `https://unpkg.com/opencv.js@4.8.0/opencv.js`
- **Cloudflare**: `https://cdnjs.cloudflare.com/ajax/libs/opencv.js/4.8.0/opencv.js`

## Istruzioni per il Deployment

### Passo 1: Preparazione dei File
1. Scarica il file `Mappa-pietre-FINALE.zip`
2. Estrai tutti i file nella directory del tuo repository GitHub
3. **IMPORTANTE**: Assicurati che il file `.nojekyll` sia presente nella directory radice

### Passo 2: Caricamento su GitHub
1. Carica tutti i file sul tuo repository GitHub
2. Assicurati che il file `.nojekyll` sia visibile nel repository (potrebbe essere nascosto per default)
3. Verifica che `index.html` sia nella directory radice

### Passo 3: Configurazione GitHub Pages
1. Vai nelle impostazioni del repository
2. Scorri fino alla sezione "Pages"
3. Seleziona "Deploy from a branch"
4. Scegli il branch principale (main o master)
5. Seleziona "/ (root)" come cartella
6. Clicca "Save"

### Passo 4: Attesa del Deployment
1. GitHub Pages impiegherà alcuni minuti per processare i file
2. Riceverai una notifica quando il sito sarà pronto
3. L'URL sarà: `https://[username].github.io/[repository-name]/`

### Passo 5: Verifica
1. Visita il sito
2. Apri la console del browser (F12)
3. Verifica che non ci siano più errori 404 per OpenCV.js
4. Testa la funzione "Trova la mia pietra"

## Risoluzione Problemi

### Se l'errore 404 persiste:
1. **Svuota la cache del browser**: Ctrl+F5 o Ctrl+Shift+R
2. **Verifica il file .nojekyll**: Deve essere presente nella directory radice
3. **Controlla i log di GitHub Pages**: Nelle impostazioni del repository
4. **Attendi**: A volte GitHub Pages impiega fino a 10 minuti per aggiornare

### Se il sito non si carica:
1. Verifica che `index.html` sia nella directory radice
2. Controlla che GitHub Pages sia configurato correttamente
3. Assicurati che il repository sia pubblico (o che tu abbia GitHub Pro per repository privati)

## File Chiave Inclusi

- **`.nojekyll`**: Disabilita Jekyll processing
- **`index.html`**: File principale con il nuovo sistema di caricamento OpenCV.js
- **`opencv.js`**: File locale di backup (non più utilizzato ma mantenuto)
- **Tutti gli altri file**: Mantenuti invariati per compatibilità

## Note Tecniche

- Il nuovo sistema non dipende più da file locali per OpenCV.js
- Utilizza solo CDN esterni affidabili
- Include un sistema di fallback che prova diversi CDN
- Il file `.nojekyll` è essenziale per il corretto funzionamento

Seguendo queste istruzioni, l'errore 404 per OpenCV.js dovrebbe essere completamente risolto.

