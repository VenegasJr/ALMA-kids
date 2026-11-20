/* La llave viaja en el fragmento del enlace: no está en el sitio ni se envía al servidor. */
(() => {
  'use strict';
  const state = document.getElementById('propuesta-estado');
  const help = document.getElementById('propuesta-ayuda');
  const decode = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
  const fail = () => {
    state.textContent = 'Necesitas el enlace completo';
    help.textContent = 'Abre el enlace completo que te compartió ALMA Kids. Si no lo tienes, solicítalo por WhatsApp.';
  };
  const open = async () => {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const encoded = fragment.get('k');
    if (!encoded || !/^[A-Za-z0-9_-]{43}$/.test(encoded)) return fail();
    try {
      const bytes = decode(encoded.replace(/-/g, '+').replace(/_/g, '/') + '=');
      const key = await crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['decrypt']);
      const payload = JSON.parse(document.getElementById('propuesta-cifrada').textContent);
      const clear = await crypto.subtle.decrypt({name:'AES-GCM', iv:decode(payload.iv)}, key, decode(payload.data));
      // AES-GCM autentica el HTML de esta propuesta antes de incorporarlo.
      document.getElementById('contenido').innerHTML = new TextDecoder().decode(clear);
      document.getElementById('propuesta-cifrada').remove();
      // Los saltos internos conservan la llave al copiar o volver a abrir el enlace.
      document.addEventListener('click', event => {
        const link = event.target.closest?.('a[href^="#"]');
        if (!link) return;
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      });
      await import('/empresas.js?v=20261119-02');
    } catch { fail(); }
  };
  window.addEventListener('hashchange', () => {
    if (document.getElementById('propuesta-cifrada')) open();
  });
  open();
})();
