/* === app.js: Lógica de Negocio ALMA Kids === */

// 1. BASE DE DATOS (Del PDF)

const CATALOGO = [
    {
        id: 'set-alma-magic',
        category: 'Pack Todo Incluido',
        name: 'Set ALMA MAGIC',
        price: 150000,
        image: 'imagenes/Pack-alma-magic.png', 
        badge: 'Más Vendido 🏆',
        description: 'La experiencia definitiva: Castillo (Rosa/Peque) + Piscina + Motricidad + 2 Saltarines + Tipi + Burbujas + Accesorios.',
        features: ['4 horas de uso', 'Espacio: 4x3.5m', 'Instalación incluida']
    },
    {
        id: 'set-active',
        category: 'Pack Diversión',
        name: 'Set ACTIVE',
        price: 125000, 
        image: 'imagenes/Set-alma-active.webp',
        badge: 'Popular 🔥',
        description: 'Diversión total: Castillo (Peque/Rosa) + Piscina + Motricidad + 2 Saltarines + Tatami.',
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años']
    },
    {
        id: 'set-mini-play',
        category: 'Pack Bebés',
        name: 'Pack ALMA MINI PLAY',
        price: 90000,
        image: 'imagenes/Pack-alma-mini-play-machali.png',
        description: 'Ideal espacios reducidos. Piscina espuma + Motricidad + Tatami + Cojines.',
        features: ['4 horas de uso', 'Requiere 2.5x2.5m', 'Ideal bebés']
    },
    {
        id: 'castillo-grand-peque',
        category: 'Castillos',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand-peque.png',
        description: 'El gigante de la familia. Blanco impoluto, ideal para fotos y eventos grandes.',
        features: ['Medidas: 5x4x2.8m', 'Requiere 6x6m', 'Capacidad 6 niños']
    },
    {
        id: 'castillo-rosa',
        category: 'Castillos',
        name: 'Castillo Inflable ROSA',
        price: 75000,
        image: 'imagenes/Castillo-Piscina-redonda.png',
        description: 'Elegante y tierno. Piscina integrada redonda. Perfecto para temáticas delicadas.',
        features: ['Medidas: 2.8x2.5x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'castillo-peque',
        category: 'Castillos',
        name: 'Castillo Inflable PEQUE',
        price: 75000,
        image: 'imagenes/Castillo, Piscina cuadrada.png',
        description: 'Clásico y seguro. Piscina cuadrada integrada. Colores neutros.',
        features: ['Medidas: 2.9x2.8x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'piscina-pelotas',
        category: 'Plaza Blanda',
        name: 'Piscina de Pelotas',
        price: 60000,
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        description: 'Piscina de espuma segura. Incluye 2 colores de pelotas base.',
        features: ['Medidas: 1.5x1.5m', 'Incluye Tatami', 'Colores a elección']
    },
    {
        id: 'maquina-burbujas',
        category: 'Extras',
        name: 'Máquina de Burbujas',
        price: 25000, 
        image: 'imagenes/Maquina-burbuja-.png',
        description: 'Magia flotante para tus fotos. Incluye 700ml de líquido.',
        features: ['Más de 2000 burbujas/min', 'No tóxico', 'Ideal fotos']
    }
];

// 2. CARRITO Y LÓGICA

let cart = JSON.parse(localStorage.getItem('almakids_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    updateCartUI();
    initCarousel(); // Si tienes carrusel en el hero
});

function renderCatalog() {
    const grid = document.getElementById('catalogo-grid');
    if(!grid) return;
    
    grid.innerHTML = CATALOGO.map(product => `
        <article class="product-card">
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='imagenes/logo-alma-kids-pagina.webp'">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <span class="category">${product.category}</span>
                    <h3>${product.name}</h3>
                </div>
                <p class="description">${product.description}</p>
                <ul class="features">
                    ${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <div class="card-footer">
                    <div class="price">$${product.price.toLocaleString('es-CL')}</div>
                    <button onclick="addToCart('${product.id}')" class="btn-add">
                        Agregar <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function addToCart(id) {
    const product = CATALOGO.find(p => p.id === id);
    if(product) {
        cart.push(product);
        localStorage.setItem('almakids_cart', JSON.stringify(cart));
        updateCartUI();
        alert(`${product.name} agregado al carrito 🛒`);
    }
}

function updateCartUI() {
    // Actualizar contadores si existen en el HTML
    const count = cart.length;
    const badges = document.querySelectorAll('.cart-badge, #cartCount');
    badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'flex' : 'none';
    });
}

function initCarousel() {
    // Lógica simple para rotar slides si existen
    const slides = document.querySelectorAll('.carousel-slide');
    let current = 0;
    if(slides.length > 0) {
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000);
    }
}

// Exponer funciones globales
window.addToCart = addToCart;
