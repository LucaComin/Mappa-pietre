// ===== SISTEMA DI CATTURA FOTO MIGLIORATO =====

class PhotoCapture {
    constructor() {
        this.currentStream = null;
        this.currentImageBlob = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('PhotoCapture inizializzato');
    }

    setupEventListeners() {
        // Pulsante principale "Trova la mia pietra"
        const findStoneBtn = document.getElementById('find-stone-btn');
        if (findStoneBtn) {
            findStoneBtn.addEventListener('click', () => {
                this.openPhotoModal();
            });
        }

        // Chiusura modal
        const closeBtn = document.getElementById('close-photo-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closePhotoModal();
            });
        }

        // Opzioni foto
        const cameraBtn = document.getElementById('camera-btn');
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                this.startCamera();
            });
        }

        const galleryBtn = document.getElementById('gallery-btn');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', () => {
                this.openGallery();
            });
        }

        // Controlli fotocamera
        const captureBtn = document.getElementById('capture-btn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                this.capturePhoto();
            });
        }

        const cancelCameraBtn = document.getElementById('cancel-camera-btn');
        if (cancelCameraBtn) {
            cancelCameraBtn.addEventListener('click', () => {
                this.cancelCamera();
            });
        }

        // Controlli anteprima
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.analyzePhoto();
            });
        }

        const retakeBtn = document.getElementById('retake-btn');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => {
                this.retakePhoto();
            });
        }

        // File input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        }

        // Chiusura con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePhotoModal();
            }
        });
    }

    // ===== GESTIONE MODAL =====

    openPhotoModal() {
        const modal = document.getElementById('photo-capture-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.resetModalState();
        }
    }

    closePhotoModal() {
        const modal = document.getElementById('photo-capture-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetModalState();
            this.stopCamera();
        }
    }

    resetModalState() {
        // Nascondi tutti i container
        const cameraContainer = document.getElementById('camera-container');
        const previewContainer = document.getElementById('image-preview-container');
        const resultsContainer = document.getElementById('analysis-results');
        const photoOptions = document.querySelector('.photo-options');

        if (cameraContainer) cameraContainer.classList.add('hidden');
        if (previewContainer) previewContainer.classList.add('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');
        if (photoOptions) photoOptions.classList.remove('hidden');

        // Reset immagini
        this.currentImageBlob = null;
        const previewImage = document.getElementById('preview-image');
        if (previewImage) {
            previewImage.src = '';
        }
    }

    // ===== GESTIONE FOTOCAMERA =====

    async startCamera() {
        try {
            // Nascondi opzioni e mostra container fotocamera
            const photoOptions = document.querySelector('.photo-options');
            const cameraContainer = document.getElementById('camera-container');
            
            if (photoOptions) photoOptions.classList.add('hidden');
            if (cameraContainer) cameraContainer.classList.remove('hidden');

            // Richiedi accesso alla fotocamera
            this.currentStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Fotocamera posteriore su mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            const video = document.getElementById('camera-video');
            if (video) {
                video.srcObject = this.currentStream;
                video.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Errore accesso fotocamera:', error);
            
            let errorMessage = 'Impossibile accedere alla fotocamera.';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Accesso alla fotocamera negato. Abilita i permessi e riprova.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Nessuna fotocamera trovata sul dispositivo.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Fotocamera non supportata dal browser.';
            }
            
            if (window.notificationSystem) {
                window.notificationSystem.error(errorMessage, 5000);
            } else {
                alert(errorMessage + ' Prova a selezionare un\'immagine dalla galleria.');
            }
            
            this.resetModalState();
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        
        if (!video || !canvas) {
            console.error('Elementi video o canvas non trovati');
            return;
        }

        const context = canvas.getContext('2d');

        // Imposta dimensioni canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Cattura frame dal video
        context.drawImage(video, 0, 0);

        // Converti in blob
        canvas.toBlob((blob) => {
            if (blob) {
                this.currentImageBlob = blob;
                this.showImagePreview(URL.createObjectURL(blob));
                this.stopCamera();
            } else {
                console.error('Errore nella creazione del blob dall\'immagine');
                if (window.notificationSystem) {
                    window.notificationSystem.error('Errore nella cattura dell\'immagine', 3000);
                }
            }
        }, 'image/jpeg', 0.8);
    }

    cancelCamera() {
        this.stopCamera();
        this.resetModalState();
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

    // ===== GESTIONE GALLERIA =====

    openGallery() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // Verifica dimensione file (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                if (window.notificationSystem) {
                    window.notificationSystem.error('File troppo grande. Seleziona un\'immagine più piccola (max 10MB).', 5000);
                } else {
                    alert('File troppo grande. Seleziona un\'immagine più piccola (max 10MB).');
                }
                return;
            }
            
            this.currentImageBlob = file;
            this.showImagePreview(URL.createObjectURL(file));
        } else {
            if (window.notificationSystem) {
                window.notificationSystem.error('Seleziona un file immagine valido.', 3000);
            } else {
                alert('Seleziona un file immagine valido.');
            }
        }
    }

    // ===== ANTEPRIMA IMMAGINE =====

    showImagePreview(imageUrl) {
        // Nascondi opzioni e fotocamera
        const photoOptions = document.querySelector('.photo-options');
        const cameraContainer = document.getElementById('camera-container');
        const previewContainer = document.getElementById('image-preview-container');
        const previewImage = document.getElementById('preview-image');
        
        if (photoOptions) photoOptions.classList.add('hidden');
        if (cameraContainer) cameraContainer.classList.add('hidden');
        if (previewContainer) previewContainer.classList.remove('hidden');
        if (previewImage) previewImage.src = imageUrl;
    }

    retakePhoto() {
        this.resetModalState();
    }

    // ===== ANALISI IMMAGINE =====

    async analyzePhoto() {
        if (!this.currentImageBlob) {
            this.showError('Nessuna foto da analizzare', '📷');
            return;
        }

        // Mostra loading
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<span class="btn-icon">⏳</span> Analizzando...';
            analyzeBtn.disabled = true;
        }

        try {
            await this.performImageAnalysis(this.currentImageBlob);
            
        } catch (error) {
            console.error('Errore nell\'analisi:', error);
            this.handleAnalysisError(error);
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
            // Mostra un indicatore di caricamento
            this.showLoadingState();
            
            // Verifica stato connessione Gradio
            const connectionStatus = window.checkGradioConnection ? window.checkGradioConnection() : null;
            
            if (!connectionStatus || !connectionStatus.isConnected) {
                const errorType = connectionStatus?.error?.type || 'GRADIO_NOT_INITIALIZED';
                throw new Error(errorType);
            }

            // Converti il Blob in File per l'invio via API
            const file = new File([imageBlob], \"image.jpeg\", { type: \"image/jpeg\" });

            // Test di connettività al servizio con timeout
            try {
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(\"TIMEOUT\")), 30000)
                );
                
                const response = await Promise.race([
                    window.gradioClient.predict(\"/predict\", [file]),
                    timeoutPromise
                ]);

                // Verifica la risposta
                if (!response || !response.data || !response.data[0]) {
                    throw new Error(\"INVALID_RESPONSE\");
                }

                const results = response.data[0]; 

                if (!results || results.length === 0) {
                    throw new Error(\"NO_STONES_DETECTED\");
                }
                
                // Formatta i risultati
                const formattedResults = results.map(item => ({
                    name: item.label.replace(/ /g, '_'),
                    confidence: item.confidences
                }));
                
                this.showAnalysisResults(formattedResults);
                
            } catch (networkError) {
                console.error('Errore di rete nell\'analisi:', networkError);
                
                if (networkError.message === \"TIMEOUT\") {
                    throw new Error(\"SERVICE_TIMEOUT\");
                } else if (networkError.name === \"TypeError\" || networkError.message.includes(\"fetch\")) {
                    throw new Error(\"SERVICE_UNREACHABLE\");
                } else if (networkError.message === \"INVALID_RESPONSE\") {
                    throw new Error(\"SERVICE_ERROR\");
                } else {
                    throw new Error(\"SERVICE_ERROR\");
                }
            }
            
        } catch (error) {
            console.error(\"Errore nell'analisi con Gradio:\", error);
            this.hideLoadingState();
            throw error; // Rilancia l'errore per la gestione nel chiamante
        }
    }

    handleAnalysisError(error) {
        this.hideLoadingState();
        
        // Ottieni informazioni dettagliate sull'errore
        const errorInfo = window.getDetailedErrorMessage ? 
            window.getDetailedErrorMessage(error.message) : 
            {
                icon: '❌',
                title: 'Errore durante l\'analisi',
                message: 'Si è verificato un errore imprevisto.',
                suggestion: 'Riprova o contatta il supporto se il problema persiste.'
            };
        
        this.showDetailedError(errorInfo);
        
        // Log per debugging
        console.error('Dettagli errore analisi:', {
            errorType: error.message,
            errorInfo: errorInfo,
            gradioStatus: window.checkGradioConnection ? window.checkGradioConnection() : 'N/A'
        });
    }

    showAnalysisResults(results) {
        const resultsContainer = document.getElementById('analysis-results');
        
        if (!resultsContainer) {
            console.error('Container risultati non trovato');
            return;
        }
        
        let html = '';
        
        if (results.length > 0) {
            html = '<div class=\"results-list\">';
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
                            stoneImageUrl = window.imageDownloader ? 
                                window.imageDownloader.getLocalImageUrl(positions[i].imageUrl) : 
                                positions[i].imageUrl;
                            break;
                        }
                    }
                }
                
                html += `
                    <div class=\"result-item ${isTopResult ? 'top-result' : ''}\">
                        <div class=\"result-header\">
                            <h4>${result.name.replace(/_/g, ' ')}</h4>
                            ${isTopResult ? '<span class=\"best-match-badge\">Miglior corrispondenza</span>' : ''}
                        </div>
                        
                        ${stoneImageUrl ? `
                            <div class=\"result-image\">
                                <img src=\"${stoneImageUrl}\" alt=\"${result.name}\" />
                            </div>
                        ` : ''}
                        
                        <div class=\"result-info\">
                            <div class=\"confidence-bar\">
                                <div class=\"confidence-fill\" style=\"width: ${percentage}%\"></div>
                            </div>
                            <div class=\"confidence-text\">${percentage}% di corrispondenza</div>
                            
                            <button class=\"select-stone-btn\" onclick=\"selectStoneFromAnalysis('${result.name}')\">
                                <span class=\"btn-icon\">✅</span>
                                Seleziona questa pietra
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html = `
                <div class=\"no-results\">
                    <div class=\"no-results-icon\">🔍</div>
                    <h3>Nessuna corrispondenza trovata</h3>
                    <p>Non sono state riconosciute pietre nell'immagine fornita.</p>
                    <button class=\"retry-btn\" onclick=\"document.getElementById('retake-btn').click()\">
                        <span class=\"btn-icon\">🔄</span>
                        Prova con un'altra foto
                    </button>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = html;
        resultsContainer.classList.remove('hidden');
    }

    showLoadingState() {
        const resultsContainer = document.getElementById('analysis-results');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `
                <div class=\"loading-state\">
                    <div class=\"loading-spinner\"></div>
                    <h3>Analisi in corso...</h3>
                    <p>Il servizio sta analizzando la tua immagine. Questo potrebbe richiedere alcuni secondi.</p>
                    <div class=\"loading-progress\">
                        <div class=\"progress-bar\">
                            <div class=\"progress-fill\"></div>
                        </div>
                        <p class=\"progress-text\">Elaborazione dell'immagine...</p>
                    </div>
                </div>
            `;
        }
    }

    hideLoadingState() {
        const loadingState = document.querySelector('.loading-state');
        if (loadingState) {
            loadingState.remove();
        }
    }

    showError(message, icon = \"⚠️\") {
        const resultsContainer = document.getElementById('analysis-results');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `
                <div class=\"error-message\">
                    <div class=\"error-icon\">${icon}</div>
                    <div class=\"error-content\">
                        <h3>Errore durante l'analisi</h3>
                        <p>${message}</p>
                        <button class=\"retry-btn\" onclick=\"document.getElementById('close-photo-modal').click()\">
                            <span class=\"btn-icon\">🔄</span>
                            Riprova
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showDetailedError(errorInfo) {
        const resultsContainer = document.getElementById('analysis-results');
        if (resultsContainer) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `
                <div class=\"detailed-error-message\">
                    <div class=\"error-icon\">${errorInfo.icon}</div>
                    <div class=\"error-content\">
                        <h3>${errorInfo.title}</h3>
                        <p class=\"error-main-message\">${errorInfo.message}</p>
                        <div class=\"error-suggestion\">
                            <strong>Suggerimento:</strong> ${errorInfo.suggestion}
                        </div>
                        <div class=\"error-actions\">
                            <button class=\"retry-btn\" onclick=\"this.closest('.modal').querySelector('#retake-btn').click()\">
                                <span class=\"btn-icon\">🔄</span>
                                Prova con un'altra foto
                            </button>
                            <button class=\"close-btn\" onclick=\"document.getElementById('close-photo-modal').click()\">
                                <span class=\"btn-icon\">❌</span>
                                Chiudi
                            </button>
                        </div>
                        <div class=\"error-details\">
                            <details>
                                <summary>Dettagli tecnici</summary>
                                <div class=\"technical-info\">
                                    <p><strong>Stato connessione:</strong> ${window.gradioConnectionStatus || 'Sconosciuto'}</p>
                                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            `;
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
            `Pietra \"${stoneName_display}\" selezionata! La mappa è stata aggiornata per mostrare questa pietra.`,
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
    // Aspetta che altri sistemi siano caricati
    setTimeout(() => {
        window.photoCapture = new PhotoCapture();
        console.log('Sistema di cattura foto migliorato inizializzato');
    }, 500);
});
