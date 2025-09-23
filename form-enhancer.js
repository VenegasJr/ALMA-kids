/**
 * ALMA Kids - Sistema de Formularios Mejorados
 * Validación avanzada, anti-spam y mejor UX
 */

class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupAntiSpam();
        this.setupAutoSave();
        this.setupSmartSubmission();
        this.setupProgressIndicator();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Validación en tiempo real
                input.addEventListener('blur', (e) => this.validateField(e.target));
                input.addEventListener('input', (e) => this.clearErrors(e.target));
            });

            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let message = '';

        // Limpiar errores previos
        this.clearFieldError(field);

        // Validaciones específicas
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    message = 'Por favor ingresa un email válido';
                }
                break;
            
            case 'tel':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
                if (value && !phoneRegex.test(value)) {
                    isValid = false;
                    message = 'Por favor ingresa un teléfono válido (+56 9 1234 5678)';
                }
                break;
            
            case 'date':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    message = 'La fecha del evento debe ser futura';
                }
                break;
        }

        // Validaciones por nombre de campo
        if (name === 'name' && value.length < 2) {
            isValid = false;
            message = 'El nombre debe tener al menos 2 caracteres';
        }

        if (name === 'location' && value.length < 10) {
            isValid = false;
            message = 'Por favor proporciona una dirección completa';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Crear mensaje de error
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    clearErrors(field) {
        if (field.classList.contains('error')) {
            setTimeout(() => this.clearFieldError(field), 100);
        }
    }

    setupAntiSpam() {
        // Honeypot field (campo oculto para detectar bots)
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website';
            honeypot.style.display = 'none';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';
            form.appendChild(honeypot);

            // Rate limiting
            form.dataset.lastSubmit = '0';
        });
    }

    setupAutoSave() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const formData = this.getFormData(input.form);
                localStorage.setItem('almakids_form_draft', JSON.stringify(formData));
            });
        });

        // Restaurar datos guardados
        this.restoreFormData();
    }

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    restoreFormData() {
        const savedData = localStorage.getItem('almakids_form_draft');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                    }
                });
            } catch (e) {
                console.log('Error restaurando datos del formulario');
            }
        }
    }

    setupSmartSubmission() {
        // Prevenir doble envío
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        
        submitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.disabled) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }

    setupProgressIndicator() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">Completado: 0%</span>
            `;
            form.insertBefore(progressBar, form.firstChild);

            // Actualizar progreso
            const requiredFields = form.querySelectorAll('[required]');
            const updateProgress = () => {
                const filledFields = Array.from(requiredFields).filter(field => field.value.trim());
                const progress = (filledFields.length / requiredFields.length) * 100;
                
                const progressFill = form.querySelector('.progress-fill');
                const progressText = form.querySelector('.progress-text');
                
                if (progressFill && progressText) {
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `Completado: ${Math.round(progress)}%`;
                }
            };

            requiredFields.forEach(field => {
                field.addEventListener('input', updateProgress);
                field.addEventListener('change', updateProgress);
            });

            updateProgress(); // Inicializar
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Verificar honeypot
        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value) {
            console.log('🛡️ Spam detectado');
            return false;
        }

        // Rate limiting
        const lastSubmit = parseInt(form.dataset.lastSubmit || '0');
        const now = Date.now();
        if (now - lastSubmit < 5000) { // 5 segundos mínimo entre envíos
            this.showNotification('Por favor espera unos segundos antes de enviar nuevamente', 'warning');
            return false;
        }

        // Validar todos los campos
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Por favor corrige los errores en el formulario', 'error');
            return false;
        }

        // Deshabilitar botón y mostrar loading
        submitButton.disabled = true;
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Simular envío (aquí se integraría con EmailJS o backend)
        setTimeout(() => {
            // Éxito
            this.showNotification('¡Cotización enviada exitosamente! Te contactaremos pronto.', 'success');
            form.reset();
            localStorage.removeItem('almakids_form_draft');
            form.dataset.lastSubmit = now.toString();
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;

            // Redirigir a WhatsApp con datos del formulario
            const formData = new FormData(form);
            const message = this.buildWhatsAppMessage(formData);
            window.open(`https://wa.me/56969073306?text=${encodeURIComponent(message)}`, '_blank');
            
        }, 2000);

        return false;
    }

    buildWhatsAppMessage(formData) {
        let message = '🎪 *ALMA Kids - Nueva Cotización*\n\n';
        
        for (let [key, value] of formData.entries()) {
            if (value && key !== 'website') { // Excluir honeypot
                const label = this.getFieldLabel(key);
                message += `*${label}:* ${value}\n`;
            }
        }
        
        message += '\n¡Gracias por contactarnos! 🎈';
        return message;
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Nombre',
            'email': 'Email',
            'phone': 'Teléfono',
            'eventDate': 'Fecha del Evento',
            'startTime': 'Hora de Inicio',
            'location': 'Ubicación',
            'serviceType': 'Tipo de Servicio',
            'decoration': 'Decoración',
            'additionalMessage': 'Mensaje Adicional'
        };
        
        return labels[fieldName] || fieldName;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        return icons[type] || 'fa-info-circle';
    }
}

// CSS para formularios mejorados
const formEnhancerCSS = `
    /* Progress Bar */
    .form-progress {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--bg-light);
        border-radius: var(--border-radius);
        border: 1px solid rgba(233, 30, 99, 0.1);
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 4px;
    }

    .progress-text {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    /* Error States */
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Success States */
    .form-group input.success,
    .form-group textarea.success,
    .form-group select.success {
        border-color: #27ae60;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }

    /* Notifications */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease;
    }

    .notification-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .notification-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    .notification-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }

    .notification-info {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }

    .notification-content {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    /* Form Enhancements */
    .form-group {
        position: relative;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(233, 30, 99, 0.2);
    }

    /* Smart Suggestions */
    .form-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    }

    .suggestion-item {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s;
    }

    .suggestion-item:hover {
        background-color: #f8f9fa;
    }

    .suggestion-item:last-child {
        border-bottom: none;
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = formEnhancerCSS;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new FormEnhancer();
    console.log('🎪 ALMA Kids: Sistema de formularios mejorados activado');
});

export default FormEnhancer;


