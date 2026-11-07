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
        { id: 'burbujas', nombre: 'Máquina de Burbujas (Solo arriendo 3 hrs)', precio: 16000 },
        { id: 'liquido_extra', nombre: 'Líquido para Burbujas (1 Litro)', precio: 6000 },
        { id: 'carpa_tipi', nombre: 'Carpa Tipi Decorativa Aesthetic', precio: 17000 },
        { id: 'cartel', nombre: 'Cartel de Bienvenida Personalizado (60×90 cm)', precio: 25000 },
        { id: 'monitor', nombre: 'Supervisión Profesional por Monitor (4 hrs)', precio: 30000 },
        { id: 'saltarin', nombre: 'Animalito Saltarín o Balancín adicional', precio: 16000 }
    ];

    function formatearCLP(valor) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(valor);
    }

    function initCotizador() {
        const selectBase = document.getElementById('cotizadorBaseSelect');
        const addonsContainer = document.getElementById('cotizadorAddonsList');
        const inputFecha = document.getElementById('cotizadorFechaInput');
        const selectComuna = document.getElementById('cotizadorComunaSelect');
        const totalAmountEl = document.getElementById('cotizadorTotalAmount');
        const totalNotesEl = document.getElementById('cotizadorTotalNotes');
        const btnWsp = document.getElementById('cotizadorBtnWsp');

        if (!selectBase || !addonsContainer || !totalAmountEl || !btnWsp) return;

        // 1. Poblar juegos y sets base
        const productos = (window.CATALOGO_PRODUCTOS || []).filter(p => p.activo !== false);
        selectBase.innerHTML = productos.map(p => {
            const precioFmt = formatearCLP(p.precio);
            return `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} — ${precioFmt}</option>`;
        }).join('');

        // Preseleccionar Set Máximo por defecto
        const defaultSet = productos.find(p => p.id === 'pack-maximo') || productos[0];
        if (defaultSet) {
            selectBase.value = defaultSet.id;
        }

        // 2. Poblar adicionales
        addonsContainer.innerHTML = ADICIONALES.map(ad => `
            <label class="cotizador-addon-item" data-id="${ad.id}">
                <div class="cotizador-addon-left">
                    <input type="checkbox" id="addon_${ad.id}" data-precio="${ad.precio}" data-nombre="${ad.nombre}">
                    <span class="cotizador-addon-name">${ad.nombre}</span>
                </div>
                <span class="cotizador-addon-price">+ ${formatearCLP(ad.precio)}</span>
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

            let sumaAdicionales = 0;
            const adicionalesElegidos = [];

            const checkboxes = addonsContainer.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(cb => {
                const precio = parseInt(cb.getAttribute('data-precio') || '0', 10);
                const nombre = cb.getAttribute('data-nombre');
                sumaAdicionales += precio;
                adicionalesElegidos.push({ nombre, precio });
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

            // Revisar si hay promo activa
            let promoActiva = null;
            try {
                const raw = localStorage.getItem('almakids_active_promo');
                if (raw) promoActiva = JSON.parse(raw);
            } catch (e) {}

            if (promoActiva && promoActiva.venceEn > Date.now()) {
                if (promoActiva.codigo === 'INSTALMA') {
                    descuento = Math.min(10000, Math.round(total * 0.10));
                    total = total - descuento;
                    promoMsg = `🎉 Cupón ${promoActiva.codigo} aplicado: -${formatearCLP(descuento)} (10% OFF)`;
                } else if (promoActiva.codigo === 'TRASLADO') {
                    promoMsg = `🚚 Cupón ${promoActiva.codigo} activo: Traslado 100% Gratis en Machalí/Rancagua`;
                } else if (promoActiva.codigo === 'BURBUJAS') {
                    promoMsg = `🫧 Cupón ${promoActiva.codigo} activo: 1 Litro de líquido gratis incluido`;
                }
            }

            totalAmountEl.textContent = formatearCLP(total);
            if (promoMsg) {
                totalNotesEl.innerHTML = `<strong>${promoMsg}</strong><br>50% de abono al agendar y 50% previo a la instalación.`;
            } else {
                totalNotesEl.textContent = 'Valores referenciales. 50% de abono al agendar y 50% previo a la instalación.';
            }

            // Construir mensaje WhatsApp
            const comuna = selectComuna ? selectComuna.value : 'Machalí';
            const fecha = (inputFecha && inputFecha.value) ? inputFecha.value : 'Por definir';

            let textoAdicionales = '';
            if (adicionalesElegidos.length > 0) {
                textoAdicionales = '\n➕ *Adicionales elegidos:*\n' + adicionalesElegidos.map(a => `   • ${a.nombre} (+${formatearCLP(a.precio)})`).join('\n');
            }

            let promoTexto = '';
            if (typeof window.obtenerPromoParaWhatsApp === 'function') {
                promoTexto = window.obtenerPromoParaWhatsApp();
            }

            const mensaje = 
`💖 *¡Hola ALMA Kids!* 💖

Armé mi presupuesto en su cotizador web y me gustaría reservar:

🎈 *Servicio Base:* ${baseNombre} (${formatearCLP(basePrecio)})${textoAdicionales}

📍 *Comuna:* ${comuna}
📅 *Fecha estimada:* ${fecha}
💰 *Total estimado:* ${formatearCLP(total)}${promoTexto ? '\n' + promoTexto : ''}

¿Tienen disponibilidad para esta fecha? ¡Muchas gracias! 💕`;

            btnWsp.href = `https://wa.me/56969073306?text=${encodeURIComponent(mensaje)}`;
        }

        selectBase.addEventListener('change', recalcular);
        addonsContainer.addEventListener('change', recalcular);
        if (inputFecha) inputFecha.addEventListener('change', recalcular);
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
