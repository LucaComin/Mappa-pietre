// Stone Search Module - Versione Finale Semplificata
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
            this.retakePhotoBtn.addEventListener('click', () => this.resetCapture());
        }
        
        // View stone button
        if (this.viewStoneBtn) {
            this.viewStoneBtn.addEventListener('click', () => this.viewStoneOnMap());
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
        this.captureStep?.classList.add('hidden');
        this.loadingStep?.classList.add('hidden');
        this.resultsStep?.classList.add('hidden');
        this.confirmStep?.classList.add('hidden');
        
        // Mostra lo step richiesto
        switch(stepName) {
            case 'capture':
                this.captureStep?.classList.remove('hidden');
                break;
            case 'loading':
                this.loadingStep?.classList.remove('hidden');
                break;
            case 'results':
                this.resultsStep?.classList.remove('hidden');
                break;
            case 'confirm':
                this.confirmStep?.classList.remove('hidden');
                break;
        }
        
        this.currentStep = stepName;
    }
    
    showError(message) {
        if (this.errorMessage && this.errorText) {
            this.errorText.textContent = message;
            this.errorMessage.classList.remove('hidden');
            
            setTimeout(() => {
                this.errorMessage.classList.add('hidden');
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
            this.showError('Impossibile accedere alla fotocamera. Verifica i permessi.');
        }
    }
    
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        
        if (this.cameraVideo) {
            this.cameraVideo.srcObject = null;
        }
        
        this.cameraContainer?.classList.add('hidden');
    }
    
    capturePhoto() {
        if (!this.cameraVideo || !this.cameraCanvas) return;
        
        const canvas = this.cameraCanvas;
        const video = this.cameraVideo;
        
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
            const stoneMatch = line.match(/ST\d+/);
            const accuracyMatch = line.match(/Accuratezza:\s*([\d.]+)%/);
            
            if (stoneMatch && accuracyMatch) {
                this.searchResults.push({
                    name: stoneMatch[0],
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
        
        // Mostra i risultati
        this.displayResults();
    }
    
    displayResults() {
        if (!this.resultsContainer) return;
        
        // Pulisci il container
        this.resultsContainer.innerHTML = '';
        
        // Crea i risultati
        this.searchResults.forEach((result, index) => {
            const resultItem = this.createResultItem(result, index);
            this.resultsContainer.appendChild(resultItem);
        });
        
        // Mostra lo step dei risultati
        this.showStep('results');
    }
    
    createResultItem(result, index) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.style.cssText = `
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            gap: 15px;
            align-items: center;
            background: white;
        `;
        
        // Ottieni l'immagine della pietra
        const stoneImage = this.getStoneFirstImageSync(result.name);
        
        // Crea il contenitore per l'immagine/placeholder
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
        `;
        
        if (stoneImage) {
            // Crea l'elemento immagine
            const img = document.createElement('img');
            img.src = stoneImage;
            img.alt = result.name;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            `;
            
            // Gestisci l'errore di caricamento
            img.onerror = () => {
                imageContainer.innerHTML = this.createPlaceholderSVG();
            };
            
            imageContainer.appendChild(img);
        } else {
            // Mostra il placeholder SVG
            imageContainer.innerHTML = this.createPlaceholderSVG();
        }
        
        // Crea il contenitore delle informazioni
        const infoContainer = document.createElement('div');
        infoContainer.style.cssText = 'flex: 1;';
        
        const nameDiv = document.createElement('div');
        nameDiv.textContent = result.name;
        nameDiv.style.cssText = `
            font-size: 1.2em;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        `;
        
        const accuracyDiv = document.createElement('div');
        accuracyDiv.textContent = `Accuratezza: ${result.accuracy.toFixed(1)}%`;
        accuracyDiv.style.cssText = `
            color: #667eea;
            font-size: 1em;
            font-weight: 500;
        `;
        
        infoContainer.appendChild(nameDiv);
        infoContainer.appendChild(accuracyDiv);
        
        // Crea il pulsante di azione
        const actionButton = document.createElement('button');
        actionButton.textContent = 'È questa';
        actionButton.style.cssText = `
            padding: 10px 20px;
            border: 2px solid #10b981;
            background: white;
            border-radius: 10px;
            cursor: pointer;
            color: #10b981;
            font-weight: 600;
            transition: all 0.3s ease;
            flex-shrink: 0;
        `;
        
        // Aggiungi l'evento hover
        actionButton.addEventListener('mouseenter', () => {
            actionButton.style.background = '#10b981';
            actionButton.style.color = 'white';
        });
        
        actionButton.addEventListener('mouseleave', () => {
            actionButton.style.background = 'white';
            actionButton.style.color = '#10b981';
        });
        
        // Aggiungi l'evento click
        actionButton.addEventListener('click', () => {
            this.selectStone(result);
        });
        
        // Assembla il risultato
        resultItem.appendChild(imageContainer);
        resultItem.appendChild(infoContainer);
        resultItem.appendChild(actionButton);
        
        // Aggiungi l'effetto hover al risultato
        resultItem.addEventListener('mouseenter', () => {
            resultItem.style.borderColor = '#667eea';
            resultItem.style.background = '#f8f9ff';
            resultItem.style.transform = 'translateX(5px)';
        });
        
        resultItem.addEventListener('mouseleave', () => {
            resultItem.style.borderColor = '#e0e0e0';
            resultItem.style.background = 'white';
            resultItem.style.transform = 'translateX(0)';
        });
        
        return resultItem;
    }
    
    createPlaceholderSVG() {
        return `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" fill="#F3F4F6"/>
                <path d="M17.5 17.5H22.5V22.5H17.5V17.5Z" fill="#9CA4AF"/>
                <path d="M12.5 12.5H27.5V27.5H12.5V12.5Z" stroke="#9CA4AF" stroke-width="1" fill="none"/>
            </svg>
        `;
    }
    
    getStoneFirstImageSync(stoneName) {
        // Versione sincrona per uso immediato nella UI
        if (typeof window.allStonesData !== 'undefined') {
            // Prova diverse varianti del nome della pietra
            const stoneVariants = [
                stoneName,
                stoneName.replace(/ /g, '_'),
                stoneName.replace(/_/g, ' '),
                stoneName.replace(/ST/g, 'ST'),
                'ST' + stoneName.replace(/ST/g, ''),
                stoneName.toLowerCase(),
                stoneName.toUpperCase()
            ];
            
            for (const variant of stoneVariants) {
                if (window.allStonesData[variant] && window.allStonesData[variant].length > 0) {
                    const stoneData = window.allStonesData[variant];
                    // Prova diversi nomi di campo per l'immagine
                    const imageUrl = stoneData[0].imageUrl || stoneData[0].image || stoneData[0].img || null;
                    if (imageUrl) {
                        console.log(`Immagine trovata per ${stoneName} (variante: ${variant}):`, imageUrl);
                        return imageUrl;
                    }
                }
            }
            
            // Debug: mostra tutti i nomi delle pietre disponibili
            console.log('Pietre disponibili in allStonesData:', Object.keys(window.allStonesData));
            console.log(`Nessuna immagine trovata per: ${stoneName}`);
        } else {
            console.warn('window.allStonesData non è definito');
        }
        
        // Ritorna un'immagine placeholder come fallback
        return `https://via.placeholder.com/80x80/667eea/white?text=${encodeURIComponent(stoneName)}`;
    }
    
    async selectStone(stoneResult) {
        this.selectedStone = stoneResult;
        
        // Seleziona immediatamente la pietra nel selettore
        this.selectStoneInDropdown(stoneResult.name);
        
        // Chiudi il modale
        this.closeModal();
        
        // Attendi un momento per permettere alla mappa di aggiornarsi
        setTimeout(() => {
            // Apri il pannello della storia
            if (typeof window.showStoneHistory === 'function') {
                window.showStoneHistory(this.getMatchingStoneName(stoneResult.name));
            }
        }, 300);
    }
    
    selectStoneInDropdown(stoneName) {
        const stoneSelect = document.getElementById('stone-select');
        if (!stoneSelect) return;
        
        // Cerca il valore corretto nel select (potrebbe avere underscore o spazi)
        const options = Array.from(stoneSelect.options);
        const matchingOption = options.find(opt => 
            opt.value === stoneName || 
            opt.value.replace(/_/g, ' ') === stoneName ||
            opt.value === stoneName.replace(/ /g, '_') ||
            opt.value.includes(stoneName) ||
            stoneName.includes(opt.value)
        );
        
        if (matchingOption) {
            stoneSelect.value = matchingOption.value;
            
            // Trigger change event per aggiornare la mappa
            const event = new Event('change', { bubbles: true });
            stoneSelect.dispatchEvent(event);
            
            return matchingOption.value;
        }
        
        return stoneName;
    }
    
    getMatchingStoneName(stoneName) {
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
                opt.value === this.selectedStone.name.replace(/ /g, '_')
            );
            
            if (matchingOption) {
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
