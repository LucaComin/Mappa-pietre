// status-indicator.js - Indicatore visivo dello stato del sistema

class StatusIndicator {
    constructor() {
        this.indicator = null;
        this.createIndicator();
        this.setupSystemMonitoring();
    }

    createIndicator() {
        // Crea l'elemento indicatore
        this.indicator = document.createElement('div');
        this.indicator.id = 'system-status-indicator';
        this.indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s ease;
            cursor: pointer;
            user-select: none;
        `;
        
        // Aggiungi al DOM
        document.body.appendChild(this.indicator);
        
        // Aggiungi click handler per mostrare dettagli
        this.indicator.addEventListener('click', () => this.showDetails());
        
        // Inizializza con stato di caricamento
        this.updateStatus('loading', 'Caricamento sistema...');
    }

    updateStatus(status, message) {
        if (!this.indicator) return;
        
        const statusConfig = {
            loading: { color: '#ffc107', icon: '⏳' },
            ready: { color: '#28a745', icon: '✅' },
            error: { color: '#dc3545', icon: '❌' },
            warning: { color: '#fd7e14', icon: '⚠️' }
        };
        
        const config = statusConfig[status] || statusConfig.loading;
        
        this.indicator.innerHTML = `
            <span style="font-size: 14px;">${config.icon}</span>
            <span>${message}</span>
        `;
        
        this.indicator.style.background = `${config.color}22`;
        this.indicator.style.border = `1px solid ${config.color}`;
        this.indicator.style.color = config.color;
        
        // Nascondi automaticamente se tutto è pronto
        if (status === 'ready') {
            setTimeout(() => {
                if (this.indicator) {
                    this.indicator.style.opacity = '0.3';
                    this.indicator.style.transform = 'scale(0.8)';
                }
            }, 3000);
        }
    }

    setupSystemMonitoring() {
        // Monitora lo stato del sistema ogni secondo
        const checkStatus = () => {
            if (window.systemInitializer) {
                const status = window.systemInitializer.checkSystemStatus();
                
                if (status.fullyReady) {
                    this.updateStatus('ready', 'Sistema pronto');
                } else {
                    let message = 'Inizializzazione...';
                    if (!status.openCvLoaded) {
                        message = 'Caricamento OpenCV...';
                    } else if (!status.dataLoaded) {
                        message = 'Caricamento dati...';
                    } else if (!status.imageRecognitionReady) {
                        message = 'Inizializzazione AI...';
                    }
                    this.updateStatus('loading', message);
                }
            } else {
                this.updateStatus('loading', 'Avvio sistema...');
            }
        };
        
        // Controlla immediatamente e poi ogni secondo
        checkStatus();
        this.statusInterval = setInterval(checkStatus, 1000);
        
        // Ferma il monitoraggio quando il sistema è pronto
        if (window.systemInitializer) {
            window.systemInitializer.onSystemReady(() => {
                clearInterval(this.statusInterval);
                this.updateStatus('ready', 'Sistema pronto');
            });
        }
    }

    showDetails() {
        if (!window.systemInitializer) return;
        
        const status = window.systemInitializer.checkSystemStatus();
        
        const details = `
Sistema di Riconoscimento Pietre - Stato Dettagliato:

🔧 OpenCV.js: ${status.openCvLoaded ? '✅ Caricato' : '❌ Non caricato'}
📊 Dati Pietre: ${status.dataLoaded ? '✅ Caricati' : '❌ Non caricati'}
🤖 AI Recognition: ${status.imageRecognitionReady ? '✅ Pronto' : '❌ Non pronto'}

${status.fullyReady ? '🎉 Sistema completamente operativo!' : '⏳ Inizializzazione in corso...'}

Clicca OK per continuare.
        `;
        
        alert(details);
    }

    hide() {
        if (this.indicator) {
            this.indicator.style.display = 'none';
        }
    }

    show() {
        if (this.indicator) {
            this.indicator.style.display = 'flex';
        }
    }

    destroy() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
        if (this.indicator && this.indicator.parentNode) {
            this.indicator.parentNode.removeChild(this.indicator);
        }
    }
}

// Inizializza l'indicatore quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.statusIndicator = new StatusIndicator();
});

// Esporta per uso globale
window.StatusIndicator = StatusIndicator;
