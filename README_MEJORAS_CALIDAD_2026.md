# Mejoras ALMA Kids — rama ChatGPT

Fecha: 30-06-2026

## Cambios principales

- Nueva página `feedback.html` con formulario funcional de Netlify Forms.
- Nueva página `calidad.html` con validación fotográfica obligatoria antes de una visita técnica.
- Nueva página `privacidad.html`.
- Página de confirmación `gracias-feedback.html` y error `404.html`.
- Botón fijo y enlaces de navegación para evaluar el servicio.
- Eliminación de cifras y testimonios sin respaldo verificable.
- Reemplazo de afirmaciones de certificación por controles internos verificables.
- Corrección de FAQ: fotos antes de visita, acceso máximo 20 m, autorización expresa de imágenes.
- Sitemap y rutas Netlify actualizados.

## Activar notificaciones del formulario

1. Publicar la rama en Netlify como Deploy Preview.
2. En Netlify: `Forms` → `feedback-alma-kids`.
3. Configurar notificación por correo a `info.almakids@gmail.com`.
4. Realizar una respuesta de prueba y confirmar que aparezca en Forms.

## Integrar Google Forms en lugar de Netlify Forms (opcional)

La versión entregada funciona sin enlace externo. Cuando exista el Google Form definitivo, puede reemplazarse el formulario de `feedback.html` por el iframe de Google Forms. La política CSP ya permite `https://docs.google.com`. No se recomienda publicar simultáneamente ambos formularios porque dispersaría las respuestas.

## Antes de fusionar con `principal`

- Completar RUT y domicilio legal en la política definitiva.
- Revisar todos los precios y edades/fichas técnicas.
- Probar el formulario desde teléfono y computador.
- Verificar notificación de Netlify Forms.
- Revisar los textos contractuales con asesoría jurídica antes de presentarlos como condiciones definitivas.
- No usar logos ISO ni afirmar certificación hasta contar con certificado verificable.

## Publicación

1. Subir estos archivos a la rama `ChatGPT`.
2. Abrir un Pull Request contra `principal`.
3. Revisar el Deploy Preview de Netlify.
4. Aprobar y fusionar solo después de las pruebas.
