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
            
            try {
                // Gestisci diversi formati di data
                if (typeof timestamp === 'string') {
                    // Prova prima a parsare come stringa
                    date = new Date(timestamp);
                    
                    // Se la data non è valida, prova a parsare come numero
                    if (isNaN(date.getTime())) {
                        const numericTimestamp = parseFloat(timestamp);
                        if (!isNaN(numericTimestamp)) {
                            // Il timestamp da Google Sheets è un formato numerico che rappresenta giorni da 1899-12-30
                            date = new Date((numericTimestamp - 25569) * 86400 * 1000);
                        } else {
                            console.warn(`Timestamp non valido per ${name}: ${timestamp}`);
                            return; // Salta questa riga se il timestamp non è valido
                        }
                    }
                } else if (typeof timestamp === 'number') {
                    // Il timestamp da Google Sheets è un formato numerico che rappresenta giorni da 1899-12-30
                    date = new Date((timestamp - 25569) * 86400 * 1000);
                } else {
                    console.warn(`Tipo di timestamp non supportato per ${name}: ${typeof timestamp}`);
                    return; // Salta questa riga se il tipo non è supportato
                }

                // Verifica che la data sia valida prima di procedere
                if (isNaN(date.getTime())) {
                    console.warn(`Data non valida per ${name}: ${timestamp}`);
                    return; // Salta questa riga se la data non è valida
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
            } catch (error) {
                console.error(`Errore nel processare la data per ${name}: ${timestamp}`, error);
                return; // Salta questa riga in caso di errore
            }
        }
    });

    // Ordina le posizioni di ogni pietra per timestamp (dal più vecchio al più recente)
    for (const stoneName in allStonesData) {
        allStonesData[stoneName].sort((a, b) => a.dateObj - b.dateObj);
    }

    populateStoneSelect();
    displayStonesOnMap('all');
}

// NOTA IMPORTANTE RIGUARDO A stone.json:
// Nel codice analizzato NON ci sono riferimenti a un file 'stone.json'.
// I dati delle pietre vengono caricati esclusivamente dal Google Sheet tramite la funzione loadData().
// Se si desidera utilizzare un file stone.json come fallback o fonte alternativa di dati,
// sarebbe necessario implementare una funzione separata per caricarlo, ad esempio:
//
// async function loadStoneJson() {
//     try {
//         const response = await fetch('./stone.json');
//         if (response.ok) {
//             const data = await response.json();
//             // Processa i dati da stone.json
//             processJsonData(data);
//         } else {
//             console.warn('File stone.json non trovato, utilizzo solo dati da Google Sheets');
//         }
//     } catch (error) {
//         console.warn('Errore nel caricamento di stone.json:', error);
//     }
// }

