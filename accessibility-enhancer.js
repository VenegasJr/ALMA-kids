/**
 * ALMA Kids - Mejoras de Accesibilidad
 * Hace el sitio accesible para todos los usuarios
 */

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupColorContrastCheck();
        this.setupAltTextValidation();
        this.addAccessibilityControls();
    }

    setupKeyboardNavigation() {
        // Navegación por teclado mejorada
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Enter':
                    this.handleEnterKey(e);
                    break;
                case 'Escape':
                    this.handleEscapeKey(e);
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                    this.handleArrowNavigation(e);
                    break;
            }
        });

        // Hacer todos los elementos interactivos accesibles por teclado
        const interactiveElements = document.querySelectorAll('.globo-item, .service-card, .event-card');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Tab hacia atrás
            if (currentIndex <= 0) {
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab hacia adelante
            if (currentIndex === focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[0].focus();
            }
        }
    }

    handleEnterKey(e) {
        const target = e.target;
        
        // Activar botones y enlaces con Enter
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            if (!target.disabled) {
                target.click();
            }
        }
    }

    handleEscapeKey(e) {
        // Cerrar modales abiertos
        const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
        openModals.forEach(modal => {
            const closeButton = modal.querySelector('.close-modal, .close');
            if (closeButton) {
                closeButton.click();
            }
        });

        // Cerrar menú móvil
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const closeButton = document.querySelector('.mobile-menu-toggle');
            if (closeButton) {
                closeButton.click();
            }
        }
    }

    handleArrowNavigation(e) {
        const target = e.target;
        
        // Navegación en grids de productos
        if (target.closest('.globos-grid') || target.closest('.services-grid')) {
            e.preventDefault();
            
            const grid = target.closest('.globos-grid, .services-grid');
            const items = Array.from(grid.querySelectorAll('.globo-item, .service-card'));
            const currentIndex = items.indexOf(target);
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentIndex + 4, items.length - 1); // Asumiendo 4 columnas
            } else {
                nextIndex = Math.max(currentIndex - 4, 0);
            }
            
            items[nextIndex].focus();
        }
    }

    getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(document.querySelectorAll(selector))
            .filter(el => el.offsetParent !== null); // Solo elementos visibles
    }

    setupScreenReaderSupport() {
        // Añadir landmarks ARIA
        this.addARIALandmarks();
        
        // Mejorar anuncios para lectores de pantalla
        this.setupLiveRegions();
        
        // Describir elementos interactivos
        this.addARIADescriptions();
    }

    addARIALandmarks() {
        // Header
        const header = document.querySelector('header');
        if (header) {
            header.setAttribute('role', 'banner');
            header.setAttribute('aria-label', 'Navegación principal de ALMA Kids');
        }

        // Navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Menú principal');
        }

        // Main content
        const main = document.querySelector('main') || document.querySelector('#inicio');
        if (main) {
            main.setAttribute('role', 'main');
            main.setAttribute('aria-label', 'Contenido principal');
        }

        // Footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.setAttribute('role', 'contentinfo');
            footer.setAttribute('aria-label', 'Información de contacto y enlaces');
        }
    }

    setupLiveRegions() {
        // Crear región para anuncios dinámicos
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);

        // Anunciar cambios importantes
        this.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    addARIADescriptions() {
        // Describir botones del carrito
        const cartButtons = document.querySelectorAll('.btn-cart');
        cartButtons.forEach(button => {
            const productName = button.closest('.globo-info').querySelector('h4').textContent;
            button.setAttribute('aria-label', `Agregar ${productName} al carrito de compras`);
        });

        // Describir botones de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            link.setAttribute('aria-label', `Ir a sección ${text}`);
        });

        // Describir imágenes de productos
        const productImages = document.querySelectorAll('.globo-img');
        productImages.forEach(img => {
            const productName = img.closest('.globo-item').querySelector('h4').textContent;
            const price = img.closest('.globo-item').querySelector('.product-details');
            img.setAttribute('aria-describedby', `Producto: ${productName}`);
        });
    }

    setupFocusManagement() {
        // Gestión de foco para modales
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="openImageModal"], [onclick*="openCartModal"]')) {
                setTimeout(() => {
                    const modal = document.querySelector('.modal:not([style*="display: none"])');
                    if (modal) {
                        const firstFocusable = modal.querySelector('button, a, input, textarea, select');
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }
                }, 100);
            }
        });

        // Trap focus en modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal:not([style*="display: none"])');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupColorContrastCheck() {
        // Verificar contraste de colores
        const elementsToCheck = document.querySelectorAll('h1, h2, h3, h4, p, a, button');
        
        elementsToCheck.forEach(element => {
            const styles = window.getComputedStyle(element);
            const bgColor = styles.backgroundColor;
            const textColor = styles.color;
            
            // Solo verificar si hay colores definidos
            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
                const contrast = this.calculateContrast(bgColor, textColor);
                
                if (contrast < 4.5) {
                    console.warn(`⚠️ Contraste bajo detectado:`, element, `Ratio: ${contrast.toFixed(2)}`);
                    element.setAttribute('data-low-contrast', 'true');
                }
            }
        });
    }

    calculateContrast(color1, color2) {
        // Simplificado - en producción usarías una librería específica
        const getLuminance = (color) => {
            // Convertir a RGB y calcular luminancia
            // Esta es una implementación simplificada
            return 0.5; // Placeholder
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }

    setupAltTextValidation() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.alt || img.alt.trim() === '') {
                console.warn('⚠️ Imagen sin alt text:', img.src);
                img.setAttribute('alt', 'ALMA Kids - Imagen decorativa');
            }
            
            // Verificar que el alt text sea descriptivo
            if (img.alt.length < 3) {
                console.warn('⚠️ Alt text muy corto:', img.src, img.alt);
            }
        });
    }

    addAccessibilityControls() {
        // Crear panel de controles de accesibilidad
        const accessibilityPanel = document.createElement('div');
        accessibilityPanel.className = 'accessibility-panel';
        accessibilityPanel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Abrir controles de accesibilidad">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="accessibility-controls" style="display: none;">
                <h3>Opciones de Accesibilidad</h3>
                <button onclick="this.parentElement.parentElement.classList.toggle('high-contrast')" aria-label="Activar alto contraste">
                    <i class="fas fa-adjust"></i> Alto Contraste
                </button>
                <button onclick="this.parentElement.parentElement.classList.toggle('large-text')" aria-label="Aumentar tamaño de texto">
                    <i class="fas fa-font"></i> Texto Grande
                </button>
                <button onclick="this.parentElement.parentElement.classList.toggle('focus-visible')" aria-label="Mostrar indicadores de foco">
                    <i class="fas fa-eye"></i> Mostrar Foco
                </button>
                <button onclick="this.parentElement.parentElement.classList.toggle('reduce-motion')" aria-label="Reducir animaciones">
                    <i class="fas fa-pause"></i> Reducir Movimiento
                </button>
            </div>
        `;

        document.body.appendChild(accessibilityPanel);

        // Toggle panel
        const toggle = accessibilityPanel.querySelector('.accessibility-toggle');
        const controls = accessibilityPanel.querySelector('.accessibility-controls');
        
        toggle.addEventListener('click', () => {
            const isVisible = controls.style.display !== 'none';
            controls.style.display = isVisible ? 'none' : 'block';
            toggle.setAttribute('aria-expanded', !isVisible);
        });
    }
}

// CSS para accesibilidad
const accessibilityCSS = `
    /* Panel de Accesibilidad */
    .accessibility-panel {
        position: fixed;
        bottom: 100px;
        left: 20px;
        z-index: 10000;
    }

    .accessibility-toggle {
        background: var(--primary-color);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow);
        transition: all 0.3s ease;
    }

    .accessibility-toggle:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-lg);
    }

    .accessibility-controls {
        position: absolute;
        bottom: 60px;
        left: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        padding: 1rem;
        min-width: 200px;
        box-shadow: var(--shadow-lg);
    }

    .accessibility-controls h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--primary-color);
    }

    .accessibility-controls button {
        display: block;
        width: 100%;
        background: transparent;
        border: 1px solid #ddd;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;
    }

    .accessibility-controls button:hover {
        background: var(--bg-light);
        border-color: var(--primary-color);
    }

    /* Estados de accesibilidad */
    .high-contrast {
        filter: contrast(150%) brightness(1.2);
    }

    .large-text {
        font-size: 120% !important;
    }

    .large-text * {
        font-size: inherit !important;
    }

    .focus-visible *:focus {
        outline: 3px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }

    .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    /* Skip links */
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    }

    .skip-link:focus {
        top: 6px;
    }

    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* Focus indicators mejorados */
    button:focus,
    a:focus,
    input:focus,
    textarea:focus,
    select:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.1);
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = accessibilityCSS;
document.head.appendChild(style);

// Añadir skip link
const skipLink = document.createElement('a');
skipLink.href = '#inicio';
skipLink.className = 'skip-link';
skipLink.textContent = 'Saltar al contenido principal';
document.body.insertBefore(skipLink, document.body.firstChild);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityEnhancer();
    console.log('🎪 ALMA Kids: Mejoras de accesibilidad activadas');
});

export default AccessibilityEnhancer;


