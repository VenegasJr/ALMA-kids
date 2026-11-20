/* Preparación local de una consulta. No almacena datos ni envía mensajes. */
(() => {
  'use strict';
  const form = document.getElementById('empresa-form');
  if (!form) return;
  const result = document.getElementById('empresa-resumen');
  const output = document.getElementById('empresa-mensaje');
  const link = document.getElementById('empresa-whatsapp');
  const get = name => String(new FormData(form).get(name) || '').trim();
  // El resumen se invalida al editar para evitar enviar antecedentes anteriores.
  form.addEventListener('input', () => { result.hidden = true; link.removeAttribute('href'); });
  form.addEventListener('change', () => { result.hidden = true; link.removeAttribute('href'); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const date = get('fecha');
    const formattedDate = date ? date.split('-').reverse().join('/') : 'Por definir';
    const message = [
      '¡Hola, ALMA Kids! 🤍 Quiero cotizar un evento para mi empresa.', '',
      `Empresa: ${get('empresa')}`, `Evento: ${get('tipo')}`, `Comuna: ${get('comuna')}`,
      `Fecha tentativa: ${formattedDate}`, `Duración: ${get('horas')}`,
      `Cantidad estimada de niños: ${get('ninos')}`, `Edades: ${get('edades')}`,
      `Mínimo facturable informado: 50 niños. Base desde $8.000 netos por niño + IVA, según propuesta.`,
      `Set de interés: ${get('plan')}`,
      `Monitores: ${get('monitores')}`, 'Facturación: factura con IVA.',
      ...(get('detalles') ? [`Espacio y detalles: ${get('detalles')}`] : []), '',
      'Quisiera conocer la propuesta por cantidad de niños, juegos, traslado y valor neto, IVA y total. Sujeto a disponibilidad y revisión del lugar.'
    ].join('\n');
    output.textContent = message;
    link.href = 'https://wa.me/56969073306?text=' + encodeURIComponent(message);
    result.hidden = false;
    document.getElementById('empresa-resumen-titulo').focus();
    result.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
  });
})();
