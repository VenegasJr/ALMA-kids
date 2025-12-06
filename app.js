/* === BASE DE DATOS CATÁLOGO === */
const PRODUCTOS = [
    {
        id: 'set-magic',
        name: 'Set ALMA MAGIC',
        price: 150000,
        image: 'imagenes/set-magic.webp', // Asegúrate del nombre
        badge: '🏆 MÁS VENDIDO',
        desc: 'El pack definitivo con todo incluido para tu fiesta.'
    },
    {
        id: 'set-active',
        name: 'Set ACTIVE',
        price: 130000,
        image: 'imagenes/set-active.webp',
        badge: '🔥 POPULAR',
        desc: 'Diversión activa para niños de 1 a 6 años.'
    },
    {
        id: 'castillo-grand',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand.png',
        badge: '',
        desc: 'Castillo blanco gigante ideal para fotos.'
    },
    {
        id: 'piscina',
        name: 'Piscina de Pelotas',
        price: 60000,
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        badge: '👶 BEBÉS',
        desc: 'Seguridad y diversión para los más pequeños.'
    }
];

/* === INYECCIÓN DE PRODUCTOS === */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('catalogo-container');
    
    if (!container) {
        console.warn('No se encontró #catalogo-container');
        return;
    }
    
    // Inyectar cada producto en su propia SECCIÓN para que el CSS le de color alterno
    container.innerHTML = PRODUCTOS.map(p => `
        <section class="product-section">
            <article class="product-card">
                <div class="card-img-wrapper" onclick="verFoto('${p.image}')">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='imagenes/logo-alma-kids-pagina.webp'">
                </div>
                <div class="card-body">
                    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
                    <h2>${p.name}</h2>
                    <p>${p.desc}</p>
                    <span class="price">$${p.price.toLocaleString('es-CL')}</span>
                    <button class="btn-add" onclick="agregarAlCarrito('${p.id}')">
                        Agregar al Carrito
                    </button>
                </div>
            </article>
        </section>
    `).join('');
});

/* === LÓGICA DEL CARRITO === */
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
actualizarContador();

function agregarAlCarrito(id) {
    const prod = PRODUCTOS.find(p => p.id === id);
    if (!prod) {
        console.error('Producto no encontrado:', id);
        return;
    }
    
    carrito.push(prod);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    alert('¡Agregado! 🛒');
}

function actualizarContador() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = carrito.length;
        cartCount.style.display = carrito.length > 0 ? 'flex' : 'none';
    }
}

function toggleCart() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Generar mensaje WhatsApp
    let mensaje = "Hola ALMA Kids! 👋 Quiero cotizar:\n";
    let total = 0;
    carrito.forEach(p => {
        mensaje += `- ${p.name} ($${p.price.toLocaleString('es-CL')})\n`;
        total += p.price;
    });
    mensaje += `\nTotal Ref: $${total.toLocaleString('es-CL')}`;
    
    window.open(`https://wa.me/56969073306?text=${encodeURIComponent(mensaje)}`, '_blank');
}

/* === FUNCIÓN ZOOM DE FOTOS === */
function verFoto(imgSrc) {
    const modal = document.createElement('div');
    modal.id = 'zoom-modal';
    modal.className = 'zoom-modal';
    modal.onclick = cerrarFoto;
    modal.innerHTML = `
        <div class="zoom-content">
            <span class="close-btn">&times;</span>
            <img src="${imgSrc}" class="zoom-img" alt="Vista ampliada">
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Cerrar al hacer clic en el botón X
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            cerrarFoto();
        };
    }
    
    // Prevenir cierre al hacer clic en la imagen
    const zoomContent = modal.querySelector('.zoom-content');
    if (zoomContent) {
        zoomContent.onclick = (e) => e.stopPropagation();
    }
}

function cerrarFoto() {
    const modal = document.getElementById('zoom-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Exponer funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.toggleCart = toggleCart;
window.verFoto = verFoto;
window.cerrarFoto = cerrarFoto;
