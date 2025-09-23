/**
 * ALMA Kids - Optimizador de Rendimiento
 * Mejora automática de velocidad y Core Web Vitals
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.setupResourceHints();
        this.setupCriticalResourcePrioritization();
        this.setupLazyLoadingEnhanced();
        this.setupImageOptimization();
        this.setupFontOptimization();
        this.setupJavaScriptOptimization();
        this.monitorPerformanceMetrics();
    }

    setupResourceHints() {
        // Preconnect a dominios externos críticos
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://www.googletagmanager.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // DNS prefetch para WhatsApp y redes sociales
        const dnsPrefetchDomains = [
            'https://wa.me',
            'https://www.instagram.com',
            'https://www.facebook.com'
        ];

        dnsPrefetchDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    setupCriticalResourcePrioritization() {
        // Priorizar recursos críticos
        const criticalResources = document.querySelectorAll('link[rel="stylesheet"], script[src]');
        
        criticalResources.forEach((resource, index) => {
            if (index < 3) { // Primeros 3 recursos son críticos
                resource.setAttribute('importance', 'high');
            } else {
                resource.setAttribute('importance', 'low');
            }
        });

        // Preload de imágenes hero
        const heroImages = [
            'imagenes/castillo-3d-profesional.png',
            'imagenes/ALMA kids Logo web.png'
        ];

        heroImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            link.importance = 'high';
            document.head.appendChild(link);
        });
    }

    setupLazyLoadingEnhanced() {
        // Configurar Intersection Observer optimizado
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Optimizar carga según viewport
                    this.loadImageOptimized(img);
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px', // Cargar 100px antes de que sea visible
            threshold: 0.1
        });

        // Observar imágenes no críticas
        document.querySelectorAll('.globo-img, .highlight-img').forEach(img => {
            if (!img.src.includes('castillo-3d-profesional') && 
                !img.src.includes('ALMA kids Logo')) {
                
                // Mover src a data-src para lazy loading
                img.dataset.src = img.src;
                img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
                img.classList.add('lazy');
                
                imageObserver.observe(img);
            }
        });
    }

    loadImageOptimized(img) {
        const src = img.dataset.src || img.src;
        
        // Crear imagen temporal para precargar
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // Aplicar efectos de entrada
            img.style.animation = 'fadeIn 0.5s ease-out';
        };
        
        tempImg.onerror = () => {
            // Fallback image
            img.src = 'imagenes/ALMA kids Logo web.png';
            img.classList.add('error');
        };
        
        tempImg.src = src;
    }

    generatePlaceholder(width, height) {
        // Generar SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                    ALMA Kids
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    setupImageOptimization() {
        // Comprimir imágenes dinámicamente si es necesario
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                // Verificar si la imagen es muy pesada
                if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
                    console.log('📸 Imagen grande detectada:', img.src);
                    this.optimizeImageSize(img);
                }
            });
        });
    }

    optimizeImageSize(img) {
        // Solo optimizar si el navegador lo soporta
        if ('createImageBitmap' in window) {
            fetch(img.src)
                .then(response => response.blob())
                .then(blob => createImageBitmap(blob))
                .then(bitmap => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Redimensionar a tamaño óptimo
                    const maxWidth = 800;
                    const maxHeight = 600;
                    
                    let { width, height } = bitmap;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width *= ratio;
                        height *= ratio;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(bitmap, 0, 0, width, height);
                    
                    // Convertir a blob optimizado
                    canvas.toBlob(blob => {
                        const optimizedUrl = URL.createObjectURL(blob);
                        img.src = optimizedUrl;
                    }, 'image/jpeg', 0.85);
                })
                .catch(error => {
                    console.log('Error optimizando imagen:', error);
                });
        }
    }

    setupFontOptimization() {
        // Optimizar carga de fuentes
        if ('fonts' in document) {
            // Preload fuentes críticas
            const criticalFonts = [
                'Poppins:wght@400',
                'Poppins:wght@600'
            ];

            criticalFonts.forEach(font => {
                document.fonts.load(`16px ${font.split(':')[0]}`).then(() => {
                    console.log(`✅ Fuente cargada: ${font}`);
                });
            });
        }

        // Font display swap para mejor rendimiento
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            link.href += '&display=swap';
        });
    }

    setupJavaScriptOptimization() {
        // Diferir scripts no críticos
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            if (!script.src.includes('critical') && 
                !script.src.includes('analytics') &&
                !script.async && 
                !script.defer) {
                
                script.defer = true;
            }
        });

        // Lazy load de scripts pesados
        this.lazyLoadScripts();
    }

    lazyLoadScripts() {
        const heavyScripts = [
            'social-integration.js',
            'favorites-system.js'
        ];

        // Cargar cuando el usuario interactúe
        const loadHeavyScripts = () => {
            heavyScripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.defer = true;
                document.head.appendChild(script);
            });
        };

        // Cargar en primera interacción
        ['click', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, loadHeavyScripts, { once: true });
        });

        // O después de 3 segundos si no hay interacción
        setTimeout(loadHeavyScripts, 3000);
    }

    monitorPerformanceMetrics() {
        // Monitor Core Web Vitals
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    this.metrics.lcp = entry.startTime;
                    console.log('📊 LCP:', entry.startTime);
                }
                
                if (entry.entryType === 'first-input') {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    console.log('📊 FID:', this.metrics.fid);
                }
                
                if (entry.entryType === 'layout-shift') {
                    if (!this.metrics.cls) this.metrics.cls = 0;
                    this.metrics.cls += entry.value;
                    console.log('📊 CLS:', this.metrics.cls);
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Reportar métricas después de 5 segundos
        setTimeout(() => {
            this.reportPerformanceMetrics();
        }, 5000);
    }

    reportPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        const metrics = {
            ...this.metrics,
            page_load_time: navigation.loadEventEnd - navigation.fetchStart,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            time_to_interactive: this.calculateTTI(),
            total_blocking_time: this.calculateTBT(),
            speed_index: this.calculateSpeedIndex()
        };

        // Enviar métricas a analytics
        if (window.gtag) {
            gtag('event', 'performance_metrics', metrics);
        }

        console.log('📊 ALMA Kids Performance Metrics:', metrics);

        // Mostrar advertencias si hay problemas
        this.checkPerformanceThresholds(metrics);
    }

    calculateTTI() {
        // Simplificado - en producción usar librería específica
        const navigation = performance.getEntriesByType('navigation')[0];
        return navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }

    calculateTBT() {
        // Total Blocking Time simplificado
        const longTasks = performance.getEntriesByType('longtask');
        return longTasks.reduce((total, task) => total + Math.max(0, task.duration - 50), 0);
    }

    calculateSpeedIndex() {
        // Speed Index simplificado
        return this.metrics.lcp || 0;
    }

    checkPerformanceThresholds(metrics) {
        const thresholds = {
            lcp: 2500, // 2.5s
            fid: 100,  // 100ms
            cls: 0.1   // 0.1
        };

        Object.keys(thresholds).forEach(metric => {
            if (metrics[metric] > thresholds[metric]) {
                console.warn(`⚠️ Performance: ${metric.toUpperCase()} por encima del umbral recomendado`);
                
                // Sugerir optimizaciones
                this.suggestOptimizations(metric, metrics[metric]);
            }
        });
    }

    suggestOptimizations(metric, value) {
        const suggestions = {
            lcp: [
                'Optimizar imágenes hero',
                'Implementar preload de recursos críticos',
                'Reducir tiempo de respuesta del servidor'
            ],
            fid: [
                'Reducir JavaScript de terceros',
                'Implementar code splitting',
                'Optimizar event listeners'
            ],
            cls: [
                'Definir dimensiones de imágenes',
                'Reservar espacio para contenido dinámico',
                'Optimizar carga de fuentes'
            ]
        };

        console.log(`💡 Sugerencias para mejorar ${metric.toUpperCase()}:`, suggestions[metric]);
    }

    // Método público para forzar optimización
    static optimize() {
        // Limpiar recursos no utilizados
        if ('memory' in performance) {
            console.log('🧹 Limpiando memoria...');
            
            // Limpiar event listeners huérfanos
            document.querySelectorAll('*').forEach(element => {
                if (element._listeners) {
                    delete element._listeners;
                }
            });
        }

        // Optimizar DOM
        const unusedElements = document.querySelectorAll('[style*="display: none"]:not(.modal)');
        unusedElements.forEach(element => {
            if (!element.classList.contains('keep')) {
                element.remove();
            }
        });

        console.log('⚡ ALMA Kids: Optimización manual completada');
    }
}

// CSS para mejoras de rendimiento
const performanceCSS = `
    /* Optimizaciones de renderizado */
    .globo-img, .service-img, .hero-img {
        content-visibility: auto;
        contain-intrinsic-size: 300px 200px;
    }

    /* Lazy loading placeholder */
    .lazy {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    .loaded {
        animation: none;
        background: none;
    }

    /* Optimización de animaciones */
    .hero-particle, .particle {
        will-change: transform, opacity;
        transform: translateZ(0); /* Force hardware acceleration */
    }

    /* Optimización de scroll */
    .globos-grid, .services-grid {
        contain: layout style paint;
    }

    /* Reducir repaints */
    .btn:hover, .nav-link:hover {
        transform: translateZ(0);
    }

    /* Critical CSS inlined */
    .hero {
        contain: layout;
    }

    /* Optimización de fuentes */
    @font-face {
        font-family: 'Poppins';
        font-display: swap;
        src: local('Poppins');
    }
`;

// Inyectar CSS crítico
const style = document.createElement('style');
style.textContent = performanceCSS;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    console.log('🎪 ALMA Kids: Optimizador de rendimiento activado');
});

// Optimización automática cada 30 segundos
setInterval(() => {
    PerformanceOptimizer.optimize();
}, 30000);

export default PerformanceOptimizer;


