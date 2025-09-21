// image-recognition.js - Algoritmo di riconoscimento immagini con OpenCV.js

class ImageRecognition {
    constructor() {
        this.isOpenCvReady = false;
        this.stoneFeatures = new Map(); // Cache delle feature delle pietre
        this.orb = null;
        this.matcher = null;
        
        // Parametri per l'algoritmo ORB (simili al codice Python)
        this.SOGLIA_CORRISPONDENZA = 0.6;
        this.MIN_MATCH_COUNT = 10;
        this.RATIO_TEST_THRESHOLD = 0.75;
    }

    initialize() {
        if (typeof cv === 'undefined') {
            console.error('OpenCV.js non è ancora caricato');
            return false;
        }

        try {
            // Inizializza ORB detector
            this.orb = new cv.ORB(500); // 500 keypoints max
            
            // Inizializza BF Matcher con Hamming distance per ORB
            this.matcher = new cv.BFMatcher(cv.NORM_HAMMING, false);
            
            this.isOpenCvReady = true;
            console.log('ImageRecognition inizializzato con successo');
            
            // Pre-calcola le feature delle pietre esistenti
            this.precomputeStoneFeatures();
            
            return true;
        } catch (error) {
            console.error('Errore nell\'inizializzazione di ImageRecognition:', error);
            return false;
        }
    }

    async precomputeStoneFeatures() {
        if (!this.isOpenCvReady || !window.allStonesData) {
            return;
        }

        console.log('Pre-calcolo delle feature delle pietre...');
        
        for (const stoneName in window.allStonesData) {
            const positions = window.allStonesData[stoneName];
            
            for (const position of positions) {
                if (position.imageUrl) {
                    try {
                        const features = await this.extractFeaturesFromUrl(position.imageUrl);
                        if (features) {
                            const key = `${stoneName}_${position.timestamp}`;
                            this.stoneFeatures.set(key, {
                                stoneName: stoneName,
                                features: features,
                                imageUrl: position.imageUrl,
                                timestamp: position.timestamp
                            });
                        }
                    } catch (error) {
                        console.warn(`Errore nell'estrazione feature per ${stoneName}:`, error);
                    }
                }
            }
        }
        
        console.log(`Feature pre-calcolate per ${this.stoneFeatures.size} immagini`);
    }

    async extractFeaturesFromUrl(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    const features = this.extractFeaturesFromImage(img);
                    resolve(features);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error(`Impossibile caricare l'immagine: ${imageUrl}`));
            };
            
            // Usa l'URL locale se disponibile, altrimenti l'URL originale
            const urlToUse = window.imageDownloader ? 
                window.imageDownloader.getLocalImageUrl(imageUrl) : imageUrl;
            
            img.src = urlToUse;
        });
    }

    extractFeaturesFromImage(imageElement) {
        if (!this.isOpenCvReady) {
            throw new Error('OpenCV non è pronto');
        }

        let src = null;
        let gray = null;
        let keypoints = null;
        let descriptors = null;

        try {
            // Converti l'immagine in formato OpenCV
            src = cv.imread(imageElement);
            
            // Converti in scala di grigi
            gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            
            // Estrai keypoints e descriptors con ORB
            keypoints = new cv.KeyPointVector();
            descriptors = new cv.Mat();
            
            this.orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);
            
            // Verifica se abbiamo abbastanza keypoints
            if (keypoints.size() < this.MIN_MATCH_COUNT) {
                console.warn('Troppo pochi keypoints trovati:', keypoints.size());
                return null;
            }

            // Converti i descriptors in un formato utilizzabile
            const descriptorArray = [];
            for (let i = 0; i < descriptors.rows; i++) {
                const row = [];
                for (let j = 0; j < descriptors.cols; j++) {
                    row.push(descriptors.ucharPtr(i, j)[0]);
                }
                descriptorArray.push(row);
            }

            // Salva anche i keypoints
            const keypointArray = [];
            for (let i = 0; i < keypoints.size(); i++) {
                const kp = keypoints.get(i);
                keypointArray.push({
                    x: kp.pt.x,
                    y: kp.pt.y,
                    angle: kp.angle,
                    response: kp.response,
                    octave: kp.octave
                });
            }

            return {
                keypoints: keypointArray,
                descriptors: descriptorArray,
                imageSize: { width: src.cols, height: src.rows }
            };

        } catch (error) {
            console.error('Errore nell\'estrazione delle feature:', error);
            return null;
        } finally {
            // Pulisci la memoria
            if (src) src.delete();
            if (gray) gray.delete();
            if (keypoints) keypoints.delete();
            if (descriptors) descriptors.delete();
        }
    }

    async analyzeUserImage(imageBlob) {
        if (!this.isOpenCvReady) {
            throw new Error('OpenCV non è ancora pronto');
        }

        if (this.stoneFeatures.size === 0) {
            throw new Error('Nessuna feature delle pietre disponibile');
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = async () => {
                try {
                    // Estrai le feature dall'immagine dell'utente
                    const userFeatures = this.extractFeaturesFromImage(img);
                    
                    if (!userFeatures) {
                        reject(new Error('Impossibile estrarre feature dall\'immagine'));
                        return;
                    }

                    // Confronta con tutte le pietre
                    const results = await this.compareWithAllStones(userFeatures);
                    
                    // Raggruppa per nome pietra e prendi il miglior punteggio
                    const stoneScores = new Map();
                    
                    for (const result of results) {
                        const stoneName = result.stoneName;
                        if (!stoneScores.has(stoneName) || result.score > stoneScores.get(stoneName).score) {
                            stoneScores.set(stoneName, result);
                        }
                    }
                    
                    // Converti in array e ordina per punteggio
                    const finalResults = Array.from(stoneScores.values())
                        .filter(result => result.score >= this.SOGLIA_CORRISPONDENZA)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5); // Top 5 risultati
                    
                    resolve(finalResults.map(result => ({
                        name: result.stoneName,
                        confidence: result.score
                    })));
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => {
                reject(new Error('Impossibile caricare l\'immagine per l\'analisi'));
            };
            
            img.src = URL.createObjectURL(imageBlob);
        });
    }

    async compareWithAllStones(userFeatures) {
        const results = [];
        
        for (const [key, stoneData] of this.stoneFeatures) {
            try {
                const score = this.compareFeatures(userFeatures, stoneData.features);
                
                if (score > 0) {
                    results.push({
                        stoneName: stoneData.stoneName,
                        score: score,
                        imageUrl: stoneData.imageUrl,
                        timestamp: stoneData.timestamp
                    });
                }
            } catch (error) {
                console.warn(`Errore nel confronto con ${key}:`, error);
            }
        }
        
        return results;
    }

    compareFeatures(features1, features2) {
        if (!features1 || !features2 || 
            features1.descriptors.length < this.MIN_MATCH_COUNT || 
            features2.descriptors.length < this.MIN_MATCH_COUNT) {
            return 0;
        }

        try {
            // Converti i descriptors in formato OpenCV Mat
            const desc1 = cv.matFromArray(features1.descriptors.length, features1.descriptors[0].length, cv.CV_8UC1, 
                features1.descriptors.flat());
            const desc2 = cv.matFromArray(features2.descriptors.length, features2.descriptors[0].length, cv.CV_8UC1, 
                features2.descriptors.flat());

            // Esegui il matching
            const matches = new cv.DMatchVector();
            this.matcher.knnMatch(desc1, desc2, matches, 2);

            // Applica il ratio test di Lowe
            const goodMatches = [];
            for (let i = 0; i < matches.size(); i++) {
                const match = matches.get(i);
                if (match.size() >= 2) {
                    const m = match.get(0);
                    const n = match.get(1);
                    
                    if (m.distance < this.RATIO_TEST_THRESHOLD * n.distance) {
                        goodMatches.push(m);
                    }
                }
            }

            // Pulisci la memoria
            desc1.delete();
            desc2.delete();
            matches.delete();

            // Calcola il punteggio basato sul numero di buone corrispondenze
            if (goodMatches.length >= this.MIN_MATCH_COUNT) {
                // Normalizza il punteggio basandosi sul numero di keypoints
                const maxKeypoints = Math.max(features1.keypoints.length, features2.keypoints.length);
                const score = goodMatches.length / maxKeypoints;
                return Math.min(score, 1.0); // Cap a 1.0
            }

            return 0;

        } catch (error) {
            console.error('Errore nel confronto delle feature:', error);
            return 0;
        }
    }

    cleanup() {
        if (this.orb) {
            this.orb.delete();
            this.orb = null;
        }
        if (this.matcher) {
            this.matcher.delete();
            this.matcher = null;
        }
        this.stoneFeatures.clear();
        this.isOpenCvReady = false;
    }
}

// Variabile globale per l'istanza
let imageRecognition = null;

// La funzione onOpenCvReady è ora gestita nel file index.html

// Esporta per uso globale
window.ImageRecognition = ImageRecognition;
window.imageRecognition = imageRecognition;

