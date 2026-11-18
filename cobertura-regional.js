(() => {
    'use strict';

    const form = document.querySelector('[data-quote]');
    const fallback = document.getElementById('cotizar-directo');
    if (!form || !fallback) return;

    const { fecha, comuna, sector, servicio } = form.elements;
    const fechaEnChile = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago' });
    fecha.min = fechaEnChile.format(new Date());
    comuna.addEventListener('input', () => comuna.setCustomValidity(''));

    form.addEventListener('submit', event => {
        event.preventDefault();

        // El día puede haber cambiado desde que se abrió la página.
        fecha.min = fechaEnChile.format(new Date());
        if (!fecha.reportValidity()) return;

        const commune = comuna.value.trim();
        if (!commune) {
            comuna.setCustomValidity('Escribe la comuna o localidad del evento.');
            comuna.reportValidity();
            return;
        }

        const sectorName = sector?.value.trim();
        const optionalDetails = [
            ['Nombre', form.elements.nombre],
            ['Teléfono', form.elements.telefono],
            ['Comentario', form.elements.comentario],
        ].flatMap(([label, field]) => field?.value.trim() ? [`${label}: ${field.value.trim()}`] : []);
        const message = [
            'Hola, ALMA Kids. Quiero cotizar un arriendo.',
            `Fecha: ${fecha.value.split('-').reverse().join('/')}`,
            `Comuna o localidad: ${commune}`,
            sectorName ? `Sector o referencia: ${sectorName}` : '',
            `Servicio: ${servicio.value}`,
            ...optionalDetails,
            '¿Tienen disponibilidad y cuánto cuesta el traslado?',
        ].filter(Boolean).join('\n');
        const url = new URL(fallback.href);
        url.searchParams.set('text', message);
        window.location.assign(url.href);
    });

    form.hidden = false;
})();
