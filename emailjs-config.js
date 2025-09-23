// Stub seguro: Configuración EmailJS
(function(){
  console.info('[stub] emailjs-config.js cargado');
  if (window.emailjs && !window.emailjs.__inited) {
    try { window.emailjs.init('PUBLIC_KEY_PENDIENTE'); } catch(e) {}
    window.emailjs.__inited = true;
  }
})();


