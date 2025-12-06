/* === ALMA KIDS LOGIC 2025 === */

// CATÁLOGO COMPLETO DE PRODUCTOS
const PRODUCTOS = [
    {
        id: 'set-alma-magic',
        name: 'Set ALMA MAGIC',
        price: 150000,
        image: 'imagenes/Pack-alma-magic.png',
        badge: '🏆 TOP 1',
        desc: 'Pack completo: Castillo (Rosa/Peque) + Piscina + Motricidad + 2 Saltarines + Tipi + Burbujas + Accesorios. La experiencia definitiva para tu evento.',
        descCompleta: `La experiencia definitiva para tu evento. Este pack incluye TODO lo necesario para una fiesta inolvidable:

• Castillo Inflable (Rosa o Peque) - El centro de la diversión
• Piscina de Pelotas - Seguridad y diversión para los más pequeños
• Circuito de Motricidad - Desarrollo y entretenimiento
• 2 Saltarines de Peluche - Diversión adicional
• Carpa Tipi - Rincón mágico para descansar
• Máquina de Burbujas - Magia flotante para las fotos
• Tatami de Seguridad - Protección total
• Accesorios decorativos - Para que todo se vea perfecto

Todo esto por 4 horas de diversión intensa. Requiere espacio de 4x3.5m. Instalación y retiro incluidos.`,
        features: ['4 horas de uso', 'Espacio: 4x3.5m', 'Instalación incluida', 'Todo incluido']
    },
    {
        id: 'set-active',
        name: 'Set ACTIVE',
        price: 130000,
        image: 'imagenes/Set-alma-active.webp',
        badge: '🔥 POPULAR',
        desc: 'Diversión activa: Castillo (Peque/Rosa) + Piscina + Motricidad + 2 Saltarines + Tatami. Ideal para niños de 1 a 6 años.',
        descCompleta: `Diversión activa garantizada. Este pack incluye:

• Castillo Inflable (Peque o Rosa) - Con piscina integrada
• Piscina de Pelotas - Seguridad y entretenimiento
• Circuito de Motricidad - Desarrollo motor
• 2 Saltarines de Peluche - Para saltar y jugar
• Tatami de Seguridad - Protección en todo momento

Ideal para niños de 1 a 6 años. 4 horas de uso continuo. Requiere espacio de 3.5x2.5m. Instalación profesional incluida.`,
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años', 'Instalación incluida']
    },
    {
        id: 'set-mini-play',
        name: 'Pack ALMA MINI PLAY',
        price: 90000,
        image: 'imagenes/Pack-alma-mini-play-machali.png',
        badge: '👶 BEBÉS',
        desc: 'Ideal espacios reducidos. Piscina espuma + Motricidad + Tatami + Cojines. Perfecto para los más pequeños.',
        descCompleta: `Pack diseñado especialmente para los más pequeños y espacios reducidos. Incluye:

• Piscina de Espuma - Seguridad total para bebés
• Circuito de Motricidad - Desarrollo sensorial
• Tatami de Seguridad - Protección en cada paso
• Cojines Decorativos - Comodidad y estética
• Pelotas de Colores - Estimulación visual

Perfecto para bebés desde 6 meses. 4 horas de uso. Requiere solo 2.5x2.5m de espacio. Ideal para interiores.`,
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', 'Ideal bebés', 'Seguro 6 meses+']
    },
    {
        id: 'castillo-grand-peque',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand-peque.png',
        badge: '✨ FOTOS',
        desc: 'El gigante de la familia. Blanco impoluto, ideal para fotos y eventos grandes. Medidas: 5x4x2.8m.',
        descCompleta: `El castillo más grande de nuestro catálogo. Perfecto para eventos grandes y fotos espectaculares.

• Medidas: 5m x 4m x 2.8m de altura
• Color: Blanco impoluto - Ideal para fotos
• Capacidad: Hasta 6 niños simultáneos
• Espacio requerido: 6m x 6m (incluye seguridad)
• Conexión eléctrica: Máximo 10 metros
• Incluye: Pelotas de colores, limpieza profunda

Ideal para eventos al aire libre, cumpleaños grandes y celebraciones especiales. El diseño blanco hace que las fotos se vean increíbles.`,
        features: ['Medidas: 5x4x2.8m', 'Requiere 6x6m', 'Capacidad 6 niños', 'Blanco impoluto']
    },
    {
        id: 'castillo-rosa',
        name: 'Castillo Inflable ROSA',
        price: 75000,
        image: 'imagenes/Castillo-Piscina-redonda.png',
        badge: '💖 ELEGANTE',
        desc: 'Elegante y tierno. Piscina integrada redonda. Perfecto para temáticas delicadas y fotos hermosas.',
        descCompleta: `Castillo elegante con diseño delicado en tonos rosa pastel. Perfecto para temáticas de princesas y eventos estéticos.

• Medidas: 2.8m x 2.5m x 2.3m de altura
• Piscina integrada: Redonda con pelotas incluidas
• Color: Rosa pastel elegante
• Capacidad: Hasta 4 niños simultáneos
• Espacio requerido: 3.5m x 3.5m
• Incluye: Pelotas de colores, limpieza profunda

Ideal para cumpleaños de niñas, temáticas de princesas y eventos donde la estética es importante. Las fotos quedan hermosas.`,
        features: ['Medidas: 2.8x2.5x2.3m', 'Incluye pelotas', 'Capacidad 4 niños', 'Rosa pastel']
    },
    {
        id: 'castillo-peque',
        name: 'Castillo Inflable PEQUE',
        price: 75000,
        image: 'imagenes/Castillo, Piscina cuadrada.png',
        badge: '🎯 CLÁSICO',
        desc: 'Clásico y seguro. Piscina cuadrada integrada. Colores neutros que combinan con cualquier temática.',
        descCompleta: `El clásico de ALMA Kids. Diseño seguro y versátil que combina con cualquier temática.

• Medidas: 2.9m x 2.8m x 2.3m de altura
• Piscina integrada: Cuadrada con pelotas incluidas
• Colores: Neutros (blanco, gris, beige)
• Capacidad: Hasta 4 niños simultáneos
• Espacio requerido: 3.5m x 3.5m
• Incluye: Pelotas de colores, limpieza profunda

Perfecto para cualquier temática. Los colores neutros hacen que se adapte a cualquier decoración. Muy seguro y confiable.`,
        features: ['Medidas: 2.9x2.8x2.3m', 'Incluye pelotas', 'Capacidad 4 niños', 'Colores neutros']
    },
    {
        id: 'piscina-pelotas',
        name: 'Piscina de Pelotas',
        price: 60000,
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        badge: '👶 SEGURO',
        desc: 'Piscina de espuma segura. Incluye 2 colores de pelotas base. Ideal para los más pequeños.',
        descCompleta: `Piscina de espuma segura diseñada especialmente para los más pequeños. Máxima seguridad y diversión.

• Medidas: 1.5m x 1.5m
• Material: Espuma de alta densidad
• Pelotas: 2 colores base incluidos (más colores disponibles)
• Tatami de seguridad: Incluido
• Colores disponibles: Blanco, Rosa, Celeste, Amarillo
• Edad recomendada: Desde 6 meses

Ideal para bebés y niños pequeños. El material de espuma garantiza seguridad total. Perfecto para interiores y exteriores.`,
        features: ['Medidas: 1.5x1.5m', 'Incluye Tatami', 'Colores a elección', 'Seguro 6 meses+']
    },
    {
        id: 'maquina-burbujas',
        name: 'Máquina de Burbujas',
        price: 25000,
        image: 'imagenes/Maquina-burbuja-.png',
        badge: '✨ MAGIA',
        desc: 'Magia flotante para tus fotos. Incluye 700ml de líquido. Más de 2000 burbujas por minuto.',
        descCompleta: `Agrega magia a tu evento con nuestra máquina de burbujas profesional. Perfecta para fotos increíbles.

• Capacidad: Más de 2000 burbujas por minuto
• Líquido incluido: 700ml (dura todo el evento)
• Material: No tóxico, seguro para niños
• Funcionamiento: Continuo y automático
• Ideal para: Fotos, videos, momentos especiales
• Uso: Interior y exterior

Transforma cualquier momento en algo mágico. Las burbujas hacen que las fotos se vean increíbles y los niños se divierten mucho.`,
        features: ['Más de 2000 burbujas/min', 'No tóxico', 'Ideal fotos', '700ml incluido']
    },
    {
        id: 'carpa-tipi',
        name: 'Carpa Tipi',
        price: 15000,
        image: 'Servicios adicionales/carpa-tipi.jpg',
        badge: '🏕️ RINCÓN',
        desc: 'Rincón de descanso o lectura aesthetic. Altura 160cm, incluye alfombra. Perfecta para crear espacios mágicos.',
        descCompleta: `Crea un rincón mágico para descansar, leer o jugar. Diseño aesthetic que hace que cualquier espacio se vea increíble.

• Altura: 160cm
• Material: Lino y algodón de alta calidad
• Incluye: Alfombra decorativa
• Colores: Naturales y pasteles
• Uso: Interior y exterior (con protección)
• Capacidad: 2-3 niños cómodamente

Perfecta para crear espacios de descanso, lectura o juego tranquilo. El diseño aesthetic hace que las fotos se vean hermosas.`,
        features: ['Altura 160cm', 'Incluye alfombra', 'Materiales premium', 'Diseño aesthetic']
    }
];

// INYECTAR PRODUCTOS CON ANIMACIONES
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-productos');
    if (!grid) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarBadge(carrito.length);

    grid.innerHTML = PRODUCTOS.map((p, index) => `
        <article class="card" style="animation-delay: ${index * 0.1}s">
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
            <div class="card-img" onclick="openImageZoom('${p.image}', '${p.name}')">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='imagenes/logo-alma-kids-oficial.png'">
                <div class="zoom-overlay">
                    <i class="fa-solid fa-search-plus"></i>
                    <span>Click para ampliar</span>
                </div>
            </div>
            <div class="card-body">
                <h3>${p.name}</h3>
                <p class="card-desc-short">${p.desc}</p>
                ${p.features ? `
                    <ul class="card-features">
                        ${p.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
                    </ul>
                ` : ''}
                <button class="btn-ver-detalles" onclick="verDetallesCompletos('${p.id}')">
                    <i class="fa-solid fa-info-circle"></i> Ver descripción completa
                </button>
                <div class="price">$${p.price.toLocaleString('es-CL')}</div>
                <button class="btn-add" onclick="agregar('${p.id}')">
                    <span>Agregar al Carrito</span>
                </button>
            </div>
        </article>
    `).join('');

    // Inicializar animaciones de scroll
    initScrollAnimations();
});

// ANIMACIONES AL HACER SCROLL
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar secciones animadas
    document.querySelectorAll('.animated-section').forEach(section => {
        observer.observe(section);
    });

    // Observar cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    // Observar benefit cards
    document.querySelectorAll('.benefit-card').forEach(card => {
        observer.observe(card);
    });
}

// CARRITO
function agregar(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const prod = PRODUCTOS.find(p => p.id === id);
    
    if (!prod) return;
    
    carrito.push(prod);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarBadge(carrito.length);
    
    // Feedback visual
    const btn = event.target.closest('.btn-add');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>¡Agregado! ✓</span>';
        btn.style.background = '#4ecdc4';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 1500);
    }
}

function actualizarBadge(num) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = num;
        if (num > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function toggleCart() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío 🛒\nAgrega productos para cotizar.');
        return;
    }
    
    let msg = "Hola ALMA Kids! 👋\n\nQuiero cotizar los siguientes productos:\n\n";
    let total = 0;
    
    carrito.forEach((p, index) => {
        msg += `${index + 1}. ${p.name} - $${p.price.toLocaleString('es-CL')}\n`;
        total += p.price;
    });
    
    msg += `\n💰 Total Referencial: $${total.toLocaleString('es-CL')}`;
    msg += `\n\n📝 Mis datos:\n- Nombre: `;
    msg += `\n- Fecha del evento: `;
    msg += `\n- Dirección/Comuna: `;
    msg += `\n\nQuedo atento a disponibilidad. Gracias! 🙏`;
    
    window.open(`https://wa.me/56969073306?text=${encodeURIComponent(msg)}`, '_blank');
}

function sendForm(e) {
    e.preventDefault();
    const nombre = document.getElementById('formName').value;
    const fecha = document.getElementById('formDate').value;
    const mensaje = document.getElementById('formMessage')?.value || '';
    
    if (!nombre || !fecha) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    let msg = `Hola ALMA Kids! 👋\n\n`;
    msg += `Mi nombre es: *${nombre}*\n`;
    msg += `Fecha del evento: *${fecha}*\n\n`;
    
    if (mensaje) {
        msg += `Mensaje:\n${mensaje}\n\n`;
    }
    
    msg += `Me gustaría cotizar disponibilidad y precios para esta fecha.\n\nGracias! 🙏`;
    
    window.open(`https://wa.me/56969073306?text=${encodeURIComponent(msg)}`, '_blank');
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// MENÚ MÓVIL
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMobile.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    if (menuToggle && navMobile) {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Inicializar menú móvil al cargar
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initWhatsAppFloat();
    initPDFGallery();
    initWhatsAppStatus();
});

// ZOOM DE IMÁGENES
function openImageZoom(imageSrc, imageAlt) {
    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
        <div class="zoom-modal-content">
            <button class="zoom-close" onclick="closeImageZoom()" aria-label="Cerrar">
                <i class="fa-solid fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="${imageAlt}" class="zoom-image">
            <div class="zoom-caption">${imageAlt}</div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageZoom();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeImageZoom();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeImageZoom() {
    const modal = document.querySelector('.image-zoom-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// VER DETALLES COMPLETOS DEL PRODUCTO
function verDetallesCompletos(productId) {
    const producto = PRODUCTOS.find(p => p.id === productId);
    if (!producto) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-details-modal';
    modal.innerHTML = `
        <div class="details-modal-content">
            <button class="details-close" onclick="closeDetailsModal()" aria-label="Cerrar">
                <i class="fa-solid fa-times"></i>
            </button>
            <div class="details-header">
                <img src="${producto.image}" alt="${producto.name}" class="details-image">
                <div class="details-title-section">
                    ${producto.badge ? `<span class="details-badge">${producto.badge}</span>` : ''}
                    <h2>${producto.name}</h2>
                    <div class="details-price">$${producto.price.toLocaleString('es-CL')}</div>
                </div>
            </div>
            <div class="details-body">
                <h3>Descripción Completa</h3>
                <div class="details-text">${producto.descCompleta || producto.desc}</div>
                ${producto.features ? `
                    <h3>Características</h3>
                    <ul class="details-features">
                        ${producto.features.map(f => `<li><i class="fa-solid fa-check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
            <div class="details-footer">
                <button class="btn-add-large" onclick="agregar('${producto.id}'); closeDetailsModal();">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDetailsModal();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeDetailsModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeDetailsModal() {
    const modal = document.querySelector('.product-details-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Exponer funciones globalmente
window.openImageZoom = openImageZoom;
window.closeImageZoom = closeImageZoom;
window.verDetallesCompletos = verDetallesCompletos;
window.closeDetailsModal = closeDetailsModal;

// INICIALIZAR ESTADO DE WHATSAPP
function initWhatsAppStatus() {
    const statusDot = document.getElementById('whatsappStatus');
    const statusText = document.getElementById('whatsappStatusText');
    
    if (!statusDot || !statusText) return;
    
    // Simular verificación de estado (en producción, usar API de WhatsApp Business)
    // Por ahora, asumimos que está disponible
    const checkWhatsAppStatus = async () => {
        try {
            // Intentar verificar si el número está disponible
            // Nota: WhatsApp no tiene API pública para esto, pero podemos simular
            const isOnline = true; // Cambiar según lógica real
            
            if (isOnline) {
                statusDot.classList.remove('offline');
                statusText.classList.remove('offline');
                statusText.textContent = 'Disponible ahora';
            } else {
                statusDot.classList.add('offline');
                statusText.classList.add('offline');
                statusText.textContent = 'Fuera de línea';
            }
        } catch (error) {
            // Si hay error, asumir que está disponible
            statusDot.classList.remove('offline');
            statusText.classList.remove('offline');
            statusText.textContent = 'Disponible ahora';
        }
    };
    
    // Verificar estado inicial
    checkWhatsAppStatus();
    
    // Verificar cada 5 minutos
    setInterval(checkWhatsAppStatus, 300000);
}

// INICIALIZAR GALERÍA DE IMÁGENES DEL PDF
function initPDFGallery() {
    // Lista de imágenes del PDF (actualizar cuando se extraigan)
    const pdfImages = [
        // Ejemplo de estructura - Reemplazar con las imágenes reales extraídas del PDF
        // 'imagenes/catalogo-pdf/imagen1.jpg',
        // 'imagenes/catalogo-pdf/imagen2.jpg',
        // etc...
    ];
    
    const galleryContainer = document.getElementById('gallery-pdf');
    if (!galleryContainer || pdfImages.length === 0) return;
    
    // Mostrar sección si hay imágenes
    const gallerySection = document.getElementById('galeria-pdf');
    if (gallerySection && pdfImages.length > 0) {
        gallerySection.style.display = 'block';
        
        galleryContainer.innerHTML = pdfImages.map((img, index) => `
            <div class="gallery-item fade-in" style="animation-delay: ${index * 0.1}s">
                <img src="${img}" alt="Producto ALMA Kids ${index + 1}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fa-solid fa-search-plus"></i>
                </div>
            </div>
        `).join('');
    }
}

// INICIALIZAR BOTÓN WHATSAPP FLOTANTE
function initWhatsAppFloat() {
    const whatsappBtn = document.getElementById('whatsappFloat');
    if (whatsappBtn) {
        // Validar URL de WhatsApp antes de permitir el clic
        whatsappBtn.addEventListener('click', (e) => {
            const href = whatsappBtn.getAttribute('href');
            if (href && href.includes('wa.me/56969073306')) {
                // URL válida, permitir navegación
                // El rel="noopener noreferrer" ya está en el HTML para seguridad
            } else {
                e.preventDefault();
                console.warn('URL de WhatsApp no válida');
            }
        });
        
        // Agregar animación de entrada
        setTimeout(() => {
            whatsappBtn.style.opacity = '0';
            whatsappBtn.style.transform = 'scale(0)';
            whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                whatsappBtn.style.opacity = '1';
                whatsappBtn.style.transform = 'scale(1)';
            }, 500);
        }, 1000);
    }
}

// SEGURIDAD PARA ENLACES DE INSTAGRAM
function openInstagram(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // URL segura y validada
    const safeUrl = 'https://www.instagram.com/alma.kidscl/';
    const allowedDomain = 'instagram.com';
    
    // Validación estricta de seguridad
    try {
        const urlObj = new URL(safeUrl);
        
        // Verificar que sea el dominio correcto
        if (urlObj.hostname.includes(allowedDomain) && urlObj.pathname.includes('alma.kidscl')) {
            // Abrir de forma segura
            const link = document.createElement('a');
            link.href = safeUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer nofollow';
            link.setAttribute('aria-label', 'Abrir perfil de Instagram de ALMA Kids');
            
            // Agregar al DOM temporalmente para compatibilidad
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn('Intento de acceso a URL no autorizada bloqueado');
        }
    } catch (error) {
        console.error('Error al validar URL de Instagram:', error);
    }
}

// SEGURIDAD PARA ENLACES DE FACEBOOK
function openFacebook(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // URL segura y validada
    const safeUrl = 'https://www.facebook.com/almakidscl';
    const allowedDomain = 'facebook.com';
    
    // Validación estricta de seguridad
    try {
        const urlObj = new URL(safeUrl);
        
        // Verificar que sea el dominio correcto
        if (urlObj.hostname.includes(allowedDomain)) {
            // Abrir de forma segura
            const link = document.createElement('a');
            link.href = safeUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer nofollow';
            link.setAttribute('aria-label', 'Abrir página de Facebook de ALMA Kids');
            
            // Agregar al DOM temporalmente para compatibilidad
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn('Intento de acceso a URL no autorizada bloqueado');
        }
    } catch (error) {
        console.error('Error al validar URL de Facebook:', error);
    }
}

// Funciones globales para exponer de forma segura
window.openInstagram = openInstagram;
window.openFacebook = openFacebook;
