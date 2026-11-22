/* Horarios de uso: la atención de consultas hasta las 23:00 es independiente. */
(() => {
    'use strict';
    const duracion = texto => Number(String(texto || '').match(/^(\d+)\s*horas?\b/i)?.[1] || 0);
    const hora = minutos => `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
    function revisar(inicio, horas) {
        const maximo = hora(20 * 60 - horas * 60);
        const ayuda = horas
            ? `Inicio del retiro: hasta las 20:00. Para ${horas} horas completas, inicia a más tardar a las ${maximo}.`
            : 'Consultas y reservas: 08:00–23:00. El retiro de juegos comienza como máximo a las 20:00; coordinamos la duración antes de reservar.';
        if (!inicio || !horas) return { valido: true, maximo: horas ? maximo : '', ayuda, error: '' };
        const partes = /^(\d{2}):(\d{2})$/.exec(inicio);
        const minutos = partes ? Number(partes[1]) * 60 + Number(partes[2]) : NaN;
        const valido = Boolean(partes) && Number(partes[1]) < 24 && Number(partes[2]) < 60 && minutos + horas * 60 <= 20 * 60;
        return { valido, maximo, ayuda, error: valido ? '' : `Elige una hora hasta las ${maximo} para disponer de ${horas} horas completas antes del retiro de las 20:00.` };
    }
    window.ALMA_HORARIOS = { duracion, revisar };
})();
