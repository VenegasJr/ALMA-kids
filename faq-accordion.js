/**
 * =========================================================================
 * ❓ ALMA KIDS - ACORDEÓN DE CONDICIONES Y PREGUNTAS FRECUENTES (CANVA)
 * =========================================================================
 * Maneja el acordeón interactivo de la portada y el consultor de disponibilidad.
 * =========================================================================
 */

(function() {
    'use strict';

    function initFaqAccordion() {
        const items = document.querySelectorAll('.faq-accordion-item');
        items.forEach(item => {
            const header = item.querySelector('.faq-accordion-header');
            const body = item.querySelector('.faq-accordion-body');
            if (!header || !body) return;

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Cerrar otros acordeones si se desea comportamiento único
                items.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBody = other.querySelector('.faq-accordion-body');
                        if (otherBody) otherBody.style.maxHeight = null;
                    }
                });

                if (isActive) {
                    item.classList.remove('active');
                    body.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });
    }

    // Consultor rápido de disponibilidad de fecha
    window.consultarDisponibilidadExpress = function() {
        const inputFecha = document.getElementById('quickCheckFecha');
        const selectComuna = document.getElementById('quickCheckComuna');
        const telefono = '56969073306';

        const fechaVal = (inputFecha && inputFecha.value) ? inputFecha.value : 'próximamente';
        const comunaVal = (selectComuna && selectComuna.value) ? selectComuna.value : 'Machalí';

        const mensaje = 
`💖 *¡Hola ALMA Kids!* 💖

Quisiera consultar si tienen *disponibilidad de agenda* para la siguiente fecha:

📅 *Fecha del evento:* ${fechaVal}
📍 *Comuna:* ${comunaVal}

¿Tienen juegos o sets disponibles para ese día? ¡Muchas gracias! 💕`;

        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaqAccordion);
    } else {
        setTimeout(initFaqAccordion, 100);
    }
})();
