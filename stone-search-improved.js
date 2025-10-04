import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

class StoneSearchManager {
    constructor() {
        this.modal = null;
        this.currentStep = 'capture';
        this.capturedPhoto = null;
        this.searchResults = [];
        this.selectedStone = null;
        this.cameraStream = null;
        
        this.init();
    }
    
    init() {
        // Aspetta che il DOM sia caricato
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        // Riferimenti agli elementi
        this.modal = document.getElementById('stone-search-modal');
        this.openBtn = document.getElementById('open-search-btn');
        this.closeBtn = document.getElementById('close-search-modal');
        
        // Steps
        this.captureStep = document.getElementById('capture-step');
        this.loadingStep = document.getElementById('loading-step');
        this.resultsStep = document.getElementById('results-step');
        this.confirmStep = document.getElementById('confirm-step');
        
        // Capture elements
        this.takePhotoBtn = document.getElementById('take-photo-btn');
        this.uploadPhotoBtn = document.getElementById('upload-photo-btn');
        this.photoInput = document.getElementById('photo-input');
        this.cameraContainer = document.getElementById('camera-container');
        this.cameraVideo = document.getElementById('camera-video');
        this.cameraCanvas = document.getElementById('camera-canvas');
        this.capturePhotoBtn = document.getElementById('capture-photo-btn');
        this.cancelCameraBtn = document.getElementById('cancel-camera-btn');
        
        // Preview elements
        this.photoPreviewContainer = document.getElementById('photo-preview-container');
        this.photoPreview = document.getElementById('photo-preview');
        this.analyzePhotoBtn = document.getElementById('analyze-photo-btn');
        this.retakePhotoBtn = document.getElementById('retake-photo-btn');
        
        // Results elements
        this.resultsContainer = document.getElementById('results-container');
        
        // Confirm elements
        this.confirmStoneName = document.getElementById('confirm-stone-name');
        this.confirmStoneImage = document.getElementById('confirm-stone-image');
        this.viewStoneBtn = document.getElementById('view-stone-btn');
        
        // Error elements
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Open/Close modal
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.openModal());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Capture options
        if (this.takePhotoBtn) {
            this.takePhotoBtn.addEventListener('click', () => this.startCamera());
        }
        
        if (this.uploadPhotoBtn) {
            this.uploadPhotoBtn.addEventListener('click', () => this.photoInput.click());
        }
        
        if (this.photoInput) {
            this.photoInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // Camera controls
        if (this.capturePhotoBtn) {
            this.capturePhotoBtn.addEventListener('click', () => this.capturePhoto());
        }
        
        if (this.cancelCameraBtn) {
            this.cancelCameraBtn.addEventListener('click', () => this.stopCamera());
        }
        
        // Preview actions
        if (this.analyzePhotoBtn) {
            this.analyzePhotoBtn.addEventListener('click', () => this.analyzePhoto());
        }
        
        if (this.retakePhotoBtn) {
            this.retakePhotoBtn.addEventListener('click', () => this.resetToCapture());
        }
        
        // Confirm actions
        if (this.viewStoneBtn) {
            this.viewStoneBtn.addEventListener('click', () => this.viewStoneOnMap());
        }
        
        // Close modal on outside click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    openModal() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.resetToCapture();
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.stopCamera();
            this.resetToCapture();
        }
    }
    
    showStep(stepName) {
        // Nascondi tutti gli step
        const steps = ['capture', 'loading', 'results', 'confirm'];
        steps.forEach(step => {
            const element = document.getElementById(`${step}-step`);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        // Mostra lo step richiesto
        const targetStep = document.getElementById(`${stepName}-step`);
        if (targetStep) {
            targetStep.classList.remove('hidden');
        }
        
        this.currentStep = stepName;
    }
    
    showError(message) {
        if (this.errorMessage && this.errorText) {
            this.errorText.textContent = message;
            this.errorMessage.classList.remove('hidden');
            
            // Nascondi automaticamente dopo 5 secondi
            setTimeout(() => {
                if (this.errorMessage) {
                    this.errorMessage.classList.add('hidden');
                }
            }, 5000);
        }
    }
    
    async startCamera() {
        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            if (this.cameraVideo) {
                this.cameraVideo.srcObject = this.cameraStream;
                this.cameraContainer?.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Errore accesso camera:', error);
            this.showError('Impossibile accedere alla fotocamera. Usa il caricamento file.');
        }
    }
    
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        this.cameraContainer?.classList.add('hidden');
    }
    
    capturePhoto() {
        if (!this.cameraVideo || !this.cameraCanvas) return;
        
        const video = this.cameraVideo;
        const canvas = this.cameraCanvas;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
            this.capturedPhoto = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            this.showPhotoPreview(URL.createObjectURL(blob));
            this.stopCamera();
        }, 'image/jpeg', 0.9);
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.capturedPhoto = file;
            this.showPhotoPreview(URL.createObjectURL(file));
        } else {
            this.showError('Seleziona un file immagine valido (JPG, PNG, ecc.)');
        }
    }
    
    showPhotoPreview(imageUrl) {
        if (this.photoPreview) {
            this.photoPreview.src = imageUrl;
            this.photoPreviewContainer?.classList.remove('hidden');
        }
    }
    
    resetCapture() {
        this.capturedPhoto = null;
        this.photoPreviewContainer?.classList.add('hidden');
        if (this.photoInput) {
            this.photoInput.value = '';
        }
    }
    
    resetToCapture() {
        this.resetCapture();
        this.showStep('capture');
        this.searchResults = [];
        this.selectedStone = null;
    }
    
    async analyzePhoto() {
        if (!this.capturedPhoto) {
            this.showError('Nessuna foto da analizzare');
            return;
        }
        
        this.showStep('loading');
        
        try {
            // Connetti al client Gradio
            const client = await Client.connect("llllluuuuucccccaaaaa/AnalisiPietre");
            
            // Invia la richiesta
            const result = await client.predict("/analizza_immagine", {
                template_img_input: handle_file(this.capturedPhoto)
            });
            
            // Processa i risultati
            this.processResults(result.data);
            
        } catch (error) {
            console.error('Errore analisi:', error);
            this.showError(`Errore durante l'analisi: ${error.message}`);
            this.showStep('capture');
        }
    }
    
    processResults(data) {
        if (!data || data.length < 1) {
            this.showError('Nessun risultato ricevuto dal server');
            this.showStep('capture');
            return;
        }
        
        // Il primo elemento contiene il testo con i risultati
        const resultsText = data[0];
        
        // Parse dei risultati (formato: "File: 215 ST216 (Accuratezza: 92.9%)")
        const lines = resultsText.split('\n').filter(line => line.trim());
        this.searchResults = [];
        
        for (const line of lines) {
            // Estrai il nome della pietra e l'accuratezza
            const stoneMatch = line.match(/ST(\d+)/);
            const accuracyMatch = line.match(/Accuratezza:\s*([\d.]+)%/);
            
            if (stoneMatch && accuracyMatch) {
                const stoneNumber = stoneMatch[1];
                const stoneName = `ST${stoneNumber}`;
                
                this.searchResults.push({
                    name: stoneName,
                    number: stoneNumber,
                    accuracy: parseFloat(accuracyMatch[1]),
                    rawLine: line
                });
            }
        }
        
        if (this.searchResults.length === 0) {
            this.showError('Nessuna pietra trovata nei risultati');
            this.showStep('capture');
            return;
        }
        
        // Ordina i risultati per accuratezza decrescente
        this.searchResults.sort((a, b) => b.accuracy - a.accuracy);
        
        // Mostra i risultati
        this.displayResults();
    }
    
    displayResults() {
        if (!this.resultsContainer) return;
        
        this.resultsContainer.innerHTML = '';
        
        // Mostra solo i primi 3 risultati per non sovraccaricare l'interfaccia
        const topResults = this.searchResults.slice(0, 3);
        
        topResults.forEach((result, index) => {
            // Ottieni la prima immagine della pietra
            const stoneImage = this.getStoneFirstImageSync(result.name);
            
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Crea l'HTML con l'immagine se disponibile, altrimenti usa un placeholder
            let imageHtml = '';
            if (stoneImage) {
                imageHtml = `<img src="${stoneImage}" alt="${result.name}" class="result-image">`;
            } else {
                // Placeholder con il numero della pietra
                imageHtml = `
                    <div class="result-image-placeholder">
                        <div class="stone-number">${result.number}</div>
                        <div class="stone-label">ST</div>
                    </div>
                `;
            }
            
            resultItem.innerHTML = `
                ${imageHtml}
                <div class="result-info">
                    <div class="result-name">Pietra ${result.number}</div>
                    <div class="result-code">${result.name}</div>
                    <div class="result-accuracy">Accuratezza: ${result.accuracy.toFixed(1)}%</div>
                </div>
                <button class="result-action" data-index="${index}">È questa</button>
            `;
            
            resultItem.querySelector('.result-action').addEventListener('click', () => {
                this.selectStone(result);
            });
            
            this.resultsContainer.appendChild(resultItem);
        });
        
        this.showStep('results');
    }
    
    async selectStone(stoneResult) {
        this.selectedStone = stoneResult;
        
        // Aggiorna il pannello di conferma
        if (this.confirmStoneName) {
            this.confirmStoneName.textContent = `Pietra ${stoneResult.number} (${stoneResult.name})`;
        }
        
        // Ottieni e mostra l'immagine della pietra
        const stoneImage = await this.getStoneFirstImage(stoneResult.name);
        if (this.confirmStoneImage && stoneImage) {
            this.confirmStoneImage.src = stoneImage;
            this.confirmStoneImage.style.display = 'block';
        } else if (this.confirmStoneImage) {
            // Mostra placeholder se non c'è immagine
            this.confirmStoneImage.style.display = 'none';
        }
        
        this.showStep('confirm');
    }
    
    findStoneInSelector(stoneName) {
        const stoneSelect = document.getElementById('stone-select');
        if (!stoneSelect) return stoneName;
        
        const options = Array.from(stoneSelect.options);
        const matchingOption = options.find(opt => 
            opt.value === stoneName || 
            opt.value.replace(/_/g, ' ') === stoneName ||
            opt.value === stoneName.replace(/ /g, '_') ||
            opt.value.includes(stoneName) ||
            stoneName.includes(opt.value)
        );
        
        return matchingOption ? matchingOption.value : stoneName;
    }
    
    getStoneFirstImageSync(stoneName) {
        // Versione sincrona per uso immediato nella UI
        if (typeof window.allStonesData !== 'undefined' && window.allStonesData[stoneName]) {
            const stoneData = window.allStonesData[stoneName];
            if (stoneData.length > 0) {
                // Prova diversi nomi di campo per l'immagine
                return stoneData[0].imageUrl || stoneData[0].image || stoneData[0].img || null;
            }
        }
        return null;
    }
    
    async getStoneFirstImage(stoneName) {
        // Questa funzione deve recuperare la prima immagine della pietra dal sistema
        // Accede ai dati globali delle pietre se disponibili
        if (typeof window.allStonesData !== 'undefined' && window.allStonesData[stoneName]) {
            const stoneData = window.allStonesData[stoneName];
            if (stoneData.length > 0) {
                // Prova diversi nomi di campo per l'immagine
                return stoneData[0].imageUrl || stoneData[0].image || stoneData[0].img || null;
            }
        }
        
        // Fallback: ritorna un'immagine placeholder o null
        return null;
    }
    
    viewStoneOnMap() {
        if (!this.selectedStone) return;
        
        // Chiudi il modale
        this.closeModal();
        
        // Seleziona la pietra nel selettore principale
        const stoneSelect = document.getElementById('stone-select');
        if (stoneSelect) {
            // Cerca il valore corretto nel select (potrebbe avere underscore)
            const options = Array.from(stoneSelect.options);
            const matchingOption = options.find(opt => 
                opt.value === this.selectedStone.name || 
                opt.value.replace(/_/g, ' ') === this.selectedStone.name ||
                opt.value === this.selectedStone.name.replace(/ /g, '_') ||
                opt.textContent.includes(this.selectedStone.number)
            );
            
            if (matchingOption) {
                // Seleziona la pietra nel dropdown
                stoneSelect.value = matchingOption.value;
                
                // Trigger change event per aggiornare la mappa
                const event = new Event('change', { bubbles: true });
                stoneSelect.dispatchEvent(event);
                
                // Attendi un momento per permettere alla mappa di aggiornarsi
                setTimeout(() => {
                    // Se esiste una funzione per visualizzare la storia, chiamala
                    if (typeof window.showStoneHistory === 'function') {
                        window.showStoneHistory(matchingOption.value);
                    }
                }, 300);
            } else {
                console.warn('Pietra non trovata nel selettore:', this.selectedStone.name);
                // Prova comunque a chiamare showStoneHistory
                if (typeof window.showStoneHistory === 'function') {
                    window.showStoneHistory(this.selectedStone.name);
                }
            }
        }
    }
}

// Inizializza il manager quando il modulo viene caricato
const stoneSearchManager = new StoneSearchManager();

// Esporta per uso globale se necessario
window.stoneSearchManager = stoneSearchManager;
