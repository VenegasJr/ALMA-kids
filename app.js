/**
 * ALMA Kids - Aplicación Principal Unificada
 * Consolidación completa de script.js y lógica del sitio
 * Mobile-First, Clean Code, LocalStorage
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
let cart = JSON.parse(localStorage.getItem('almakids_cart')) || [];
let lastAddToCartMs = 0;
let favorites = JSON.parse(localStorage.getItem('almakids_favorites')) || [];
let comparison = JSON.parse(localStorage.getItem('almakids_comparison')) || [];

// Variables del carrusel
let currentSlideIndex = 0;
let carouselInterval = null;
const CAROUSEL_AUTO_ROTATE_INTERVAL = 5000;

// Variables del modal de imágenes
let currentImageGallery = [];
let currentImageIndex = 0;
let isFullscreen = false;
let isZoomed = false;

// ============================================
// SISTEMA DE CARRUSEL HERO
// ============================================

function initCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) {
        console.warn('⚠️ No se encontró el carrusel del hero');
        return;
    }

    const slides = carousel.querySelectorAll('.carousel-slide');
    if (slides.length === 0) {
        console.warn('⚠️ No se encontraron slides del carrusel');
        return;
    }

    console.log(`✅ Carrusel inicializado con ${slides.length} slides`);

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    startCarouselAutoRotate();
    carousel.addEventListener('mouseenter', stopCarouselAutoRotate);
    carousel.addEventListener('mouseleave', startCarouselAutoRotate);
    updateCarouselDisplay();
}

function goToSlide(index) {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlideIndex = 0;
    } else {
        currentSlideIndex = index;
    }

    updateCarouselDisplay();
    resetCarouselAutoRotate();
}

function updateCarouselDisplay() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.zIndex = '2';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        }
    });

    indicators.forEach((indicator, index) => {
        if (index === currentSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function startCarouselAutoRotate() {
    stopCarouselAutoRotate();
    carouselInterval = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
    }, CAROUSEL_AUTO_ROTATE_INTERVAL);
}

function stopCarouselAutoRotate() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function resetCarouselAutoRotate() {
    stopCarouselAutoRotate();
    startCarouselAutoRotate();
}

// ============================================
// SISTEMA DE NAVEGACIÓN Y MENÚ MÓVIL
// ============================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay') || createMobileMenuOverlay();
    const toggleButton = document.querySelector('.mobile-menu-toggle, .navbar-toggler');
    const body = document.body;
    
    if (!mobileMenu) {
        console.error('❌ mobileMenu no encontrado');
        return;
    }
    
    const isActive = mobileMenu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        if (!document.getElementById('mobileMenuOverlay')) {
            createMobileMenuOverlay();
        }
        
        mobileMenu.classList.add('active');
        mobileMenu.style.display = 'block';
        
        const overlayEl = document.getElementById('mobileMenuOverlay');
        if (overlayEl) {
            overlayEl.classList.add('active');
            overlayEl.style.display = 'block';
        }
        
        if (toggleButton) {
            toggleButton.classList.add('active');
        }
        
        body.style.overflow = 'hidden';
        body.classList.add('menu-open');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggleButton = document.querySelector('.mobile-menu-toggle, .navbar-toggler');
    const body = document.body;
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        mobileMenu.style.display = 'none';
        
        if (toggleButton) {
            toggleButton.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
        
        body.style.overflow = 'auto';
        body.classList.remove('menu-open');
    }
}

function createMobileMenuOverlay() {
    let overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        return overlay;
    }
    
    overlay = document.createElement('div');
    overlay.id = 'mobileMenuOverlay';
    overlay.className = 'mobile-menu-overlay';
    overlay.style.display = 'none';
    
    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
    
    overlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeMobileMenu();
    });
    
    document.body.appendChild(overlay);
    return overlay;
}

// ============================================
// SISTEMA DE BÚSQUEDA
// ============================================

function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    if (searchContainer) {
        searchContainer.classList.toggle('active');
        
        if (searchContainer.classList.contains('active')) {
            searchInput?.focus();
        } else {
            searchInput?.blur();
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
        }
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput?.value.toLowerCase().trim() || '';
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const searchDatabase = [
        { terms: ['castillo', 'inflable', 'hinchable'], title: 'Castillos Inflables', url: 'castillos-inflables.html', icon: '🏰', category: 'Servicios' },
        { terms: ['plaza blanda', 'piscina pelotas'], title: 'Plaza Blanda', url: 'index.html#plaza-blanda', icon: '🏊‍♀️', category: 'Servicios' },
        { terms: ['servicios adicionales', 'tipi', 'burbujas'], title: 'Servicios Adicionales', url: 'servicios-adicionales.html', icon: '🎪', category: 'Servicios' },
        { terms: ['eventos', 'cumpleaños', 'fiesta'], title: 'Eventos', url: 'eventos.html', icon: '🎉', category: 'Eventos' },
        { terms: ['preguntas', 'faq'], title: 'Preguntas Frecuentes', url: 'faq.html', icon: '❓', category: 'Información' },
        { terms: ['contacto', 'whatsapp'], title: 'Contacto', url: 'index.html#contacto', icon: '📞', category: 'Contacto' },
    ];
    
    const results = [];
    const queryWords = query.split(' ');
    
    searchDatabase.forEach(item => {
        let matchScore = 0;
        item.terms.forEach(term => {
            queryWords.forEach(word => {
                if (term.includes(word) || word.includes(term)) {
                    matchScore++;
                }
            });
        });
        
        if (matchScore > 0) {
            results.push({ ...item, score: matchScore });
        }
    });
    
    results.sort((a, b) => b.score - a.score);
    
    if (results.length > 0) {
        let html = '<div class="search-results-list">';
        results.slice(0, 5).forEach(result => {
            html += `
                <div class="search-result-item" onclick="window.location.href='${result.url}'; toggleSearch();">
                    <div class="search-result-icon">${result.icon}</div>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-category">${result.category}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
    } else {
        resultsContainer.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
    }
}

// ============================================
// SISTEMA DE CARRITO (LocalStorage)
// ============================================

function addToCart(code, name, category, imageSrc) {
    if (!code || !name) {
        return;
    }
    
    const now = Date.now();
    if (now - lastAddToCartMs < 300) {
        return;
    }
    lastAddToCartMs = now;
    
    const existingItem = cart.find(item => item.code === code);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        if (!imageSrc) {
            const productElement = document.querySelector(`[onclick*="${code}"]`);
            if (productElement) {
                const productContainer = productElement.closest('.balloon-item, .product-card, .item, .service-card');
                if (productContainer) {
                    const productImage = productContainer.querySelector('img');
                    imageSrc = productImage ? productImage.src : null;
                }
            }
            
            if (!imageSrc) {
                imageSrc = `imagenes globos decoracion/${code}.png`;
            }
        }
        
        cart.push({
            code: code,
            name: name,
            category: category || '',
            image: imageSrc,
            quantity: 1,
            timestamp: Date.now()
        });
    }
    
    localStorage.setItem('almakids_cart', JSON.stringify(cart));
    updateCartCount(); // Actualiza header y barra móvil
    updateNewCartDisplay();
    
    showCartNotification(name, imageSrc);
    
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

function removeFromCart(code) {
    const index = cart.findIndex(item => item.code === code);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('almakids_cart', JSON.stringify(cart));
        updateCartCount();
        updateNewCartDisplay();
        showNotification(`${item.name} eliminado del carrito`, 'info');
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('almakids_cart');
    updateCartCount();
    updateNewCartDisplay();
    showNotification('Carrito limpiado', 'info');
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Actualizar contador en el header (Desktop)
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        
        if (totalItems > 0) {
            cartCount.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
    }
    
    // Actualizar contador en la barra móvil (Mobile App Nav)
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        mobileCartCount.textContent = totalItems;
        if (totalItems > 0) {
            mobileCartCount.style.display = 'flex';
        } else {
            mobileCartCount.style.display = 'none';
        }
    }
    
    // También actualizar badge del header si existe
    const cartCountBadge = document.getElementById('cartCountBadge');
    if (cartCountBadge) {
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
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
            updateNewCartDisplay();
        }
    }
}

// ============================================
// SISTEMA DE CARRITO NUEVO (Modal)
// ============================================

function showNewCart() {
    let modal = document.getElementById('newCartModal');
    
    if (!modal) {
        modal = createCartModalElement();
    }
    
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateNewCartDisplay();
    } else {
        console.error('❌ No se pudo crear el modal del carrito');
        alert('Error: No se pudo abrir el carrito. Por favor, recarga la página.');
    }
}

function hideNewCart() {
    const modal = document.getElementById('newCartModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function createCartModalElement() {
    const modalHTML = `
        <div id="newCartModal" class="cart-overlay">
            <div class="cart-container">
                <div class="cart-header">
                    <h2>🛒 Mi Carrito</h2>
                    <button class="cart-close" onclick="hideNewCart()">✕</button>
                </div>
                <div id="cartItemsList" class="cart-items-list">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Tu carrito está vacío</p>
                    </div>
                </div>
                <div class="cart-footer">
                    <button class="cart-clear-btn" onclick="clearNewCart()">🗑️ Limpiar Todo</button>
                    <button class="cart-send-btn" onclick="sendCartToWhatsApp()">📱 Enviar por WhatsApp</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Cerrar al hacer click fuera del modal
    const modal = document.getElementById('newCartModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideNewCart();
            }
        });
    }
    
    return modal;
}

function updateNewCartDisplay() {
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
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.code || ''}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.code}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.code}', 1)">+</button>
                    <button onclick="removeFromCart('${item.code}')" class="remove-btn">🗑️</button>
                </div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = html;
    updateCartCount();
}

function clearNewCart() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
        clearCart();
        updateNewCartDisplay();
    }
}

// ============================================
// WHATSAPP FORMATTER (Ventas)
// ============================================

function formatWhatsAppMessage(options = {}) {
    const {
        products = [],
        eventDate = '',
        location = '',
        comuna = '',
        name = '',
        phone = '',
        email = '',
        startTime = '',
        endTime = '',
        additionalMessage = ''
    } = options;
    
    let message = 'Hola ALMA Kids! 🎪\n\n';
    message += 'Estoy interesado en:\n';
    
    if (products.length > 0) {
        products.forEach(product => {
            message += `- ${product.name}`;
            if (product.quantity > 1) {
                message += ` (x${product.quantity})`;
            }
            message += '\n';
        });
    } else if (cart.length > 0) {
        cart.forEach(item => {
            message += `- ${item.name}`;
            if (item.quantity > 1) {
                message += ` (x${item.quantity})`;
            }
            message += '\n';
        });
    }
    
    message += '\n';
    
    if (eventDate) {
        message += `Fecha evento: ${eventDate}\n`;
    }
    
    if (comuna) {
        message += `Comuna: ${comuna}\n`;
    } else if (location) {
        message += `Ubicación: ${location}\n`;
    }
    
    if (name) {
        message += `Nombre: ${name}\n`;
    }
    
    if (phone) {
        message += `Teléfono: ${phone}\n`;
    }
    
    if (email) {
        message += `Email: ${email}\n`;
    }
    
    if (startTime && endTime) {
        message += `Horario: ${startTime} - ${endTime}\n`;
    }
    
    if (additionalMessage) {
        message += `\nMensaje adicional: ${additionalMessage}\n`;
    }
    
    return message;
}

function sendCartToWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const contactForm = document.getElementById('contactForm');
    let eventDate = '';
    let location = '';
    let comuna = '';
    let name = '';
    let phone = '';
    let email = '';
    let startTime = '';
    let endTime = '';
    let additionalMessage = '';
    
    if (contactForm) {
        const formData = new FormData(contactForm);
        eventDate = formData.get('eventDate') || '';
        location = formData.get('location') || '';
        name = formData.get('name') || '';
        phone = formData.get('phone') || '';
        email = formData.get('email') || '';
        startTime = formData.get('startTime') || '';
        endTime = formData.get('endTime') || '';
        additionalMessage = formData.get('additionalMessage') || '';
        
        // Extraer comuna de la ubicación si es posible
        if (location) {
            const comunaMatch = location.match(/(Machalí|Rancagua|Graneros|Codegua|Doñihue|Coltauco|Quinta de Tilcoco|Las Cabras|Peumo|Pichidegua|San Vicente|Mostazal|Malloa|Olivar|Requínoa|Rengo|San Fernando)/i);
            if (comunaMatch) {
                comuna = comunaMatch[1];
            }
        }
    }
    
    const message = formatWhatsAppMessage({
        products: cart,
        eventDate,
        location,
        comuna,
        name,
        phone,
        email,
        startTime,
        endTime,
        additionalMessage
    });
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ============================================
// MODAL DE IMÁGENES
// ============================================

function openImageModal(imageSrc, title, description) {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    detectImageGallery(imageSrc);
    
    currentImageIndex = currentImageGallery.findIndex(img => img.src === imageSrc);
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
        currentImageGallery = [{
            src: imageSrc,
            title: title,
            code: description || '',
            category: ''
        }];
    }
    
    isZoomed = false;
    isFullscreen = false;
    modal.classList.remove('fullscreen');
    if (modalImage) {
        modalImage.classList.remove('zoomed');
    }
    
    const isVideo = /\.mp4(\?|$)/i.test(imageSrc);
    
    if (modalImage && modalCaption) {
        if (isVideo) {
            modalImage.style.display = 'none';
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
            const existingVideo = modal.querySelector('#modalVideo');
            if (existingVideo) existingVideo.remove();
            modalImage.style.display = 'block';
            modalImage.src = imageSrc;
            modalImage.alt = title;
        }
        
        modalCaption.innerHTML = `
            <h3>${title}</h3>
            ${description ? `<p>${description}</p>` : ''}
        `;
        
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateImageNavigation();
        document.addEventListener('keydown', handleImageModalKeyboard);
    }
}

function detectImageGallery(currentImageSrc) {
    currentImageGallery = [];
    
    const allImages = document.querySelectorAll('img[onclick*="openImageModal"]');
    
    allImages.forEach(img => {
        const onclickAttr = img.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/openImageModal\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*(?:,\s*['"]([^'"]*)['"])?\s*(?:,\s*['"]([^'"]*)['"])?/);
            if (match) {
                currentImageGallery.push({
                    src: match[1],
                    title: match[2] || img.alt || 'Imagen',
                    code: match[3] || '',
                    category: match[4] || ''
                });
            }
        }
    });
    
    if (currentImageGallery.length === 0) {
        const galleryContainers = document.querySelectorAll('.divertete-images-gallery, .castillo-images-gallery, .service-images, .gallery');
        galleryContainers.forEach(container => {
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                if (img.src && !img.src.includes('data:')) {
                    currentImageGallery.push({
                        src: img.src,
                        title: img.alt || 'Imagen',
                        code: '',
                        category: ''
                    });
                }
            });
        });
    }
}

function updateImageNavigation() {
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    if (currentImageGallery.length > 1) {
        if (prevBtn) {
            prevBtn.style.display = 'flex';
            prevBtn.style.opacity = currentImageIndex > 0 ? '1' : '0.5';
            prevBtn.style.pointerEvents = currentImageIndex > 0 ? 'auto' : 'none';
        }
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.style.opacity = currentImageIndex < currentImageGallery.length - 1 ? '1' : '0.5';
            nextBtn.style.pointerEvents = currentImageIndex < currentImageGallery.length - 1 ? 'auto' : 'none';
        }
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        showImageInModal(currentImageIndex);
    }
}

function nextImage() {
    if (currentImageIndex < currentImageGallery.length - 1) {
        currentImageIndex++;
        showImageInModal(currentImageIndex);
    }
}

function showImageInModal(index) {
    if (index < 0 || index >= currentImageGallery.length) return;
    
    const image = currentImageGallery[index];
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modalImage) {
        isZoomed = false;
        modalImage.classList.remove('zoomed');
        modalImage.src = image.src;
        modalImage.alt = image.title;
        
        if (modalCaption) {
            modalCaption.innerHTML = `
                <h3>${image.title}</h3>
                ${image.code ? `<p>${image.code}</p>` : ''}
            `;
        }
        
        updateImageNavigation();
    }
}

function handleImageModalKeyboard(e) {
    const modal = document.getElementById('imageModal');
    if (!modal || !modal.classList.contains('active')) return;
    
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousImage();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextImage();
            break;
        case 'Escape':
            e.preventDefault();
            closeImageModal();
            break;
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'fullscreen');
        document.body.style.overflow = 'auto';
        
        isZoomed = false;
        isFullscreen = false;
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.classList.remove('zoomed');
        }
        
        document.removeEventListener('keydown', handleImageModalKeyboard);
    }
}

// ============================================
// NOTIFICACIONES
// ============================================

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

function showCartNotification(productName, imageSrc) {
    console.log(`✅ ${productName} agregado al carrito`);
    showNotification(`${productName} agregado al carrito`, 'success');
}

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    if (startTimeInput && endTimeInput) {
        startTimeInput.addEventListener('change', () => {
            const startTime = startTimeInput.value;
            if (startTime) {
                const [hours, minutes] = startTime.split(':');
                const startDate = new Date();
                startDate.setHours(parseInt(hours), parseInt(minutes));
                
                const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
                const endTimeString = endDate.toTimeString().slice(0, 5);
                
                endTimeInput.value = endTimeString;
            }
        });
    }
    
    contactForm.addEventListener('submit', handleContactFormSubmit);
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const message = formatWhatsAppMessage({
        eventDate: data.eventDate || '',
        location: data.location || '',
        comuna: extractComuna(data.location || ''),
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        additionalMessage: data.additionalMessage || ''
    });
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Formulario procesado. Te redirigimos a WhatsApp.', 'success');
}

function extractComuna(location) {
    if (!location) return '';
    
    const comunas = ['Machalí', 'Rancagua', 'Graneros', 'Codegua', 'Doñihue', 'Coltauco', 
                     'Quinta de Tilcoco', 'Las Cabras', 'Peumo', 'Pichidegua', 'San Vicente', 
                     'Mostazal', 'Malloa', 'Olivar', 'Requínoa', 'Rengo', 'San Fernando'];
    
    for (const comuna of comunas) {
        if (location.toLowerCase().includes(comuna.toLowerCase())) {
            return comuna;
        }
    }
    
    return '';
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ALMA Kids - Inicializando aplicación...');
    
    // Inicializar carrusel
    initCarousel();
    
    // Actualizar contadores
    updateCartCount();
    
    // Configurar formulario de contacto
    setupContactForm();
    
    // Cerrar menú con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            closeImageModal();
            hideNewCart();
        }
    });
    
    // Cerrar modales con click fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('cart-overlay')) {
            if (e.target.id === 'imageModal') {
                closeImageModal();
            } else if (e.target.id === 'newCartModal') {
                hideNewCart();
            }
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
                closeMobileMenu();
            }
        });
    });
    
    // Cerrar menú móvil al hacer click en enlaces
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    console.log('✅ Aplicación inicializada correctamente');
});

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================

window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleSearch = toggleSearch;
window.performSearch = performSearch;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.openImageModal = openImageModal;
window.showNewCart = showNewCart;
window.hideNewCart = hideNewCart;
window.clearNewCart = clearNewCart;
window.sendCartToWhatsApp = sendCartToWhatsApp;
window.updateQuantity = updateQuantity;
window.previousImage = previousImage;
window.nextImage = nextImage;
window.closeImageModal = closeImageModal;
window.formatWhatsAppMessage = formatWhatsAppMessage;
