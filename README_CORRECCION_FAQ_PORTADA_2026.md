# Corrección FAQ y portada — ALMA Kids

## Archivos del parche

- `faq.html`: página FAQ reconstruida con cabecera uniforme, búsqueda, categorías, acordeones nativos y botones flotantes.
- `index.html`: portada inicial reformulada y eliminación del carrusel/partículas obsoletas.
- `site-upgrade.css`: estilos de la nueva portada y FAQ responsive.
- `site-ui.js`: buscador liviano de preguntas frecuentes y cierre del menú móvil.
- `script.js`: eliminación del scroll suave forzado por JavaScript.

## Pruebas recomendadas en Deploy Preview

1. Abrir `/faq.html` en computador y teléfono.
2. Probar la búsqueda con las palabras `fotos`, `lluvia`, `pago` y `electricidad`.
3. Abrir y cerrar varias preguntas y confirmar que ninguna respuesta quede cortada.
4. Probar `Evaluar servicio` y el botón flotante de contacto.
5. Abrir `/index.html` y desplazarse desde la portada hasta Servicios.
6. Probar los botones `Cotizar por WhatsApp` y `Ver servicios`.
7. Comprobar el menú móvil y el carrito.

## Resultado técnico

- La portada ya no utiliza `min-height: 100vh`, partículas animadas ni carrusel con temporizadores.
- Se retiraron precargas de imágenes pesadas que no eran necesarias para el primer bloque visible.
- En dispositivos táctiles se evita el scroll suave forzado y las revelaciones animadas.
- El FAQ utiliza elementos HTML `details/summary`, sin cálculo manual de alturas.
