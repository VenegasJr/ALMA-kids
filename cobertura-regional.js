(() => {
    'use strict';

    const form = document.querySelector('[data-quote]');
    const fallback = document.getElementById('cotizar-directo');
    if (!form || !fallback) return;

    const { fecha, comuna, servicio } = form.elements;
    fecha.min = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago' }).format(new Date());
    comuna.addEventListener('input', () => comuna.setCustomValidity(''));

    form.addEventListener('submit', event => {
        event.preventDefault();

        const commune = comuna.value.trim();
        if (!commune) {
            comuna.setCustomValidity('Escribe la comuna o localidad del evento.');
            comuna.reportValidity();
            return;
        }

        const message = [
            'Hola, ALMA Kids. Quiero cotizar un arriendo.',
            `Fecha: ${fecha.value.split('-').reverse().join('/')}`,
            `Comuna o localidad: ${commune}`,
            `Servicio: ${servicio.value}`,
            '¿Tienen disponibilidad y cuánto cuesta el traslado?',
        ].join('\n');
        const url = new URL(fallback.href);
        url.searchParams.set('text', message);
        window.location.assign(url.href);
    });

    form.hidden = false;
})();
