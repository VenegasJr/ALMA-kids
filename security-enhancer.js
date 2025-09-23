/**
 * ALMA Kids - Mejoras de Seguridad
 * Protección contra vulnerabilidades comunes
 */

class SecurityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSPViolationReporting();
        this.setupXSSProtection();
        this.setupClickjackingProtection();
        this.setupFormSecurityEnhancements();
        this.setupContentSecurityPolicy();
        this.monitorSuspiciousActivity();
    }

    setupCSPViolationReporting() {
        document.addEventListener('securitypolicyviolation', (e) => {
            console.warn('🛡️ CSP Violation:', {
                directive: e.violatedDirective,
                blockedURI: e.blockedURI,
                originalPolicy: e.originalPolicy
            });

            // Reportar violación
            this.reportSecurityEvent('csp_violation', {
                directive: e.violatedDirective,
                blocked_uri: e.blockedURI,
                source_file: e.sourceFile,
                line_number: e.lineNumber
            });
        });
    }

    setupXSSProtection() {
        // Sanitizar inputs dinámicos
        const sanitizeInput = (input) => {
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };

        // Interceptar innerHTML assignments peligrosas
        const originalInnerHTML = Element.prototype.innerHTML;
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string' && this.tagName !== 'SCRIPT') {
                    // Verificar contenido sospechoso
                    if (value.includes('<script') || value.includes('javascript:') || value.includes('onerror=')) {
                        console.warn('🛡️ Contenido potencialmente peligroso bloqueado:', value);
                        this.reportSecurityEvent('xss_attempt', { content: value });
                        return;
                    }
                }
                originalInnerHTML.call(this, value);
            },
            get: function() {
                return originalInnerHTML.call(this);
            }
        });
    }

    setupClickjackingProtection() {
        // Verificar si el sitio está siendo embebido
        if (window.top !== window.self) {
            console.warn('🛡️ Posible clickjacking detectado');
            
            this.reportSecurityEvent('clickjacking_attempt', {
                parent_origin: document.referrer,
                current_url: window.location.href
            });

            // Mostrar advertencia
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                    font-family: Arial, sans-serif;
                ">
                    <div style="text-align: center; padding: 2rem;">
                        <h1>🛡️ ALMA Kids - Acceso Seguro</h1>
                        <p>Para tu seguridad, este sitio no puede ser mostrado en un frame.</p>
                        <a href="${window.location.href}" style="
                            background: #E91E63;
                            color: white;
                            padding: 1rem 2rem;
                            text-decoration: none;
                            border-radius: 8px;
                            display: inline-block;
                            margin-top: 1rem;
                        ">Visitar ALMA Kids Directamente</a>
                    </div>
                </div>
            `;
        }
    }

    setupFormSecurityEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Rate limiting por IP (simulado)
            form.addEventListener('submit', (e) => {
                const lastSubmit = localStorage.getItem('last_form_submit');
                const now = Date.now();
                
                if (lastSubmit && (now - parseInt(lastSubmit)) < 10000) { // 10 segundos
                    e.preventDefault();
                    console.warn('🛡️ Rate limit aplicado');
                    
                    this.reportSecurityEvent('rate_limit_triggered', {
                        form_id: form.id,
                        time_since_last: now - parseInt(lastSubmit)
                    });
                    
                    this.showSecurityMessage('Por favor espera antes de enviar el formulario nuevamente.');
                    return false;
                }
                
                localStorage.setItem('last_form_submit', now.toString());
            });

            // Detectar envíos automatizados
            let humanInteraction = false;
            
            form.addEventListener('mousedown', () => humanInteraction = true);
            form.addEventListener('keydown', () => humanInteraction = true);
            
            form.addEventListener('submit', (e) => {
                if (!humanInteraction) {
                    e.preventDefault();
                    console.warn('🛡️ Envío automatizado detectado');
                    
                    this.reportSecurityEvent('automated_submission', {
                        form_id: form.id,
                        user_agent: navigator.userAgent
                    });
                    
                    return false;
                }
            });
        });
    }

    setupContentSecurityPolicy() {
        // Verificar que CSP esté configurado
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        
        if (!metaCSP) {
            console.warn('🛡️ Content Security Policy no configurado');
            
            // Añadir CSP básico
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            cspMeta.content = `
                default-src 'self';
                script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
                img-src 'self' data: https:;
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' https://www.google-analytics.com;
                frame-ancestors 'none';
            `.replace(/\s+/g, ' ').trim();
            
            document.head.appendChild(cspMeta);
        }
    }

    monitorSuspiciousActivity() {
        let suspiciousScore = 0;
        
        // Detectar actividad sospechosa
        const patterns = [
            // Demasiados clicks rápidos
            { event: 'rapid_clicks', threshold: 10, timeWindow: 1000 },
            // Navegación muy rápida
            { event: 'rapid_navigation', threshold: 5, timeWindow: 2000 },
            // Múltiples envíos de formulario
            { event: 'multiple_submissions', threshold: 3, timeWindow: 30000 }
        ];

        let recentEvents = [];

        document.addEventListener('click', () => {
            recentEvents.push({ type: 'click', timestamp: Date.now() });
            this.checkSuspiciousPatterns(recentEvents, patterns[0]);
        });

        // Limpiar eventos antiguos
        setInterval(() => {
            const now = Date.now();
            recentEvents = recentEvents.filter(event => 
                now - event.timestamp < 60000 // Mantener últimos 60 segundos
            );
        }, 10000);
    }

    checkSuspiciousPatterns(events, pattern) {
        const now = Date.now();
        const recentEvents = events.filter(event => 
            now - event.timestamp < pattern.timeWindow
        );

        if (recentEvents.length >= pattern.threshold) {
            console.warn(`🛡️ Patrón sospechoso detectado: ${pattern.event}`);
            
            this.reportSecurityEvent('suspicious_activity', {
                pattern: pattern.event,
                event_count: recentEvents.length,
                time_window: pattern.timeWindow
            });
        }
    }

    reportSecurityEvent(eventType, data) {
        const securityEvent = {
            type: eventType,
            data: data,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href,
            session_id: this.getSessionId()
        };

        // En producción, enviar a endpoint de seguridad
        console.log('🛡️ Security Event:', securityEvent);
        
        // Almacenar localmente para review
        const securityLog = JSON.parse(localStorage.getItem('security_log') || '[]');
        securityLog.push(securityEvent);
        
        // Mantener solo últimos 50 eventos
        if (securityLog.length > 50) {
            securityLog.splice(0, securityLog.length - 50);
        }
        
        localStorage.setItem('security_log', JSON.stringify(securityLog));
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('alma_session_id');
        if (!sessionId) {
            sessionId = 'alma_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('alma_session_id', sessionId);
        }
        return sessionId;
    }

    showSecurityMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'security-notification';
        notification.innerHTML = `
            <div class="security-notification-content">
                <i class="fas fa-shield-alt"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Método público para verificar integridad
    static verifyIntegrity() {
        // Verificar que scripts críticos no hayan sido modificados
        const criticalScripts = document.querySelectorAll('script[src]');
        
        criticalScripts.forEach(script => {
            if (script.src.includes('alma') || script.src.includes('script.js')) {
                // En producción, verificar hash del archivo
                console.log('🔍 Verificando integridad de:', script.src);
            }
        });
    }
}

// CSS para notificaciones de seguridad
const securityCSS = `
    .security-notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 1rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 500px;
    }

    .security-notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .security-notification button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = securityCSS;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new SecurityEnhancer();
    console.log('🎪 ALMA Kids: Mejoras de seguridad activadas');
});

export default SecurityEnhancer;


