// Classe per gestire la guida interattiva
class TutorialGuide {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.isActive = false;
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'it';
        this.hasSeenTutorial = localStorage.getItem('mapTutorialSeen') === 'true';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        
        // Mostra automaticamente la guida se è la prima volta
        if (!this.hasSeenTutorial) {
            setTimeout(() => {
                this.show();
            }, 2000);
        }
    }
    
    bindEvents() {
        const nextBtn = document.getElementById('tutorial-next');
        const prevBtn = document.getElementById('tutorial-prev');
        const skipBtn = document.getElementById('tutorial-skip');
        const closeBtn = document.getElementById('tutorial-close');
        const helpBtn = document.getElementById('help-button');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (skipBtn) skipBtn.addEventListener('click', () => this.close());
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (helpBtn) helpBtn.addEventListener('click', () => this.show());
        
        // Chiudi con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.close();
            }
        });
    }
    
    show() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.isActive = true;
            this.currentStep = 1;
            this.updateStep();
            
            // Focus management per accessibilità
            overlay.focus();
        }
    }
    
    close() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.isActive = false;
            
            // Segna come visto
            localStorage.setItem('mapTutorialSeen', 'true');
            this.hasSeenTutorial = true;
        }
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStep();
        } else {
            this.close();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
        }
    }
    
    updateStep() {
        // Nascondi tutti gli step
        const steps = document.querySelectorAll('.tutorial-step');
        steps.forEach(step => step.classList.add('hidden'));
        
        // Mostra lo step corrente
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
        }
        
        // Aggiorna i pulsanti
        this.updateButtons();
        
        // Aggiorna la progress bar
        this.updateProgress();
        
        // Aggiorna il titolo e contenuto con le traduzioni
        this.updateStepContent();
    }
    
    updateButtons() {
        const nextBtn = document.getElementById('tutorial-next');
        const prevBtn = document.getElementById('tutorial-prev');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 1;
        }
        
        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.textContent = this.getTranslation('tutorialFinish') || 'Finisci';
            } else {
                nextBtn.textContent = this.getTranslation('tutorialNext') || 'Avanti';
            }
        }
    }
    
    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.currentStep} ${this.getTranslation('tutorialOf') || 'di'} ${this.totalSteps}`;
        }
    }
    
    updateStepContent() {
        const stepData = this.getStepData(this.currentStep);
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        
        if (currentStepElement && stepData) {
            const iconElement = currentStepElement.querySelector('.tutorial-icon');
            const titleElement = currentStepElement.querySelector('h3');
            const descElement = currentStepElement.querySelector('p');
            
            if (iconElement) iconElement.textContent = stepData.icon;
            if (titleElement) titleElement.textContent = stepData.title;
            if (descElement) descElement.textContent = stepData.description;
        }
        
        this.updateStepTitle();
    }
    
    getStepData(step) {
        const stepData = {
            1: {
                icon: '🗺️',
                title: this.getTranslation('tutorialExploreMap') || 'Esplora la Mappa',
                description: this.getTranslation('tutorialExploreMapDesc') || 'Questa mappa interattiva ti permette di seguire il viaggio delle pietre attraverso il tempo. Ogni pietra ha una sua storia unica da raccontare.'
            },
            2: {
                icon: '🪨',
                title: this.getTranslation('tutorialSelectStone') || 'Seleziona una Pietra',
                description: this.getTranslation('tutorialSelectStoneDesc') || 'Usa il menu a tendina in alto per selezionare una pietra specifica o visualizzare tutte le pietre contemporaneamente. Ogni pietra ha un colore distintivo.'
            },
            3: {
                icon: '📸',
                title: this.getTranslation('tutorialViewImages') || 'Visualizza le Immagini',
                description: this.getTranslation('tutorialViewImagesDesc') || 'Puoi scegliere di mostrare tutte le immagini, solo l\'ultima o nessuna immagine. Le immagini sono rappresentate da marcatori circolari sulla mappa.'
            },
            4: {
                icon: '📖',
                title: this.getTranslation('tutorialDiscoverHistory') || 'Scopri la Storia',
                description: this.getTranslation('tutorialDiscoverHistoryDesc') || 'Clicca su una pietra per vedere il popup informativo, poi clicca su "Vedi la storia" per aprire il pannello dettagliato con timeline e galleria immagini.'
            },
            5: {
                icon: '🌐',
                title: this.getTranslation('tutorialChangeLanguage') || 'Cambia Lingua',
                description: this.getTranslation('tutorialChangeLanguageDesc') || 'Il sito supporta multiple lingue. Usa il selettore lingua in alto per cambiare l\'interfaccia nella tua lingua preferita.'
            },
            6: {
                icon: '✨',
                title: this.getTranslation('tutorialStartExploring') || 'Inizia l\'Esplorazione!',
                description: this.getTranslation('tutorialStartExploringDesc') || 'Ora sei pronto per esplorare la mappa! Ricorda che puoi sempre riaprire questa guida cliccando sul pulsante "?" nell\'angolo in basso a destra.'
            }
        };
        
        return stepData[step] || stepData[1];
    }
    
    updateStepTitle() {
        const titleElement = document.getElementById('tutorial-title');
        const closeBtnElement = document.getElementById('tutorial-close');
        
        if (titleElement) {
            if (this.currentStep === 1) {
                titleElement.textContent = this.getTranslation('tutorialWelcome') || 'Benvenuto nella Mappa delle Pietre!';
            } else {
                const stepData = this.getStepData(this.currentStep);
                titleElement.textContent = stepData.title;
            }
        }
        
        if (closeBtnElement) {
            closeBtnElement.setAttribute('aria-label', this.getTranslation('tutorialClose') || 'Chiudi guida');
        }
    }
    
    getTranslation(key) {
        if (typeof translations !== 'undefined' && translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
            return translations[this.currentLanguage][key];
        }
        return null;
    }
    
    // Metodo per aggiornare la lingua quando cambia
    updateLanguage(newLanguage) {
        this.currentLanguage = newLanguage;
        if (this.isActive) {
            this.updateStep();
        }
        
        // Aggiorna anche il pulsante di aiuto
        const helpBtn = document.getElementById('help-button');
        if (helpBtn) {
            helpBtn.setAttribute('title', this.getTranslation('tutorialHelp') || 'Guida');
            helpBtn.setAttribute('aria-label', this.getTranslation('tutorialHelp') || 'Apri guida');
        }
    }
    
    // Metodo per resettare la guida (utile per debug)
    reset() {
        localStorage.removeItem('mapTutorialSeen');
        this.hasSeenTutorial = false;
        this.currentStep = 1;
    }
}

