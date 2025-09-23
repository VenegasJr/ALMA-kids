/**
 * ALMA Kids - Funciones de Emergencia
 * Funcionalidades básicas que funcionan inmediatamente
 */

console.log('🎪 ALMA Kids: Cargando funciones de emergencia...');

// Variables globales simples
window.almakidsCart = JSON.parse(localStorage.getItem('almakids_cart')) || [];

// ========================================
// FUNCIONES BÁSICAS DEL CARRITO
// ========================================

window.openCartModal = function() {
    console.log('🛒 Abriendo carrito...');
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Actualizar contenido del carrito
        updateCartDisplay();
        
        console.log('✅ Carrito abierto exitosamente');
    } else {
        console.error('❌ Modal del carrito no encontrado');
        alert('Error: Modal del carrito no encontrado');
    }
};

window.closeCartModal = function() {
    console.log('🛒 Cerrando carrito...');
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('✅ Carrito cerrado exitosamente');
    }
};

window.clearCart = function() {
    console.log('🗑️ Limpiando carrito...');
    window.almakidsCart = [];
    localStorage.removeItem('almakids_cart');
    
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.innerHTML = `
            <div class="cart-empty" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega algunos productos!</p>
            </div>
        `;
    }
    
    updateCartCount();
    console.log('✅ Carrito limpiado exitosamente');
};

window.requestQuote = function() {
    console.log('📞 Solicitando cotización...');
    
    let message = '🎪 *ALMA Kids - Solicitud de Cotización*\\n\\n';
    
    if (window.almakidsCart.length > 0) {
        message += '*Productos en mi carrito:*\\n';
        window.almakidsCart.forEach(item => {
            message += `• ${item.name || 'Producto'} (Cantidad: ${item.quantity || 1})\\n`;
        });
        message += '\\n';
    }
    
    message += '¡Hola! Me interesa solicitar una cotización para sus servicios. ¿Podrían enviarme más información?';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('✅ Redirigiendo a WhatsApp para cotización');
};

window.addToCart = function(code, name, category) {
    console.log(`🛒 Agregando al carrito: ${name}`);
    
    const existingItem = window.almakidsCart.find(item => item.code === code);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.almakidsCart.push({
            code: code,
            name: name,
            category: category,
            quantity: 1,
            timestamp: Date.now()
        });
    }
    
    localStorage.setItem('almakids_cart', JSON.stringify(window.almakidsCart));
    updateCartCount();
    
    // Mostrar notificación simple
    showSimpleNotification(`✅ ${name} agregado al carrito`);
    
    console.log('✅ Producto agregado exitosamente');
};

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (window.almakidsCart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Agrega algunos globos metalizados!</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = window.almakidsCart.map(item => `
        <div class="cart-item" style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid #f0f0f0; gap: 1rem;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">${item.name}</h4>
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">Código: ${item.code}</p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">Categoría: ${item.category}</p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">Cantidad: ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart('${item.code}')" style="
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
            ">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.removeFromCart = function(code) {
    console.log(`🗑️ Eliminando del carrito: ${code}`);
    
    const index = window.almakidsCart.findIndex(item => item.code === code);
    if (index > -1) {
        const item = window.almakidsCart[index];
        window.almakidsCart.splice(index, 1);
        localStorage.setItem('almakids_cart', JSON.stringify(window.almakidsCart));
        updateCartCount();
        updateCartDisplay();
        
        showSimpleNotification(`🗑️ ${item.name} eliminado del carrito`);
        console.log('✅ Producto eliminado exitosamente');
    }
};

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = window.almakidsCart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        
        // Animación simple
        if (totalItems > 0) {
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// ========================================
// OTRAS FUNCIONES BÁSICAS
// ========================================

window.togglePriceCalculator = function() {
    console.log('🧮 Abriendo calculadora...');
    
    // Crear modal de calculadora
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'priceCalculatorModal';
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 12px;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div class="modal-header" style="
                padding: 1.5rem;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, #E91E63, #FF6B9D);
                color: white;
                border-radius: 12px 12px 0 0;
            ">
                <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-calculator"></i> Calculadora de Precios
                </h3>
                <button onclick="closePriceCalculator()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'" onmouseout="this.style.backgroundColor='transparent'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="calculator-content" style="padding: 1.5rem;">
                <div class="calculator-intro" style="
                    background: linear-gradient(135deg, #FFF0F5, #F0F8FF);
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    text-align: center;
                ">
                    <h4 style="margin: 0 0 0.5rem 0; color: #E91E63;">🎪 Cotiza tu Evento Perfecto</h4>
                    <p style="margin: 0; color: #666;">Selecciona los servicios y obtén un precio estimado al instante</p>
                </div>
                
                <div class="calculator-form">
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                            <i class="fas fa-castle"></i> Tipo de Servicio Principal:
                        </label>
                        <select id="serviceTypeCalc" onchange="calculatePrice()" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                            transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='#E91E63'" onblur="this.style.borderColor='#ddd'">
                            <option value="" data-price="0">Selecciona un servicio...</option>
                            <option value="plaza-blanda-basico" data-price="60000">Plaza Blanda Básica - $60.000</option>
                            <option value="plaza-blanda-premium" data-price="75000">Plaza Blanda Premium - $75.000</option>
                            <option value="inflable-pequeno" data-price="70000">Castillo Inflable Pequeño - $70.000</option>
                            <option value="inflable-mediano" data-price="85000">Castillo Inflable Mediano - $85.000</option>
                            <option value="inflable-grande" data-price="100000">Castillo Inflable Grande - $100.000</option>
                            <option value="combo-plaza-inflable" data-price="130000">Combo Plaza + Inflable - $130.000</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                            <i class="fas fa-palette"></i> Decoración con Globos Metalizados:
                        </label>
                        <select id="decorationCalc" onchange="calculatePrice()" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                            transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='#E91E63'" onblur="this.style.borderColor='#ddd'">
                            <option value="" data-price="0">Sin decoración adicional</option>
                            <option value="globos-basico" data-price="25000">Decoración Básica - $25.000</option>
                            <option value="tematica-personalizada" data-price="60000">Temática Personalizada - $60.000</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">
                            <i class="fas fa-plus-circle"></i> Servicios Adicionales:
                        </label>
                        <div class="checkbox-group" style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                                <input type="checkbox" value="supervision" data-price="25000" onchange="calculatePrice()" style="margin: 0;">
                                <span>👥 Supervisión Profesional (+$25.000)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                                <input type="checkbox" value="tiempo-extra" data-price="20000" onchange="calculatePrice()" style="margin: 0;">
                                <span>⏰ Tiempo Extra 2hrs (+$20.000)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'">
                                <input type="checkbox" value="traslado" data-price="15000" onchange="calculatePrice()" style="margin: 0;">
                                <span>🚚 Traslado Especial (+$15.000)</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="price-result" style="
                        background: linear-gradient(135deg, #E3F2FD, #F3E5F5);
                        padding: 1.5rem;
                        border-radius: 12px;
                        text-align: center;
                        margin: 1.5rem 0;
                        border: 2px solid #E91E63;
                    ">
                        <h3 style="margin: 0 0 0.5rem 0; color: #E91E63; font-size: 1.8rem;">
                            Total Estimado: <span id="totalPrice" style="color: #2E7D32;">$0</span>
                        </h3>
                        <p style="margin: 0; font-size: 0.875rem; color: #666; font-style: italic;">
                            *Precio referencial. Cotización final puede variar según ubicación y requerimientos específicos.
                        </p>
                    </div>
                    
                    <div class="calculator-actions" style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="requestQuoteFromCalculator()" style="
                            background: linear-gradient(135deg, #25D366, #128C7E);
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1rem;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fab fa-whatsapp"></i> Solicitar Cotización
                        </button>
                        <button onclick="resetCalculator()" style="
                            background: #f8f9fa;
                            color: #666;
                            border: 2px solid #ddd;
                            padding: 1rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1rem;
                            transition: all 0.2s;
                        " onmouseover="this.style.borderColor='#E91E63'; this.style.color='#E91E63'" onmouseout="this.style.borderColor='#ddd'; this.style.color='#666'">
                            <i class="fas fa-redo"></i> Reiniciar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Calculadora de precios abierta');
};

window.closePriceCalculator = function() {
    console.log('🧮 Cerrando calculadora...');
    const modal = document.getElementById('priceCalculatorModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        console.log('✅ Calculadora cerrada');
    }
};

window.calculatePrice = function() {
    console.log('🧮 Calculando precio...');
    
    const serviceSelect = document.getElementById('serviceTypeCalc');
    const decorationSelect = document.getElementById('decorationCalc');
    const additionalServices = document.querySelectorAll('#priceCalculatorModal input[type="checkbox"]:checked');
    
    let total = 0;
    
    // Precio base del servicio
    if (serviceSelect && serviceSelect.selectedOptions[0]) {
        total += parseInt(serviceSelect.selectedOptions[0].dataset.price || 0);
    }
    
    // Precio de decoración
    if (decorationSelect && decorationSelect.selectedOptions[0]) {
        total += parseInt(decorationSelect.selectedOptions[0].dataset.price || 0);
    }
    
    // Servicios adicionales
    if (additionalServices) {
        additionalServices.forEach(service => {
            total += parseInt(service.dataset.price || 0);
        });
    }
    
    // Mostrar total
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toLocaleString('es-CL')}`;
        
        // Animación del precio
        totalPriceElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalPriceElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    console.log(`✅ Precio calculado: $${total.toLocaleString('es-CL')}`);
};

window.requestQuoteFromCalculator = function() {
    console.log('📞 Solicitando cotización desde calculadora...');
    
    const serviceSelect = document.getElementById('serviceTypeCalc');
    const decorationSelect = document.getElementById('decorationCalc');
    const additionalServices = document.querySelectorAll('#priceCalculatorModal input[type="checkbox"]:checked');
    const total = document.getElementById('totalPrice').textContent;
    
    let message = '🎪 *ALMA Kids - Cotización desde Calculadora*\\n\\n';
    
    if (serviceSelect && serviceSelect.value) {
        message += `*Servicio Principal:* ${serviceSelect.selectedOptions[0].text}\\n`;
    }
    
    if (decorationSelect && decorationSelect.value) {
        message += `*Decoración:* ${decorationSelect.selectedOptions[0].text}\\n`;
    }
    
    if (additionalServices.length > 0) {
        message += '*Servicios Adicionales:*\\n';
        additionalServices.forEach(service => {
            const label = service.parentElement.textContent.trim();
            message += `• ${label}\\n`;
        });
    }
    
    message += `\\n*Total Estimado:* ${total}\\n`;
    message += '\\n¿Podrían confirmarme la disponibilidad y precio final para mi evento?';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closePriceCalculator();
    showSimpleNotification('✅ Cotización enviada a WhatsApp');
    
    console.log('✅ Cotización enviada exitosamente');
};

window.resetCalculator = function() {
    console.log('🔄 Reiniciando calculadora...');
    
    const serviceSelect = document.getElementById('serviceTypeCalc');
    const decorationSelect = document.getElementById('decorationCalc');
    const checkboxes = document.querySelectorAll('#priceCalculatorModal input[type="checkbox"]');
    const totalPrice = document.getElementById('totalPrice');
    
    if (serviceSelect) serviceSelect.value = '';
    if (decorationSelect) decorationSelect.value = '';
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    if (totalPrice) {
        totalPrice.textContent = '$0';
    }
    
    showSimpleNotification('🔄 Calculadora reiniciada');
    console.log('✅ Calculadora reiniciada');
};

window.toggleFavorites = function() {
    console.log('❤️ Abriendo favoritos...');
    showSimpleNotification('❤️ Sistema de favoritos: Próximamente disponible');
};

window.toggleComparison = function() {
    console.log('⚖️ Abriendo comparador...');
    showSimpleNotification('⚖️ Comparador: Próximamente disponible');
};

window.toggleMobileMenu = function() {
    console.log('📱 Toggle menú móvil...');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (mobileMenu) {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            console.log('✅ Menú móvil cerrado');
        } else {
            mobileMenu.classList.add('active');
            body.classList.add('menu-open');
            console.log('✅ Menú móvil abierto');
        }
    } else {
        console.error('❌ Menú móvil no encontrado');
    }
};

window.closeMobileMenu = function() {
    console.log('📱 Cerrando menú móvil...');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
        console.log('✅ Menú móvil cerrado');
    }
};

window.toggleSearch = function() {
    console.log('🔍 Toggle búsqueda...');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    if (searchContainer) {
        const isActive = searchContainer.classList.contains('active');
        
        if (isActive) {
            searchContainer.classList.remove('active');
            searchContainer.style.display = 'none';
        } else {
            searchContainer.classList.add('active');
            searchContainer.style.display = 'block';
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        console.log('✅ Búsqueda toggled');
    }
};

window.performSearch = function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    // Resultados básicos
    const results = [
        { text: 'Juegos Inflables', url: 'index.html#servicios' },
        { text: 'Plaza Blanda', url: 'index.html#plaza-blanda' },
        { text: 'Globos Metalizados', url: 'globos-metalizados.html' },
        { text: 'Eventos', url: 'eventos.html' },
        { text: 'FAQ', url: 'faq.html' },
        { text: 'Contacto', url: 'index.html#contacto' }
    ].filter(result => result.text.toLowerCase().includes(query));
    
    if (results.length > 0) {
        searchResults.innerHTML = results.map(result => 
            `<div onclick="window.location.href='${result.url}'" style="
                padding: 0.75rem;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <i class="fas fa-search"></i>
                <span>${result.text}</span>
            </div>`
        ).join('');
    } else {
        searchResults.innerHTML = '<div style="padding: 0.75rem; color: #666;">No se encontraron resultados</div>';
    }
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function showSimpleNotification(message) {
    // Crear notificación simple
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ========================================
// FORMULARIO DE CONTACTO MEJORADO
// ========================================

function setupContactForm() {
    console.log('📝 Configurando formulario de contacto...');
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.warn('❌ Formulario de contacto no encontrado');
        return;
    }
    
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
                console.log(`⏰ Hora de término calculada: ${endTimeString}`);
            }
        });
    }
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Formulario de contacto configurado');
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let message = '';

    // Limpiar errores previos
    clearFieldError(field);

    // Validaciones específicas
    switch (type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                message = 'Por favor ingresa un email válido';
            }
            break;
        
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                message = 'Por favor ingresa un teléfono válido (+56 9 1234 5678)';
            }
            break;
        
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                message = 'La fecha del evento debe ser futura';
            }
            break;
    }

    // Validaciones por nombre de campo
    if (name === 'name' && value.length < 2) {
        isValid = false;
        message = 'El nombre debe tener al menos 2 caracteres';
    }

    if (name === 'location' && value.length < 10) {
        isValid = false;
        message = 'Por favor proporciona una dirección completa';
    }

    if (!isValid) {
        showFieldError(field, message);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    
    // Crear mensaje de error
    let errorDiv = field.parentNode.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
            animation: slideDown 0.3s ease;
        `;
        field.parentNode.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📤 Enviando formulario...');
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validar todos los campos
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let allValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });

    if (!allValid) {
        showSimpleNotification('❌ Por favor corrige los errores en el formulario');
        return false;
    }

    // Deshabilitar botón y mostrar loading
    submitButton.disabled = true;
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.style.background = '#95a5a6';

    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Simular envío exitoso
    setTimeout(() => {
        // Construir mensaje para WhatsApp
        const message = buildWhatsAppMessage(data);
        
        // Mostrar éxito
        showSimpleNotification('✅ ¡Cotización procesada! Te redirigimos a WhatsApp...');
        
        // Limpiar formulario
        form.reset();
        
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
        
        // Abrir WhatsApp
        setTimeout(() => {
            const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }, 1000);
        
        console.log('✅ Formulario enviado exitosamente');
    }, 2000);

    return false;
}

function buildWhatsAppMessage(data) {
    // Usar solo emojis básicos compatibles con WhatsApp
    let message = '🎪 *COTIZACION ALMA KIDS* 🎪\n';
    message += '==========================\n\n';
    
    // Información del cliente
    message += `*Cliente:* ${data.name}\n`;
    message += `*Email:* ${data.email}\n`;
    message += `*Telefono:* ${data.phone}\n\n`;
    
    // Detalles del evento
    message += `*DETALLES DEL EVENTO*\n`;
    message += `-------------------------\n`;
    message += `*Fecha:* ${data.eventDate}\n`;
    message += `*Hora:* ${data.startTime} - ${data.endTime}\n`;
    
    // Ubicación con enlace de Google Maps
    const locationCoords = data.locationCoords;
    const locationUrl = data.locationUrl;
    
    if (locationCoords && locationCoords.includes(',')) {
        // Usar formato directo de Google Maps sin URL corta
        message += `*Ubicacion:* https://www.google.com/maps?q=${locationCoords}\n\n`;
    } else if (data.location) {
        // Si no hay coordenadas, crear enlace de búsqueda
        const searchQuery = encodeURIComponent(data.location);
        message += `*Ubicacion:* https://www.google.com/maps/search/${searchQuery}\n\n`;
    } else {
        message += `*Ubicacion:* ${data.location || 'Por confirmar'}\n\n`;
    }
    
    // Servicios solicitados
    message += `*SERVICIOS SOLICITADOS*\n`;
    message += `-------------------------\n`;
    if (data.serviceType) {
        message += `*Tipo de servicio:* ${getServiceName(data.serviceType)}\n`;
    }
    if (data.decoration && data.decoration !== 'ninguna') {
        message += `*Decoracion:* ${getDecorationName(data.decoration)}\n`;
    }
    
    // Horas adicionales si las hay
    const extraHoursData = window.getExtraHoursData ? window.getExtraHoursData() : null;
    if (extraHoursData && extraHoursData.needed && extraHoursData.hours > 0) {
        message += `*Horas adicionales:* +${extraHoursData.hours} hora${extraHoursData.hours > 1 ? 's' : ''}\n`;
        message += `*Costo horas extra:* $${extraHoursData.cost.toLocaleString('es-CL')}\n`;
    }
    
    // Información de traslado si está disponible
    if (window.almakidsMapSystem && window.almakidsMapSystem.selectedLocation) {
        const location = window.almakidsMapSystem.selectedLocation;
        if (location.distance !== undefined && location.travelCost !== undefined) {
            message += `\n🚗 *INFORMACIÓN DE TRASLADO*\n`;
            message += `📏 *Distancia:* ${location.distance.toFixed(1)} km desde Machalí\n`;
            if (location.travelCost === 0) {
                message += `💰 *Costo traslado:* ¡GRATIS! (Zona de cobertura)\n`;
            } else {
                message += `💰 *Costo traslado:* $${location.travelCost.toLocaleString('es-CL')}\n`;
            }
        }
    }
    
    // Productos del carrito si los hay
    if (window.almakidsCart && window.almakidsCart.length > 0) {
        message += `\n*PRODUCTOS ADICIONALES:*\n`;
        window.almakidsCart.forEach(item => {
            message += `- ${item.name} (${item.code})\n`;
        });
    }
    
    // Mensaje adicional del cliente
    if (data.additionalMessage && data.additionalMessage.trim()) {
        message += `\n*Mensaje adicional:*\n${data.additionalMessage}\n\n`;
    } else {
        message += `\n`;
    }
    
    message += '==========================\n';
    message += '*Gracias por elegir ALMA Kids!* 🎪\n';
    message += '*Donde los suenos se inflan y la diversion nunca termina!*';
    
    return message;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-CL', options);
}

function getServiceName(serviceType) {
    const services = {
        'plaza-blanda-basico': 'Plaza Blanda - Kit Básico',
        'plaza-blanda-premium': 'Plaza Blanda - Kit Premium',
        'inflable-pequeno': 'Inflable Pequeño',
        'inflable-mediano': 'Inflable Mediano',
        'inflable-grande': 'Inflable Grande',
        'combo-plaza-inflable': 'Combo Plaza + Inflable'
    };
    return services[serviceType] || serviceType;
}

function getDecorationName(decoration) {
    const decorations = {
        'globos-basico': 'Decoración con Globos - Básico',
        'tematica-personalizada': 'Temática Personalizada'
    };
    return decorations[decoration] || decoration;
}

// ========================================
// INICIALIZACIÓN INMEDIATA
// ========================================

    // Ejecutar inmediatamente sin esperar DOMContentLoaded
(function() {
    console.log('🎪 ALMA Kids: Funciones de emergencia cargadas');
    
    // Cuadro informativo de facturas eliminado - solo se mantiene en footer
    
    // Actualizar contador del carrito inmediatamente
    setTimeout(() => {
        updateCartCount();
    }, 100);
    
    // Configurar formulario de contacto
    setTimeout(() => {
        setupContactForm();
        setupExtraHoursSystem();
    }, 500);
    
    // Verificar que los botones existan
    setTimeout(() => {
        const cartButton = document.querySelector('.cart-btn');
        const priceButton = document.querySelector('.price-btn');
        const favoritesButton = document.querySelector('.favorites-btn');
        const comparisonButton = document.querySelector('.comparison-btn');
        
        console.log('🔍 Verificando botones:');
        console.log('Carrito:', cartButton ? '✅' : '❌');
        console.log('Calculadora:', priceButton ? '✅' : '❌');
        console.log('Favoritos:', favoritesButton ? '✅' : '❌');
        console.log('Comparación:', comparisonButton ? '✅' : '❌');
        
        if (cartButton) {
            cartButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🛒 Click en botón de carrito detectado');
                window.openCartModal();
            });
        }
        
        if (priceButton) {
            priceButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🧮 Click en calculadora detectado');
                window.togglePriceCalculator();
            });
        }
        
        if (favoritesButton) {
            favoritesButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('❤️ Click en favoritos detectado');
                window.toggleFavorites();
            });
        }
        
        if (comparisonButton) {
            comparisonButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('⚖️ Click en comparación detectado');
                window.toggleComparison();
            });
        }
    }, 500);
})();

// CSS básico para animaciones
const emergencyCSS = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-count {
        transition: transform 0.2s ease;
    }
    
    .mobile-menu.active {
        display: block !important;
        transform: translateX(0) !important;
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    .search-container.active {
        display: block !important;
    }
    
    /* Mejoras del formulario de contacto */
    #contactForm {
        background: linear-gradient(135deg, #FFF0F5, #F0F8FF);
        padding: 2rem;
        border-radius: 16px;
        border: 2px solid rgba(233, 30, 99, 0.1);
        box-shadow: 0 10px 30px rgba(233, 30, 99, 0.1);
    }
    
    .form-notice {
        background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
        color: #2c3e50;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 2px solid rgba(233, 30, 99, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .form-notice i {
        color: #E91E63;
        font-size: 1.2rem;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 0.875rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        border-color: #E91E63;
        box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.1);
        transform: translateY(-2px);
        outline: none;
    }
    
    .form-group input.success,
    .form-group textarea.success,
    .form-group select.success {
        border-color: #27ae60;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }
    
    button[type="submit"] {
        background: linear-gradient(135deg, #E91E63, #FF6B9D);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    button[type="submit"]:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
    }
    
    button[type="submit"]:disabled {
        background: #95a5a6;
        cursor: not-allowed;
        transform: none;
    }
    
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Estilos para la sección de ubicación mejorada */
        .location-section {
            width: 100%;
        }

        .location-input-group {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .location-input-group input {
            flex: 1;
        }

        .btn-map {
            background: linear-gradient(135deg, #17a2b8, #20c997);
            color: white;
            border: none;
            padding: 0.875rem 1.25rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 8px rgba(23, 162, 184, 0.2);
            min-width: 80px;
        }

        .btn-map:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
        }

        .btn-map .btn-text {
            display: none;
        }

        .location-help {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 1rem;
            padding: 0.75rem;
            background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
            border-radius: 8px;
            border: 1px solid rgba(233, 30, 99, 0.1);
        }

        .location-help i {
            color: #17a2b8;
            font-size: 1rem;
        }

        .selected-location {
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            border-radius: 12px;
            padding: 1rem;
            margin-top: 1rem;
            animation: slideDown 0.3s ease;
        }

        .location-info {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }

        .location-icon {
            background: rgba(39, 174, 96, 0.2);
            padding: 0.75rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 48px;
            height: 48px;
        }

        .location-icon i {
            color: #27ae60;
            font-size: 1.25rem;
        }

        .location-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .location-details span {
            font-weight: 600;
            color: #155724;
            line-height: 1.4;
        }

        .location-details small {
            color: #666;
            font-size: 0.85rem;
        }

        .btn-remove-location {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
            border: 2px solid rgba(220, 53, 69, 0.2);
            padding: 0.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-remove-location:hover {
            background: rgba(220, 53, 69, 0.2);
            transform: scale(1.1);
        }

        /* Responsive para móviles */
        @media (max-width: 768px) {
            .location-input-group {
                flex-direction: column;
                gap: 0.5rem;
            }

            .btn-map {
                width: 100%;
                justify-content: center;
            }

            .btn-map .btn-text {
                display: inline;
            }

            .location-info {
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 0.75rem;
            }

            .location-details {
                align-items: center;
            }
        }

        /* Estilos para Redes Sociales */
        .social-media-section {
            border-top: 2px solid rgba(233, 30, 99, 0.1);
            margin-top: 1.5rem;
            padding-top: 1.5rem;
        }

        .social-links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .social-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }

        .social-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }

        .social-link:hover::before {
            left: 100%;
        }

        .social-link i {
            font-size: 1.25rem;
            min-width: 24px;
            text-align: center;
        }

        .social-link span {
            font-size: 0.9rem;
        }

        /* Instagram */
        .social-link.instagram {
            background: linear-gradient(135deg, #E4405F, #C13584);
            color: white;
            box-shadow: 0 4px 15px rgba(225, 48, 108, 0.3);
        }

        .social-link.instagram:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(225, 48, 108, 0.4);
        }

        /* Facebook */
        .social-link.facebook {
            background: linear-gradient(135deg, #1877F2, #42A5F5);
            color: white;
            box-shadow: 0 4px 15px rgba(24, 119, 242, 0.3);
        }

        .social-link.facebook:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(24, 119, 242, 0.4);
        }

        /* TikTok */
        .social-link.tiktok {
            background: linear-gradient(135deg, #000000, #FF0050);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 0, 80, 0.3);
        }

        .social-link.tiktok:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 0, 80, 0.4);
        }

        /* WhatsApp */
        .social-link.whatsapp {
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .social-link.whatsapp:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }

        .social-cta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: linear-gradient(135deg, #FFF0F5, #F0F8FF);
            border-radius: 12px;
            border: 2px solid rgba(233, 30, 99, 0.1);
            text-align: center;
            justify-content: center;
            font-size: 0.9rem;
            color: #2c3e50;
            font-weight: 600;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.2);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 0 0 10px rgba(233, 30, 99, 0);
            }
        }

        /* Responsive para redes sociales */
        @media (max-width: 768px) {
            .social-links {
                gap: 0.5rem;
            }
            
            .social-link {
                padding: 0.625rem 0.875rem;
                font-size: 0.85rem;
            }
            
            .social-link i {
                font-size: 1.1rem;
            }
            
            .social-cta {
                padding: 0.75rem;
                font-size: 0.85rem;
            }
        }

        /* Animación especial para el icono de compartir */
        .social-media-section > i {
            animation: bounce 2s infinite;
            color: #E91E63 !important;
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

        /* Estilos para Horas Adicionales */
        .extra-hours-section {
            background: linear-gradient(135deg, #FFF8DC, #F0F8FF);
            border: 2px solid rgba(233, 30, 99, 0.1);
            border-radius: 16px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            transition: all 0.3s ease;
        }

        .extra-hours-header {
            margin-bottom: 1rem;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        #needExtraHours {
            width: 20px;
            height: 20px;
            accent-color: #E91E63;
            cursor: pointer;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #2c3e50;
            cursor: pointer;
            font-size: 1.1rem;
        }

        .checkbox-label i {
            color: #E91E63;
            font-size: 1.2rem;
        }

        .extra-hours-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: #666;
            padding: 0.75rem;
            background: rgba(233, 30, 99, 0.05);
            border-radius: 8px;
            border-left: 4px solid #E91E63;
        }

        .extra-hours-info i {
            color: #17a2b8;
            font-size: 1rem;
        }

        .extra-hours-content {
            animation: slideDown 0.3s ease;
            border-top: 2px solid rgba(233, 30, 99, 0.1);
            padding-top: 1.5rem;
            margin-top: 1.5rem;
        }

        .extra-hours-cost {
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            border-radius: 12px;
            padding: 1rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #155724;
        }

        .extra-hours-cost i {
            color: #27ae60;
            font-size: 1.2rem;
        }

        .extra-hours-cost strong {
            color: #27ae60;
            font-size: 1.1rem;
        }

        .extra-hours-details {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            border: 2px solid rgba(233, 30, 99, 0.1);
        }

        .pricing-info h4 {
            margin: 0 0 1rem 0;
            color: #E91E63;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .pricing-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
            border-radius: 8px;
            border: 2px solid rgba(233, 30, 99, 0.1);
            transition: all 0.3s ease;
        }

        .pricing-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(233, 30, 99, 0.1);
        }

        .pricing-item i {
            color: #E91E63;
            font-size: 1.25rem;
            min-width: 24px;
        }

        .pricing-item span {
            font-size: 0.9rem;
            color: #2c3e50;
        }

        .pricing-item strong {
            color: #E91E63;
            font-weight: 700;
        }

        .extra-hours-note {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
            border-radius: 8px;
            border: 2px solid rgba(255, 193, 7, 0.3);
            font-size: 0.9rem;
            color: #856404;
            font-weight: 500;
        }

        .extra-hours-note i {
            color: #ffc107;
            font-size: 1.2rem;
        }

        #customHours {
            display: none;
            margin-bottom: 1rem;
        }

        #customHours.show {
            display: block;
            animation: slideDown 0.3s ease;
        }

        /* Estados activos */
        .extra-hours-section.active {
            border-color: #E91E63;
            box-shadow: 0 8px 25px rgba(233, 30, 99, 0.15);
            transform: translateY(-2px);
        }

        /* Responsive para horas adicionales */
        @media (max-width: 768px) {
            .extra-hours-section {
                padding: 1rem;
            }

            .checkbox-label {
                font-size: 1rem;
            }

            .pricing-grid {
                grid-template-columns: 1fr;
                gap: 0.75rem;
            }

            .pricing-item {
                padding: 0.75rem;
                font-size: 0.85rem;
            }

            .extra-hours-details {
                padding: 1rem;
            }

            .extra-hours-note {
                padding: 0.875rem;
                font-size: 0.85rem;
            }
        }

        /* Estilos para Footer de Redes Sociales */
        .footer-social-links {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid rgba(233, 30, 99, 0.1);
        }

        .footer-social-grid {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .footer-social-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .footer-social-link.instagram {
            background: linear-gradient(135deg, #E4405F, #C13584);
            color: white;
        }

        .footer-social-link.facebook {
            background: linear-gradient(135deg, #1877F2, #42A5F5);
            color: white;
        }

        .footer-social-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .footer-social-link i {
            font-size: 1.1rem;
        }

        /* Responsive footer social */
        @media (max-width: 768px) {
            .footer-social-grid {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .footer-social-link {
                justify-content: center;
                padding: 0.75rem;
            }
        }

        /* Estilos para colores específicos en redes sociales de contacto */
        .social-media-section h4 {
            color: #2c3e50 !important; /* Negro para "Síguenos en Redes Sociales" */
        }

        .social-media-section .social-link span {
            color: white !important; /* Blanco para "@alma.kidscl" y "ALMA Kids" */
        }

        .social-cta {
            color: #2c3e50 !important; /* Negro para "¡Comparte la magia..." */
        }

        .social-cta span {
            color: #2c3e50 !important; /* Negro para el texto del mensaje */
        }
`;

// ========================================
// CUADRO INFORMATIVO DE FACTURACIÓN
// ========================================

// Funciones de facturación eliminadas - solo se mantiene mensaje en footer

// Inyectar CSS inmediatamente (sin CSS de facturación)
const style = document.createElement('style');
style.textContent = emergencyCSS;
document.head.appendChild(style);

// ========================================
// SISTEMA DE HORAS ADICIONALES
// ========================================

function setupExtraHoursSystem() {
    console.log('🕒 Configurando sistema de horas adicionales...');
    
    const needExtraHoursCheckbox = document.getElementById('needExtraHours');
    const extraHoursContent = document.getElementById('extraHoursContent');
    const extraHoursSelect = document.getElementById('extraHours');
    const customHoursInput = document.getElementById('customHours');
    const extraHoursCost = document.getElementById('extraHoursCost');
    const extraHoursSection = document.querySelector('.extra-hours-section');
    
    if (!needExtraHoursCheckbox || !extraHoursContent) {
        console.warn('❌ Elementos de horas adicionales no encontrados');
        return;
    }
    
    // Toggle del contenido de horas adicionales
    needExtraHoursCheckbox.addEventListener('change', function() {
        if (this.checked) {
            extraHoursContent.style.display = 'block';
            extraHoursSection.classList.add('active');
            console.log('✅ Horas adicionales activadas');
        } else {
            extraHoursContent.style.display = 'none';
            extraHoursSection.classList.remove('active');
            // Limpiar selecciones
            if (extraHoursSelect) extraHoursSelect.value = '';
            if (customHoursInput) {
                customHoursInput.value = '';
                customHoursInput.style.display = 'none';
            }
            updateExtraHoursCost(0);
            console.log('❌ Horas adicionales desactivadas');
        }
    });
    
    // Manejo del selector de horas adicionales
    if (extraHoursSelect) {
        extraHoursSelect.addEventListener('change', function() {
            const value = this.value;
            
            if (value === 'custom') {
                customHoursInput.style.display = 'block';
                customHoursInput.classList.add('show');
                customHoursInput.focus();
                updateExtraHoursCost(0);
            } else {
                customHoursInput.style.display = 'none';
                customHoursInput.classList.remove('show');
                customHoursInput.value = '';
                
                if (value) {
                    const hours = parseInt(value);
                    calculateExtraHoursCost(hours);
                } else {
                    updateExtraHoursCost(0);
                }
            }
        });
    }
    
    // Manejo del input personalizado
    if (customHoursInput) {
        customHoursInput.addEventListener('input', function() {
            const value = this.value.trim();
            const hours = parseInt(value);
            
            if (value && !isNaN(hours) && hours > 0) {
                calculateExtraHoursCost(hours);
            } else {
                updateExtraHoursCost(0);
            }
        });
    }
    
    console.log('✅ Sistema de horas adicionales configurado');
}

function calculateExtraHoursCost(hours) {
    // Obtener tipo de servicio seleccionado
    const serviceTypeSelect = document.getElementById('serviceType');
    let serviceType = '';
    
    if (serviceTypeSelect && serviceTypeSelect.value) {
        serviceType = serviceTypeSelect.value;
    }
    
    // Precios por hora según el tipo de servicio
    const hourlyRates = {
        'plaza-blanda-basico': 15000,
        'plaza-blanda-premium': 15000,
        'inflable-pequeno': 20000,
        'inflable-mediano': 20000,
        'inflable-grande': 20000,
        'combo-plaza-inflable': 25000
    };
    
    // Precio por defecto si no hay servicio seleccionado
    const defaultRate = 20000;
    const rate = hourlyRates[serviceType] || defaultRate;
    const totalCost = hours * rate;
    
    updateExtraHoursCost(totalCost, hours, rate);
    
    console.log(`💰 Calculado: ${hours} horas × $${rate.toLocaleString('es-CL')} = $${totalCost.toLocaleString('es-CL')}`);
}

function updateExtraHoursCost(cost, hours = 0, rate = 0) {
    const extraHoursCostElement = document.getElementById('extraHoursCost');
    
    if (!extraHoursCostElement) return;
    
    if (cost === 0) {
        extraHoursCostElement.innerHTML = `
            <i class="fas fa-calculator"></i>
            <span>Costo adicional: <strong>$0</strong></span>
        `;
    } else {
        extraHoursCostElement.innerHTML = `
            <i class="fas fa-calculator"></i>
            <span>
                ${hours} hora${hours > 1 ? 's' : ''} × $${rate.toLocaleString('es-CL')} = 
                <strong>$${cost.toLocaleString('es-CL')}</strong>
            </span>
        `;
    }
}

// Función para obtener datos de horas adicionales (para usar en el formulario)
window.getExtraHoursData = function() {
    const needExtraHours = document.getElementById('needExtraHours');
    const extraHoursSelect = document.getElementById('extraHours');
    const customHoursInput = document.getElementById('customHours');
    
    if (!needExtraHours || !needExtraHours.checked) {
        return {
            needed: false,
            hours: 0,
            cost: 0,
            description: 'Sin horas adicionales'
        };
    }
    
    let hours = 0;
    let description = '';
    
    if (extraHoursSelect && extraHoursSelect.value) {
        if (extraHoursSelect.value === 'custom') {
            hours = parseInt(customHoursInput.value) || 0;
            description = `${hours} horas adicionales (personalizado)`;
        } else {
            hours = parseInt(extraHoursSelect.value);
            const selectedOption = extraHoursSelect.options[extraHoursSelect.selectedIndex];
            description = selectedOption.text;
        }
    }
    
    // Calcular costo
    const serviceTypeSelect = document.getElementById('serviceType');
    const serviceType = serviceTypeSelect ? serviceTypeSelect.value : '';
    
    const hourlyRates = {
        'plaza-blanda-basico': 15000,
        'plaza-blanda-premium': 15000,
        'inflable-pequeno': 20000,
        'inflable-mediano': 20000,
        'inflable-grande': 20000,
        'combo-plaza-inflable': 25000
    };
    
    const rate = hourlyRates[serviceType] || 20000;
    const cost = hours * rate;
    
    return {
        needed: true,
        hours: hours,
        cost: cost,
        rate: rate,
        description: description
    };
};
