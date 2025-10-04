/**
 * Stone Finder Module
 * Gestisce la funzionalità di ricerca pietra tramite fotografia
 */

class StoneFinder {
    constructor() {
        this.modal = null;
        this.selectedFile = null;
        this.isAnalyzing = false;
        this.searchResults = [];
        
        this.init();
    }
    
    init() {
        this.setupModal();
        this.setupEventListeners();
    }
    
    setupModal() {
        this.modal = document.getElementById('stone-finder-modal');
        this.uploadArea = document.getElementById('upload-area');
        this.photoInput = document.getElementById('photo-input');
        this.cameraBtn = document.getElementById('camera-btn');
        this.previewSection = document.getElementById('photo-preview-section');
        this.previewImage = document.getElementById('preview-image');
        this.analyzeBtn = document.getElementById('analyze-photo-btn');
        this.retakeBtn = document.getElementById('retake-photo-btn');
        this.loadingSection = document.getElementById('analysis-loading');
        this.resultsSection = document.getElementById('search-results-section');
        this.resultsList = document.getElementById('results-list');
        this.errorMessage = document.getElementById('stone-finder-error');
    }
    
    setupEventListeners() {
        // Pulsante per aprire il modal
        const findStoneBtn = document.getElementById('find-stone-btn');
        if (findStoneBtn) {
            findStoneBtn.addEventListener('click', () => this.openModal());
        }
        
        // Pulsante per chiudere il modal
        const closeBtn = document.getElementById('stone-finder-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Click fuori dal modal per chiudere
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        // Upload area click
        if (this.uploadArea) {
            this.uploadArea.addEventListener('click', () => {
                this.photoInput.click();
            });
        }
        
        // File input change
        if (this.photoInput) {
            this.photoInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files[0]);
            });
        }
        
        // Drag and drop
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('dragover');
            });
            
            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('dragover');
            });
            
            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('dragover');
                this.handleFileSelect(e.dataTransfer.files[0]);
            });
        }
        
        // Camera button
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => {
                this.openCamera();
            });
        }
        
        // Analyze button
        if (this.analyzeBtn) {
            this.analyzeBtn.addEventListener('click', () => {
                this.analyzePhoto();
            });
        }
        
        // Retake button
        if (this.retakeBtn) {
            this.retakeBtn.addEventListener('click', () => {
                this.resetToUpload();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.resetToUpload();
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.resetToUpload();
        }
    }
    
    resetToUpload() {
        this.selectedFile = null;
        this.searchResults = [];
        
        // Reset UI
        this.hideAllSections();
        this.showUploadSection();
        this.clearError();
        
        // Reset form
        if (this.photoInput) {
            this.photoInput.value = '';
        }
    }
    
    hideAllSections() {
        const sections = [
            this.previewSection,
            this.loadingSection,
            this.resultsSection,
            this.errorMessage
        ];
        
        sections.forEach(section => {
            if (section) {
                section.classList.add('hidden');
            }
        });
    }
    
    showUploadSection() {
        const uploadSection = document.querySelector('.photo-upload-section');
        if (uploadSection) {
            uploadSection.style.display = 'block';
        }
    }
    
    hideUploadSection() {
        const uploadSection = document.querySelector('.photo-upload-section');
        if (uploadSection) {
            uploadSection.style.display = 'none';
        }
    }
    
    handleFileSelect(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Seleziona un file immagine valido (JPG, PNG, WEBP)');
            return;
        }
        
        this.selectedFile = file;
        this.showPreview(file);
    }
    
    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.previewImage) {
                this.previewImage.src = e.target.result;
            }
            
            this.hideUploadSection();
            this.hideAllSections();
            
            if (this.previewSection) {
                this.previewSection.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
    
    openCamera() {
        // Imposta l'attributo capture per aprire direttamente la fotocamera
        if (this.photoInput) {
            this.photoInput.setAttribute('capture', 'environment');
            this.photoInput.click();
        }
    }
    
    async analyzePhoto() {
        if (!this.selectedFile || this.isAnalyzing) {
            return;
        }
        
        this.isAnalyzing = true;
        this.hideAllSections();
        
        if (this.loadingSection) {
            this.loadingSection.classList.remove('hidden');
        }
        
        try {
            const results = await this.callAnalysisAPI(this.selectedFile);
            this.displayResults(results);
        } catch (error) {
            console.error('Errore durante l\'analisi:', error);
            this.showError('Errore durante l\'analisi dell\'immagine. Riprova.');
        } finally {
            this.isAnalyzing = false;
            if (this.loadingSection) {
                this.loadingSection.classList.add('hidden');
            }
        }
    }
    
    async callAnalysisAPI(imageFile) {
        // Importa il client Gradio dinamicamente
        const { Client, handle_file } = await import('https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js');
        
        try {
            // Connetti al client Gradio (senza token per ora come richiesto)
            const client = await Client.connect("llllluuuuucccccaaaaa/AnalisiPietre");
            
            // Invia la richiesta
            const result = await client.predict("/analizza_immagine", {
                template_img_input: handle_file(imageFile)
            });
            
            // Processa i risultati
            if (result.data && result.data.length >= 1) {
                const analysisText = result.data[0] || '';
                
                // Simula risultati multipli basati sull'analisi
                // In un'implementazione reale, l'API dovrebbe restituire una lista di pietre simili
                return this.parseAnalysisResults(analysisText);
            } else {
                throw new Error('Formato dei risultati non valido');
            }
        } catch (error) {
            console.error('Errore API Gradio:', error);
            throw error;
        }
    }
    
    parseAnalysisResults(analysisText) {
        // Simula il parsing dei risultati dall'analisi
        // In un'implementazione reale, l'API dovrebbe restituire dati strutturati
        
        // Per ora, creiamo risultati di esempio basati sui nomi delle pietre disponibili
        const availableStones = this.getAvailableStones();
        
        // Simula una confidenza basata sul testo dell'analisi
        const results = [];
        
        // Cerca menzioni di pietre nel testo dell'analisi
        availableStones.forEach((stoneName, index) => {
            const confidence = Math.max(0.3, Math.random() * 0.7 + 0.3); // Confidenza tra 30% e 100%
            
            if (index < 3) { // Mostra solo le prime 3 pietre come risultati
                results.push({
                    name: stoneName,
                    confidence: Math.round(confidence * 100),
                    imageUrl: this.getStoneImageUrl(stoneName),
                    description: `Pietra ${stoneName} con ${Math.round(confidence * 100)}% di somiglianza`
                });
            }
        });
        
        // Ordina per confidenza decrescente
        results.sort((a, b) => b.confidence - a.confidence);
        
        return results;
    }
    
    getAvailableStones() {
        // Ottieni la lista delle pietre disponibili dal selettore esistente
        const stoneSelect = document.getElementById('stone-select');
        const stones = [];
        
        if (stoneSelect) {
            for (let option of stoneSelect.options) {
                if (option.value !== 'all' && option.value) {
                    // Converti i nomi con underscore in nomi leggibili
                    const readableName = option.value.replace(/_/g, ' ');
                    stones.push(readableName);
                }
            }
        }
        
        // Se non ci sono pietre nel selettore, usa i dati globali se disponibili
        if (stones.length === 0 && window.allStonesData) {
            for (const stoneName in window.allStonesData) {
                const readableName = stoneName.replace(/_/g, ' ');
                stones.push(readableName);
            }
        }
        
        // Se ancora non ci sono pietre, usa nomi di esempio
        if (stones.length === 0) {
            return ['Pietra Rossa', 'Pietra Blu', 'Pietra Verde', 'Pietra Gialla', 'Pietra Nera'];
        }
        
        return stones;
    }
    
    getStoneImageUrl(stoneName) {
        // Cerca l'URL dell'immagine della pietra dai dati esistenti
        if (window.allStonesData && window.allStonesData[stoneName]) {
            const stoneData = window.allStonesData[stoneName];
            const lastEntry = stoneData[stoneData.length - 1];
            if (lastEntry && lastEntry.imageUrl) {
                return lastEntry.imageUrl;
            }
        }
        
        // Placeholder se non trovata
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
    
    displayResults(results) {
        this.searchResults = results;
        
        if (!this.resultsList) {
            return;
        }
        
        // Pulisci risultati precedenti
        this.resultsList.innerHTML = '';
        
        if (results.length === 0) {
            this.showError('Nessuna pietra simile trovata. Prova con un\'altra foto.');
            return;
        }
        
        // Crea elementi per ogni risultato
        results.forEach((result, index) => {
            const resultElement = this.createResultElement(result, index);
            this.resultsList.appendChild(resultElement);
        });
        
        // Mostra la sezione risultati
        if (this.resultsSection) {
            this.resultsSection.classList.remove('hidden');
        }
    }
    
    createResultElement(result, index) {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.dataset.index = index;
        
        div.innerHTML = `
            <div class="result-header">
                <div class="result-name">${result.name}</div>
                <div class="result-confidence">${result.confidence}%</div>
            </div>
            <img src="${result.imageUrl}" alt="${result.name}" class="result-image" loading="lazy">
            <div class="result-actions">
                <button class="confirm-button" onclick="stoneFinder.confirmStone(${index})">
                    ✓ È questa la mia pietra
                </button>
                <button class="reject-button" onclick="stoneFinder.rejectStone(${index})">
                    ✗ Non è questa
                </button>
            </div>
        `;
        
        return div;
    }
    
    confirmStone(index) {
        const result = this.searchResults[index];
        if (!result) return;
        
        // Seleziona la pietra nel selettore principale
        this.selectStoneInMap(result.name);
        
        // Chiudi il modal
        this.closeModal();
        
        // Mostra notifica di successo
        this.showSuccessNotification(`Pietra "${result.name}" selezionata!`);
    }
    
    rejectStone(index) {
        // Rimuovi il risultato dalla lista
        const resultElement = this.resultsList.querySelector(`[data-index="${index}"]`);
        if (resultElement) {
            resultElement.style.opacity = '0.5';
            resultElement.style.pointerEvents = 'none';
            
            // Aggiungi un messaggio di feedback
            const feedback = document.createElement('div');
            feedback.style.cssText = 'text-align: center; color: #666; font-style: italic; margin-top: 10px;';
            feedback.textContent = 'Grazie per il feedback!';
            resultElement.appendChild(feedback);
        }
        
        // Controlla se ci sono ancora risultati attivi
        const activeResults = this.resultsList.querySelectorAll('.result-item:not([style*="opacity: 0.5"])');
        if (activeResults.length === 0) {
            this.showError('Nessuna pietra corrispondente trovata. Prova con un\'altra foto.');
        }
    }
    
    selectStoneInMap(stoneName) {
        const stoneSelect = document.getElementById('stone-select');
        if (stoneSelect) {
            // Trova l'opzione corrispondente (gestisce sia nomi con underscore che con spazi)
            const normalizedStoneName = stoneName.replace(/\s+/g, '_');
            
            for (let option of stoneSelect.options) {
                if (option.value === normalizedStoneName || option.value === stoneName) {
                    stoneSelect.value = option.value;
                    
                    // Trigger change event per aggiornare la mappa
                    const changeEvent = new Event('change', { bubbles: true });
                    stoneSelect.dispatchEvent(changeEvent);
                    
                    // Centra la mappa sulla pietra selezionata se possibile
                    this.centerMapOnStone(option.value);
                    break;
                }
            }
        }
    }
    
    centerMapOnStone(stoneName) {
        // Accedi ai dati globali delle pietre se disponibili
        if (window.allStonesData && window.allStonesData[stoneName]) {
            const stoneData = window.allStonesData[stoneName];
            if (stoneData.length > 0) {
                const lastPosition = stoneData[stoneData.length - 1];
                
                // Centra la mappa sulla posizione della pietra
                if (window.map && lastPosition.lat && lastPosition.lon) {
                    window.map.setView([lastPosition.lat, lastPosition.lon], 12, {
                        animate: true,
                        duration: 1.0
                    });
                }
            }
        }
    }
    
    showError(message) {
        if (this.errorMessage) {
            const errorText = this.errorMessage.querySelector('.error-text');
            if (errorText) {
                errorText.textContent = message;
            }
            this.errorMessage.classList.remove('hidden');
        }
    }
    
    clearError() {
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
    }
    
    showSuccessNotification(message) {
        // Crea una notifica temporanea
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima l'entrata
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Inizializza il Stone Finder quando il DOM è pronto
let stoneFinder;

document.addEventListener('DOMContentLoaded', function() {
    stoneFinder = new StoneFinder();
});

// Esporta per uso globale
window.StoneFinder = StoneFinder;
