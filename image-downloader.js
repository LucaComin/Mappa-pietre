// image-downloader.js - Modulo per scaricare e gestire le immagini delle pietre

class ImageDownloader {
    constructor() {
        this.downloadedImages = new Map(); // Cache delle immagini scaricate
        this.downloadProgress = { current: 0, total: 0 };
        this.isDownloading = false;
    }

    async downloadAllStoneImages() {
        if (this.isDownloading) {
            console.log('Download già in corso...');
            return;
        }

        if (!window.allStonesData || Object.keys(window.allStonesData).length === 0) {
            console.error('Nessun dato delle pietre disponibile');
            return;
        }

        this.isDownloading = true;
        console.log('Inizio download delle immagini delle pietre...');

        // Mostra notifica di inizio download
        if (window.notificationSystem) {
            window.notificationSystem.info('Download delle immagini delle pietre in corso...', 0);
        }

        try {
            // Raccogli tutti gli URL delle immagini
            const imageUrls = new Set();
            for (const stoneName in window.allStonesData) {
                const positions = window.allStonesData[stoneName];
                for (const position of positions) {
                    if (position.imageUrl && this.isValidImageUrl(position.imageUrl)) {
                        imageUrls.add(position.imageUrl);
                    }
                }
            }

            this.downloadProgress.total = imageUrls.size;
            this.downloadProgress.current = 0;

            console.log(`Trovate ${imageUrls.size} immagini uniche da scaricare`);

            // Scarica le immagini in parallelo (max 5 alla volta per non sovraccaricare)
            const urlArray = Array.from(imageUrls);
            const batchSize = 5;
            
            for (let i = 0; i < urlArray.length; i += batchSize) {
                const batch = urlArray.slice(i, i + batchSize);
                const promises = batch.map(url => this.downloadSingleImage(url));
                
                await Promise.allSettled(promises);
            }

            // Aggiorna i percorsi delle immagini in allStonesData
            this.updateImagePaths();

            console.log('Download completato!');
            
            if (window.notificationSystem) {
                window.notificationSystem.success(
                    `Download completato! ${this.downloadedImages.size} immagini scaricate.`,
                    4000
                );
            }

            // Riavvia il pre-calcolo delle feature con le immagini locali
            if (window.imageRecognition) {
                await window.imageRecognition.precomputeStoneFeatures();
            }

        } catch (error) {
            console.error('Errore durante il download delle immagini:', error);
            if (window.notificationSystem) {
                window.notificationSystem.error('Errore durante il download delle immagini');
            }
        } finally {
            this.isDownloading = false;
        }
    }

    async downloadSingleImage(imageUrl) {
        try {
            // Crea un nome file sicuro dall'URL
            const fileName = this.createSafeFileName(imageUrl);
            
            // Verifica se l'immagine è già stata scaricata
            if (this.downloadedImages.has(imageUrl)) {
                return this.downloadedImages.get(imageUrl);
            }

            // Scarica l'immagine usando fetch
            const response = await fetch(imageUrl, {
                mode: 'cors',
                headers: {
                    'Accept': 'image/*'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Converti in blob
            const blob = await response.blob();
            
            // Verifica che sia effettivamente un'immagine
            if (!blob.type.startsWith('image/')) {
                throw new Error('Il file scaricato non è un\'immagine valida');
            }

            // Crea un URL blob locale
            const localUrl = URL.createObjectURL(blob);
            
            // Salva nella cache
            this.downloadedImages.set(imageUrl, {
                originalUrl: imageUrl,
                localUrl: localUrl,
                fileName: fileName,
                blob: blob,
                type: blob.type,
                size: blob.size
            });

            this.downloadProgress.current++;
            
            console.log(`Scaricata: ${fileName} (${this.downloadProgress.current}/${this.downloadProgress.total})`);
            
            return this.downloadedImages.get(imageUrl);

        } catch (error) {
            console.warn(`Errore nel download di ${imageUrl}:`, error);
            this.downloadProgress.current++;
            return null;
        }
    }

    updateImagePaths() {
        // Aggiorna i percorsi delle immagini in allStonesData per usare gli URL locali
        for (const stoneName in window.allStonesData) {
            const positions = window.allStonesData[stoneName];
            for (const position of positions) {
                if (position.imageUrl && this.downloadedImages.has(position.imageUrl)) {
                    const downloadedImage = this.downloadedImages.get(position.imageUrl);
                    position.localImageUrl = downloadedImage.localUrl;
                    position.originalImageUrl = position.imageUrl; // Backup dell'URL originale
                }
            }
        }

        console.log('Percorsi delle immagini aggiornati in allStonesData');
    }

    createSafeFileName(url) {
        try {
            const urlObj = new URL(url);
            let fileName = urlObj.pathname.split('/').pop();
            
            // Se non c'è un nome file o estensione, crea uno basato sull'hash dell'URL
            if (!fileName || !fileName.includes('.')) {
                const hash = this.simpleHash(url);
                fileName = `image_${hash}.jpg`;
            }
            
            // Pulisci il nome file da caratteri non sicuri
            fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            
            return fileName;
        } catch (error) {
            // Fallback per URL malformati
            const hash = this.simpleHash(url);
            return `image_${hash}.jpg`;
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converti a 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    isValidImageUrl(url) {
        try {
            new URL(url);
            // Verifica che l'URL sembri puntare a un'immagine
            const lowerUrl = url.toLowerCase();
            return lowerUrl.includes('image') || 
                   lowerUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/i) ||
                   lowerUrl.includes('unsplash') ||
                   lowerUrl.includes('imgur') ||
                   lowerUrl.includes('cloudinary');
        } catch {
            return false;
        }
    }

    getLocalImageUrl(originalUrl) {
        const downloadedImage = this.downloadedImages.get(originalUrl);
        return downloadedImage ? downloadedImage.localUrl : originalUrl;
    }

    getDownloadProgress() {
        return {
            current: this.downloadProgress.current,
            total: this.downloadProgress.total,
            percentage: this.downloadProgress.total > 0 ? 
                Math.round((this.downloadProgress.current / this.downloadProgress.total) * 100) : 0,
            isDownloading: this.isDownloading
        };
    }

    cleanup() {
        // Rilascia tutti gli URL blob per liberare memoria
        for (const [url, imageData] of this.downloadedImages) {
            if (imageData.localUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageData.localUrl);
            }
        }
        this.downloadedImages.clear();
    }
}

// Inizializza il downloader quando il DOM è pronto
let imageDownloader = null;

document.addEventListener('DOMContentLoaded', function() {
    imageDownloader = new ImageDownloader();
    window.imageDownloader = imageDownloader;
    
    // Avvia automaticamente il download quando i dati delle pietre sono caricati
    const checkDataAndDownload = () => {
        if (window.allStonesData && Object.keys(window.allStonesData).length > 0) {
            // Aspetta un po' per assicurarsi che tutto sia inizializzato
            setTimeout(() => {
                imageDownloader.downloadAllStoneImages();
            }, 1000);
        } else {
            // Riprova dopo 500ms
            setTimeout(checkDataAndDownload, 500);
        }
    };
    
    checkDataAndDownload();
});

// Esporta per uso globale
window.ImageDownloader = ImageDownloader;

