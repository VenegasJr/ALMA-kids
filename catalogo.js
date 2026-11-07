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
    function generarLinkWhatsApp(producto, opciones = {}) {
        const telefono = '56969073306';
        const precioFmt = formatearPrecio(producto.precio);

        let personalizacionTexto = '';
        if (opciones && Object.keys(opciones).length > 0) {
            const lineas = [];
            if (opciones.castillo) lineas.push(`   🏰 Castillo elegido: *${opciones.castillo}*`);
            if (opciones.pelotas) lineas.push(`   ⚪ Pelotas de piscina: *${opciones.pelotas}*`);
            if (opciones.tatami) lineas.push(`   🧩 Piso Tatami: *${opciones.tatami}*`);
            if (opciones.tipi) lineas.push(`   🏕️ Alfombra Tipi: *${opciones.tipi}*`);
            if (lineas.length > 0) {
                personalizacionTexto = `\n\n🎨 *Mi personalización elegida (gratis):*\n${lineas.join('\n')}`;
            }
        }

        // Revisar si el cliente tiene un cupón activo de Instagram
        let promoBloque = '';
        if (typeof window.obtenerPromoParaWhatsApp === 'function') {
            promoBloque = window.obtenerPromoParaWhatsApp();
        }

        const mensaje = 
`💖 *¡Hola ALMA Kids!* 💖

Me encantó su catálogo y quisiera cotizar el siguiente servicio:

🎈 *${producto.nombre}*
🏷️ Valor referencia: *${precioFmt}*
⏱️ Tiempo: *${producto.duracion}*${personalizacionTexto}${promoBloque ? '\n' + promoBloque : ''}

📅 *Fecha de mi evento:* 
📍 *Comuna:* 

¿Tienen disponibilidad para esa fecha? ¡Muchas gracias! 💕`;

        return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    }

    // Renderizar las tarjetas de producto
    function renderizarCatalogo(categoria = 'todos') {
        const contenedor = document.getElementById('catalogo-grid');
        if (!contenedor) return;

        const productos = (window.CATALOGO_PRODUCTOS || (typeof CATALOGO_PRODUCTOS !== 'undefined' ? CATALOGO_PRODUCTOS : [])).filter(p => {
            if (p.activo === false) return false;
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
                        <img src="${p.imagen}" alt="${p.nombre}" class="loaded" loading="eager" decoding="async" onerror="this.src='imagenes/logo-alma-kids-oficial.png'">
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
        const productos = (window.CATALOGO_PRODUCTOS || (typeof CATALOGO_PRODUCTOS !== 'undefined' ? CATALOGO_PRODUCTOS : []));
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        const modal = document.getElementById('catalogo-modal') || crearModalEstructura();
        const precioFmt = formatearPrecio(producto.precio);
        const linkWsp = generarLinkWhatsApp(producto);

        const modalBody = modal.querySelector('.catalogo-modal-body');
        const imgPrincipal = producto.imagenModal || producto.imagen;

        // Detectar qué opciones aplican según el juego
        const tieneOpcionCastillo = (producto.id === 'pack-maximo' || producto.id === 'set-duo');
        const tieneOpcionPelotas = ['pack-grand-peque', 'pack-maximo', 'set-alma-magic', 'set-alma-active', 'set-duo', 'pack-alma-mini-play', 'piscina-pelotas-espuma', 'castillo-rosa', 'castillo-peque'].includes(producto.id);
        const tieneOpcionTatami = ['pack-grand-peque', 'pack-maximo', 'set-alma-magic', 'set-alma-active', 'set-duo', 'pack-alma-mini-play', 'castillo-grand-peque', 'castillo-rosa', 'castillo-peque', 'piscina-pelotas-espuma'].includes(producto.id);
        const tieneOpcionTipi = ['pack-grand-peque', 'pack-maximo', 'set-alma-active', 'carpa-tipi'].includes(producto.id);

        const tieneOpciones = (tieneOpcionCastillo || tieneOpcionPelotas || tieneOpcionTatami || tieneOpcionTipi);

        // Estado inicial de opciones
        const opciones = {};
        if (tieneOpcionCastillo) opciones.castillo = 'Castillo "PEQUE" Neutro';
        if (tieneOpcionPelotas) opciones.pelotas = 'Rosa & Blanco';
        if (tieneOpcionTatami) opciones.tatami = 'Rosa / Blanco';
        if (tieneOpcionTipi) opciones.tipi = 'Rosa Pastel';

        const linkInicial = generarLinkWhatsApp(producto, tieneOpciones ? opciones : {});

        // Bloque HTML de personalización interactiva
        let customizerHtml = '';
        if (tieneOpciones) {
            customizerHtml = `
                <div class="catalogo-modal-customizer">
                    <div class="customizer-header">
                        <i class="fas fa-palette"></i>
                        <span>Personaliza tu celebración (Opciones incluidas gratis):</span>
                    </div>

                    ${tieneOpcionCastillo ? `
                        <div class="customizer-group" data-opt="castillo">
                            <span class="customizer-label">🏰 Elige el modelo de Castillo Inflable:</span>
                            <div class="customizer-pills">
                                <button type="button" class="customizer-pill active" data-val='Castillo "PEQUE" Neutro'>Castillo "PEQUE" Neutro</button>
                                <button type="button" class="customizer-pill" data-val='Castillo "ROSA" Pastel'>Castillo "ROSA" Pastel</button>
                            </div>
                        </div>
                    ` : ''}

                    ${tieneOpcionPelotas ? `
                        <div class="customizer-group" data-opt="pelotas">
                            <span class="customizer-label">⚪ Color de pelotas para la piscina:</span>
                            <div class="customizer-pills">
                                <button type="button" class="customizer-pill active" data-val="Rosa & Blanco">🌸 Rosa & Blanco</button>
                                <button type="button" class="customizer-pill" data-val="Celeste & Blanco">☁️ Celeste & Blanco</button>
                                <button type="button" class="customizer-pill" data-val="Mix Pastel Dulce">✨ Mix Pastel</button>
                                <button type="button" class="customizer-pill" data-val="Blanco Impoluto">🤍 Blanco Puro</button>
                            </div>
                        </div>
                    ` : ''}

                    ${tieneOpcionTatami ? `
                        <div class="customizer-group" data-opt="tatami">
                            <span class="customizer-label">🧩 Paleta del Piso de Goma Tatami:</span>
                            <div class="customizer-pills">
                                <button type="button" class="customizer-pill active" data-val="Rosa / Blanco">🌸 Rosa / Blanco</button>
                                <button type="button" class="customizer-pill" data-val="Beige / Gris">🌾 Beige / Gris Neutro</button>
                            </div>
                        </div>
                    ` : ''}

                    ${tieneOpcionTipi ? `
                        <div class="customizer-group" data-opt="tipi">
                            <span class="customizer-label">🏕️ Alfombra para la Carpa Tipi:</span>
                            <div class="customizer-pills">
                                <button type="button" class="customizer-pill active" data-val="Rosa Pastel">🎀 Rosa</button>
                                <button type="button" class="customizer-pill" data-val="Celeste Pastel">☁️ Celeste</button>
                                <button type="button" class="customizer-pill" data-val="Gris Neutro">🌫️ Gris</button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        modalBody.innerHTML = `
            <div class="catalogo-modal-grid">
                <div class="catalogo-modal-media">
                    <img id="modalMediaImg" src="${imgPrincipal}" alt="${producto.nombre}" onerror="this.src='${producto.imagen}'">
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

                    ${customizerHtml}

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
                        <a id="btnModalWspAction" href="${linkInicial}" target="_blank" rel="noopener noreferrer" class="btn-modal-wsp">
                            <i class="fab fa-whatsapp"></i> Cotizar este juego por WhatsApp
                        </a>
                        <button type="button" class="btn-modal-close-action" onclick="window.cerrarModalDetalles()">
                            Volver al catálogo
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Activar interactividad de los botones de personalización
        if (tieneOpciones) {
            const groups = modalBody.querySelectorAll('.customizer-group');
            const btnWsp = modalBody.querySelector('#btnModalWspAction');

            groups.forEach(group => {
                const optKey = group.getAttribute('data-opt');
                const pills = group.querySelectorAll('.customizer-pill');

                pills.forEach(pill => {
                    pill.addEventListener('click', () => {
                        pills.forEach(p => p.classList.remove('active'));
                        pill.classList.add('active');
                        opciones[optKey] = pill.getAttribute('data-val');

                        // Actualizar enlace dinámicamente
                        if (btnWsp) {
                            btnWsp.href = generarLinkWhatsApp(producto, opciones);
                        }
                    });
                });
            });
        }

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

    // Inicializar al cargar el DOM o inmediatamente si ya está listo
    function iniciarMotorCatalogo() {
        crearModalEstructura();
        initFiltros();
        renderizarCatalogo('todos');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarMotorCatalogo);
    } else {
        iniciarMotorCatalogo();
    }

})();

// =========================================================================
// 🎥 MODAL REPRODUCTOR DE VIDEO PARA EVENTOS REALES
// =========================================================================
window.abrirVideoModal = function(videoSrc, titulo) {
    let modal = document.getElementById('videoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'catalogo-modal-overlay';
        modal.innerHTML = `
            <div class="catalogo-modal-dialog" style="max-width: 650px; background: #1a1817; padding: 24px;">
                <button type="button" class="catalogo-modal-close" onclick="window.cerrarVideoModal()" style="background: rgba(255,255,255,0.2); color: #fff;">
                    <i class="fas fa-times"></i>
                </button>
                <div style="margin-bottom: 14px; color: #fff;">
                    <span style="font-size: 0.78rem; text-transform: uppercase; color: #c99a67; font-weight: 700; letter-spacing: 0.06em;">Evento Real · ALMA Kids</span>
                    <h3 id="videoModalTitle" style="font-size: 1.25rem; font-weight: 700; margin: 4px 0 0; color: #fff;"></h3>
                </div>
                <div style="position: relative; border-radius: 16px; overflow: hidden; background: #000; aspect-ratio: 9/16; max-height: 70vh; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    <video id="videoModalPlayer" controls playsinline autoplay style="width: 100%; height: 100%; object-fit: contain;">
                        Tu navegador no soporta reproducción de video.
                    </video>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.cerrarVideoModal();
        });
    }

    const titleEl = document.getElementById('videoModalTitle');
    const player = document.getElementById('videoModalPlayer');
    if (titleEl) titleEl.textContent = titulo || 'Montaje en vivo ALMA Kids';
    if (player) {
        player.src = videoSrc;
        player.play().catch(() => {});
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.cerrarVideoModal = function() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        const player = document.getElementById('videoModalPlayer');
        if (player) {
            player.pause();
            player.removeAttribute('src');
            player.load();
        }
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};
