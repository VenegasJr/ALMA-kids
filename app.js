/* === ALMA KIDS: LÓGICA COMPLETA 2025 === */

// 1. BASE DE DATOS (Catálogo PDF 2025)
const CATALOGO = [
    // --- SETS / PACKS ---
    {
        id: 'set-alma-magic',
        category: 'Pack Todo Incluido',
        name: 'Set ALMA MAGIC',
        price: 150000,
        image: 'imagenes/Pack-alma-magic.webp',
        badge: 'Más Vendido 🏆',
        description: 'La experiencia definitiva: Castillo (Rosa/Peque) + Piscina + Motricidad + 2 Saltarines + Tipi + Burbujas + Accesorios.',
        features: ['4 horas de uso', 'Espacio: 3.5x4m', 'Instalación incluida']
    },
    {
        id: 'set-active',
        category: 'Pack Diversión',
        name: 'Set ACTIVE',
        price: 130000,
        image: 'imagenes/set-alma-active.webp',
        badge: 'Popular 🔥',
        description: 'Diversión total: Castillo (Peque/Rosa) + Piscina + Motricidad + 2 Saltarines + Tatami.',
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años']
    },
    {
        id: 'set-mini-play',
        category: 'Pack Bebés',
        name: 'Pack ALMA MINI PLAY',
        price: 90000,
        image: 'imagenes/Pack-alma-mini-play-machali.webp',
        description: 'Ideal espacios reducidos. Piscina espuma + Motricidad + Tatami + Cojines.',
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', 'Ideal bebés']
    },

    // --- CASTILLOS ---
    {
        id: 'castillo-grand-peque',
        category: 'Castillos',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand.png',
        description: 'El gigante de la familia. Blanco impoluto, ideal para fotos y eventos grandes.',
        features: ['Medidas: 5x4x2.8m', 'Requiere 6x6m', 'Capacidad 6 niños']
    },
    {
        id: 'castillo-rosa',
        category: 'Castillos',
        name: 'Castillo Inflable ROSA',
        price: 75000,
        image: 'imagenes/castillo-rosa.png',
        description: 'Elegante y tierno. Piscina integrada redonda. Perfecto para temáticas delicadas.',
        features: ['Medidas: 2.8x2.5x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'castillo-peque',
        category: 'Castillos',
        name: 'Castillo Inflable PEQUE',
        price: 75000,
        image: 'imagenes/castillo-peque.webp', 
        description: 'Clásico y seguro. Piscina cuadrada integrada. Colores neutros.',
        features: ['Medidas: 2.9x2.8x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },

    // --- PLAZA BLANDA & EXTRAS ---
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

// 2. SISTEMA DE CARRITO (LocalStorage)
const CART_STORAGE_KEY = 'almakids_cart';
let cart = loadCart();

function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error cargando carrito:', e);
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error('Error guardando carrito:', e);
    }
}

function addToCart(id) {
    const product = CATALOGO.find(p => p.id === id);
    if (!product) {
        console.error('Producto no encontrado:', id);
        return;
    }
    
    // Agregar producto al carrito
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
    });
    
    saveCart();
    updateCartCounters();
    
    // Feedback visual
    showNotification(`${product.name} agregado al carrito 🛒`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCounters();
    renderCartModal();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCounters();
    renderCartModal();
}

function updateCartCounters() {
    const count = cart.length;
    const badges = document.querySelectorAll('.cart-badge, #cartCount, #mobileCartCount');
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

// 3. FUNCIÓN ZOOM
function openZoom(imgSrc) {
    const modal = document.createElement('div');
    modal.id = 'zoom-modal';
    modal.className = 'zoom-modal animate-fade-in';
    modal.onclick = closeZoom;
    modal.innerHTML = `
        <div class="zoom-content">
            <span class="close-btn">&times;</span>
            <img src="${imgSrc}" class="zoom-img">
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Evitar scroll
    
    // Cerrar al hacer clic en el botón X
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeZoom();
        };
    }
    
    // Prevenir cierre al hacer clic en la imagen
    const zoomContent = modal.querySelector('.zoom-content');
    if (zoomContent) {
        zoomContent.onclick = (e) => e.stopPropagation();
    }
}

function closeZoom() {
    const modal = document.getElementById('zoom-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// 4. RENDERIZADO DE CATÁLOGO
function renderCatalog() {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) {
        console.warn('No se encontró el contenedor #catalogo-grid');
        return;
    }
    
    grid.innerHTML = CATALOGO.map(product => `
        <article class="product-card">
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
            <div class="card-image" onclick="openZoom('${product.image}')" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='imagenes/logo-alma-kids-pagina.webp'">
                <div class="zoom-icon"><i class="fas fa-search-plus"></i></div>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <span class="category">${product.category}</span>
                    <h3>${product.name}</h3>
                </div>
                <p class="description">${product.description}</p>
                <div class="card-footer">
                    <div class="price">$${product.price.toLocaleString('es-CL')}</div>
                    <button onclick="addToCart('${product.id}')" class="btn-add">
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// 5. MODAL DE CARRITO
function showCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        renderCartModal();
    }
}

function hideCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function renderCartModal() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }
    
    // Calcular totales
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    cartItemsList.innerHTML = `
        <div class="cart-items">
            ${cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='imagenes/logo-alma-kids-pagina.webp'">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="cart-item-remove">×</button>
                </div>
            `).join('')}
        </div>
        <div class="cart-total">
            <strong>Total: $${total.toLocaleString('es-CL')}</strong>
        </div>
    `;
}

// 6. CHECKOUT WHATSAPP (CORREGIDO)
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío 🛒');
        return;
    }
    
    let text = "¡Hola ALMA Kids! 👋%0AQuiero cotizar lo siguiente:%0A%0A";
    let total = 0;
    
    cart.forEach(item => {
        text += `▪️ *${item.name}* - $${item.price.toLocaleString('es-CL')}%0A`;
        total += item.price;
    });
    
    text += `%0A💰 *TOTAL REF: $${total.toLocaleString('es-CL')}*%0A`;
    text += "%0A📝 *MIS DATOS:*%0A- Nombre:%0A- Fecha:%0A- Dirección:%0A%0AQuedo atento a disponibilidad.";
    
    // Abrir en nueva pestaña
    window.open(`https://wa.me/56969073306?text=${text}`, '_blank');
}

// 7. NOTIFICACIONES
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 8. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar catálogo
    renderCatalog();
    
    // Actualizar contadores de carrito
    updateCartCounters();
    
    // Crear modal de carrito si no existe
    if (!document.getElementById('cartModal')) {
        const modalHTML = `
            <div id="cartModal" class="cart-modal" style="display: none;">
                <div class="cart-modal-content">
                    <div class="cart-modal-header">
                        <h2>🛒 Mi Carrito</h2>
                        <button onclick="hideCartModal()" class="cart-modal-close">×</button>
                    </div>
                    <div id="cartItemsList" class="cart-items-list"></div>
                    <div class="cart-modal-footer">
                        <button onclick="clearCart()" class="btn-clear">Limpiar Todo</button>
                        <button onclick="checkout()" class="btn-checkout">Solicitar Cotización</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// 9. EXPONER FUNCIONES GLOBALES
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.showCartModal = showCartModal;
window.hideCartModal = hideCartModal;
window.checkout = checkout;
window.openZoom = openZoom;
window.closeZoom = closeZoom;
