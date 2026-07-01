# ALMA Kids — ajuste de portada, Instagram y contacto (2026)

## Cambios incluidos

- Cambia el título principal por **“Alma Kids: Magia en cada detalle”**.
- Elimina el texto solicitado sobre revisión mediante fotos del bloque principal.
- Elimina completamente la sección “Descubre ALMA Kids”.
- Reemplaza las cifras fijas o simuladas de Instagram por una integración preparada para la API oficial de Meta.
- Elimina los métodos de scraping, proxies públicos y valores inventados de Instagram.
- Renueva la sección de contacto con enlaces funcionales a WhatsApp, teléfono, correo, Google Maps, Instagram, Facebook y TikTok.
- Mejora la visualización para computador y celular.

## Archivos que deben subirse a la rama `mejora-portada-faq`

- `index.html`
- `site-upgrade.css`
- `instagram-feed-simple.js`
- carpeta `netlify/functions/`
  - `instagram-profile.mjs`
- `README_AJUSTE_PORTADA_INSTAGRAM_CONTACTO_2026.md`

Al subirlos, el Pull Request #18 se actualizará automáticamente y Netlify generará un nuevo Deploy Preview.

## Activar la actualización automática de Instagram

La página funciona sin configurar la API, pero no mostrará cifras falsas. Para sincronizar seguidores, publicaciones, cuentas seguidas y publicaciones recientes se necesita conectar el perfil profesional de Instagram con la API oficial de Meta.

### Requisitos

1. La cuenta `@almakids.cl` debe ser profesional (Empresa o Creador).
2. Debe estar correctamente vinculada a los activos de Meta utilizados para la integración.
3. Debe existir una aplicación en Meta for Developers con acceso autorizado al perfil.
4. Debe obtenerse un token de acceso válido y el identificador numérico del usuario de Instagram.

### Variables en Netlify

En Netlify: **Project configuration → Environment variables → Add a variable**.

Crear:

- `INSTAGRAM_USER_ID`: identificador numérico del perfil profesional.
- `INSTAGRAM_ACCESS_TOKEN`: token válido de Meta. Marcarlo como secreto.
- `INSTAGRAM_API_VERSION`: `v25.0`.

Las variables deben estar disponibles para **Functions**. Nunca guardar el token en GitHub, HTML o JavaScript público.

Después de guardar las variables, realizar un nuevo deploy. La web consultará:

`/.netlify/functions/instagram-profile`

La respuesta se almacena en caché durante una hora para evitar solicitudes innecesarias.

## Comportamiento seguro

- Si la conexión está activa, las cifras y publicaciones se actualizan automáticamente.
- Si Meta no responde, la web conserva el enlace al perfil y muestra un mensaje neutral.
- Si aún no se configuran las variables, la web no presenta números inventados.
