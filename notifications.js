// notifications.js - Sistema di notifiche per l'interfaccia utente

class NotificationSystem {
    constructor() {
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        // Crea il container per le notifiche se non esiste
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icone per i diversi tipi di notifica
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Aggiungi al container
        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Animazione di entrata
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);

        // Rimozione automatica
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    remove(notification) {
        if (notification && notification.parentElement) {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }
}

// Funzione globale per compatibilità
function showNotification(message, type = 'info', duration = 4000) {
    if (window.notificationSystem) {
        return window.notificationSystem.show(message, type, duration);
    }
}

// Inizializza il sistema di notifiche
document.addEventListener('DOMContentLoaded', function() {
    window.notificationSystem = new NotificationSystem();
});

