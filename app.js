/* === ALMA KIDS: LÓGICA 2025 === */

// 1. CATÁLOGO OFICIAL (Precios del PDF)

const CATALOGO = [
    // --- SETS ---
    {
        id: 'set-magic',
        name: 'Set ALMA MAGIC',
        price: 150000,
        category: 'Todo Incluido',
        image: 'imagenes/set-magic.webp', // Renombrado
        badge: '🏆 Más Vendido',
        description: 'La experiencia definitiva: Castillo (Rosa/Peque) + Piscina + Motricidad + 2 Saltarines + Tipi + Burbujas + Tatami.',
        features: ['4 horas de uso', 'Espacio: 4x3.5m', 'Instalación incluida']
    },
    {
        id: 'set-active',
        name: 'Set ALMA ACTIVE',
        price: 130000, // Corregido según PDF pag 4
        category: 'Pack Diversión',
        image: 'imagenes/set-active.webp', // Renombrado
        badge: '🔥 Popular',
        description: 'Diversión activa: Castillo (Peque/Rosa) + Piscina + Motricidad + 2 Saltarines + Tatami.',
        features: ['4 horas de uso', 'Espacio: 3.5x2.5m', 'Ideal 1-6 años']
    },
    {
        id: 'set-mini',
        name: 'Pack MINI PLAY',
        price: 90000,
        category: 'Pack Bebés',
        image: 'imagenes/set-mini.webp', // Renombrado
        description: 'Ideal espacios reducidos: Piscina espuma + Motricidad + Tatami + Cojines.',
        features: ['4 horas de uso', 'Espacio: 2.5x2.5m', 'Ideal bebés']
    },

    // --- CASTILLOS ---
    {
        id: 'castillo-grand',
        name: 'Castillo Grand-Peque',
        price: 90000,
        category: 'Castillos',
        image: 'imagenes/castillo-grand.png', // Renombrado
        description: 'El gigante blanco. Ideal para fotos y eventos grandes.',
        features: ['Medidas: 5x4x2.8m', 'Capacidad: 6 niños', 'Requiere 6x6m']
    },
    {
        id: 'castillo-rosa',
        name: 'Castillo Inflable ROSA',
        price: 75000,
        category: 'Castillos',
        image: 'imagenes/castillo-rosa.png', // Renombrado
        description: 'Elegante con piscina redonda integrada.',
        features: ['Medidas: 2.8x2.5x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    {
        id: 'castillo-peque',
        name: 'Castillo Inflable PEQUE',
        price: 75000,
        category: 'Castillos',
        image: 'imagenes/castillo-peque.webp', // Renombrado
        description: 'Clásico con piscina cuadrada integrada.',
        features: ['Medidas: 2.9x2.8x2.3m', 'Incluye pelotas', 'Capacidad 4 niños']
    },
    
    // --- EXTRAS ---
    {
        id: 'piscina-pelotas',
        name: 'Piscina de Pelotas',
        price: 60000,
        category: 'Plaza Blanda',
        image: 'imagenes/Nuestra Plaza blanda/Plaza-Blanda-Pelotas-Azules.png',
        description: 'Piscina de espuma segura con pelotas a elección.',
        features: ['Medidas: 1.5x1.5m', 'Incluye Tatami', 'Colores: Blanco, Rosa, Celeste']
    }
];

// 2. INYECCIÓN HTML

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('catalogo-grid');
    if(grid) {
        grid.innerHTML = CATALOGO.map(p => `
            <div class="card">
                ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
                <div class="card-img">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='imagenes/logo-alma-kids-pagina.webp'">
                </div>
                <div class="card-body">
                    <span class="category">${p.category}</span>
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <ul class="features">
                        ${p.features.map(f => `<li>✓ ${f}</li>`).join('')}
                    </ul>
                    <div class="card-footer">
                        <div class="price">$${p.price.toLocaleString('es-CL')}</div>
                        <button onclick="comprar('${p.id}')" class="btn-comprar">Cotizar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
});

// 3. WHATSAPP CHECKOUT

function comprar(id) {
    const prod = CATALOGO.find(p => p.id === id);
    const text = `Hola ALMA Kids! 👋\nMe interesa el *${prod.name}* ($${prod.price.toLocaleString('es-CL')}).\n¿Tienen disponibilidad?`;
    window.open(`https://wa.me/56969073306?text=${encodeURIComponent(text)}`, '_blank');
}

// Exponer función global
window.comprar = comprar;
