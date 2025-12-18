# 📸 Configuración de Instagram Feed para ALMA Kids

## Opciones para mostrar Instagram en tu sitio web

### Opción 1: Widget Embed de Instagram (MÁS SIMPLE - RECOMENDADO)

Esta es la forma más fácil y no requiere configuración adicional. El código ya está implementado y funcionará automáticamente.

**Ventajas:**
- ✅ No requiere API keys
- ✅ Funciona inmediatamente
- ✅ Muestra las últimas publicaciones
- ✅ Actualización automática

**Cómo funciona:**
- El widget oficial de Instagram se carga automáticamente
- Muestra las últimas publicaciones de @almakids.cl
- Los usuarios pueden hacer clic para ver más en Instagram

---

### Opción 2: Instagram Basic Display API (MÁS CONTROL)

Si quieres mostrar estadísticas reales (seguidores, publicaciones) y tener más control sobre el feed:

**Pasos para configurar:**

1. **Crear una App en Meta Developers:**
   - Ve a https://developers.facebook.com/
   - Crea una cuenta o inicia sesión
   - Ve a "Mis Apps" → "Crear App"
   - Selecciona "Ninguno" como tipo de app
   - Completa la información básica

2. **Agregar Instagram Basic Display:**
   - En el dashboard de tu app, busca "Instagram Basic Display"
   - Haz clic en "Configurar"
   - Agrega "Instagram App ID" y "Instagram App Secret"

3. **Configurar OAuth Redirect URIs:**
   - En "Configuración Básica" → "OAuth Redirect URIs"
   - Agrega: `https://www.almakids.cl/` (o tu dominio)

4. **Obtener Access Token:**
   - Ve a "Herramientas" → "Explorador de Graph API"
   - Genera un token de acceso
   - Copia el token

5. **Actualizar el código:**
   - Abre `instagram-feed.js`
   - Reemplaza `accessToken: ''` con tu token
   - Cambia `useEmbed: false` si quieres usar la API

**Archivo a modificar:** `instagram-feed.js` línea 10-15

```javascript
const INSTAGRAM_CONFIG = {
    username: 'almakids.cl',
    accessToken: 'TU_TOKEN_AQUI', // ← Pegar tu token aquí
    useEmbed: false, // ← Cambiar a false para usar API
};
```

---

### Opción 3: Servicios de Terceros (ALTERNATIVA)

Si prefieres una solución más simple sin código:

**Servicios recomendados:**
- **SnapWidget** (https://snapwidget.com/) - Gratis hasta 12 posts
- **Elfsight** (https://elfsight.com/) - Widget gratuito
- **Juicer** (https://www.juicer.io/) - Feed social agregado

**Cómo usar:**
1. Regístrate en uno de estos servicios
2. Conecta tu cuenta de Instagram
3. Obtén el código embed
4. Reemplaza el contenido de `instagram-feed-container` en el HTML

---

## 📍 Ubicación de la Sección

La sección de Instagram se encuentra:
- **En el HTML:** Entre la sección de FAQ y la sección de Contacto
- **ID:** `#instagram-feed`
- **Archivos relacionados:**
  - `instagram-feed.css` - Estilos
  - `instagram-feed.js` - Funcionalidad
  - `index.html` - HTML de la sección

---

## 🎨 Personalización

### Cambiar colores:
Edita `instagram-feed.css` y busca los gradientes de Instagram:
```css
background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
```

### Cambiar número de posts:
En `instagram-feed.js`, línea 60:
```javascript
limit=9  // ← Cambiar el número aquí
```

### Cambiar diseño del grid:
En `instagram-feed.css`, busca `.instagram-grid`:
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
```

---

## ⚠️ Notas Importantes

1. **Límites de la API:**
   - Instagram limita las solicitudes a 200 por hora por token
   - Los tokens pueden expirar (renovar cada 60 días)

2. **Términos de Servicio:**
   - Asegúrate de cumplir con los términos de Instagram
   - No uses scraping sin permiso

3. **Privacidad:**
   - Los datos de Instagram son públicos por defecto
   - No se almacenan datos personales

---

## 🚀 Estado Actual

**Implementación actual:** Opción 1 (Widget Embed)
- ✅ Funciona sin configuración
- ✅ Muestra publicaciones automáticamente
- ⚠️ Las estadísticas muestran emojis (actualizar manualmente o usar API)

**Para activar estadísticas reales:** Seguir Opción 2

---

## 📞 Soporte

Si necesitas ayuda con la configuración:
1. Revisa la documentación de Meta Developers
2. Consulta la documentación de Instagram Basic Display API
3. Verifica que tu cuenta de Instagram esté configurada como cuenta de negocio

