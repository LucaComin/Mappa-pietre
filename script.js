// Aggiorna la funzione di inizializzazione del selettore di lingua
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'it';

    if (languageSelect) {
        languageSelect.value = savedLanguage;
        updateUIText(savedLanguage);
        updateAboutUsLink();

        // **CORREZIONE**: Aggiungi l'event listener per gestire il cambio di lingua
        languageSelect.addEventListener('change', (event) => {
            changeLanguage(event.target.value);
        });
    }
}

// Funzione per cambiare lingua (aggiornata)
function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updateUIText(lang);
    updateAboutUsLink();

    if (tutorialGuide) {
        tutorialGuide.updateLanguage(lang);
    }
    
    // Ricarica la pagina per applicare completamente la nuova lingua, se necessario
    // window.location.reload(); 
    // Ho commentato il reload per non interrompere il flusso, ma potrebbe essere necessario a seconda di come è strutturato il resto del codice.
}

// ... (il resto del codice di script.js e translations.js non mostrato qui)

