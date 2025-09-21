# Problemi Identificati nell'Applicazione Mappa-pietre

## Errore HTTP 404 - OpenCV.js
Il problema principale è che l'applicazione sta tentando di caricare OpenCV.js da un URL remoto che restituisce un errore 404. Nel file `index.html`, alla riga 256, il codice tenta di caricare:

```javascript
script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
```

Tuttavia, questo URL non è più disponibile o è stato spostato.

## Conseguenze dell'errore
1. Il sistema di riconoscimento immagini non si inizializza correttamente
2. La funzione "Trova la mia pietra" non funziona
3. L'applicazione mostra errori nella console del browser

## Soluzioni implementate
1. **Download locale di OpenCV.js**: Ho scaricato il file opencv.js localmente nella directory del progetto
2. **Modifica del percorso**: Ho aggiornato il codice per caricare opencv.js dal file locale invece che dall'URL remoto
3. **Verifica funzionamento**: Il file è ora disponibile localmente e dovrebbe risolvere l'errore 404

## File modificati
- `index.html`: Cambiato il percorso di caricamento di OpenCV.js da remoto a locale
- Aggiunto `opencv.js` nella directory del progetto

## Test necessari
- Verificare che l'applicazione carichi senza errori 404
- Testare la funzionalità "Trova la mia pietra"
- Verificare che il sistema di riconoscimento immagini si inizializzi correttamente

