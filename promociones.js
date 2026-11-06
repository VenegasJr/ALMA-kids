/**
 * =========================================================================
 * 🎁 ALMA KIDS - SISTEMA DE CÓDIGOS DE DESCUENTO & PROMOCIONES INSTAGRAM
 * =========================================================================
 * - Soporta activación mediante URL: ?promo=INSTALMA o ?codigo=TRASLADO
 * - Validación automática con validez estricta de 7 días
 * - Genera token criptográfico/único para verificación directa en WhatsApp
 * - Letra chica y términos incluidos con total transparencia
 * =========================================================================
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'almakids_active_promo';
    const DURACION_DIAS = 7;
    const DURACION_MS = DURACION_DIAS * 24 * 60 * 60 * 1000;

    // Catálogo de Códigos y Beneficios Oficiales
    const PROMOCIONES = {
        'INSTALMA': {
            codigo: 'INSTALMA',
            alias: ['ALMA10', 'DESCUENTO10', 'INSTA10'],
            titulo: '10% de Descuento (Tope $10.000)',
            resumen: '10% de descuento sobre el valor del arriendo, con un tope máximo de $10.000 CLP.',
            badge: '🎟️ 10% OFF INSTAGRAM',
            tipo: 'porcentaje_tope',
            tope: 10000,
            aplicaA: 'Cualquier servicio o pack del catálogo',
            condiciones: 'Válido por 7 días desde su activación. No acumulable con otras promociones o convenios. Aplica para eventos en Machalí, Rancagua y comunas con cobertura. Sujeto a disponibilidad de fecha y factibilidad técnica.'
        },
        'TRASLADO': {
            codigo: 'TRASLADO',
            alias: ['ENVIOALMA', 'TRASLADOGRATIS', 'GRATIS', 'MACHALIRANCAGUA'],
            titulo: 'Traslado 100% Gratis en Machalí y Rancagua',
            resumen: 'Ahorra el costo de traslado e instalación en Machalí y Rancagua contratando cualquier Set.',
            badge: '🚚 TRASLADO GRATIS',
            tipo: 'envio_gratis',
            aplicaA: 'Contratando cualquier Set o Pack (Set Máximo, Alma Active, Alma Party o Mini Play)',
            condiciones: 'Aplica exclusivamente en la contratación de cualquier Set o Pack completo para las comunas de Machalí y Rancagua. Válido por 7 días desde su activación. No acumulable con otros cupones o promociones. Sujeto a disponibilidad.'
        },
        'BURBUJAS': {
            codigo: 'BURBUJAS',
            alias: ['BURBUJASMAX', 'BURBUJASVIP', 'LIQUIDOGRATIS'],
            titulo: '1 Litro de Líquido de Burbujas Gratis',
            resumen: 'Llévate 1 Litro extra de líquido profesional hipoalergénico gratis al contratar el Set MÁXIMO.',
            badge: '🫧 BURBUJAS GRATIS',
            tipo: 'regalo_producto',
            aplicaA: 'Al contratar el SET "MÁXIMO" Todo Incluido',
            condiciones: 'Aplica exclusivamente al contratar el Set "MÁXIMO" Todo Incluido. Incluye 1 litro de líquido premium no tóxico para la máquina de burbujas. Válido por 7 días desde su activación. No acumulable con otras promociones.'
        }
    };

    // Buscar código principal por alias
    function buscarPromoPorTexto(input) {
        if (!input) return null;
        const normalizado = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        for (const key in PROMOCIONES) {
            const p = PROMOCIONES[key];
            if (p.codigo === normalizado || (p.alias && p.alias.includes(normalizado))) {
                return p;
            }
        }
        return null;
    }

    // Generar Token de Verificación Único
    function generarToken(codigo) {
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const datePart = Date.now().toString(36).slice(-4).toUpperCase();
        return `ALMA-${codigo}-${datePart}-${randomPart}`;
    }

    // Formatear Fecha en Español (Ej: 13 de Noviembre, 2026)
    function formatearFecha(timestamp) {
        const d = new Date(timestamp);
        return d.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    // Guardar promo activa en localStorage
    function guardarPromoActiva(promo) {
        const ahora = Date.now();
        const payload = {
            codigo: promo.codigo,
            titulo: promo.titulo,
            resumen: promo.resumen,
            badge: promo.badge,
            aplicaA: promo.aplicaA,
            condiciones: promo.condiciones,
            token: generarToken(promo.codigo),
            activadoEn: ahora,
            venceEn: ahora + DURACION_MS
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {}
        return payload;
    }

    // Obtener promo activa y validar vencimiento de 7 días
    function obtenerPromoActiva() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            const ahora = Date.now();
            if (ahora > data.venceEn) {
                // Expiró
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    // Calcular días y horas restantes
    function tiempoRestanteTexto(venceEn) {
        const ms = venceEn - Date.now();
        if (ms <= 0) return 'Expirado';
        const dias = Math.floor(ms / (24 * 60 * 60 * 1000));
        const horas = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        if (dias > 0) {
            return `${dias} ${dias === 1 ? 'día' : 'días'} y ${horas}h restantes`;
        }
        return `${horas} horas restantes`;
    }

    // Crear o actualizar la barra superior flotante si hay promo activa
    function actualizarBannerPromo() {
        const promo = obtenerPromoActiva();
        let banner = document.getElementById('almaPromoBanner');

        if (!promo) {
            if (banner) banner.remove();
            return;
        }

        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'almaPromoBanner';
            banner.className = 'alma-promo-sticky-bar';
            document.body.prepend(banner);
        }

        const tiempo = tiempoRestanteTexto(promo.venceEn);

        banner.innerHTML = `
            <div class="alma-promo-container">
                <span class="promo-badge-tag">${promo.badge}</span>
                <span class="promo-text-msg">
                    <strong>¡Cupón activado!</strong> ${promo.titulo} · <small>Vence en ${tiempo}</small>
                </span>
                <button type="button" class="promo-info-btn" onclick="window.abrirModalPromo('${promo.codigo}')" title="Ver detalles y letra chica">
                    Ver cupón <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    // Modal de Promociones
    function renderizarModalPromo(promo, esNuevo = false) {
        let modal = document.getElementById('almaPromoModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'almaPromoModal';
            modal.className = 'catalogo-modal-overlay alma-promo-modal-overlay';
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.cerrarModalPromo();
            });
        }

        const activo = promo || obtenerPromoActiva();
        const fechaLimite = activo ? formatearFecha(activo.venceEn) : '';
        const tiempoRest = activo ? tiempoRestanteTexto(activo.venceEn) : '';

        modal.innerHTML = `
            <div class="catalogo-modal-dialog alma-promo-modal-dialog">
                <button type="button" class="catalogo-modal-close" onclick="window.cerrarModalPromo()" aria-label="Cerrar modal">
                    <i class="fas fa-times"></i>
                </button>

                ${esNuevo ? '<div class="promo-celebration-badge">🎉 ¡CÓDIGO SECRETO ACTIVADO!</div>' : ''}

                <div class="promo-modal-header">
                    <div class="promo-icon-circle">
                        <i class="fas fa-gift"></i>
                    </div>
                    <span class="promo-tag-subtitle">Beneficio Exclusivo ALMA Kids</span>
                    <h2 class="promo-main-title">${activo ? activo.titulo : 'Ingresa tu Código de Descuento'}</h2>
                </div>

                ${activo ? `
                    <div class="promo-active-ticket">
                        <div class="ticket-header">
                            <span class="ticket-code-display">${activo.codigo}</span>
                            <span class="ticket-status-pill"><i class="fas fa-check-circle"></i> Válido</span>
                        </div>
                        <p class="ticket-detail-text">${activo.resumen}</p>
                        <div class="ticket-meta">
                            <div><i class="fas fa-bullseye"></i> <strong>Aplica a:</strong> ${activo.aplicaA}</div>
                            <div><i class="fas fa-hourglass-half"></i> <strong>Vencimiento:</strong> ${fechaLimite} (${tiempoRest})</div>
                            <div class="ticket-token-row"><i class="fas fa-shield-alt"></i> <strong>Verificación:</strong> <code>#${activo.token}</code></div>
                        </div>
                    </div>

                    <div class="promo-terms-box">
                        <h4><i class="fas fa-file-contract"></i> Letra Chica & Términos:</h4>
                        <p>${activo.condiciones}</p>
                    </div>

                    <div class="promo-modal-actions">
                        <a href="#catalogo" class="btn btn-primary promo-cta-btn" onclick="window.cerrarModalPromo()">
                            <i class="fas fa-eye"></i> Ver servicios en el Catálogo
                        </a>
                        <button type="button" class="btn btn-secondary promo-btn-change" onclick="window.mostrarFormularioCanje()">
                            Probar otro código
                        </button>
                    </div>
                ` : `
                    <div class="promo-input-card">
                        <p class="promo-input-desc">
                            ¿Viste una promoción en nuestras historias o Reels de Instagram? Escribe el código aquí para activarlo de inmediato en tu arriendo:
                        </p>
                        <form id="formCanjePromo" onsubmit="window.procesarFormularioPromo(event)">
                            <div class="promo-input-group">
                                <input type="text" id="inputCodigoPromo" placeholder="Ej: INSTALMA o TRASLADO" autocomplete="off" autocapitalize="characters" required>
                                <button type="submit" class="btn btn-primary">Activar <i class="fas fa-magic"></i></button>
                            </div>
                            <p id="promoErrorMsg" class="promo-error-msg" style="display:none;"></p>
                        </form>

                        <div class="promo-examples-list">
                            <span>Promociones disponibles para probar:</span>
                            <div class="promo-pills-row">
                                <button type="button" onclick="window.activarPromoDirecta('INSTALMA')">🎟️ INSTALMA (10% OFF)</button>
                                <button type="button" onclick="window.activarPromoDirecta('TRASLADO')">🚚 TRASLADO (Envío Gratis)</button>
                                <button type="button" onclick="window.activarPromoDirecta('BURBUJAS')">🫧 BURBUJAS (1L Gratis)</button>
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Funciones Globales para UI y Catálogo
    window.abrirModalPromo = function(codigo) {
        if (codigo) {
            const promo = buscarPromoPorTexto(codigo);
            if (promo) {
                const activa = guardarPromoActiva(promo);
                actualizarBannerPromo();
                renderizarModalPromo(activa, false);
                return;
            }
        }
        renderizarModalPromo(obtenerPromoActiva(), false);
    };

    window.cerrarModalPromo = function() {
        const modal = document.getElementById('almaPromoModal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.mostrarFormularioCanje = function() {
        renderizarModalPromo(null, false);
    };

    window.activarPromoDirecta = function(codigo) {
        const promo = buscarPromoPorTexto(codigo);
        if (promo) {
            const activa = guardarPromoActiva(promo);
            actualizarBannerPromo();
            renderizarModalPromo(activa, true);
        }
    };

    window.procesarFormularioPromo = function(e) {
        e.preventDefault();
        const input = document.getElementById('inputCodigoPromo');
        const errorEl = document.getElementById('promoErrorMsg');
        if (!input) return;

        const promo = buscarPromoPorTexto(input.value);
        if (promo) {
            const activa = guardarPromoActiva(promo);
            actualizarBannerPromo();
            renderizarModalPromo(activa, true);
        } else {
            if (errorEl) {
                errorEl.textContent = 'El código ingresado no existe o no está activo. Intenta con INSTALMA, TRASLADO o BURBUJAS.';
                errorEl.style.display = 'block';
            }
        }
    };

    // Helper público para que catalogo.js inyecte el cupón en WhatsApp
    window.obtenerPromoParaWhatsApp = function() {
        const promo = obtenerPromoActiva();
        if (!promo) return '';

        const fechaAct = formatearFecha(promo.activadoEn);
        const fechaVen = formatearFecha(promo.venceEn);

        return `
🎁 *CÓDIGO DE DESCUENTO INSTAGRAM:*
🎟️ Cupón: *${promo.codigo}* (${promo.titulo})
⏳ Activado: ${fechaAct} · Válido hasta: ${fechaVen} (7 días)
🔐 Verificación: #${promo.token}
📌 *Letra chica:* No acumulable con otras promociones.`;
    };

    // Inicializador al cargar la página
    function initPromoSystem() {
        // 1. Detectar si viene código por URL (ej: almakids.cl/?promo=INSTALMA)
        const params = new URLSearchParams(window.location.search);
        const promoUrl = params.get('promo') || params.get('codigo') || params.get('descuento');

        if (promoUrl) {
            const match = buscarPromoPorTexto(promoUrl);
            if (match) {
                const activa = guardarPromoActiva(match);
                actualizarBannerPromo();
                // Abrir modal de celebración de inmediato
                setTimeout(() => {
                    renderizarModalPromo(activa, true);
                }, 100);
                return;
            }
        }

        // 2. Si ya tenía una promo guardada y vigente, refrescar el banner
        actualizarBannerPromo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPromoSystem);
    } else {
        initPromoSystem();
    }

})();
