/**
 * ALMA Kids - Fix Móvil Definitivo
 * Sistema simple y robusto para móvil
 */

// Esperar a que cargue todo
document.addEventListener('DOMContentLoaded', function() {
    // Ejecutar SOLO en móvil (<=768px)
    if (window.innerWidth > 768) {
        return;
    }

    console.log('🔧 Iniciando fix móvil...');

    // Crear botones móviles desde cero
    createMobileButtons();

    // Hacer funcionar el menú
    setupMobileMenu();

    // Hacer funcionar la búsqueda
    setupMobileSearch();

    console.log('✅ Fix móvil completado');
});

// Si el usuario rota o cambia a escritorio, desmontar UI móvil
window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 768;
    const mobileUI = document.querySelector('.mobile-buttons-fixed') ||
                     document.getElementById('mobileMenuNew') ||
                     document.getElementById('searchContainerNew');

    if (!isMobile) {
        // Remover elementos móviles si existen
        document.querySelectorAll('.mobile-buttons-fixed, #mobileMenuNew, #searchContainerNew')
            .forEach(el => el && el.remove());
        return;
    }
});

function createMobileButtons() {
    // Eliminar botones existentes si hay problemas
    const existingButtons = document.querySelector('.floating-nav-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }
    
    // Crear contenedor nuevo
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mobile-buttons-fixed';
    buttonContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
        z-index: 9999;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        pointer-events: none;
    `;
    
    // Botón menú (izquierda)
    const menuBtn = document.createElement('button');
    menuBtn.innerHTML = '☰';
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.style.cssText = `
        width: 50px;
        height: 50px;
        background: #FF6B9D;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Botón búsqueda (derecha)
    const searchBtn = document.createElement('button');
    searchBtn.innerHTML = '🔍';
    searchBtn.className = 'mobile-search-btn';
    searchBtn.style.cssText = `
        width: 50px;
        height: 50px;
        background: #25D366;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    buttonContainer.appendChild(menuBtn);
    buttonContainer.appendChild(searchBtn);
    document.body.appendChild(buttonContainer);
    
    // Eventos
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📱 Menú tocado');
        toggleMobileMenuNew();
    });
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔍 Búsqueda tocada');
        toggleSearchNew();
    });
}

function setupMobileMenu() {
    // Crear menú móvil nuevo
    const existingMenu = document.getElementById('mobileMenu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobileMenuNew';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9998;
        display: none;
        padding: 20px;
    `;
    
    mobileMenu.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #FF6B9D; margin: 0;">ALMA Kids</h3>
        </div>
        <nav style="display: flex; flex-direction: column; gap: 15px;">
            <a href="index.html#inicio" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">🏠 Inicio</a>
            <a href="index.html#nosotros" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">👥 Nosotros</a>
            <a href="index.html#servicios" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">🎪 Servicios</a>
            <a href="index.html#plaza-blanda" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">🏊 Plaza Blanda</a>
            <a href="eventos.html" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">🎉 Eventos</a>
            <a href="globos-metalizados.html" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">🎈 Globos</a>
            <a href="faq.html" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">❓ FAQ</a>
            <a href="index.html#contacto" style="padding: 15px; background: #f8f9fa; border-radius: 10px; text-decoration: none; color: #333; text-align: center; font-weight: 500;">📞 Contacto</a>
        </nav>
    `;
    
    document.body.appendChild(mobileMenu);
}

function setupMobileSearch() {
    // Crear búsqueda móvil nueva
    const existingSearch = document.getElementById('searchContainer');
    if (existingSearch) {
        existingSearch.remove();
    }
    
    const searchContainer = document.createElement('div');
    searchContainer.id = 'searchContainerNew';
    searchContainer.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9998;
        display: none;
        padding: 20px;
    `;
    
    searchContainer.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h3 style="color: #25D366; margin: 0 0 15px 0; text-align: center;">🔍 Buscar</h3>
            <input type="text" id="searchInputNew" placeholder="Buscar en ALMA Kids..." style="width: 100%; padding: 15px; border: 2px solid #25D366; border-radius: 10px; font-size: 16px; outline: none;">
        </div>
        <div id="searchResultsNew" style="max-height: 300px; overflow-y: auto;"></div>
    `;
    
    document.body.appendChild(searchContainer);
    
    // Evento de búsqueda
    const searchInput = document.getElementById('searchInputNew');
    searchInput.addEventListener('input', function() {
        performSearchNew(this.value);
    });
}

function toggleMobileMenuNew() {
    const menu = document.getElementById('mobileMenuNew');
    const search = document.getElementById('searchContainerNew');
    
    if (search && search.style.display !== 'none') {
        search.style.display = 'none';
    }
    
    if (menu) {
        if (menu.style.display === 'none' || !menu.style.display) {
            menu.style.display = 'block';
            console.log('✅ Menú abierto');
        } else {
            menu.style.display = 'none';
            console.log('✅ Menú cerrado');
        }
    }
}

function toggleSearchNew() {
    const search = document.getElementById('searchContainerNew');
    const menu = document.getElementById('mobileMenuNew');
    
    if (menu && menu.style.display !== 'none') {
        menu.style.display = 'none';
    }
    
    if (search) {
        if (search.style.display === 'none' || !search.style.display) {
            search.style.display = 'block';
            document.getElementById('searchInputNew').focus();
            console.log('✅ Búsqueda abierta');
        } else {
            search.style.display = 'none';
            console.log('✅ Búsqueda cerrada');
        }
    }
}

function performSearchNew(query) {
    const resultsContainer = document.getElementById('searchResultsNew');
    if (!resultsContainer) return;
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
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
        if (term.includes(query.toLowerCase())) {
            results.push({
                title: term.charAt(0).toUpperCase() + term.slice(1),
                url: searchTerms[term]
            });
        }
    });
    
    if (results.length > 0) {
        resultsContainer.innerHTML = results.map(result => 
            `<div onclick="window.location.href='${result.url}'; toggleSearchNew();" style="padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 10px; cursor: pointer; text-align: center; font-weight: 500;">
                ${result.title}
            </div>`
        ).join('');
    } else {
        resultsContainer.innerHTML = '<div style="padding: 15px; text-align: center; color: #666;">No se encontraron resultados</div>';
    }
}

// Cerrar menús al tocar fuera
document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobileMenuNew');
    const search = document.getElementById('searchContainerNew');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const searchBtn = document.querySelector('.mobile-search-btn');
    
    if (menu && menu.style.display !== 'none') {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.style.display = 'none';
        }
    }
    
    if (search && search.style.display !== 'none') {
        if (!search.contains(e.target) && !searchBtn.contains(e.target)) {
            search.style.display = 'none';
        }
    }
});

// Agrandar botones flotantes en móvil
function resizeFloatingButtons() {
    if (window.innerWidth <= 768) {
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (whatsappBtn) {
            whatsappBtn.style.width = '100px';
            whatsappBtn.style.height = '100px';
            whatsappBtn.style.fontSize = '2rem';
        }
        
        if (cartBtn) {
            cartBtn.style.width = '100px';
            cartBtn.style.height = '100px';
            cartBtn.style.fontSize = '2rem';
        }
    }
}

// Aplicar al cargar y redimensionar
resizeFloatingButtons();
window.addEventListener('resize', resizeFloatingButtons);
