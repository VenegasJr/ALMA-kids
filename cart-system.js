// Sistema de Carrito Unificado ALMA Kids
// ========================================

// Variables globales del carrito
let cart = JSON.parse(localStorage.getItem('almakids_cart')) || [];
let lastAddToCartMs = 0;

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    updateCartCount();
    createCartModal();
    createCartButton();
});

// Inicializar el carrito
function initializeCart() {
    // Crear botón flotante del carrito si no existe
    if (!document.getElementById('cart-float')) {
        createCartButton();
    }
    
    // Crear modal del carrito si no existe
    if (!document.getElementById('cartModal')) {
        createCartModal();
    }
    
    console.log('✅ Sistema de carrito inicializado');
}

// Crear botón flotante del carrito
function createCartButton() {
    const cartButton = document.createElement('div');
    cartButton.id = 'cart-float';
    cartButton.className = 'cart-float';
    cartButton.innerHTML = `
        <button class="cart-btn" onclick="openCartModal()" title="Ver carrito">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartCount" class="cart-count">0</span>
        </button>
    `;
    document.body.appendChild(cartButton);
}

// Crear modal del carrito
function createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="cart-modal-content modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Mi Carrito ALMA Kids</h3>
                <button class="close-modal" onclick="closeCartModal()"><i class="fas fa-times"></i></button>
            </div>
            <div id="cartItems" class="cart-items"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="clearCart()">
                    <i class="fas fa-trash"></i> Vaciar Carrito
                </button>
                <button class="btn btn-primary" onclick="requestQuote()">
                    <i class="fas fa-paper-plane"></i> Solicitar Cotización
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Abrir modal del carrito
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        updateCartDisplay();
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal del carrito abierto');
    }
}

// Cerrar modal del carrito
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('✅ Modal del carrito cerrado');
    }
}

// Agregar producto al carrito
function addToCart(productData) {
    const now = Date.now();
    if (now - lastAddToCartMs < 500) {
        return; // Prevenir doble clic
    }
    lastAddToCartMs = now;

    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            category: productData.category || 'Servicio',
            image: productData.image || '',
            quantity: 1
        });
    }
    
    localStorage.setItem('almakids_cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification(productData.name);
    
    // Abrir carrito automáticamente
    setTimeout(() => {
        openCartModal();
    }, 1000);
}

// Función específica para agregar servicios
function addServiceToCart(serviceData) {
    const productData = {
        id: serviceData.id || serviceData.name.toLowerCase().replace(/\s+/g, '-'),
        name: serviceData.name,
        price: serviceData.price,
        category: 'Servicio',
        image: serviceData.image || ''
    };
    
    addToCart(productData);
}

// Mostrar notificación de producto agregado
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="cart-notification-content">
            <div class="cart-notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="cart-notification-text">
                <h4>¡Agregado al carrito!</h4>
                <p>${productName}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar notificación
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animación del contador
        if (totalItems > 0) {
            cartCount.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
    }
}

// Actualizar display del carrito
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h4>Tu carrito está vacío</h4>
                <p>¡Agrega algunos servicios para empezar!</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> Ver Servicios
                </a>
            </div>
        `;
        return;
    }
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = `
        <div class="cart-header-info">
            <h4><i class="fas fa-list"></i> ${totalItems} producto${totalItems > 1 ? 's' : ''} en tu carrito</h4>
        </div>
        <div class="cart-items-list">
            ${cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        ${item.image ? 
                            `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">` :
                            `<i class="fas fa-image"></i>`
                        }
                    </div>
                    <div class="cart-item-details">
                        <h5 class="cart-item-name">${item.name}</h5>
                        <p class="cart-item-category"><i class="fas fa-tag"></i> ${item.category}</p>
                        <p class="cart-item-price">$${item.price.toLocaleString()} c/u</p>
                        
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" onclick="updateQuantity('${item.id}', -1)" title="Disminuir cantidad">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase" onclick="updateQuantity('${item.id}', 1)" title="Aumentar cantidad">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="Eliminar del carrito">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <i class="fas fa-calculator"></i>
                <span>Total: <strong>$${totalPrice.toLocaleString()}</strong></span>
            </div>
            <div class="cart-note">
                <i class="fas fa-info-circle"></i>
                <span>Precios incluyen IVA. Transporte y montaje incluidos.</span>
            </div>
        </div>
    `;
}

// Actualizar cantidad de un producto
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('almakids_cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
}

// Eliminar producto del carrito
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('almakids_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showCartNotification(`${item.name} eliminado del carrito`);
    }
}

// Limpiar carrito
function clearCart() {
    cart = [];
    localStorage.removeItem('almakids_cart');
    updateCartCount();
    updateCartDisplay();
    showCartNotification('Carrito limpiado');
}

// Solicitar cotización
function requestQuote() {
    if (cart.length === 0) {
        showCartNotification('Agrega productos al carrito primero');
        return;
    }
    
    let message = '🎪 *ALMA Kids - Cotización de Carrito*\n\n';
    message += '*Productos seleccionados:*\n';
    
    cart.forEach(item => {
        message += `• ${item.name} - Cantidad: ${item.quantity} - $${item.price.toLocaleString()} c/u\n`;
    });
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    message += `\n*Total estimado: $${totalPrice.toLocaleString()}*\n\n`;
    message += 'Por favor, confirma disponibilidad y detalles del evento.';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('✅ Cotización enviada por WhatsApp');
}

// Función para agregar servicios específicos de ALMA Kids
function addCastilloToCart(castilloType) {
    const castillos = {
        'piscina-cuadrada': {
            name: 'Castillo Piscina Cuadrada',
            price: 75000,
            image: 'imagenes/Castillo, Piscina cuadrada.png'
        },
        'inflable-portada': {
            name: 'Castillo Inflable Portada',
            price: 75000,
            image: 'imagenes/Castillo-inflable-portadas.png'
        },
        'piscina-redonda': {
            name: 'Castillo Piscina Redonda',
            price: 75000,
            image: 'imagenes/Castillo-Piscina-redonda.png'
        }
    };
    
    const castillo = castillos[castilloType];
    if (castillo) {
        addServiceToCart(castillo);
    }
}

function addPiscinaToCart() {
    addServiceToCart({
        name: 'Piscina de Pelotas',
        price: 55000,
        image: 'imagenes/plaza-blanda.png'
    });
}

function addCarpaTipiToCart() {
    addServiceToCart({
        name: 'Carpa Tipi',
        price: 15000,
        image: 'divierte jugando /carpa-tipi.jpg'
    });
}

function addInflableCarestinoToCart() {
    addServiceToCart({
        name: 'Inflable Saltarín Carestino',
        price: 15000,
        image: 'divierte jugando /Inflable-saltarin-de-eluche-carestino-18m.jpg'
    });
}

function addMaquinaBurbujasToCart() {
    addServiceToCart({
        name: 'Máquina de Burbujas',
        price: 15000,
        image: 'imagenes/Maquina-burbuja-.png'
    });
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCartModal();
    }
});

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('cartModal');
    if (modal && e.target === modal) {
        closeCartModal();
    }
});

console.log('✅ Sistema de carrito unificado cargado');
