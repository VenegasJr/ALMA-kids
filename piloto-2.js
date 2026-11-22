(() => {
    'use strict';

    const products = window.CATALOGO_PRODUCTOS || [];
    const byId = new Map(products.filter(product => product.activo !== false).map(product => [product.id, product]));
    const featured = [
        { id: 'piscina-pelotas-espuma', label: 'Para los más chicos', title: 'Piscina de pelotas' },
        { id: 'castillo-grand-peque', label: 'Castillo inflable', title: 'Castillo Grand-Peque' },
        { id: 'pack-maximo', label: 'Montaje completo', title: 'Set Máximo' }
    ];

    const price = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
    const section = document.getElementById('destacados');
    const grid = section.querySelector('.pilot-featured-grid');
    const template = document.getElementById('pilot-featured-card');

    for (const choice of featured) {
        const product = byId.get(choice.id);
        if (!product) continue;

        const card = template.content.cloneNode(true);
        const image = card.querySelector('img');
        image.src = product.imagen;
        image.alt = product.nombre;
        card.querySelector('h3').textContent = choice.title;
        card.querySelector('.pilot-card-label').textContent = choice.label;
        card.querySelector('.pilot-card-age').textContent = product.edadesRecomendadas;
        const space = product.medidasEspacio.match(/Espacio mín: ([^)]+)/)?.[1] || product.medidasEspacio;
        card.querySelector('.pilot-card-space').textContent = `Espacio: ${space}`;
        card.querySelector('.pilot-card-price').textContent = price.format(product.precio);
        const button = card.querySelector('button');
        button.dataset.pilotProduct = product.id;
        button.setAttribute('aria-label', `Cotizar ${choice.title}`);
        grid.append(card);
    }

    if (grid.childElementCount) {
        section.hidden = false;
        document.getElementById('pilot-see-games').href = '#destacados';
    }

    const dialog = document.getElementById('pilot-quote-dialog');
    if (typeof dialog.showModal !== 'function') {
        for (const button of grid.querySelectorAll('[data-pilot-quote]')) {
            button.hidden = true;
        }
        return;
    }

    const form = document.getElementById('pilot-quote-form');
    const date = form.elements.fecha;
    const commune = form.elements.comuna;
    const startTime = form.elements.hora;
    const pool = form.elements.piscina;
    const poolField = document.getElementById('pilot-pool-field');
    const productLabel = dialog.querySelector('.pilot-quote-product');
    const extraLabel = dialog.querySelector('.pilot-quote-extra');
    const whatsapp = document.querySelector('.home-hero-v2-actions [data-pilot-quote]');
    let selectedProduct;
    let previousOverflow;

    dialog.querySelector('.pilot-quote-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') event.stopPropagation();
    });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
    });
    commune.addEventListener('input', () => commune.setCustomValidity(''));

    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const trigger = event.target.closest('[data-pilot-quote], #catalogo-grid .btn-catalogo-wsp, #catalogo-modal .btn-modal-wsp');
        if (!trigger) return;

        const productId = trigger.dataset.pilotProduct || trigger.dataset.catalogoCotizar;
        selectedProduct = byId.get(productId);
        if (!selectedProduct && trigger !== whatsapp) return;

        event.preventDefault();
        const priceLabel = selectedProduct?.etiquetaPrecio;
        productLabel.textContent = selectedProduct
            ? `${selectedProduct.nombre} · ${priceLabel ? priceLabel + ': ' : ''}${price.format(selectedProduct.precio)}`
            : '';
        productLabel.hidden = !selectedProduct;
        const extra = selectedProduct?.suplemento;
        extraLabel.textContent = extra ? `Opcional · ${extra.nombre}: ${price.format(extra.precio)}` : '';
        extraLabel.hidden = !extra;
        if (poolField) poolField.hidden = selectedProduct?.id !== 'set-duo';
        date.min = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago' }).format(new Date());
        previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const communeName = commune.value.trim();
        if (!communeName) {
            commune.setCustomValidity('Ingresa la comuna del evento.');
            commune.reportValidity();
            return;
        }

        const eventDate = date.value.split('-').reverse().join('/');
        const priceLabel = selectedProduct?.etiquetaPrecio?.toLowerCase() || 'valor de referencia';
        const extra = selectedProduct?.suplemento;
        const service = selectedProduct
            ? `Quiero cotizar ${selectedProduct.nombre} (${priceLabel}: ${price.format(selectedProduct.precio)}; ${selectedProduct.duracion}).`
            : 'Quiero cotizar juegos para mi celebración.';
        const personalizacion = window.obtenerPersonalizacionModal?.(selectedProduct?.id) || '';
        const promo = window.obtenerPromoParaWhatsApp?.() || '';
        const message = [
            `¡Hola, ALMA Kids! ${service}`,
            `Fecha: ${eventDate}`,
            `Comuna: ${communeName}`,
            `Hora de inicio: ${startTime?.value || 'Por definir'}`,
            selectedProduct?.id === 'set-duo' ? `Piscina de espuma DÚO: ${pool?.value || 'Por elegir: grande o mini, sin recargo'}` : '',
            extra ? `Opcional: ${extra.nombre} por ${price.format(extra.precio)}.` : '',
            personalizacion ? personalizacion.trim() : '',
            '¿Tienen disponibilidad para esa fecha?',
            promo.trim()
        ].filter(Boolean).join('\n');
        const link = new URL(whatsapp.href);
        link.searchParams.set('text', message);
        window.almaRegistrarConsulta?.(selectedProduct?.id || 'general');
        window.open(link.href, '_blank', 'noopener,noreferrer');
        dialog.close();
    });
})();
