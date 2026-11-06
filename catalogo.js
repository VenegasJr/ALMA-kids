/**
 * =========================================================================
 * 🎠 ALMA KIDS - MOTOR DEL CATÁLOGO INTERACTIVO
 * =========================================================================
 * Renderiza los productos dinámicamente desde 'catalogo-datos.js'.
 * Permite filtrar por categorías, ver detalles completos en modal
 * y generar enlaces directos a WhatsApp con el precio y producto exacto.
 * =========================================================================
 */

(function() {
    'use strict';

    let currentCategory = 'todos';

    // Formateador de moneda chilena
    function formatearPrecio(valor) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(valor);
    }

    // Generar enlace directo a WhatsApp
    function generarLinkWhatsApp(producto) {
        const telefono = '56969073306';
        const precioFmt = formatearPrecio(producto.precio);
        const mensaje = 
`💖 *¡Hola ALMA Kids!* 💖

Me encantó su catálogo y quisiera cotizar el siguiente servicio:

🎈 *${producto.nombre}*
🏷️ Valor referencia: *${precioFmt}*
⏱️ Tiempo: *${producto.duracion}*

📅 *Fecha de mi evento:* 
📍 *Comuna:* 

¿Tienen disponibilidad para esa fecha? ¡Muchas gracias! 💕`;

        return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    }

    // Renderizar las tarjetas de producto
    function renderizarCatalogo(categoria = 'todos') {
        const contenedor = document.getElementById('catalogo-grid');
        if (!contenedor) return;

        const productos = (window.CATALOGO_PRODUCTOS || []).filter(p => {
            if (categoria === 'todos') return true;
            return p.categoria === categoria;
        });

        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div class="catalogo-empty">
                    <i class="fas fa-search"></i>
                    <p>No hay productos en esta categoría por el momento.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = productos.map((p, index) => {
            const precioFmt = formatearPrecio(p.precio);
            const linkWsp = generarLinkWhatsApp(p);
            const badgeHtml = p.badge ? `<span class="catalogo-card-badge">${p.badge}</span>` : '';

            // Mostrar hasta 4 ítems de inclusión
            const previewIncluye = (p.incluye || []).slice(0, 3).map(item => `
                <li><i class="fas fa-check-circle" aria-hidden="true"></i> <span>${item}</span></li>
            `).join('');

            const tieneMas = (p.incluye || []).length > 3 ? `
                <li class="catalogo-card-more"><span>+ ${(p.incluye.length - 3)} detalles más incluidos</span></li>
            ` : '';

            return `
                <article class="catalogo-card ${p.destacado ? 'destacado' : ''}" data-id="${p.id}" style="animation-delay: ${index * 0.05}s">
                    <div class="catalogo-card-media" onclick="window.abrirModalDetalles('${p.id}')" title="Click para ver fotos y medidas">
                        ${badgeHtml}
                        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" decoding="async" onerror="this.src='imagenes/logo-alma-kids-oficial.png'">
                        <div class="catalogo-card-zoom-hint">
                            <i class="fas fa-expand" aria-hidden="true"></i>
                            <span>Ver medidas y detalles</span>
                        </div>
                    </div>

                    <div class="catalogo-card-body">
                        <div class="catalogo-card-header">
                            <span class="catalogo-card-cat">${p.categoriaNombre}</span>
                            <h3 class="catalogo-card-title">${p.nombre}</h3>
                        </div>

                        <div class="catalogo-card-chips">
                            <span class="catalogo-chip"><i class="fas fa-clock"></i> ${p.duracion}</span>
                            <span class="catalogo-chip"><i class="fas fa-ruler-combined"></i> ${p.medidasEspacio}</span>
                            <span class="catalogo-chip"><i class="fas fa-child"></i> ${p.edadesRecomendadas}</span>
                        </div>

                        <p class="catalogo-card-desc">${p.resumen}</p>

                        <div class="catalogo-card-incluye">
                            <strong class="catalogo-incluye-title">Qué incluye:</strong>
                            <ul>
                                ${previewIncluye}
                                ${tieneMas}
                            </ul>
                        </div>

                        <div class="catalogo-card-footer">
                            <div class="catalogo-card-price-box">
                                <span class="catalogo-price-label">Valor arriendo</span>
                                <div class="catalogo-price-val">${precioFmt}</div>
                            </div>

                            <div class="catalogo-card-actions">
                                <button type="button" class="btn-catalogo-details" onclick="window.abrirModalDetalles('${p.id}')">
                                    <i class="fas fa-info-circle"></i> Detalles
                                </button>
                                <a href="${linkWsp}" target="_blank" rel="noopener noreferrer" class="btn-catalogo-wsp">
                                    <i class="fab fa-whatsapp"></i> Cotizar
                                </a>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    // Configurar botones de filtro
    function initFiltros() {
        const botones = document.querySelectorAll('.catalogo-filter-btn');
        botones.forEach(btn => {
            btn.addEventListener('click', () => {
                botones.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-filter') || 'todos';
                renderizarCatalogo(currentCategory);
            });
        });
    }

    // Modal de Detalles Completos
    window.abrirModalDetalles = function(id) {
        const producto = (window.CATALOGO_PRODUCTOS || []).find(p => p.id === id);
        if (!producto) return;

        const modal = document.getElementById('catalogo-modal') || crearModalEstructura();
        const precioFmt = formatearPrecio(producto.precio);
        const linkWsp = generarLinkWhatsApp(producto);

        const modalBody = modal.querySelector('.catalogo-modal-body');
        const imgPrincipal = producto.imagenModal || producto.imagen;

        modalBody.innerHTML = `
            <div class="catalogo-modal-grid">
                <div class="catalogo-modal-media">
                    <img src="${imgPrincipal}" alt="${producto.nombre}" onerror="this.src='${producto.imagen}'">
                    ${producto.badge ? `<span class="catalogo-modal-badge">${producto.badge}</span>` : ''}
                </div>

                <div class="catalogo-modal-content">
                    <span class="catalogo-modal-kicker">${producto.categoriaNombre}</span>
                    <h2 class="catalogo-modal-title">${producto.nombre}</h2>

                    <div class="catalogo-modal-price-strip">
                        <div class="catalogo-modal-price">
                            <span>Precio de arriendo:</span>
                            <strong>${precioFmt}</strong>
                        </div>
                        <span class="catalogo-modal-time"><i class="fas fa-clock"></i> ${producto.duracion}</span>
                    </div>

                    <div class="catalogo-modal-specs">
                        <div class="spec-box">
                            <i class="fas fa-ruler-combined"></i>
                            <div>
                                <small>Espacio requerido</small>
                                <strong>${producto.medidasEspacio}</strong>
                            </div>
                        </div>
                        <div class="spec-box">
                            <i class="fas fa-child"></i>
                            <div>
                                <small>Edades recomendadas</small>
                                <strong>${producto.edadesRecomendadas}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="catalogo-modal-section">
                        <h4><i class="fas fa-check-circle"></i> Todo lo que incluye este servicio:</h4>
                        <ul class="catalogo-modal-list">
                            ${(producto.incluye || []).map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                        </ul>
                    </div>

                    ${producto.requisitos ? `
                        <div class="catalogo-modal-requisitos">
                            <strong><i class="fas fa-info-circle"></i> Requisitos técnicos:</strong>
                            <p>${producto.requisitos}</p>
                        </div>
                    ` : ''}

                    <div class="catalogo-modal-cta">
                        <a href="${linkWsp}" target="_blank" rel="noopener noreferrer" class="btn-modal-wsp">
                            <i class="fab fa-whatsapp"></i> Cotizar este juego por WhatsApp
                        </a>
                        <button type="button" class="btn-modal-close-action" onclick="window.cerrarModalDetalles()">
                            Volver al catálogo
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.cerrarModalDetalles = function() {
        const modal = document.getElementById('catalogo-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    function crearModalEstructura() {
        let modal = document.getElementById('catalogo-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'catalogo-modal';
        modal.className = 'catalogo-modal-overlay';
        modal.innerHTML = `
            <div class="catalogo-modal-dialog">
                <button type="button" class="catalogo-modal-close" onclick="window.cerrarModalDetalles()" aria-label="Cerrar ventana">
                    <i class="fas fa-times"></i>
                </button>
                <div class="catalogo-modal-body"></div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.cerrarModalDetalles();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                window.cerrarModalDetalles();
            }
        });

        return modal;
    }

    // Inicializar al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        crearModalEstructura();
        initFiltros();
        renderizarCatalogo('todos');
    });

})();
