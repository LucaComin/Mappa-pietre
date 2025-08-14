function processSheetData(data) {
    const rows = data.table.rows;
    const stoneData = {};

    rows.forEach(row => {
        const cells = row.c;
        const stoneName = cells[0] && cells[0].v ? cells[0].v : 'Unknown Stone';
        const lat = cells[1] && cells[1].v ? cells[1].v : 0;
        const lon = cells[2] && cells[2].v ? cells[2].v : 0;
        const dateValue = cells[3] && cells[3].v ? cells[3].v : null;
        const imageUrl = cells[4] && cells[4].v ? cells[4].v : null;

        let dateObj = null;
        if (dateValue) {
            // Tentativo di parsificare la data. Il formato 'Date(YYYY,M,D,H,M,S)' è specifico di Google Sheets API.
            // Mese è 0-indicizzato in JavaScript Date, quindi M-1.
            const dateMatch = dateValue.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2}),?(\d{1,2})?,?(\d{1,2})?,?(\d{1,2})?\)$/);
            if (dateMatch) {
                const year = parseInt(dateMatch[1]);
                const month = parseInt(dateMatch[2]);
                const day = parseInt(dateMatch[3]);
                const hour = dateMatch[4] ? parseInt(dateMatch[4]) : 0;
                const minute = dateMatch[5] ? parseInt(dateMatch[5]) : 0;
                const second = dateMatch[6] ? parseInt(dateMatch[6]) : 0;
                dateObj = new Date(year, month, day, hour, minute, second);
            } else {
                // Fallback per altri formati di data, se necessario
                try {
                    dateObj = new Date(dateValue);
                } catch (e) {
                    console.error("Errore durante la parsificazione della data: ", dateValue, e);
                    dateObj = null; // Assicurati che sia null se non valido
                }
            }
        }

        if (!stoneData[stoneName]) {
            stoneData[stoneName] = [];
        }
        stoneData[stoneName].push({
            lat: lat,
            lon: lon,
            dateObj: dateObj,
            imageUrl: imageUrl
        });
    });

    allStonesData = stoneData;
    updateStoneDropdown();
    displayFilteredStonesOnMap();
    hideLoadingOverlay();
}

// Funzione per formattare la data in modo sicuro
function formatSafeDate(dateObj, currentLanguage) {
    if (!dateObj instanceof Date || isNaN(dateObj.getTime())) {
        return 'Data non disponibile'; // O un altro messaggio di errore
    }
    return dateObj.toLocaleString(currentLanguage === 'en' ? 'en-US' : 'it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Modifica la riga 627 in script.js per usare formatSafeDate
// Cerca: const formattedDate = lastPosition.dateObj.toLocaleString(currentLanguage === 'en' ? 'en-US' : 'it-IT', {
// Sostituisci con: const formattedDate = formatSafeDate(lastPosition.dateObj, currentLanguage);

