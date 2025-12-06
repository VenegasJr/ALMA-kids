/* === ALMA KIDS LOGIC === */

// TUS PRODUCTOS REALES (Asegúrate que los nombres de archivo en la carpeta coincidan)
const PRODUCTOS = [
    {
        id: 'set-magic',
        name: 'Set ALMA MAGIC',
        price: 150000,
        image: 'imagenes/set-magic.webp', // Cambia el nombre en tu carpeta si es necesario
        badge: '🏆 TOP 1',
        desc: 'Pack completo: Castillo + Piscina + Motricidad + Tipi + Accesorios.'
    },
    {
        id: 'set-active',
        name: 'Set ACTIVE',
        price: 130000,
        image: 'imagenes/set-active.webp',
        badge: '🔥 POPULAR',
        desc: 'Ideal para niños de 1 a 6 años. Diversión asegurada.'
    },
    {
        id: 'castillo-grand',
        name: 'Castillo Grand-Peque',
        price: 90000,
        image: 'imagenes/castillo-grand.png',
        badge: '',
        desc: 'Castillo blanco gigante (5x4m). Perfecto para fotos.'
    },
    {
        id: 'castillo-rosa',
        name: 'Castillo Rosa',
        price: 75000,
        image: 'imagenes/castillo-rosa.png',
        badge: '💖',
        desc: 'Castillo elegante con piscina redonda integrada.'
    },
    {
        id: 'piscina',
        name: 'Piscina de Pelotas',
        price: 60000,
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        badge: '👶 BEBÉS',
        desc: 'Seguridad total para los más pequeños.'
    }
];

// INYECTAR PRODUCTOS
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-productos');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarBadge(carrito.length);

    grid.innerHTML = PRODUCTOS.map(p => `
        <article class="card">
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
            <div class="card-img">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='imagenes/logo-alma-kids-oficial.png'">
            </div>
            <div class="card-body">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price">$${p.price.toLocaleString('es-CL')}</div>
                <button class="btn-add" onclick="agregar('${p.id}')">Agregar al Carrito</button>
            </div>
        </article>
    `).join('');
});

// CARRITO
function agregar(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const prod = PRODUCTOS.find(p => p.id === id);
    carrito.push(prod);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarBadge(carrito.length);
    alert('Producto agregado 🛒');
}

function actualizarBadge(num) {
    document.getElementById('cart-badge').textContent = num;
}

function toggleCart() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if(carrito.length === 0) return alert('El carrito está vacío');
    
    let msg = "Hola ALMA Kids! 👋 Quiero cotizar:\n";
    let total = 0;
    carrito.forEach(p => {
        msg += `- ${p.name} ($${p.price.toLocaleString()})\n`;
        total += p.price;
    });
    msg += `\nTotal Ref: $${total.toLocaleString()}`;
    
    window.open(`https://wa.me/56969073306?text=${encodeURIComponent(msg)}`);
}

function sendForm(e) {
    e.preventDefault();
    const nombre = document.getElementById('formName').value;
    const fecha = document.getElementById('formDate').value;
    window.open(`https://wa.me/56969073306?text=Hola, soy ${nombre}. Quisiera cotizar fecha: ${fecha}`);
}
