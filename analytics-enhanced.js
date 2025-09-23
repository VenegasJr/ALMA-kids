/**
 * ALMA Kids - Analytics Avanzado
 * Tracking inteligente de comportamiento del usuario
 */

class AdvancedAnalytics {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            pageViews: [],
            interactions: [],
            cartEvents: [],
            searchQueries: [],
            deviceInfo: this.getDeviceInfo()
        };
        this.init();
    }

    init() {
        this.setupPageTracking();
        this.setupInteractionTracking();
        this.setupCartTracking();
        this.setupSearchTracking();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        this.setupHeatmapSimulation();
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: {
                width: screen.width,
                height: screen.height,
                orientation: screen.orientation ? screen.orientation.type : 'unknown'
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null,
            timestamp: new Date().toISOString()
        };
    }

    setupPageTracking() {
        // Track page view
        this.trackPageView(window.location.pathname);

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestones
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                    this.trackEvent('scroll_depth', {
                        percentage: scrollPercent,
                        page: window.location.pathname
                    });
                }
            }
        });

        // Track time on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.sessionData.startTime;
            this.trackEvent('time_on_page', {
                duration: timeOnPage,
                page: window.location.pathname
            });
        });
    }

    setupInteractionTracking() {
        // Track clicks en productos
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.globo-item, .service-card, .event-card');
            
            if (target) {
                const productName = target.querySelector('h3, h4').textContent;
                const category = this.getProductCategory(target);
                
                this.trackEvent('product_view', {
                    product_name: productName,
                    category: category,
                    position: this.getElementPosition(target)
                });
            }

            // Track navigation clicks
            const navLink = e.target.closest('.nav-link, .mobile-link');
            if (navLink) {
                this.trackEvent('navigation_click', {
                    link_text: navLink.textContent.trim(),
                    href: navLink.href,
                    is_mobile: navLink.classList.contains('mobile-link')
                });
            }

            // Track CTA clicks
            const ctaButton = e.target.closest('.btn-primary, .btn-secondary');
            if (ctaButton) {
                this.trackEvent('cta_click', {
                    button_text: ctaButton.textContent.trim(),
                    section: this.getCurrentSection(ctaButton)
                });
            }
        });

        // Track form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_focus', {
                    field_name: e.target.name,
                    field_type: e.target.type
                });
            }
        }, true);
    }

    setupCartTracking() {
        // Override funciones del carrito para tracking
        const originalAddToCart = window.addToCart;
        window.addToCart = (code, name, category) => {
            this.trackEvent('add_to_cart', {
                product_code: code,
                product_name: name,
                category: category,
                cart_size: this.getCartSize() + 1
            });

            if (originalAddToCart) {
                return originalAddToCart(code, name, category);
            }
        };

        // Track cart opens
        const originalOpenCart = window.openCartModal;
        window.openCartModal = () => {
            this.trackEvent('cart_view', {
                cart_size: this.getCartSize()
            });

            if (originalOpenCart) {
                return originalOpenCart();
            }
        };
    }

    setupSearchTracking() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (query.length >= 3) {
                        this.trackEvent('search', {
                            query: query,
                            results_count: this.getSearchResultsCount()
                        });
                        
                        this.sessionData.searchQueries.push({
                            query: query,
                            timestamp: Date.now()
                        });
                    }
                }, 500);
            });
        }
    }

    setupPerformanceTracking() {
        // Track Core Web Vitals
        if ('web-vitals' in window) {
            // Si tienes la librería web-vitals cargada
            webVitals.getCLS(this.trackWebVital.bind(this));
            webVitals.getFID(this.trackWebVital.bind(this));
            webVitals.getFCP(this.trackWebVital.bind(this));
            webVitals.getLCP(this.trackWebVital.bind(this));
            webVitals.getTTFB(this.trackWebVital.bind(this));
        }

        // Track load times
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.trackEvent('page_performance', {
                load_time: navigation.loadEventEnd - navigation.fetchStart,
                dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                first_paint: this.getFirstPaint(),
                page: window.location.pathname
            });
        });
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error ? e.error.stack : null
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('promise_rejection', {
                reason: e.reason.toString(),
                stack: e.reason.stack
            });
        });

        // Track 404 images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.trackEvent('image_404', {
                    src: e.target.src,
                    alt: e.target.alt
                });
            }
        }, true);
    }

    setupHeatmapSimulation() {
        // Simular heatmap tracking
        let clickData = [];
        
        document.addEventListener('click', (e) => {
            clickData.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                target: e.target.tagName,
                page: window.location.pathname
            });

            // Enviar datos cada 10 clicks
            if (clickData.length >= 10) {
                this.trackEvent('heatmap_data', {
                    clicks: clickData.splice(0, 10)
                });
            }
        });
    }

    trackPageView(path) {
        this.sessionData.pageViews.push({
            path: path,
            timestamp: Date.now(),
            referrer: document.referrer
        });

        this.trackEvent('page_view', {
            page_title: document.title,
            page_path: path
        });
    }

    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }

        // Custom analytics
        this.sessionData.interactions.push({
            event: eventName,
            parameters: parameters,
            timestamp: Date.now()
        });

        console.log(`📊 ALMA Kids Analytics: ${eventName}`, parameters);
    }

    trackWebVital(metric) {
        this.trackEvent('web_vital', {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
        });
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    getProductCategory(element) {
        const categorySection = element.closest('.globos-category, .service-card');
        if (categorySection) {
            const categoryTitle = categorySection.querySelector('h3');
            return categoryTitle ? categoryTitle.textContent.trim() : 'unknown';
        }
        return 'unknown';
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        };
    }

    getCurrentSection(element) {
        const section = element.closest('section');
        return section ? section.id || section.className : 'unknown';
    }

    getCartSize() {
        const cartCount = document.getElementById('cartCount');
        return cartCount ? parseInt(cartCount.textContent) || 0 : 0;
    }

    getSearchResultsCount() {
        const results = document.querySelectorAll('.search-results .search-result');
        return results.length;
    }

    // Método para enviar datos de sesión al finalizar
    sendSessionData() {
        const sessionSummary = {
            ...this.sessionData,
            endTime: Date.now(),
            totalDuration: Date.now() - this.sessionData.startTime
        };

        // Enviar a analytics endpoint
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/analytics', JSON.stringify(sessionSummary));
        }
    }
}

// Inicializar analytics
document.addEventListener('DOMContentLoaded', () => {
    window.almakidsAnalytics = new AdvancedAnalytics();
    console.log('🎪 ALMA Kids: Analytics avanzado activado');
});

// Enviar datos al cerrar la página
window.addEventListener('beforeunload', () => {
    if (window.almakidsAnalytics) {
        window.almakidsAnalytics.sendSessionData();
    }
});

export default AdvancedAnalytics;


