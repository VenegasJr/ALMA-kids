/**
 * ALMA Kids - Sistema Funcional Principal
 * Todas las funcionalidades del sitio web
 */

// Variables globales
let cart = JSON.parse(localStorage.getItem('almakids_cart')) || [];
let lastAddToCartMs = 0; // anti-doble-disparo
let favorites = JSON.parse(localStorage.getItem('almakids_favorites')) || [];
let comparison = JSON.parse(localStorage.getItem('almakids_comparison')) || [];

// ========================================
// SISTEMA DE NAVEGACIÓN Y MENÚ MÓVIL
// ========================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const floatMenuBtn = document.querySelector('.mobile-menu-btn'); // Botón flotante móvil
    const body = document.body;
    
    if (mobileMenu) {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            // Crear overlay si no existe
            if (!overlay) {
                createMobileMenuOverlay();
            }
            
            mobileMenu.classList.add('active');
            document.getElementById('mobileMenuOverlay').classList.add('active');
            if (toggleButton) toggleButton.classList.add('active');
            if (floatMenuBtn) floatMenuBtn.classList.add('active'); // Activar botón flotante
            body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const floatMenuBtn = document.querySelector('.mobile-menu-btn'); // Botón flotante móvil
    const body = document.body;
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        if (toggleButton) toggleButton.classList.remove('active');
        if (floatMenuBtn) floatMenuBtn.classList.remove('active'); // Desactivar botón flotante
        if (overlay) {
            overlay.classList.remove('active');
        }
        body.style.overflow = 'auto';
    }
}

function createMobileMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobileMenuOverlay';
    overlay.className = 'mobile-menu-overlay';
    overlay.onclick = closeMobileMenu;
    document.body.appendChild(overlay);
}

// ========================================
// SISTEMA DE BÚSQUEDA
// ========================================

function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    if (searchContainer) {
        searchContainer.classList.toggle('active');
        
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.blur();
            document.getElementById('searchResults').innerHTML = '';
        }
    }
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Base de datos de búsqueda mejorada con categorías
    const searchDatabase = [
        // Servicios - Castillos
        { terms: ['castillo', 'inflable', 'hinchable', 'brinca brinca', 'saltarín'], title: 'Castillos Inflables', url: 'castillos-inflables.html', icon: '🏰', category: 'Servicios' },
        { terms: ['castillo inflable', 'castillo pequ', 'castillo rosa', 'castillo grand'], title: 'Castillos Disponibles', url: 'castillos-inflables.html', icon: '🏰', category: 'Servicios' },
        
        // Servicios - Plaza Blanda
        { terms: ['plaza blanda', 'piscina pelotas', 'pelotas', 'piscina', 'plaza'], title: 'Plaza Blanda', url: 'index.html#plaza-blanda', icon: '🏊‍♀️', category: 'Servicios' },
        
        // Servicios - Globos
        { terms: ['globos', 'globos metalizados', 'decoracion', 'decoración', 'helium', 'helio'], title: 'Globos Metalizados', url: 'globos-metalizados.html', icon: '🎈', category: 'Servicios' },
        { terms: ['dinosaurio', 'princesa', 'pokemon', 'superheroes', 'superhéroes', 'mickey', 'frozen'], title: 'Globos Temáticos', url: 'globos-metalizados.html', icon: '🎈', category: 'Servicios' },
        
        // Servicios Adicionales
        { terms: ['servicios adicionales', 'tipi', 'carpa', 'maquina burbujas', 'burbujas', 'motricidad'], title: 'Servicios Adicionales', url: 'servicios-adicionales.html', icon: '🎪', category: 'Servicios' },
        
        // Eventos
        { terms: ['eventos', 'cumpleaños', 'fiesta', 'celebración', 'festejo'], title: 'Eventos', url: 'eventos.html', icon: '🎉', category: 'Eventos' },
        { terms: ['graduacion', 'graduación', 'kinder', 'colegio', 'escolar'], title: 'Eventos Escolares', url: 'eventos.html', icon: '🎓', category: 'Eventos' },
        
        // Información
        { terms: ['preguntas', 'faq', 'preguntas frecuentes', 'dudas', 'consulta'], title: 'Preguntas Frecuentes', url: 'faq.html', icon: '❓', category: 'Información' },
        { terms: ['precios', 'precio', 'cotizacion', 'cotización', 'costo', 'tarifas'], title: 'Precios y Cotizaciones', url: 'faq.html#precios', icon: '💰', category: 'Información' },
        { terms: ['reserva', 'reservar', 'agendar', 'disponibilidad', 'fecha'], title: 'Reservar Fecha', url: 'index.html#contacto', icon: '📅', category: 'Información' },
        
        // Contacto
        { terms: ['contacto', 'contactar', 'whatsapp', 'telefono', 'teléfono', 'email', 'correo'], title: 'Contacto', url: 'index.html#contacto', icon: '📞', category: 'Contacto' },
        { terms: ['ubicacion', 'ubicación', 'direccion', 'dirección', 'machali', 'rancagua'], title: 'Ubicación y Cobertura', url: 'index.html#contacto', icon: '📍', category: 'Contacto' },
        
        // Packs
        { terms: ['pack', 'packs', 'combo', 'paquete', 'promocion', 'promoción'], title: 'Packs y Promociones', url: 'index.html#ofertas', icon: '📦', category: 'Ofertas' },
        
        // Seguridad
        { terms: ['seguridad', 'seguro', 'certificado', 'edad', 'supervision', 'supervisión'], title: 'Seguridad y Certificaciones', url: 'faq.html#seguridad', icon: '🛡️', category: 'Información' },
        
        // Términos generales
        { terms: ['niños', 'niño', 'infantil', 'pequeños', 'bebes', 'bebés'], title: 'Servicios para Niños', url: 'index.html#servicios', icon: '👶', category: 'Servicios' },
        { terms: ['machali', 'rancagua', 'ohiggins', 'region', 'región'], title: 'Cobertura en la Región', url: 'index.html#contacto', icon: '🗺️', category: 'Información' }
    ];
    
    // Búsqueda mejorada: busca coincidencias en términos
    const results = [];
    const queryWords = query.split(' ');
    
    searchDatabase.forEach(item => {
        let matchScore = 0;
        let matchedTerm = '';
        
        // Buscar coincidencias exactas o parciales
        item.terms.forEach(term => {
            // Coincidencia exacta
            if (term === query) {
                matchScore = 100;
                matchedTerm = term;
            }
            // El término contiene la búsqueda
            else if (term.includes(query) && matchScore < 80) {
                matchScore = 80;
                matchedTerm = term;
            }
            // La búsqueda contiene el término
            else if (query.includes(term) && matchScore < 60) {
                matchScore = 60;
                matchedTerm = term;
            }
            // Coincidencia de palabras individuales
            else {
                queryWords.forEach(word => {
                    if (word.length >= 3 && term.includes(word) && matchScore < 40) {
                        matchScore = 40;
                        matchedTerm = term;
                    }
                });
            }
        });
        
        if (matchScore > 0) {
            results.push({
                ...item,
                score: matchScore,
                matchedTerm: matchedTerm
            });
        }
    });
    
    // Ordenar por relevancia (score)
    results.sort((a, b) => b.score - a.score);
    
    // Limitar a 8 resultados más relevantes
    const topResults = results.slice(0, 8);
    
    // Agrupar por categorías
    const groupedResults = {};
    topResults.forEach(result => {
        if (!groupedResults[result.category]) {
            groupedResults[result.category] = [];
        }
        groupedResults[result.category].push(result);
    });
    
    // Generar HTML mejorado
    if (topResults.length > 0) {
        let html = '';
        Object.keys(groupedResults).forEach(category => {
            html += `<div class="search-category">
                <div class="search-category-header">${category}</div>
                <div class="search-category-results">`;
            
            groupedResults[category].forEach(result => {
                html += `<div class="search-result-item" onclick="window.location.href='${result.url}'; toggleSearch();">
                    <div class="search-result-icon">${result.icon}</div>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-subtitle">${result.matchedTerm}</div>
                    </div>
                    <div class="search-result-arrow"><i class="fas fa-chevron-right"></i></div>
                </div>`;
            });
            
            html += `</div></div>`;
        });
        
        resultsContainer.innerHTML = html;
    } else {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <div class="search-no-results-icon">🔍</div>
                <div class="search-no-results-text">No se encontraron resultados</div>
                <div class="search-no-results-suggestions">
                    <p>Intenta buscar:</p>
                    <ul>
                        <li>Castillos Inflables</li>
                        <li>Plaza Blanda</li>
                        <li>Globos Metalizados</li>
                        <li>Eventos</li>
                        <li>Precios</li>
                    </ul>
                </div>
            </div>`;
    }
}

// ========================================
// SISTEMA DE CARRITO
// ========================================

function ensureCartModalExists() {
    let modal = document.getElementById('cartModal');
    if (modal) return modal;

    // Crear estructura mínima del modal de carrito
    modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="cart-modal-content modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Mi Carrito</h3>
                <button class="close-modal" onclick="closeCartModal()"><i class="fas fa-times"></i></button>
            </div>
            <div id="cartItems" class="cart-items"></div>
            <div class="modal-footer" style="padding:1rem; display:flex; gap:.5rem; justify-content:flex-end;">
                <button class="btn btn-secondary" onclick="clearCart()"><i class="fas fa-trash"></i> Vaciar</button>
                <button class="btn btn-primary" onclick="requestQuote()"><i class="fas fa-paper-plane"></i> Solicitar Cotización</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function openCartModal() {
    const modal = ensureCartModalExists();
    modal.style.display = 'flex';
    modal.classList.add('active');
    updateCartDisplay();
    document.body.style.overflow = 'hidden';
    console.log('✅ Modal del carrito abierto');
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('✅ Modal del carrito cerrado');
    }
}

function addToCart(code, name, category, imageSrc) {
    // Validaciones: no agregar sin datos válidos ni dobles clics muy seguidos
    if (!code || !name) {
        return;
    }
    const now = Date.now();
    if (now - lastAddToCartMs < 300) {
        return; // ignora doble toque/click
    }
    lastAddToCartMs = now;
    const existingItem = cart.find(item => item.code === code);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Obtener la imagen del producto automáticamente
        if (!imageSrc) {
            // Buscar la imagen en la página actual
            const productElement = document.querySelector(`[onclick*="${code}"]`);
            if (productElement) {
                const productContainer = productElement.closest('.balloon-item, .product-card, .item');
                if (productContainer) {
                    const productImage = productContainer.querySelector('img');
                    imageSrc = productImage ? productImage.src : null;
                }
            }
            
            // Fallback a la ruta estándar
            if (!imageSrc) {
                imageSrc = `imagenes globos decoracion/${code}.png`;
            }
        }
        
        cart.push({
            code: code,
            name: name,
            category: category,
            image: imageSrc,
            quantity: 1,
            timestamp: Date.now()
        });
    }
    
    localStorage.setItem('almakids_cart', JSON.stringify(cart));
    updateCartCount();

    // Abrir directamente el carrito (sin mensaje previo)
    if (typeof openCartModal === 'function') {
        openCartModal();
    }

    // Analytics
    if (window.gtag) {
        gtag('event', 'add_to_cart', {
            currency: 'CLP',
            value: 1,
            items: [{
                item_id: code,
                item_name: name,
                item_category: category,
                quantity: 1
            }]
        });
    }
}

// Notificación mejorada para el carrito
function showCartNotification(productName, imageSrc) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="cart-notification-content">
            <div class="cart-notification-image">
                <img src="${imageSrc}" alt="${productName}" onerror="this.style.display='none'">
            </div>
            <div class="cart-notification-text">
                <h4>¡Agregado al carrito!</h4>
                <p>${productName}</p>
            </div>
            <div class="cart-notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
        </div>
    `;
    
    // Agregar estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
        z-index: 10000;
        max-width: 350px;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3s;
    `;
    
    // Estilos para el contenido
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .cart-notification-image {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .cart-notification-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .cart-notification-text h4 {
            margin: 0 0 0.25rem 0;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .cart-notification-text p {
            margin: 0;
            font-size: 0.8rem;
            opacity: 0.9;
        }
        
        .cart-notification-icon {
            font-size: 1.5rem;
            color: rgba(255,255,255,0.9);
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
        if (style.parentNode) {
            style.remove();
        }
    }, 4000);
}

function removeFromCart(code) {
    const index = cart.findIndex(item => item.code === code);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('almakids_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        
        showNotification(`${item.name} eliminado del carrito`, 'info');
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('almakids_cart');
    updateCartCount();
    updateCartDisplay();
    showNotification('Carrito limpiado', 'info');
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Actualizar contador en el badge de la sección de botones de acción
    const cartCountBadge = document.getElementById('cartCountBadge');
    if (cartCountBadge) {
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Actualizar contador en el botón flotante del carrito
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
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

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h4>Tu carrito está vacío</h4>
                <p>¡Agrega algunos globos metalizados para empezar!</p>
                <a href="globos-metalizados.html" class="btn btn-primary">
                    <i class="fas fa-eye"></i> Ver Catálogo
                </a>
            </div>
        `;
        return;
    }
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = `
        <div class="cart-header-info">
            <h4><i class="fas fa-list"></i> ${totalItems} producto${totalItems > 1 ? 's' : ''} en tu carrito</h4>
        </div>
        <div class="cart-items-list">
            ${cart.map(item => `
                <div class="cart-item" data-code="${item.code}">
                    <div class="cart-item-image">
                        <img src="${item.image || `imagenes globos decoracion/${item.code}.png`}" 
                             alt="${item.name}" 
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
                    </div>
                    <div class="cart-item-details">
                        <h5 class="cart-item-name">${item.name}</h5>
                        <p class="cart-item-code"><i class="fas fa-barcode"></i> ${item.code}</p>
                        <p class="cart-item-category"><i class="fas fa-tag"></i> ${item.category}</p>
                        
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" onclick="updateQuantity('${item.code}', -1)" title="Disminuir cantidad">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">
                                <i class="fas fa-cubes"></i> ${item.quantity}
                            </span>
                            <button class="quantity-btn increase" onclick="updateQuantity('${item.code}', 1)" title="Aumentar cantidad">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-item-btn" onclick="removeFromCart('${item.code}')" title="Eliminar del carrito">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <i class="fas fa-calculator"></i>
                <span>Total de productos: <strong>${totalItems}</strong></span>
            </div>
            <div class="cart-note">
                <i class="fas fa-info-circle"></i>
                <span>Los precios se calcularán según tu evento específico</span>
            </div>
        </div>
    `;
}

function updateQuantity(code, change) {
    const item = cart.find(item => item.code === code);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(code);
        } else {
            localStorage.setItem('almakids_cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function requestQuote() {
    if (cart.length === 0) {
        showNotification('Agrega productos al carrito primero', 'warning');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let message = '🎪 *ALMA Kids - Cotización de Carrito*\n\n';
    message += '*Productos seleccionados:*\n';
    
    cart.forEach(item => {
        message += `• ${item.name} (${item.code}) - Cantidad: ${item.quantity}\n`;
    });
    
    message += '\n¡Hola! Me interesa cotizar estos globos metalizados. ¿Podrían enviarme información de precios y disponibilidad?';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Analytics
    if (window.gtag) {
        gtag('event', 'begin_checkout', {
            currency: 'CLP',
            value: cart.length,
            items: cart.map(item => ({
                item_id: item.code,
                item_name: item.name,
                item_category: item.category,
                quantity: item.quantity
            }))
        });
    }
}

// ========================================
// SISTEMA DE FAVORITOS
// ========================================

function toggleFavorites() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'favoritesModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-heart"></i> Mis Favoritos</h3>
                <button class="close-modal" onclick="closeFavoritesModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="favoritesItems" class="favorites-items"></div>
            <div class="favorites-buttons">
                <button class="btn btn-secondary" onclick="clearFavorites()">
                    <i class="fas fa-trash"></i> Limpiar Favoritos
                </button>
                <button class="btn btn-primary" onclick="addFavoritesToCart()">
                    <i class="fas fa-cart-plus"></i> Agregar Todo al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    updateFavoritesDisplay();
}

function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.remove();
    }
}

function addToFavorites(code, name, category) {
    const existingFavorite = favorites.find(item => item.code === code);
    
    if (!existingFavorite) {
        favorites.push({
            code: code,
            name: name,
            category: category,
            timestamp: Date.now()
        });
        
        localStorage.setItem('almakids_favorites', JSON.stringify(favorites));
        updateFavoritesCount();
        showNotification(`${name} agregado a favoritos`, 'success');
    } else {
        showNotification(`${name} ya está en favoritos`, 'info');
    }
}

function updateFavoritesCount() {
    const favoritesCount = document.getElementById('favoritesCount');
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
}

// ========================================
// SISTEMA DE COMPARACIÓN
// ========================================

function toggleComparison() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'comparisonModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-balance-scale"></i> Comparar Productos</h3>
                <button class="close-modal" onclick="closeComparisonModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="comparisonItems" class="comparison-items"></div>
            <div class="comparison-buttons">
                <button class="btn btn-secondary" onclick="clearComparison()">
                    <i class="fas fa-trash"></i> Limpiar Comparación
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    updateComparisonDisplay();
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.remove();
    }
}

function addToComparison(code, name, category) {
    if (comparison.length >= 4) {
        showNotification('Máximo 4 productos para comparar', 'warning');
        return;
    }
    
    const existingItem = comparison.find(item => item.code === code);
    
    if (!existingItem) {
        comparison.push({
            code: code,
            name: name,
            category: category,
            timestamp: Date.now()
        });
        
        localStorage.setItem('almakids_comparison', JSON.stringify(comparison));
        updateComparisonCount();
        showNotification(`${name} agregado a comparación`, 'success');
    }
}

function updateComparisonCount() {
    const comparisonCount = document.getElementById('comparisonCount');
    if (comparisonCount) {
        comparisonCount.textContent = comparison.length;
    }
}

// ========================================
// SISTEMA DE MODALES
// ========================================

// Variable global para controlar el estado del zoom y pantalla completa
let isImageZoomed = false;
let isFullscreen = false;

function openImageModal(imageSrc, title, code, category) {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');

    // Resetear estados
    isImageZoomed = false;
    isFullscreen = false;
    modal.classList.remove('fullscreen');
    if (modalImage) {
        modalImage.classList.remove('zoomed');
    }
    updateControlIcons();

    // Si el recurso es un video MP4, reemplazamos la imagen por un reproductor de video
    const isVideo = /\.mp4(\?|$)/i.test(imageSrc);

    if (modalImage && modalCaption) {
        if (isVideo) {
            // Construir reproductor de video dentro del modal
            modalImage.style.display = 'none';
            // Insertar un contenedor temporal para el video
            let existingVideo = modal.querySelector('#modalVideo');
            if (existingVideo) existingVideo.remove();

            const videoEl = document.createElement('video');
            videoEl.id = 'modalVideo';
            videoEl.controls = true;
            videoEl.autoplay = true;
            videoEl.style.maxWidth = '90vw';
            videoEl.style.maxHeight = '80vh';
            videoEl.style.borderRadius = '12px';
            videoEl.style.background = '#000';

            const sourceEl = document.createElement('source');
            sourceEl.src = imageSrc;
            sourceEl.type = 'video/mp4';
            videoEl.appendChild(sourceEl);

            modalImage.parentNode.insertBefore(videoEl, modalImage.nextSibling);
        } else {
            // Imagen normal
            const existingVideo = modal.querySelector('#modalVideo');
            if (existingVideo) existingVideo.remove();
            modalImage.style.display = 'block';
            modalImage.src = imageSrc;
            modalImage.alt = title;
            
            // Cargar imagen en alta resolución si está disponible
            modalImage.onload = function() {
                // Asegurar que la imagen se vea correctamente
                this.style.display = 'block';
            };
        }

        const captionText = code || category || '';
        modalCaption.innerHTML = `
            <h3>${title}</h3>
            ${captionText ? `<p>${captionText}</p>` : ''}
        `;

        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'fullscreen');
        document.body.style.overflow = 'auto';
        
        // Resetear estados
        isImageZoomed = false;
        isFullscreen = false;
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.classList.remove('zoomed');
        }
        updateControlIcons();
        
        // Salir de pantalla completa si está activo
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            exitFullscreen();
        }
    }
}

// Función para toggle zoom
function toggleZoom() {
    const modalImage = document.getElementById('modalImage');
    if (!modalImage || modalImage.style.display === 'none') return;
    
    isImageZoomed = !isImageZoomed;
    
    if (isImageZoomed) {
        modalImage.classList.add('zoomed');
    } else {
        modalImage.classList.remove('zoomed');
    }
    
    updateControlIcons();
}

// Función para toggle pantalla completa
function toggleFullscreen() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        // Entrar a pantalla completa
        if (modal.requestFullscreen) {
            modal.requestFullscreen();
        } else if (modal.webkitRequestFullscreen) {
            modal.webkitRequestFullscreen();
        } else if (modal.mozRequestFullScreen) {
            modal.mozRequestFullScreen();
        } else if (modal.msRequestFullscreen) {
            modal.msRequestFullscreen();
        }
        modal.classList.add('fullscreen');
    } else {
        // Salir de pantalla completa
        exitFullscreen();
        modal.classList.remove('fullscreen');
    }
    
    updateControlIcons();
}

// Función para salir de pantalla completa
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Función para actualizar iconos de control
function updateControlIcons() {
    const zoomIcon = document.getElementById('zoomIcon');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    
    if (zoomIcon) {
        zoomIcon.className = isImageZoomed ? 'fas fa-search-minus' : 'fas fa-search-plus';
    }
    
    if (fullscreenIcon) {
        fullscreenIcon.className = isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
    }
}

// Detectar cambios de pantalla completa
document.addEventListener('fullscreenchange', function() {
    const modal = document.getElementById('imageModal');
    if (!document.fullscreenElement && modal) {
        isFullscreen = false;
        modal.classList.remove('fullscreen');
        updateControlIcons();
    }
});

document.addEventListener('webkitfullscreenchange', function() {
    const modal = document.getElementById('imageModal');
    if (!document.webkitFullscreenElement && modal) {
        isFullscreen = false;
        modal.classList.remove('fullscreen');
        updateControlIcons();
    }
});

document.addEventListener('mozfullscreenchange', function() {
    const modal = document.getElementById('imageModal');
    if (!document.mozFullScreenElement && modal) {
        isFullscreen = false;
        modal.classList.remove('fullscreen');
        updateControlIcons();
    }
});

document.addEventListener('msfullscreenchange', function() {
    const modal = document.getElementById('imageModal');
    if (!document.msFullscreenElement && modal) {
        isFullscreen = false;
        modal.classList.remove('fullscreen');
        updateControlIcons();
    }
});

// ========================================
// CALCULADORA DE PRECIOS
// ========================================

function togglePriceCalculator() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'priceCalculatorModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-calculator"></i> Calculadora de Precios</h3>
                <button class="close-modal" onclick="closePriceCalculator()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="calculator-content">
                <div class="calculator-form">
                    <div class="form-group">
                        <label>Tipo de Servicio:</label>
                        <select id="serviceTypeCalc" onchange="calculatePrice()">
                            <option value="">Seleccionar...</option>
                            <option value="plaza-blanda" data-price="60000">Plaza Blanda - $60.000</option>
                            <option value="inflable-pequeno" data-price="70000">Inflable Pequeño - $70.000</option>
                            <option value="inflable-mediano" data-price="85000">Inflable Mediano - $85.000</option>
                            <option value="inflable-grande" data-price="100000">Inflable Grande - $100.000</option>
                            <option value="combo" data-price="130000">Combo Plaza + Inflable - $130.000</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Decoración con Globos:</label>
                        <select id="decorationCalc" onchange="calculatePrice()">
                            <option value="" data-price="0">Sin decoración</option>
                            <option value="basico" data-price="25000">Básico - $25.000</option>
                            <option value="premium" data-price="45000">Premium - $45.000</option>
                            <option value="personalizado" data-price="60000">Personalizado - $60.000</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Servicios Adicionales:</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" value="supervision" data-price="25000" onchange="calculatePrice()"> Supervisión (+$25.000)</label>
                            <label><input type="checkbox" value="tiempo-extra" data-price="20000" onchange="calculatePrice()"> Tiempo Extra (+$20.000)</label>
                            <label><input type="checkbox" value="traslado" data-price="15000" onchange="calculatePrice()"> Traslado Especial (+$15.000)</label>
                        </div>
                    </div>
                    
                    <div class="price-result">
                        <h3>Total Estimado: <span id="totalPrice">$0</span></h3>
                        <p class="price-note">*Precio referencial. Cotización final puede variar según ubicación y requerimientos específicos.</p>
                    </div>
                    
                    <div class="calculator-actions">
                        <button class="btn btn-primary" onclick="requestQuoteFromCalculator()">
                            <i class="fas fa-whatsapp"></i> Solicitar Cotización
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closePriceCalculator() {
    const modal = document.getElementById('priceCalculatorModal');
    if (modal) {
        modal.remove();
    }
}

function calculatePrice() {
    const serviceSelect = document.getElementById('serviceTypeCalc');
    const decorationSelect = document.getElementById('decorationCalc');
    const additionalServices = document.querySelectorAll('#priceCalculatorModal input[type="checkbox"]:checked');
    
    let total = 0;
    
    // Precio base del servicio
    if (serviceSelect.selectedOptions[0]) {
        total += parseInt(serviceSelect.selectedOptions[0].dataset.price || 0);
    }
    
    // Precio de decoración
    if (decorationSelect.selectedOptions[0]) {
        total += parseInt(decorationSelect.selectedOptions[0].dataset.price || 0);
    }
    
    // Servicios adicionales
    additionalServices.forEach(service => {
        total += parseInt(service.dataset.price || 0);
    });
    
    // Mostrar total
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }
}

function requestQuoteFromCalculator() {
    const serviceSelect = document.getElementById('serviceTypeCalc');
    const decorationSelect = document.getElementById('decorationCalc');
    const additionalServices = document.querySelectorAll('#priceCalculatorModal input[type="checkbox"]:checked');
    const total = document.getElementById('totalPrice').textContent;
    
    let message = '🎪 *ALMA Kids - Cotización desde Calculadora*\n\n';
    message += `*Servicio:* ${serviceSelect.selectedOptions[0]?.text || 'No seleccionado'}\n`;
    message += `*Decoración:* ${decorationSelect.selectedOptions[0]?.text || 'Sin decoración'}\n`;
    
    if (additionalServices.length > 0) {
        message += '*Servicios Adicionales:*\n';
        additionalServices.forEach(service => {
            message += `• ${service.parentElement.textContent.trim()}\n`;
        });
    }
    
    message += `\n*Total Estimado:* ${total}\n`;
    message += '\n¿Podrían confirmarme la disponibilidad y precio final?';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closePriceCalculator();
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Auto-calcular hora de término
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    if (startTimeInput && endTimeInput) {
        startTimeInput.addEventListener('change', () => {
            const startTime = startTimeInput.value;
            if (startTime) {
                const [hours, minutes] = startTime.split(':');
                const startDate = new Date();
                startDate.setHours(parseInt(hours), parseInt(minutes));
                
                // Agregar 4 horas (duración estándar)
                const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
                const endTimeString = endDate.toTimeString().slice(0, 5);
                
                endTimeInput.value = endTimeString;
            }
        });
    }
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', handleContactFormSubmit);
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Construir mensaje para WhatsApp
    let message = '🎪 *ALMA Kids - Nueva Cotización*\n\n';
    message += `*Nombre:* ${data.name}\n`;
    message += `*Email:* ${data.email}\n`;
    message += `*Teléfono:* ${data.phone}\n`;
    message += `*Fecha del Evento:* ${data.eventDate}\n`;
    message += `*Hora:* ${data.startTime} - ${data.endTime}\n`;
    message += `*Ubicación:* ${data.location}\n`;
    message += `*Servicio:* ${data.serviceType}\n`;
    
    if (data.decoration) {
        message += `*Decoración:* ${data.decoration}\n`;
    }
    
    if (data.additionalMessage) {
        message += `*Mensaje:* ${data.additionalMessage}\n`;
    }
    
    // Agregar productos del carrito si los hay
    if (cart.length > 0) {
        message += '\n*Productos del Carrito:*\n';
        cart.forEach(item => {
            message += `• ${item.name} (${item.code}) - Cantidad: ${item.quantity}\n`;
        });
    }
    
    message += '\n¡Esperamos su respuesta! 🎈';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Formulario procesado. Te redirigimos a WhatsApp.', 'success');
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contadores
    updateCartCount();
    updateFavoritesCount();
    updateComparisonCount();
    
    // Configurar formulario de contacto
    setupContactForm();
    
    // Agrupar botones de acción (Carrito y WhatsApp) horizontalmente
    groupActionButtons();
    
    // Cerrar modales con click fuera
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    console.log('🎪 ALMA Kids: Sistema funcional principal activado');
});

// ========================================
// AGRUPAR BOTONES DE ACCIÓN HORIZONTALMENTE
// ========================================
function groupActionButtons() {
    // Buscar todos los botones de "Agregar al Carrito" en secciones de productos
    const productSections = document.querySelectorAll('.divertete-item, .castillo-item');
    
    productSections.forEach(section => {
        const infoDiv = section.querySelector('.divertete-info, .castillo-info');
        if (!infoDiv) return;
        
        // Buscar botón de carrito
        const cartButton = infoDiv.querySelector('button.btn-primary, .btn[onclick*="addToNewCart"]');
        if (!cartButton) return;
        
        // Verificar si ya está agrupado
        if (cartButton.closest('.product-actions-wrapper')) return;
        
        // Crear contenedor para botones
        const wrapper = document.createElement('div');
        wrapper.className = 'product-actions-wrapper';
        
        // Mover botón de carrito al wrapper
        cartButton.parentNode.insertBefore(wrapper, cartButton);
        wrapper.appendChild(cartButton);
        
        // Buscar o crear botón de WhatsApp
        let whatsappBtn = infoDiv.querySelector('.btn-whatsapp, .whatsapp-btn');
        if (!whatsappBtn) {
            // Crear botón de WhatsApp si no existe
            whatsappBtn = document.createElement('a');
            whatsappBtn.href = 'https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20me%20interesa%20cotizar%20este%20producto';
            whatsappBtn.target = '_blank';
            whatsappBtn.className = 'whatsapp-btn';
            whatsappBtn.title = 'WhatsApp: +56 9 6907 3306';
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        }
        
        // Mover botón de WhatsApp al wrapper
        if (whatsappBtn.parentNode) {
            whatsappBtn.parentNode.removeChild(whatsappBtn);
        }
        wrapper.appendChild(whatsappBtn);
    });
    
    console.log('✅ Botones de acción agrupados horizontalmente');
}

// ========================================
// CSS PARA FUNCIONALIDADES
// ========================================

const functionalCSS = `
    /* Notificaciones */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease;
    }

    .notification-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .notification-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    .notification-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }

    .notification-info {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }

    .notification-content {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }

    /* Carrito */
    .cart-empty {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .cart-empty i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .cart-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
        gap: 1rem;
    }

    .cart-item:last-child {
        border-bottom: none;
    }

    .cart-item-info {
        flex: 1;
    }

    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
    }

    .cart-item-info p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .quantity-controls button {
        background: var(--primary-color);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .remove-item {
        background: #e74c3c;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Búsqueda */
    .search-container.active {
        display: block !important;
    }

    .search-result {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: background-color 0.2s;
    }

    .search-result:hover {
        background-color: #f8f9fa;
    }

    .search-result:last-child {
        border-bottom: none;
    }

    /* Modal mejorado */
    .modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        animation: fadeIn 0.3s ease;
    }

    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 0;
        border-radius: var(--border-radius);
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideInDown 0.3s ease;
    }

    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal-header h3 {
        margin: 0;
        color: var(--primary-color);
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        transition: color 0.2s;
    }

    .close-modal:hover {
        color: var(--primary-color);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideInDown {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    /* Calculadora de precios */
    .calculator-content {
        padding: 1.5rem;
    }

    .calculator-form .form-group {
        margin-bottom: 1.5rem;
    }

    .calculator-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .calculator-form select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-size: 1rem;
    }

    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: normal;
        cursor: pointer;
    }

    .price-result {
        background: var(--bg-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        text-align: center;
        margin: 1.5rem 0;
    }

    .price-result h3 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
        font-size: 1.5rem;
    }

    .price-note {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .calculator-actions {
        text-align: center;
    }

    /* Mobile menu */
    .mobile-menu.active {
        display: block !important;
    }

    body.menu-open {
        overflow: hidden;
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = functionalCSS;
document.head.appendChild(style);


