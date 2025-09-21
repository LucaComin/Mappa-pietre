// system-initializer.js - Sistema di inizializzazione robusto per il riconoscimento immagini

class SystemInitializer {
    constructor() {
        this.isOpenCvLoaded = false;
        this.isImageRecognitionReady = false;
        this.isDataLoaded = false;
        this.initializationPromise = null;
        this.callbacks = [];
        
        // Bind methods
        this.onSystemReady = this.onSystemReady.bind(this);
        this.checkSystemStatus = this.checkSystemStatus.bind(this);
    }

    // Metodo principale per inizializzare tutto il sistema
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._performInitialization();
        return this.initializationPromise;
    }

    async _performInitialization() {
        console.log('🚀 Avvio inizializzazione sistema...');
        
        try {
            // Step 1: Carica OpenCV.js
            await this.loadOpenCV();
            console.log('✅ OpenCV.js caricato');
            
            // Step 2: Aspetta che i dati delle pietre siano disponibili
            await this.waitForStoneData();
            console.log('✅ Dati pietre caricati');
            
            // Step 3: Inizializza il sistema di riconoscimento
            await this.initializeImageRecognition();
            console.log('✅ Sistema riconoscimento inizializzato');
            
            // Step 4: Inizializza PhotoCapture
            this.initializePhotoCapture();
            console.log('✅ PhotoCapture inizializzato');
            
            console.log('🎉 Sistema completamente inizializzato!');
            this.notifyCallbacks();
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore durante l\'inizializzazione:', error);
            throw error;
        }
    }

    // Carica OpenCV.js con retry automatico
    loadOpenCV() {
        return new Promise((resolve, reject) => {
            // Controlla se OpenCV è già caricato
            if (typeof cv !== 'undefined' && cv.Mat) {
                this.isOpenCvLoaded = true;
                resolve();
                return;
            }

            console.log('📦 Caricamento OpenCV.js...');
            
            const script = document.createElement('script');
            script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
            script.type = 'text/javascript';
            script.async = true;
            
            let retryCount = 0;
            const maxRetries = 3;
            
            const attemptLoad = () => {
                script.onload = () => {
                    // Aspetta che OpenCV sia completamente inizializzato
                    const checkOpenCV = () => {
                        if (typeof cv !== 'undefined' && cv.Mat) {
                            this.isOpenCvLoaded = true;
                            resolve();
                        } else {
                            setTimeout(checkOpenCV, 100);
                        }
                    };
                    checkOpenCV();
                };
                
                script.onerror = (error) => {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        console.warn(`⚠️ Tentativo ${retryCount} fallito, riprovo...`);
                        setTimeout(() => {
                            document.head.removeChild(script);
                            const newScript = script.cloneNode();
                            newScript.onload = script.onload;
                            newScript.onerror = script.onerror;
                            document.head.appendChild(newScript);
                        }, 1000);
                    } else {
                        console.error('❌ Impossibile caricare OpenCV.js dopo', maxRetries, 'tentativi');
                        reject(error);
                    }
                };
                
                document.head.appendChild(script);
            };
            
            attemptLoad();
        });
    }

    // Aspetta che i dati delle pietre siano disponibili
    waitForStoneData() {
        return new Promise((resolve) => {
            const checkData = () => {
                if (window.allStonesData && Object.keys(window.allStonesData).length > 0) {
                    this.isDataLoaded = true;
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }

    // Inizializza il sistema di riconoscimento immagini
    async initializeImageRecognition() {
        if (!this.isOpenCvLoaded) {
            throw new Error('OpenCV non è caricato');
        }

        if (!this.isDataLoaded) {
            throw new Error('Dati pietre non disponibili');
        }

        // Crea l'istanza del riconoscimento immagini
        if (window.ImageRecognition) {
            window.imageRecognition = new window.ImageRecognition();
            
            // Inizializza con retry
            let attempts = 0;
            const maxAttempts = 5;
            
            while (attempts < maxAttempts) {
                try {
                    const success = window.imageRecognition.initialize();
                    if (success && window.imageRecognition.isOpenCvReady) {
                        this.isImageRecognitionReady = true;
                        return;
                    }
                } catch (error) {
                    console.warn(`Tentativo ${attempts + 1} fallito:`, error);
                }
                
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            throw new Error('Impossibile inizializzare il sistema di riconoscimento dopo ' + maxAttempts + ' tentativi');
        } else {
            throw new Error('Classe ImageRecognition non trovata');
        }
    }

    // Inizializza PhotoCapture
    initializePhotoCapture() {
        if (window.PhotoCapture) {
            window.photoCapture = new window.PhotoCapture();
        } else {
            console.warn('⚠️ Classe PhotoCapture non trovata');
        }
    }

    // Controlla lo stato del sistema
    checkSystemStatus() {
        return {
            openCvLoaded: this.isOpenCvLoaded,
            imageRecognitionReady: this.isImageRecognitionReady,
            dataLoaded: this.isDataLoaded,
            fullyReady: this.isOpenCvLoaded && this.isImageRecognitionReady && this.isDataLoaded
        };
    }

    // Registra callback da chiamare quando il sistema è pronto
    onSystemReady(callback) {
        if (this.isImageRecognitionReady) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    }

    // Notifica tutti i callback registrati
    notifyCallbacks() {
        this.callbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Errore nel callback:', error);
            }
        });
        this.callbacks = [];
    }

    // Metodo per forzare la reinizializzazione
    async reinitialize() {
        console.log('🔄 Reinizializzazione del sistema...');
        this.isOpenCvLoaded = false;
        this.isImageRecognitionReady = false;
        this.isDataLoaded = false;
        this.initializationPromise = null;
        
        return this.initialize();
    }
}

// Crea l'istanza globale
window.systemInitializer = new SystemInitializer();

// Avvia l'inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.systemInitializer.initialize().catch(error => {
            console.error('Errore nell\'inizializzazione del sistema:', error);
        });
    });
} else {
    // Il DOM è già pronto
    window.systemInitializer.initialize().catch(error => {
        console.error('Errore nell\'inizializzazione del sistema:', error);
    });
}

// Esporta per uso globale
window.SystemInitializer = SystemInitializer;
