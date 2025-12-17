/* === ALMA KIDS LOGIC 2025 === */

// CATÁLOGO COMPLETO DE PRODUCTOS - ACTUALIZADO SEGÚN PDF
const PRODUCTOS = [
    // ========== SETS / PACKS TODO INCLUIDO ==========
    {
        id: 'set-alma-magic',
        name: 'SET "MÁXIMO" Todo Incluido',
        price: 150000,
        image: 'imagenes/Pack-alma-magic.webp',
        badge: '🏆 TOP 1',
        desc: 'SET "MÁXIMO" Todo Incluido. La experiencia definitiva con 12 componentes premium para tu evento.',
        descCompleta: `SET "MÁXIMO" Todo Incluido - La experiencia definitiva para tu evento:

1. Castillo Inflable "ROSA" o "PEQUE", con Piscina incluida.
   L x A x H: 2.8 m x 2.53 m x 2.30 m.

2. Piscina blanca espuma de pelotas.
   L x A x H: 1.50 m x 1.50 m x 0.40 m.

3. Set Motricidad: Escala + túnel + cuña.

4. Saltarín unicornio.

5. Saltarín caballo café.

6. Carpa Tipi.

7. Cojines (01 und), (02 a elección).

8. Alfombra (01 und), color elección (Celeste, Gris y Rosa).

9. Máquina de burbujas + líquido 700ml.

10. Alfombra Tatami. (Rosa/Blanco)-(Beige/Gris)

11. Rincón zapatero.

12. Montaje y retiro de los juegos.

Todo esto por 4 horas de diversión intensa. Requiere espacio mínimo de 3.5m x 2.5m. Precio: $150.000`,
        features: ['4 horas de uso', 'Espacio: 3.5m x 2.5m', '12 componentes incluidos', 'Montaje y retiro incluido']
    },
    {
        id: 'set-active',
        name: 'SET "ALMA ACTIVE"',
        price: 130000,
        image: 'imagenes/set-active.svg',
        badge: '🔥 POPULAR',
        desc: 'Castillo + Piscina + Motricidad + Saltarines + Accesorios. Ideal para espacios medianos y niños activos.',
        descCompleta: `SET "ALMA ACTIVE" - Diversión activa garantizada:

1. Piscina blanca espuma de pelotas Largo x Ancho x Altura 1.50 m × 1.50 m × 0.40 m
2. SET Motricidad: Escala + túnel + cuña
3. Saltarín unicornio
4. Saltarín caballo café
5. Castillo Inflable "PEQUE" o "ROSA" (con piscina integrada)
6. Alfombra Tatami
7. Rincón zapatero
8. Montaje y retiro de los juegos

Ideal para niños de 1 a 6 años. 4 horas de uso continuo. Requiere espacio de 3.5x2.5m. Precio: $130.000`,
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años', '8 componentes incluidos']
    },
    {
        id: 'set-mini-play',
        name: 'PACK "ALMA MINI PLAY"',
        price: 90000,
        image: 'imagenes/set-alma-mini-play.svg',
        badge: '👶 BEBÉS',
        desc: 'Motricidad + Piscina + Accesorios. Ideal espacios reducidos. Perfecto para los más pequeños.',
        descCompleta: `PACK "ALMA MINI PLAY" - Pack diseñado especialmente para los más pequeños:

1. SET Motricidad: Escala + túnel + cuña
2. Piscina blanca espuma de pelotas Largo x Ancho x Altura 1.50 m x 1.50 m x 0.40 m
3. Alfombra Tatami
4. Rincón zapatero
5. Cojines (01 und), (02 a elección)
6. Alfombra (01 und), color elección (Celeste, Gris y Rosa)
7. Montaje y retiro de los juegos

Perfecto para bebés desde 6 meses. 4 horas de uso. Requiere solo 2.5x2.5m de espacio. Precio: $90.000`,
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', 'Ideal bebés', '7 componentes incluidos']
    },
    {
        id: 'set-alma-plus',
        name: 'SET "Alma Plus"',
        price: 80000,
        image: 'imagenes/piscina-pelota-celeste.svg',
        badge: '💫 PLUS',
        desc: 'Piscina + Accesorios. Ideal para complementar tu evento con elementos básicos.',
        descCompleta: `SET "Alma Plus" - Pack básico con piscina y accesorios:

1. Piscina blanca espuma de pelotas Largo x Ancho x Altura 1.50 m x 1.50 m x 0.40 m
2. Alfombra Tatami
3. Rincón zapatero
4. Montaje y retiro de los juegos

Ideal para eventos pequeños o como complemento. 4 horas de uso. Requiere espacio de 2m x 2m. Precio: $80.000`,
        features: ['4 horas de uso', 'Espacio: 2x2m', '4 componentes incluidos', 'Precio accesible']
    },
    {
        id: 'set-alma-party',
        name: 'SET "Alma Party"',
        price: 110000,
        image: 'imagenes/castillo-inflale-rosa.svg',
        badge: '🎉 PARTY',
        desc: 'Castillo Rosa + Motricidad + Accesorios. Perfecto para fiestas temáticas.',
        descCompleta: `SET "Alma Party" - Pack para fiestas temáticas:

1. Castillo Inflable "Rosa", Largo x Ancho x Altura 2.8 m x 2.53 m x 2.30 m
2. SET Motricidad: Escala + túnel + cuña
3. Alfombra Tatami
4. Rincón zapatero
5. Montaje y retiro de los juegos

Perfecto para cumpleaños temáticos. 4 horas de uso. Requiere espacio de 2.5m x 2.5m. Precio: $110.000`,
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', '5 componentes incluidos', 'Temático']
    },
    {
        id: 'castillo-grand-peque',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-inflale-gran-peque.svg',
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
        image: 'imagenes/castillo-inflale-rosa.svg',
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
        image: 'imagenes/castillo-inflale-peque.svg',
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

Ideal para bebés y niños pequeños. El material de espuma garantiza seguridad total. Perfecto para interiores y exteriores. Precio: $60.000`,
        features: ['Medidas: 1.5x1.5m', 'Incluye Tatami', 'Colores a elección', 'Seguro 6 meses+']
    },
    {
        id: 'maquina-burbujas',
        name: 'Máquina de Burbujas',
        price: 15000,
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
        image: 'Servicios adicionales/carpa-tipi.webp',
        badge: '🏕️ RINCÓN',
        desc: 'Rincón de descanso o lectura aesthetic. Altura 160cm, incluye alfombra. Perfecta para crear espacios mágicos.',
        descCompleta: `Crea un rincón mágico para descansar, leer o jugar. Diseño aesthetic que hace que cualquier espacio se vea increíble.

• Altura: 160cm
• Material: Lino y algodón de alta calidad
• Incluye: Alfombra decorativa
• Colores: Naturales y pasteles
• Uso: Interior y exterior (con protección)
• Capacidad: 2-3 niños cómodamente

Perfecta para crear espacios de descanso, lectura o juego tranquilo. El diseño aesthetic hace que las fotos se vean hermosas. 3 horas de uso. Precio: $15.000`,
        features: ['Altura 160cm', 'Incluye alfombra', 'Materiales premium', 'Diseño aesthetic', '3 horas de uso']
    },
    // ========== PRODUCTOS INDIVIDUALES ==========
    {
        id: 'set-motricidad',
        name: 'SET Motricidad',
        price: 25000,
        image: 'imagenes/otros-servicios.webp',
        badge: '🧠 DESARROLLO',
        desc: 'Escala + túnel + cuña. Ideal para desarrollo motor y coordinación. Perfecto para complementar cualquier evento.',
        descCompleta: `SET Motricidad - Desarrollo motor completo:

• Escala de motricidad
• Túnel de gateo
• Cuña de equilibrio

Ideal para desarrollo motor, coordinación y equilibrio. Perfecto para complementar cualquier evento. 4 horas de uso. Precio: $25.000`,
        features: ['Escala + túnel + cuña', 'Desarrollo motor', '4 horas de uso', 'Complemento ideal']
    },
    {
        id: 'saltarin-unicornio',
        name: 'Saltarín Unicornio',
        price: 15000,
        image: 'Servicios adicionales/Inflable-experiencia-saltarin-de-eluche-carestino-18m.webp',
        badge: '🦄 MÁGICO',
        desc: 'Saltarín inflable en forma de unicornio. Divertido y seguro para los más pequeños.',
        descCompleta: `Saltarín Unicornio - Diversión mágica:

• Diseño: Unicornio inflable
• Uso: Interior y exterior
• Edad: Desde 18 meses
• Capacidad: Hasta 20 kg

Perfecto para fiestas temáticas de unicornios. Divertido y seguro. 3 horas de uso. Precio: $15.000`,
        features: ['Diseño unicornio', 'Desde 18 meses', 'Hasta 20 kg', '3 horas de uso']
    },
    {
        id: 'saltarin-caballo',
        name: 'Saltarín Caballo Café',
        price: 15000,
        image: 'Servicios adicionales/Inflable-saltarin-de-eluche-carestino-18m.webp',
        badge: '🐴 AVENTURA',
        desc: 'Saltarín inflable en forma de caballo café. Ideal para niños activos y aventureros.',
        descCompleta: `Saltarín Caballo Café - Aventura garantizada:

• Diseño: Caballo café inflable
• Uso: Interior y exterior
• Edad: Desde 18 meses
• Capacidad: Hasta 20 kg

Perfecto para niños activos. Divertido y seguro. 3 horas de uso. Precio: $15.000`,
        features: ['Diseño caballo', 'Desde 18 meses', 'Hasta 20 kg', '3 horas de uso']
    },
    {
        id: 'liquido-1l',
        name: 'Líquido Burbujas 1L',
        price: 5000,
        image: 'imagenes/Maquina-burbuja-.png',
        badge: '💧 EXTRA',
        desc: 'Líquido adicional para máquina de burbujas. Botella de 1 litro. Perfecto para eventos largos.',
        descCompleta: `Líquido Burbujas 1L - Recarga adicional:
        
• Capacidad: 1 litro
• Compatible: Máquina de burbujas ALMA Kids
• Uso: Recarga para eventos largos
• Material: No tóxico, seguro para niños

Ideal para extender la diversión con más burbujas. Precio: $5.000`,
        features: ['1 litro', 'No tóxico', 'Recarga adicional', 'Seguro']
    },
    {
        id: 'alfombra-tatami',
        name: 'Alfombra Tatami',
        price: 10000,
        image: 'imagenes/Piso-goma-tatami-rosa-blanco.png',
        badge: '🛡️ SEGURIDAD',
        desc: 'Alfombra de seguridad Tatami. Colores disponibles: Rosa/Blanco o Beige/Gris.',
        descCompleta: `Alfombra Tatami - Seguridad y comodidad:

• Material: Goma EVA de alta densidad
• Colores: Rosa/Blanco o Beige/Gris
• Uso: Protección y comodidad
• Fácil limpieza

Ideal para proteger y dar comodidad en cualquier espacio de juego. Precio: $10.000`,
        features: ['Material EVA', 'Colores disponibles', 'Fácil limpieza', 'Protección']
    },
    {
        id: 'cojines',
        name: 'Cojines Decorativos',
        price: 5000,
        image: 'imagenes/cojin-corazon.jpg',
        badge: '🪑 DECORACIÓN',
        desc: 'Cojines decorativos. 01 unidad base, 02 adicionales a elección. Perfectos para decoración y comodidad.',
        descCompleta: `Cojines Decorativos - Estilo y comodidad:

• Incluye: 01 unidad base
• Adicionales: 02 a elección
• Diseños: Varios disponibles
• Uso: Decoración y comodidad

Perfectos para complementar la decoración de tu evento. Precio: $5.000 (unidad base)`,
        features: ['01 unidad base', '02 adicionales', 'Varios diseños', 'Decoración']
    },
    {
        id: 'alfombra-decorativa',
        name: 'Alfombra Decorativa',
        price: 8000,
        image: 'imagenes/tatami-rosa.jpg',
        badge: '🎨 ESTILO',
        desc: 'Alfombra decorativa. Colores disponibles: Celeste, Gris y Rosa. Perfecta para crear ambientes aesthetic.',
        descCompleta: `Alfombra Decorativa - Estilo aesthetic:

• Colores: Celeste, Gris y Rosa
• Material: Suave y cómodo
• Uso: Decoración y comodidad
• Fácil limpieza

Perfecta para crear ambientes aesthetic en tu evento. Precio: $8.000`,
        features: ['3 colores disponibles', 'Material suave', 'Fácil limpieza', 'Estilo aesthetic']
    },
    {
        id: 'rincon-zapatero',
        name: 'Rincón Zapatero',
        price: 5000,
        image: 'imagenes/otros-servicios.webp',
        badge: '👟 ORGANIZACIÓN',
        desc: 'Rincón zapatero para mantener el orden. Ideal para organizar zapatos y mantener el espacio limpio.',
        descCompleta: `Rincón Zapatero - Organización perfecta:

• Función: Organización de zapatos
• Material: Resistente y fácil limpieza
• Uso: Mantener orden en el evento
• Tamaño: Compacto

Ideal para mantener el orden y la organización durante tu evento. Precio: $5.000`,
        features: ['Organización', 'Fácil limpieza', 'Compacto', 'Práctico']
    }
];

// INYECTAR PRODUCTOS CON ANIMACIONES
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-productos');
    if (!grid) return;
    
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
                <a href="https://wa.me/56969073306?text=${encodeURIComponent(`💖 *¡Hola ALMA Kids!* 💖\n\n✨ Me encantaría cotizar el siguiente producto:\n\n🎈 *${p.name}*\n💝 Precio: *$${p.price.toLocaleString('es-CL')}*\n\n🌸 ¿Podrían ayudarme con disponibilidad y más información?\n\n💕 ¡Muchas gracias! 💕`)}" target="_blank" rel="noopener noreferrer" class="btn-add">
                    <i class="fa-brands fa-whatsapp"></i> Cotizar por WhatsApp
                </a>
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

// Funciones eliminadas - Carrito no utilizado

function sendForm(e) {
    e.preventDefault();
    const nombre = document.getElementById('formName').value;
    const fecha = document.getElementById('formDate').value;
    const mensaje = document.getElementById('formMessage')?.value || '';
    
    if (!nombre || !fecha) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }
    
    let msg = `💖 *¡Hola ALMA Kids!* 💖\n\n`;
    msg += `✨ Me gustaría solicitar información y cotización para mi evento:\n\n`;
    msg += `👤 *Nombre:* ${nombre}\n`;
    msg += `📅 *Fecha del evento:* ${fecha}\n\n`;
    
    if (mensaje) {
        msg += `💬 *Mensaje adicional:*\n${mensaje}\n\n`;
    }
    
    msg += `🌸 ¿Podrían ayudarme con disponibilidad y precios para esta fecha?\n\n`;
    msg += `💕 ¡Quedo atento a su respuesta! 💕\n\n`;
    msg += `_Gracias por su atención_ ✨`;
    
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
    initScrollToTop();
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
                <a href="https://wa.me/56969073306?text=${encodeURIComponent(`💖 *¡Hola ALMA Kids!* 💖\n\n✨ Me encantaría cotizar el siguiente producto:\n\n🎈 *${producto.name}*\n💝 Precio: *$${producto.price.toLocaleString('es-CL')}*\n\n${producto.desc ? `📝 *Descripción:*\n${producto.desc}\n\n` : ''}🌸 ¿Podrían ayudarme con disponibilidad y más información?\n\n💕 ¡Muchas gracias! 💕`)}" target="_blank" class="btn-add-large" onclick="closeDetailsModal();">
                    <i class="fa-brands fa-whatsapp"></i> Cotizar por WhatsApp
                </a>
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

// INICIALIZAR BOTÓN SCROLL TO TOP
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Scroll suave al hacer clic
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Funciones globales para exponer de forma segura
window.openInstagram = openInstagram;
window.openFacebook = openFacebook;
