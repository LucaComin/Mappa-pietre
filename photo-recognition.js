// ===== SISTEMA DI RICONOSCIMENTO FOTOGRAFICO =====

class PhotoRecognitionSystem {
    constructor() {
        this.isInitialized = false;
        this.currentStream = null;
        this.userImage = null;
        this.stoneDatabase = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Pulsante principale "Trova la mia pietra"
        document.getElementById('find-stone-btn').addEventListener('click', () => {
            this.openPhotoModal();
        });

        // Chiusura modal
        document.getElementById('close-photo-modal').addEventListener('click', () => {
            this.closePhotoModal();
        });

        document.getElementById('close-results-modal').addEventListener('click', () => {
            this.closeResultsModal();
        });

        // Opzioni foto
        document.getElementById('camera-btn').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('gallery-btn').addEventListener('click', () => {
            this.openGallery();
        });

        // Controlli fotocamera
        document.getElementById('capture-btn').addEventListener('click', () => {
            this.capturePhoto();
        });

        document.getElementById('cancel-camera-btn').addEventListener('click', () => {
            this.cancelCamera();
        });

        // Controlli anteprima
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.analyzeImage();
        });

        document.getElementById('retake-btn').addEventListener('click', () => {
            this.retakePhoto();
        });

        // File input
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        // Risultati
        document.getElementById('confirm-match-btn').addEventListener('click', () => {
            this.confirmMatch();
        });

        document.getElementById('cancel-match-btn').addEventListener('click', () => {
            this.closeResultsModal();
        });

        // Chiusura con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // ===== GESTIONE MODAL =====

    openPhotoModal() {
        document.getElementById('photo-capture-modal').classList.remove('hidden');
        this.resetModalState();
    }

    closePhotoModal() {
        document.getElementById('photo-capture-modal').classList.add('hidden');
        this.stopCamera();
        this.resetModalState();
    }

    closeResultsModal() {
        document.getElementById('analysis-loading').classList.add('hidden');
        document.getElementById('results-modal').classList.add('hidden');
    }

    closeAllModals() {
        this.closePhotoModal();
        this.closeResultsModal();
    }

    resetModalState() {
        // Nascondi tutti i container
        document.getElementById('camera-container').classList.add('hidden');
        document.getElementById('image-preview-container').classList.add('hidden');
        
        // Mostra le opzioni iniziali
        document.querySelector('.photo-options').classList.remove('hidden');
        
        // Reset immagini
        this.userImage = null;
        document.getElementById('preview-image').src = '';
    }

    // ===== GESTIONE FOTOCAMERA =====

    async startCamera() {
        try {
            // Nascondi opzioni e mostra container fotocamera
            document.querySelector('.photo-options').classList.add('hidden');
            document.getElementById('camera-container').classList.remove('hidden');

            // Richiedi accesso alla fotocamera
            this.currentStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Fotocamera posteriore su mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            const video = document.getElementById('camera-video');
            video.srcObject = this.currentStream;
            
        } catch (error) {
            console.error('Errore accesso fotocamera:', error);
            alert('Impossibile accedere alla fotocamera. Prova a selezionare un\'immagine dalla galleria.');
            this.resetModalState();
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const context = canvas.getContext('2d');

        // Imposta dimensioni canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Cattura frame dal video
        context.drawImage(video, 0, 0);

        // Converti in blob
        canvas.toBlob((blob) => {
            this.userImage = blob;
            this.showImagePreview(URL.createObjectURL(blob));
            this.stopCamera();
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
    }

    // ===== GESTIONE GALLERIA =====

    openGallery() {
        document.getElementById('file-input').click();
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.userImage = file;
            this.showImagePreview(URL.createObjectURL(file));
        }
    }

    // ===== ANTEPRIMA IMMAGINE =====

    showImagePreview(imageUrl) {
        // Nascondi opzioni e fotocamera
        document.querySelector('.photo-options').classList.add('hidden');
        document.getElementById('camera-container').classList.add('hidden');
        
        // Mostra anteprima
        document.getElementById('image-preview-container').classList.remove('hidden');
        document.getElementById('preview-image').src = imageUrl;
    }

    retakePhoto() {
        this.resetModalState();
    }

    // ===== ANALISI IMMAGINE =====

    async analyzeImage() {
        if (!this.userImage) {
            alert('Nessuna immagine da analizzare');
            return;
        }

        // Mostra loading
        this.closePhotoModal();
        document.getElementById('analysis-loading').classList.remove('hidden');

        try {
            // Prepara database se non già fatto
            await this.prepareStoneDatabase();

            // Analizza l'immagine dell'utente
            const userFeatures = await this.extractImageFeatures(this.userImage);

            // Trova la migliore corrispondenza
            const bestMatch = await this.findBestMatch(userFeatures);

            // Mostra risultati
            this.showResults(bestMatch);

        } catch (error) {
            console.error('Errore durante l\'analisi:', error);
            alert('Errore durante l\'analisi dell\'immagine. Riprova.');
            document.getElementById('analysis-loading').classList.add('hidden');
        }
    }

    async prepareStoneDatabase() {
        if (this.stoneDatabase.length > 0) return;

        console.log('Preparazione database pietre...');
        
        // Raccogli tutte le immagini dalle pietre
        for (const stoneName in allStonesData) {
            const stoneData = allStonesData[stoneName];
            
            for (const position of stoneData) {
                if (position.imageUrl) {
                    try {
                        const features = await this.extractImageFeaturesFromUrl(position.imageUrl);
                        this.stoneDatabase.push({
                            stoneName: stoneName,
                            imageUrl: position.imageUrl,
                            features: features,
                            position: position
                        });
                    } catch (error) {
                        console.warn(`Errore caricamento immagine ${position.imageUrl}:`, error);
                    }
                }
            }
        }
        
        console.log(`Database preparato con ${this.stoneDatabase.length} immagini`);
    }

    async extractImageFeatures(imageBlob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const features = this.calculateImageFeatures(img);
                    resolve(features);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(imageBlob);
        });
    }

    async extractImageFeaturesFromUrl(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const features = this.calculateImageFeatures(img);
                    resolve(features);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    calculateImageFeatures(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Ridimensiona a dimensione standard per confronto
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        
        // Disegna immagine ridimensionata
        ctx.drawImage(img, 0, 0, size, size);
        
        // Ottieni dati pixel
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Calcola caratteristiche
        const features = {
            colorHistogram: this.calculateColorHistogram(data),
            brightnessHistogram: this.calculateBrightnessHistogram(data),
            edgeIntensity: this.calculateEdgeIntensity(data, size),
            colorMoments: this.calculateColorMoments(data),
            dominantColors: this.calculateDominantColors(data)
        };
        
        return features;
    }

    calculateColorHistogram(data) {
        const histogram = {
            red: new Array(256).fill(0),
            green: new Array(256).fill(0),
            blue: new Array(256).fill(0)
        };
        
        for (let i = 0; i < data.length; i += 4) {
            histogram.red[data[i]]++;
            histogram.green[data[i + 1]]++;
            histogram.blue[data[i + 2]]++;
        }
        
        return histogram;
    }

    calculateBrightnessHistogram(data) {
        const histogram = new Array(256).fill(0);
        
        for (let i = 0; i < data.length; i += 4) {
            const brightness = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            histogram[brightness]++;
        }
        
        return histogram;
    }

    calculateEdgeIntensity(data, size) {
        // Semplificato: calcola la varianza dei pixel adiacenti
        let edgeSum = 0;
        let count = 0;
        
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                const idx = (y * size + x) * 4;
                const current = data[idx];
                const right = data[idx + 4];
                const down = data[(y + 1) * size * 4 + x * 4];
                
                edgeSum += Math.abs(current - right) + Math.abs(current - down);
                count += 2;
            }
        }
        
        return edgeSum / count;
    }

    calculateColorMoments(data) {
        let rSum = 0, gSum = 0, bSum = 0;
        let rSum2 = 0, gSum2 = 0, bSum2 = 0;
        const pixelCount = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
            rSum += data[i];
            gSum += data[i + 1];
            bSum += data[i + 2];
            rSum2 += data[i] * data[i];
            gSum2 += data[i + 1] * data[i + 1];
            bSum2 += data[i + 2] * data[i + 2];
        }
        
        const rMean = rSum / pixelCount;
        const gMean = gSum / pixelCount;
        const bMean = bSum / pixelCount;
        
        return {
            mean: { r: rMean, g: gMean, b: bMean },
            variance: {
                r: (rSum2 / pixelCount) - (rMean * rMean),
                g: (gSum2 / pixelCount) - (gMean * gMean),
                b: (bSum2 / pixelCount) - (bMean * bMean)
            }
        };
    }

    calculateDominantColors(data) {
        const colorMap = new Map();
        
        // Raggruppa colori simili (riduce precisione per raggruppamento)
        for (let i = 0; i < data.length; i += 4) {
            const r = Math.floor(data[i] / 32) * 32;
            const g = Math.floor(data[i + 1] / 32) * 32;
            const b = Math.floor(data[i + 2] / 32) * 32;
            const key = `${r},${g},${b}`;
            
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }
        
        // Trova i 5 colori più dominanti
        const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([color, count]) => {
                const [r, g, b] = color.split(',').map(Number);
                return { r, g, b, count };
            });
        
        return sortedColors;
    }

    async findBestMatch(userFeatures) {
        let bestMatch = null;
        let bestScore = -1;
        
        for (const stoneEntry of this.stoneDatabase) {
            const score = this.calculateSimilarityScore(userFeatures, stoneEntry.features);
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    ...stoneEntry,
                    similarityScore: score
                };
            }
        }
        
        return bestMatch;
    }

    calculateSimilarityScore(features1, features2) {
        // Pesi per diverse caratteristiche
        const weights = {
            colorHistogram: 0.3,
            brightnessHistogram: 0.2,
            edgeIntensity: 0.15,
            colorMoments: 0.2,
            dominantColors: 0.15
        };
        
        let totalScore = 0;
        
        // Confronto istogrammi colore
        const colorScore = this.compareColorHistograms(features1.colorHistogram, features2.colorHistogram);
        totalScore += colorScore * weights.colorHistogram;
        
        // Confronto istogramma luminosità
        const brightnessScore = this.compareHistograms(features1.brightnessHistogram, features2.brightnessHistogram);
        totalScore += brightnessScore * weights.brightnessHistogram;
        
        // Confronto intensità bordi
        const edgeScore = 1 - Math.abs(features1.edgeIntensity - features2.edgeIntensity) / 255;
        totalScore += Math.max(0, edgeScore) * weights.edgeIntensity;
        
        // Confronto momenti colore
        const momentsScore = this.compareColorMoments(features1.colorMoments, features2.colorMoments);
        totalScore += momentsScore * weights.colorMoments;
        
        // Confronto colori dominanti
        const dominantScore = this.compareDominantColors(features1.dominantColors, features2.dominantColors);
        totalScore += dominantScore * weights.dominantColors;
        
        return totalScore;
    }

    compareColorHistograms(hist1, hist2) {
        const channels = ['red', 'green', 'blue'];
        let totalScore = 0;
        
        for (const channel of channels) {
            totalScore += this.compareHistograms(hist1[channel], hist2[channel]);
        }
        
        return totalScore / channels.length;
    }

    compareHistograms(hist1, hist2) {
        // Normalizza istogrammi
        const sum1 = hist1.reduce((a, b) => a + b, 0);
        const sum2 = hist2.reduce((a, b) => a + b, 0);
        
        if (sum1 === 0 || sum2 === 0) return 0;
        
        const norm1 = hist1.map(x => x / sum1);
        const norm2 = hist2.map(x => x / sum2);
        
        // Calcola intersezione
        let intersection = 0;
        for (let i = 0; i < norm1.length; i++) {
            intersection += Math.min(norm1[i], norm2[i]);
        }
        
        return intersection;
    }

    compareColorMoments(moments1, moments2) {
        const meanDiff = Math.sqrt(
            Math.pow(moments1.mean.r - moments2.mean.r, 2) +
            Math.pow(moments1.mean.g - moments2.mean.g, 2) +
            Math.pow(moments1.mean.b - moments2.mean.b, 2)
        ) / (255 * Math.sqrt(3));
        
        const varDiff = Math.sqrt(
            Math.pow(moments1.variance.r - moments2.variance.r, 2) +
            Math.pow(moments1.variance.g - moments2.variance.g, 2) +
            Math.pow(moments1.variance.b - moments2.variance.b, 2)
        ) / (255 * 255 * Math.sqrt(3));
        
        return Math.max(0, 1 - (meanDiff + varDiff) / 2);
    }

    compareDominantColors(colors1, colors2) {
        let totalScore = 0;
        let comparisons = 0;
        
        for (const color1 of colors1) {
            let bestMatch = 0;
            for (const color2 of colors2) {
                const distance = Math.sqrt(
                    Math.pow(color1.r - color2.r, 2) +
                    Math.pow(color1.g - color2.g, 2) +
                    Math.pow(color1.b - color2.b, 2)
                ) / (255 * Math.sqrt(3));
                
                const similarity = Math.max(0, 1 - distance);
                bestMatch = Math.max(bestMatch, similarity);
            }
            totalScore += bestMatch;
            comparisons++;
        }
        
        return comparisons > 0 ? totalScore / comparisons : 0;
    }

    // ===== VISUALIZZAZIONE RISULTATI =====

    showResults(bestMatch) {
        document.getElementById('analysis-loading').classList.add('hidden');
        
        if (!bestMatch) {
            alert('Nessuna corrispondenza trovata. Riprova con un\'immagine diversa.');
            return;
        }
        
        // Popola modal risultati
        document.getElementById('user-image').src = URL.createObjectURL(this.userImage);
        document.getElementById('found-stone-image').src = bestMatch.imageUrl;
        document.getElementById('found-stone-name').textContent = bestMatch.stoneName;
        
        const percentage = Math.round(bestMatch.similarityScore * 100);
        document.getElementById('similarity-score').textContent = `Similarità: ${percentage}%`;
        
        // Salva risultato per conferma
        this.currentMatch = bestMatch;
        
        // Mostra modal
        document.getElementById('results-modal').classList.remove('hidden');
    }

    confirmMatch() {
        if (!this.currentMatch) return;
        
        // Usa la funzione selectStone per selezionare la pietra
        if (typeof selectStone === 'function') {
            selectStone(this.currentMatch.stoneName);
        } else {
            // Fallback al metodo originale
            const stoneSelect = document.getElementById('stone-select');
            stoneSelect.value = this.currentMatch.stoneName;
            stoneSelect.dispatchEvent(new Event('change'));
        }
        
        // Chiudi modal
        this.closeResultsModal();
        
        // Opzionale: apri pannello storia dopo un breve delay
        setTimeout(() => {
            if (typeof showStoneHistory === 'function') {
                showStoneHistory(this.currentMatch.stoneName);
            }
        }, 1000);
    }
}

// Inizializza il sistema quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aspetta che il sistema principale sia caricato
    setTimeout(() => {
        if (typeof allStonesData !== 'undefined') {
            window.photoRecognition = new PhotoRecognitionSystem();
            console.log('Sistema di riconoscimento fotografico inizializzato');
        } else {
            console.warn('Dati pietre non ancora caricati, riprovo...');
            setTimeout(() => {
                window.photoRecognition = new PhotoRecognitionSystem();
            }, 2000);
        }
    }, 1000);
});

