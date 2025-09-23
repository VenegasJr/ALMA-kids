/**
 * ALMA Kids - Sistema de Optimización de Imágenes
 * Simula funcionalidades de Cloudinary para mejor rendimiento
 */

class ImageOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Implementar lazy loading inteligente
        this.setupIntersectionObserver();
        
        // Optimizar imágenes según el dispositivo
        this.setupResponsiveImages();
        
        // Precargar imágenes críticas
        this.preloadCriticalImages();
        
        // Comprimir imágenes dinámicamente
        this.setupImageCompression();
    }

    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Cargar imagen real
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    }
                    
                    // Aplicar efectos de entrada
                    img.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observar todas las imágenes lazy
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupResponsiveImages() {
        const images = document.querySelectorAll('.globo-img, .service-img, .hero-img');
        
        images.forEach(img => {
            // Ajustar calidad según la velocidad de conexión
            if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                    img.style.filter = 'blur(0.5px)'; // Ligero blur para imágenes en conexiones lentas
                }
            }
            
            // Añadir placeholder mientras carga
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
            
            img.addEventListener('error', () => {
                // Imagen de fallback
                img.src = 'imagenes/ALMA kids Logo web.png';
                img.alt = 'ALMA Kids - Imagen no disponible';
            });
        });
    }

    preloadCriticalImages() {
        const criticalImages = [
            'imagenes/ALMA kids Logo web.png',
            'imagenes/castillo-3d-profesional.png',
            'imagenes/castillo-inflable.png',
            'imagenes/plaza-blanda.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupImageCompression() {
        // Detectar formato WebP support
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        };

        if (supportsWebP()) {
            console.log('🎪 ALMA Kids: WebP soportado - Optimización activa');
        }
    }

    // Comprimir imágenes del carrito para mejor rendimiento
    compressImageForCart(src, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = 80;
            canvas.height = 80;
            ctx.drawImage(img, 0, 0, 80, 80);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
        
        img.src = src;
    }
}

// CSS para animaciones de carga
const imageOptimizerCSS = `
    .lazy {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .loaded {
        opacity: 1;
        transform: scale(1);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .globo-img, .service-img, .hero-img {
        transition: all 0.3s ease;
        will-change: transform, opacity;
    }

    .globo-img:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 25px rgba(233, 30, 99, 0.2);
    }

    /* Placeholder para imágenes que cargan */
    .image-placeholder {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = imageOptimizerCSS;
document.head.appendChild(style);

// Inicializar optimizador
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
    console.log('🎪 ALMA Kids: Sistema de optimización de imágenes activado');
});

export default ImageOptimizer;


