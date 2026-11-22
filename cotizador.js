/**
 * =========================================================================
 * 🧮 ALMA KIDS - SIMULADOR / COTIZADOR RÁPIDO "ARMA TU CELEBRACIÓN"
 * =========================================================================
 * Permite calcular presupuestos en tiempo real combinando sets y adicionales,
 * integrando cupones de descuento activos y generando el enlace a WhatsApp.
 * =========================================================================
 */

(function() {
    'use strict';

    const ADICIONALES = [
        { id: 'burbujas', producto: 'maquina-burbujas', nombre: 'Máquina de Burbujas (Solo arriendo 3 hrs)' },
        { id: 'liquido_extra', producto: 'maquina-burbujas', suplemento: true, nombre: 'Líquido para Burbujas (1 Litro)' },
        { id: 'carpa_tipi', producto: 'carpa-tipi', nombre: 'Carpa Tipi Decorativa (3 horas)' },
        { id: 'cartel', producto: 'cartel-bienvenida-pequeno', nombre: 'Cartel de Bienvenida Personalizado (60×90 cm)' },
        { id: 'monitor', producto: 'supervision-monitor', nombre: 'Supervisión Profesional por Monitor (4 hrs)' },
        { id: 'saltarin', producto: 'caballo-saltarin-cafe', nombre: 'Caballo saltarín café (3 horas)' },
        { id: 'unicornio_balancin', producto: 'unicornio-balancin', nombre: 'Unicornio balancín (3 horas)' },
        { id: 'caballo_balancin', producto: 'caballo-balancin-cafe', nombre: 'Caballo balancín café (3 horas)' }
    ];

    function formatearCLP(valor, precioDesde = false) {
        const precio = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(valor);
        return precioDesde ? 'Desde ' + precio : precio;
    }

    function initCotizador() {
        const selectBase = document.getElementById('cotizadorBaseSelect');
        const addonsContainer = document.getElementById('cotizadorAddonsList');
        const inputFecha = document.getElementById('cotizadorFechaInput');
        const inputHora = document.getElementById('cotizadorHoraInput');
        const piscinaField = document.getElementById('cotizadorPiscinaField');
        const selectPiscina = document.getElementById('cotizadorPiscinaSelect');
        const selectComuna = document.getElementById('cotizadorComunaSelect');
        const totalAmountEl = document.getElementById('cotizadorTotalAmount');
        const totalNotesEl = document.getElementById('cotizadorTotalNotes');
        const btnWsp = document.getElementById('cotizadorBtnWsp');

        if (!selectBase || !addonsContainer || !totalAmountEl || !btnWsp) return;

        // 1. Poblar juegos y sets base
        const productos = (window.CATALOGO_PRODUCTOS || []).filter(p => p.activo !== false);
        const opciones = productos.flatMap(p => [p, ...(p.variantes || [])]);
        const adicionales = ADICIONALES.map(ad => {
            const producto = opciones.find(p => p.id === ad.producto);
            const tarifa = ad.suplemento ? producto?.suplemento : producto;
            return tarifa && Number.isFinite(tarifa.precio)
                ? { ...ad, precio: tarifa.precio, precioDesde: tarifa.precioDesde === true }
                : null;
        }).filter(Boolean);
        selectBase.innerHTML = productos.map(p => {
            const precioFmt = formatearCLP(p.precio, p.precioDesde);
            return `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} — ${precioFmt} · ${p.duracion}</option>`;
        }).join('');

        // Preseleccionar Set Máximo por defecto
        const defaultSet = productos.find(p => p.id === 'pack-maximo') || productos[0];
        if (defaultSet) {
            selectBase.value = defaultSet.id;
        }

        // 2. Poblar adicionales
        addonsContainer.innerHTML = adicionales.map(ad => `
            <label class="cotizador-addon-item" data-id="${ad.id}">
                <div class="cotizador-addon-left">
                    <input type="checkbox" id="addon_${ad.id}" data-precio="${ad.precio}" data-nombre="${ad.nombre}" data-precio-desde="${ad.precioDesde === true}">
                    <span class="cotizador-addon-name">${ad.nombre}</span>
                </div>
                <span class="cotizador-addon-price">+ ${formatearCLP(ad.precio, ad.precioDesde)}</span>
            </label>
        `).join('');

        // Recalcular
        function recalcular() {
            const optSeleccionada = selectBase.options[selectBase.selectedIndex];
            if (!optSeleccionada) return;

            const baseId = optSeleccionada.value;
            const productoBase = productos.find(p => p.id === baseId);
            const basePrecio = parseInt(optSeleccionada.getAttribute('data-precio') || '0', 10);
            const baseNombre = productoBase ? productoBase.nombre : optSeleccionada.text;
            const esDuo = baseId === 'set-duo';
            if (piscinaField) piscinaField.hidden = !esDuo;

            let sumaAdicionales = 0;
            const adicionalesElegidos = [];

            const checkboxes = addonsContainer.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(cb => {
                const precio = parseInt(cb.getAttribute('data-precio') || '0', 10);
                const nombre = cb.getAttribute('data-nombre');
                sumaAdicionales += precio;
                const precioDesde = cb.dataset.precioDesde === 'true';
                adicionalesElegidos.push({ nombre, precio, precioDesde });
            });

            // Resaltar tarjeta seleccionada
            addonsContainer.querySelectorAll('.cotizador-addon-item').forEach(item => {
                const cb = item.querySelector('input[type="checkbox"]');
                if (cb && cb.checked) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });

            let total = basePrecio + sumaAdicionales;
            let descuento = 0;
            let promoMsg = '';
            const comuna = selectComuna ? selectComuna.value : 'Machalí';
            const fecha = inputFecha?.value ? inputFecha.value.split('-').reverse().join('/') : 'Por definir';
            const hora = inputHora?.value || 'Por definir';
            const piscina = esDuo ? (selectPiscina?.value || 'Por elegir: grande o mini, sin recargo') : '';

            const esMachaliRancagua = ['machalí', 'machali', 'rancagua'].includes(comuna.toLowerCase().trim());
            const esSet = productoBase && (productoBase.categoria === 'packs' || ['pack-maximo', 'pack-grand-peque', 'set-alma-magic', 'set-alma-active', 'set-duo', 'pack-alma-mini-play'].includes(productoBase.id));
            const esMaximoOGrandPeque = productoBase && ['pack-maximo', 'pack-grand-peque'].includes(productoBase.id);

            // Revisar si hay promo activa
            let promoActiva = null;
            try {
                const raw = localStorage.getItem('almakids_active_promo');
                if (raw) promoActiva = JSON.parse(raw);
            } catch (e) {}

            let promoValidaParaWhatsApp = true;
            let promoAclaracionWhatsApp = '';

            if (promoActiva && promoActiva.venceEn > Date.now()) {
                if (promoActiva.codigo === 'INSTALMA') {
                    descuento = Math.min(10000, Math.round(total * 0.10));
                    total = total - descuento;
                    promoMsg = `🎉 Cupón ${promoActiva.codigo} aplicado: -${formatearCLP(descuento)} (10% OFF)`;
                } else if (promoActiva.codigo === 'TRASLADO') {
                    if (esMachaliRancagua && esSet) {
                        promoMsg = `🚚 Cupón ${promoActiva.codigo} aplicado: ¡Traslado 100% Gratis en ${comuna}!`;
                        promoAclaracionWhatsApp = `🚚 Beneficio: Traslado gratis en ${comuna} contratando Set.`;
                    } else if (!esMachaliRancagua && esSet) {
                        promoMsg = `ℹ️ Cupón TRASLADO: Válido en Machalí/Rancagua (hacia ${comuna} aplica tarifa de traslado estándar).`;
                        promoValidaParaWhatsApp = false;
                        promoAclaracionWhatsApp = `⚠️ Nota: Cupón TRASLADO aplica solo en Machalí/Rancagua (evento en ${comuna}).`;
                    } else if (esMachaliRancagua && !esSet) {
                        promoMsg = `ℹ️ Cupón TRASLADO: Aplica exclusivamente contratando un Set o Pack completo (con juego individual aplica traslado).`;
                        promoValidaParaWhatsApp = false;
                        promoAclaracionWhatsApp = `⚠️ Nota: Cupón TRASLADO aplica contratando un Set o Pack completo.`;
                    } else {
                        promoMsg = `ℹ️ Cupón TRASLADO: Válido contratando un Set en Machalí o Rancagua.`;
                        promoValidaParaWhatsApp = false;
                    }
                } else if (promoActiva.codigo === 'BURBUJAS') {
                    if (esMaximoOGrandPeque) {
                        promoMsg = `🫧 Cupón ${promoActiva.codigo} aplicado: ¡1 Litro de líquido extra gratis incluido!`;
                        promoAclaracionWhatsApp = `🫧 Beneficio: 1 Litro de líquido de burbujas gratis incluido con ${baseNombre}.`;
                    } else {
                        promoMsg = `ℹ️ Cupón BURBUJAS: Aplica exclusivamente contratando Set "MÁXIMO" o "GRAND-PEQUE".`;
                        promoValidaParaWhatsApp = false;
                        promoAclaracionWhatsApp = `⚠️ Nota: Cupón BURBUJAS aplica al contratar Set MÁXIMO o GRAND-PEQUE.`;
                    }
                }
            }

            const totalEsDesde = Boolean(productoBase?.precioDesde) || adicionalesElegidos.some(ad => ad.precioDesde);
            totalAmountEl.textContent = formatearCLP(total, totalEsDesde);
            if (promoMsg) {
                totalNotesEl.innerHTML = `<strong>${promoMsg}</strong><br>50% de abono al agendar y 50% previo a la instalación.`;
            } else {
                totalNotesEl.textContent = 'Valores referenciales de juegos y adicionales. Traslado según comuna y servicio. 50% al agendar y 50% previo a la instalación.';
            }

            // Construir mensaje WhatsApp
            let textoAdicionales = '';
            if (adicionalesElegidos.length > 0) {
                textoAdicionales = '\n➕ *Adicionales elegidos:*\n' + adicionalesElegidos.map(a => `   • ${a.nombre} (+${formatearCLP(a.precio, a.precioDesde)})`).join('\n');
            }

            let promoTexto = '';
            if (typeof window.obtenerPromoParaWhatsApp === 'function') {
                promoTexto = window.obtenerPromoParaWhatsApp();
                if (promoAclaracionWhatsApp) {
                    promoTexto += `\n${promoAclaracionWhatsApp}`;
                }
            }

            const mensaje = 
`💖 *¡Hola ALMA Kids!* 💖

Armé esta combinación en su cotizador web y quisiera consultar disponibilidad:

🎈 *Servicio Base:* ${baseNombre} (${formatearCLP(basePrecio, productoBase?.precioDesde)})
⏱️ *Duración del servicio base:* ${productoBase?.duracion || 'Por confirmar'}${textoAdicionales}

📍 *Comuna:* ${comuna}
📅 *Fecha estimada:* ${fecha}
🕒 *Hora de inicio:* ${hora}${piscina ? '\n🏊 *Piscina de espuma DÚO:* ' + piscina : ''}
💰 *Total estimado de juegos y adicionales:* ${formatearCLP(total, totalEsDesde)}
🚚 ${esMachaliRancagua && esSet ? 'Traslado incluido en Machalí y Rancagua al contratar el set.' : 'Traslado por cotizar según dirección y acceso.'}${promoTexto ? '\n' + promoTexto : ''}

¿Tienen disponibilidad para esta fecha? ¡Muchas gracias! 💕`;

            btnWsp.href = `https://wa.me/56969073306?text=${encodeURIComponent(mensaje)}`;
        }

        selectBase.addEventListener('change', recalcular);
        addonsContainer.addEventListener('change', recalcular);
        if (inputFecha) inputFecha.addEventListener('change', recalcular);
        if (inputHora) inputHora.addEventListener('change', recalcular);
        if (selectPiscina) selectPiscina.addEventListener('change', recalcular);
        if (selectComuna) selectComuna.addEventListener('change', recalcular);

        recalcular();
    }

    // Inicializador
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCotizador);
    } else {
        setTimeout(initCotizador, 200);
    }

})();
