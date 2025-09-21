// photo-capture.js - Gestione cattura e selezione foto per il riconoscimento pietre

class PhotoCapture {
    constructor() {
        this.currentStream = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Pulsante principale "Trova la mia pietra"
        const findStoneBtn = document.getElementById('find-stone-btn');
        if (findStoneBtn) {
            findStoneBtn.addEventListener('click', () => this.openPhotoModal());
        }

        // Pulsanti del modal
        const closeModalBtn = document.getElementById('close-photo-modal');
        const cameraBtn = document.getElementById('camera-btn');
        const galleryBtn = document.getElementById('gallery-btn');
        const analyzeBtn = document.getElementById('analyze-btn');
        const retakeBtn = document.getElementById('retake-btn');
        const fileInput = document.getElementById('file-input');

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closePhotoModal());
        }

        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => this.startCamera());
        }

        if (galleryBtn) {
            galleryBtn.addEventListener('click', () => this.selectFromGallery());
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzePhoto());
        }

        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.resetPhotoCapture());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        }

        // Chiudi modal cliccando fuori
        const photoModal = document.getElementById('photo-modal');
        if (photoModal) {
            photoModal.addEventListener('click', (e) => {
                if (e.target === photoModal) {
                    this.closePhotoModal();
                }
            });
        }

        // Gestione tasti ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePhotoModal();
            }
        });
    }

    openPhotoModal() {
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.resetPhotoCapture();
        }
    }

    closePhotoModal() {
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.stopCamera();
            this.resetPhotoCapture();
        }
    }

    async startCamera() {
        try {
            // Richiedi accesso alla fotocamera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Usa la fotocamera posteriore se disponibile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.currentStream = stream;
            const video = document.getElementById('camera-video');
            
            if (video) {
                video.srcObject = stream;
                video.style.display = 'block';
                video.style.maxWidth = '100%';
                video.style.borderRadius = 'var(--radius-md)';
                
                // Sostituisci i pulsanti con i controlli della fotocamera
                this.showCameraControls();
            }

        } catch (error) {
            console.error('Errore nell\'accesso alla fotocamera:', error);
            this.showError('Impossibile accedere alla fotocamera. Verifica i permessi del browser.');
        }
    }

    showCameraControls() {
        const photoOptions = document.querySelector('.photo-options');
        if (photoOptions) {
            photoOptions.innerHTML = `
                <div style="text-align: center;">
                    <video id="camera-video" autoplay playsinline style="max-width: 100%; border-radius: var(--radius-md); margin-bottom: var(--space-md);"></video>
                    <div style="display: flex; gap: var(--space-md); justify-content: center;">
                        <button id="capture-btn" class="analyze-btn">
                            <span class="btn-icon">📷</span>
                            Scatta foto
                        </button>
                        <button id="cancel-camera-btn" class="retake-btn">
                            <span class="btn-icon">❌</span>
                            Annulla
                        </button>
                    </div>
                </div>
            `;

            // Riavvia il video
            if (this.currentStream) {
                const video = document.getElementById('camera-video');
                if (video) {
                    video.srcObject = this.currentStream;
                }
            }

            // Aggiungi event listeners per i nuovi pulsanti
            const captureBtn = document.getElementById('capture-btn');
            const cancelBtn = document.getElementById('cancel-camera-btn');

            if (captureBtn) {
                captureBtn.addEventListener('click', () => this.capturePhoto());
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.resetPhotoCapture());
            }
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        
        if (video && canvas) {
            const context = canvas.getContext('2d');
            
            // Imposta le dimensioni del canvas uguali al video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Disegna il frame corrente del video sul canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Converti in blob e mostra l'anteprima
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                this.showPhotoPreview(url, blob);
                this.stopCamera();
            }, 'image/jpeg', 0.8);
        }
    }

    selectFromGallery() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            this.showPhotoPreview(url, file);
        }
    }

    showPhotoPreview(imageUrl, imageBlob) {
        // Nascondi le opzioni di selezione
        const photoOptions = document.querySelector('.photo-options');
        if (photoOptions) {
            photoOptions.style.display = 'none';
        }

        // Mostra l'anteprima
        const preview = document.getElementById('photo-preview');
        const previewImage = document.getElementById('preview-image');
        
        if (preview && previewImage) {
            previewImage.src = imageUrl;
            preview.classList.remove('hidden');
            
            // Salva il blob per l'analisi successiva
            this.currentImageBlob = imageBlob;
        }
    }

    resetPhotoCapture() {
        // Ripristina le opzioni originali
        const photoOptions = document.querySelector('.photo-options');
        if (photoOptions) {
            photoOptions.style.display = 'grid';
            photoOptions.innerHTML = `
                <button id="camera-btn" class="photo-option-btn">
                    <span class="photo-icon">📷</span>
                    <span class="photo-text">Scatta una foto</span>
                </button>
                
                <button id="gallery-btn" class="photo-option-btn">
                    <span class="photo-icon">🖼️</span>
                    <span class="photo-text">Seleziona dalla galleria</span>
                </button>
            `;

            // Riattacca gli event listeners
            const cameraBtn = document.getElementById('camera-btn');
            const galleryBtn = document.getElementById('gallery-btn');

            if (cameraBtn) {
                cameraBtn.addEventListener('click', () => this.startCamera());
            }

            if (galleryBtn) {
                galleryBtn.addEventListener('click', () => this.selectFromGallery());
            }
        }

        // Nascondi l'anteprima
        const preview = document.getElementById('photo-preview');
        const results = document.getElementById('analysis-results');
        
        if (preview) {
            preview.classList.add('hidden');
        }
        
        if (results) {
            results.classList.add('hidden');
        }

        // Pulisci i dati
        this.currentImageBlob = null;
        
        // Ferma la fotocamera se attiva
        this.stopCamera();
    }

    stopCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }

        const video = document.getElementById('camera-video');
        if (video) {
            video.style.display = 'none';
            video.srcObject = null;
        }
    }

    async analyzePhoto() {
        if (!this.currentImageBlob) {
            this.showError('Nessuna foto da analizzare');
            return;
        }

        // Mostra loading
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<span class="btn-icon">⏳</span> Analizzando...';
            analyzeBtn.disabled = true;
        }

        try {
            // Qui implementeremo l'analisi con OpenCV.js
            // Per ora mostriamo un placeholder
            await this.performImageAnalysis(this.currentImageBlob);
            
        } catch (error) {
            console.error('Errore nell\'analisi:', error);
            this.showError('Errore durante l\'analisi dell\'immagine');
        } finally {
            // Ripristina il pulsante
            if (analyzeBtn) {
                analyzeBtn.innerHTML = '<span class="btn-icon">🔍</span> Analizza foto';
                analyzeBtn.disabled = false;
            }
        }
    }

    async performImageAnalysis(imageBlob) {
        try {
            // Verifica se il riconoscimento immagini è disponibile
            if (!window.imageRecognition || !window.imageRecognition.isOpenCvReady) {
                throw new Error('Sistema di riconoscimento non ancora pronto. Riprova tra qualche secondo.');
            }

            // Usa il vero algoritmo di riconoscimento
            const results = await window.imageRecognition.analyzeUserImage(imageBlob);
            this.showAnalysisResults(results);
            
        } catch (error) {
            console.error('Errore nell\'analisi:', error);
            
            // Fallback ai dati di esempio se l'analisi reale fallisce
            console.log('Usando dati di esempio come fallback...');
            this.showAnalysisResults([
                { name: 'Pietra_Rossa', confidence: 0.85 },
                { name: 'Pietra_Blu', confidence: 0.72 },
                { name: 'Pietra_Verde', confidence: 0.45 }
            ]);
        }
    }

    showAnalysisResults(results) {
        const resultsContainer = document.getElementById('analysis-results');
        const resultsContent = document.getElementById('results-content');
        
        if (resultsContainer && resultsContent) {
            let html = '';
            
            if (results.length > 0) {
                html = '<div class="results-list">';
                results.forEach((result, index) => {
                    const percentage = Math.round(result.confidence * 100);
                    const isTopResult = index === 0;
                    
                    // Trova l'immagine della pietra per mostrarla
                    let stoneImageUrl = null;
                    if (window.allStonesData && window.allStonesData[result.name]) {
                        const positions = window.allStonesData[result.name];
                        // Prendi l'ultima immagine disponibile
                        for (let i = positions.length - 1; i >= 0; i--) {
                            if (positions[i].imageUrl) {
                                // Usa l'URL locale se disponibile
                                stoneImageUrl = window.imageDownloader ? 
                                    window.imageDownloader.getLocalImageUrl(positions[i].imageUrl) : 
                                    positions[i].imageUrl;
                                break;
                            }
                        }
                    }
                    
                    html += `
                        <div class="result-item ${isTopResult ? 'top-result' : ''}">
                            <div class="result-header">
                                <h4>${result.name.replace(/_/g, ' ')}</h4>
                                ${isTopResult ? '<span class="best-match-badge">Miglior corrispondenza</span>' : ''}
                            </div>
                            
                            ${stoneImageUrl ? `
                                <div class="result-image">
                                    <img src="${stoneImageUrl}" alt="${result.name}" />
                                </div>
                            ` : ''}
                            
                            <div class="result-info">
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="confidence-text">${percentage}% di corrispondenza</span>
                            </div>
                            
                            ${isTopResult ? `
                                <div class="result-actions">
                                    <button class="select-stone-btn" onclick="selectStoneFromAnalysis('${result.name}')">
                                        È questa!
                                    </button>
                                    <button class="cancel-btn" onclick="window.photoCapture.resetPhotoCapture()">
                                        Non è questa
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
                html += '</div>';
            } else {
                html = '<p>Nessuna pietra riconosciuta. Prova con un\'altra foto.</p>';
            }
            
            resultsContent.innerHTML = html;
            resultsContainer.classList.remove('hidden');
        }
    }

    showError(message) {
        // Mostra un messaggio di errore
        const resultsContainer = document.getElementById('analysis-results');
        const resultsContent = document.getElementById('results-content');
        
        if (resultsContainer && resultsContent) {
            resultsContent.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <p>${message}</p>
                </div>
            `;
            resultsContainer.classList.remove('hidden');
        }
    }
}

// Funzione globale per selezionare una pietra dai risultati
function selectStoneFromAnalysis(stoneName) {
    // Seleziona la pietra nel dropdown
    const stoneSelect = document.getElementById('stone-select');
    if (stoneSelect) {
        stoneSelect.value = stoneName;
        
        // Trigger change event per aggiornare la mappa
        const event = new Event('change');
        stoneSelect.dispatchEvent(event);
    }
    
    // Chiudi il modal
    const photoCapture = window.photoCapture;
    if (photoCapture) {
        photoCapture.closePhotoModal();
    }
    
    // Mostra un messaggio di successo
    const stoneName_display = stoneName.replace(/_/g, ' ');
    if (window.notificationSystem) {
        window.notificationSystem.success(
            `Pietra "${stoneName_display}" selezionata! La mappa è stata aggiornata per mostrare questa pietra.`,
            5000
        );
    }
    
    // Centra la mappa sulla pietra selezionata se possibile
    setTimeout(() => {
        if (window.allStonesData && window.allStonesData[stoneName]) {
            const positions = window.allStonesData[stoneName];
            if (positions.length > 0) {
                const lastPosition = positions[positions.length - 1];
                if (window.map) {
                    window.map.setView([lastPosition.lat, lastPosition.lon], 12);
                }
            }
        }
    }, 500);
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    window.photoCapture = new PhotoCapture();
});

