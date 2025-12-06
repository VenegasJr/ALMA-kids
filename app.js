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
        features: ['4 horas de uso', 'Espacio: 4x3.5m', 'Instalación incluida']
    },
    {
        id: 'set-active',
        name: 'Set ACTIVE',
        price: 130000,
        image: 'imagenes/Set-alma-active.webp',
        badge: '🔥 POPULAR',
        desc: 'Diversión activa: Castillo (Peque/Rosa) + Piscina + Motricidad + 2 Saltarines + Tatami. Ideal para niños de 1 a 6 años.',
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años']
    },
    {
        id: 'set-mini-play',
        name: 'Pack ALMA MINI PLAY',
        price: 90000,
        image: 'imagenes/Pack-alma-mini-play-machali.png',
        badge: '👶 BEBÉS',
        desc: 'Ideal espacios reducidos. Piscina espuma + Motricidad + Tatami + Cojines. Perfecto para los más pequeños.',
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', 'Ideal bebés']
    },
    {
        id: 'castillo-grand-peque',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand-peque.png',
        badge: '✨ FOTOS',
        desc: 'El gigante de la familia. Blanco impoluto, ideal para fotos y eventos grandes. Medidas: 5x4x2.8m.',
        features: ['Medidas: 5x4x2.8m', 'Requiere 6x6m', 'Capacidad 6 niños']
    },
    {
        id: 'castillo-rosa',
        name: 'Castillo Inflable ROSA',
        price: 75000,
        image: 'imagenes/Castillo-Piscina-redonda.png',
        badge: '💖 ELEGANTE',
        desc: 'Elegante y tierno. Piscina integrada redonda. Perfecto para temáticas delicadas y fotos hermosas.',
        features: ['Medidas: 2.8x2.5x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'castillo-peque',
        name: 'Castillo Inflable PEQUE',
        price: 75000,
        image: 'imagenes/Castillo, Piscina cuadrada.png',
        badge: '🎯 CLÁSICO',
        desc: 'Clásico y seguro. Piscina cuadrada integrada. Colores neutros que combinan con cualquier temática.',
        features: ['Medidas: 2.9x2.8x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'piscina-pelotas',
        name: 'Piscina de Pelotas',
        price: 60000,
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        badge: '👶 SEGURO',
        desc: 'Piscina de espuma segura. Incluye 2 colores de pelotas base. Ideal para los más pequeños.',
        features: ['Medidas: 1.5x1.5m', 'Incluye Tatami', 'Colores a elección']
    },
    {
        id: 'maquina-burbujas',
        name: 'Máquina de Burbujas',
        price: 25000,
        image: 'imagenes/Maquina-burbuja-.png',
        badge: '✨ MAGIA',
        desc: 'Magia flotante para tus fotos. Incluye 700ml de líquido. Más de 2000 burbujas por minuto.',
        features: ['Más de 2000 burbujas/min', 'No tóxico', 'Ideal fotos']
    },
    {
        id: 'carpa-tipi',
        name: 'Carpa Tipi',
        price: 15000,
        image: 'Servicios adicionales/carpa-tipi.jpg',
        badge: '🏕️ RINCÓN',
        desc: 'Rincón de descanso o lectura aesthetic. Altura 160cm, incluye alfombra. Perfecta para crear espacios mágicos.',
        features: ['Altura 160cm', 'Incluye alfombra', 'Materiales premium']
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
            <div class="card-img">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='imagenes/logo-alma-kids-oficial.png'">
            </div>
            <div class="card-body">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                ${p.features ? `
                    <ul class="card-features">
                        ${p.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
                    </ul>
                ` : ''}
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
    
    if (!nombre || !fecha) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const msg = `Hola ALMA Kids! 👋\n\nMi nombre es: *${nombre}*\nFecha del evento: *${fecha}*\n\nMe gustaría cotizar disponibilidad y precios para esta fecha.\n\nGracias! 🙏`;
    
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
});

// SEGURIDAD PARA ENLACES DE INSTAGRAM
function openInstagram(e) {
    e.preventDefault();
    const url = 'https://instagram.com/alma.kidscl';
    
    // Verificar que el dominio sea correcto antes de abrir
    if (url.includes('instagram.com/alma.kidscl')) {
        // Abrir en nueva pestaña con rel="noopener noreferrer" para seguridad
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    } else {
        console.error('URL de Instagram no válida');
    }
}
