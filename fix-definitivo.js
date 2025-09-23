/**
 * ALMA Kids - Fix Definitivo
 * Sistema que SÍ funciona
 */

// Variables globales (persistentes)
let cart = JSON.parse(localStorage.getItem('almakids_cart') || '[]');
let searchOpen = false;
let menuOpen = false;

// Esperar a que cargue todo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Fix definitivo iniciando...');
    
    // Sincronizar contador del carrito con almacenamiento persistente
    updateCartCount();
    
    // Arreglar búsqueda
    fixSearch();
    
    // Arreglar carrito
    fixCart();
    
    console.log('✅ Fix definitivo completado');
});

function fixSearch() {
    // Buscar TODOS los botones de búsqueda (header y flotantes)
    const searchButtons = Array.from(document.querySelectorAll('.btn-search'));
    if (searchButtons.length === 0) {
        console.log('❌ Botón de búsqueda no encontrado');
        return;
    }

    // Remover eventos anteriores y onclick inline, luego agregar listener nuevo a cada botón
    searchButtons.forEach(btn => {
        try { btn.onclick = null; } catch(e) {}
        try { btn.setAttribute('onclick', ''); } catch(e) {}
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 Búsqueda clickeada');

            const searchContainer = document.getElementById('searchContainer');
            const searchInput = document.getElementById('searchInput');

            if (!searchContainer || !searchInput) {
                console.log('❌ Elementos de búsqueda no encontrados');
                return;
            }

            if (searchOpen) {
                searchContainer.style.display = 'none';
                searchContainer.classList.remove('active');
                searchOpen = false;
                console.log('✅ Búsqueda cerrada');
            } else {
                searchContainer.style.display = 'block';
                searchContainer.classList.add('active');
                searchInput.focus();
                searchOpen = true;
                console.log('✅ Búsqueda abierta');
            }
        }, { passive: true });
    });
    
    // Arreglar input de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Buscar al escribir
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const resultsContainer = document.getElementById('searchResults');
            
            if (!resultsContainer) return;
            
            if (query.length < 1) {
                resultsContainer.innerHTML = '';
                return;
            }
            
            // Términos de búsqueda
            const searchTerms = {
                'inflable': 'index.html#servicios',
                'castillo': 'index.html#servicios',
                'plaza blanda': 'index.html#plaza-blanda',
                'globos': 'globos-metalizados.html',
                'eventos': 'eventos.html',
                'cumpleaños': 'eventos.html',
                'preguntas': 'faq.html',
                'faq': 'faq.html',
                'contacto': 'index.html#contacto',
                'precios': 'faq.html',
                'reserva': 'index.html#contacto',
                'dinosaurio': 'globos-metalizados.html',
                'princesa': 'globos-metalizados.html',
                'pokemon': 'globos-metalizados.html'
            };
            
            const results = [];
            Object.keys(searchTerms).forEach(term => {
                if (term.includes(query) || query.includes(term)) {
                    results.push({
                        title: term.charAt(0).toUpperCase() + term.slice(1),
                        url: searchTerms[term]
                    });
                }
            });
            
            if (results.length > 0) {
                resultsContainer.innerHTML = results.map(result => 
                    `<div class="search-result-item" onclick="window.location.href='${result.url}'" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">
                        <i class="fas fa-search"></i> ${result.title}
                    </div>`
                ).join('');
            } else {
                resultsContainer.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No se encontraron resultados</div>';
            }
        });

        // Buscar al presionar Enter → ir al primer resultado
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.toLowerCase().trim();
                const searchTerms = {
                    'inflable': 'index.html#servicios',
                    'castillo': 'index.html#servicios',
                    'plaza blanda': 'index.html#plaza-blanda',
                    'globos': 'globos-metalizados.html',
                    'eventos': 'eventos.html',
                    'cumpleaños': 'eventos.html',
                    'preguntas': 'faq.html',
                    'faq': 'faq.html',
                    'contacto': 'index.html#contacto',
                    'precios': 'faq.html',
                    'reserva': 'index.html#contacto',
                    'dinosaurio': 'globos-metalizados.html',
                    'princesa': 'globos-metalizados.html',
                    'pokemon': 'globos-metalizados.html'
                };
                const first = Object.keys(searchTerms).find(term => term.includes(query) || query.includes(term));
                if (first) {
                    window.location.href = searchTerms[first];
                }
            }
        });
    }
}

function fixCart() {
    // Asegurar carga de carrito existente
    cart = JSON.parse(localStorage.getItem('almakids_cart') || '[]');
    updateCartCount();
    
    // Crear modal del carrito si no existe
    let cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        cartModal = document.createElement('div');
        cartModal.id = 'cartModal';
        cartModal.className = 'modal';
        cartModal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        `;
        
        cartModal.innerHTML = `
            <div style="background-color: white; margin: 5% auto; padding: 0; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #FF6B9D;"><i class="fas fa-shopping-cart"></i> Mi Carrito</h3>
                    <button onclick="closeCartModal()" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
                </div>
                <div id="cartItems" style="padding: 20px;">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <h4>Tu carrito está vacío</h4>
                        <p>¡Agrega algunos productos para empezar!</p>
                    </div>
                </div>
                <div style="padding: 20px; border-top: 1px solid #eee; text-align: right;">
                    <button onclick="closeCartModal()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin-right: 10px; cursor: pointer;">Cerrar</button>
                    <button onclick="requestQuote()" style="background: #FF6B9D; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Solicitar Cotización</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(cartModal);
    }
    
    // Función para abrir carrito
    window.openCartModal = function() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'block';
            updateCartDisplay();
            document.body.style.overflow = 'hidden';
            console.log('✅ Carrito abierto');
        }
    };
    
    // Función para cerrar carrito
    window.closeCartModal = function() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('✅ Carrito cerrado');
        }
    };
    
    // Función para agregar al carrito
    window.addToCart = function(code, name, category, imageSrc) {
        if (!code || !name) {
            console.log('❌ Datos inválidos para agregar al carrito');
            return;
        }
        
        const existingItem = cart.find(item => item.code === code);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                code: code,
                name: name,
                category: category,
                image: imageSrc || `imagenes globos decoracion/${code}.png`,
                quantity: 1,
                timestamp: Date.now()
            });
        }
        
        localStorage.setItem('almakids_cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        
        // Abrir carrito automáticamente
        openCartModal();
        
        console.log('✅ Producto agregado al carrito:', name);
    };
    
    // Función para actualizar contador (versión local)
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Función para actualizar display del carrito
    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p>¡Agrega algunos productos para empezar!</p>
                </div>
            `;
            return;
        }
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartItems.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4><i class="fas fa-list"></i> ${totalItems} producto${totalItems > 1 ? 's' : ''} en tu carrito</h4>
            </div>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                ${cart.map(item => `
                    <div style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; gap: 15px;">
                        <div style="width: 60px; height: 60px; background: #ddd; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-image" style="color: #999;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #333;">${item.name}</h5>
                            <p style="margin: 0; font-size: 14px; color: #666;">Código: ${item.code}</p>
                            <p style="margin: 0; font-size: 14px; color: #666;">Categoría: ${item.category}</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #FF6B9D; font-weight: bold;">Cantidad: ${item.quantity}</p>
                        </div>
                        <button onclick="removeFromCart('${item.code}')" style="background: #e74c3c; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Función para remover del carrito
    window.removeFromCart = function(code) {
        const index = cart.findIndex(item => item.code === code);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem('almakids_cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
            console.log('✅ Producto removido del carrito');
        }
    };
    
    // Función para solicitar cotización
    window.requestQuote = function() {
        if (cart.length === 0) {
            alert('Agrega productos al carrito primero');
            return;
        }
        
        let message = '🎪 *ALMA Kids - Cotización de Carrito*\n\n';
        message += '*Productos seleccionados:*\n';
        
        cart.forEach(item => {
            message += `• ${item.name} (${item.code}) - Cantidad: ${item.quantity}\n`;
        });
        
        message += '\n¡Hola! Me interesa cotizar estos productos. ¿Podrían enviarme información de precios y disponibilidad?';
        
        const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        closeCartModal();
    };
    
    // Cerrar modal al hacer click fuera
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
}

// Cerrar búsqueda al hacer click fuera
document.addEventListener('click', function(e) {
    if (searchOpen) {
        const searchContainer = document.getElementById('searchContainer');
        const searchBtn = document.querySelector('.btn-search');
        
        if (searchContainer && !searchContainer.contains(e.target) && !searchBtn.contains(e.target)) {
            searchContainer.style.display = 'none';
            searchContainer.classList.remove('active');
            searchOpen = false;
        }
    }
});

console.log('🔧 Fix definitivo cargado');
