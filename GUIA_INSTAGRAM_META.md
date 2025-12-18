# 📸 Guía Paso a Paso: Configurar Instagram Feed desde Meta Business Suite

## 🎯 Objetivo
Obtener el Access Token de Instagram para mostrar estadísticas reales (356 seguidores) y el feed completo en tu sitio web.

---

## 📋 PASO 1: Acceder a Meta Developers

1. **Desde Meta Business Suite:**
   - En la barra lateral izquierda, busca **"Más herramientas"** (More tools)
   - Haz clic en **"Configuración"** (Settings)
   - Busca la opción **"Herramientas para desarrolladores"** o ve directamente a: https://developers.facebook.com/

2. **O directamente:**
   - Abre una nueva pestaña
   - Ve a: **https://developers.facebook.com/**
   - Inicia sesión con la misma cuenta de Facebook que usas para Meta Business Suite

---

## 📋 PASO 2: Crear una App

1. **En la página de Meta Developers:**
   - Haz clic en **"Mis Apps"** (My Apps) en la esquina superior derecha
   - Haz clic en **"Crear App"** (Create App)

2. **Seleccionar tipo de App:**
   - Aparecerá un modal preguntando qué quieres hacer
   - Selecciona **"Ninguno"** o **"Otro"** (si no aparece ninguna opción específica)
   - Haz clic en **"Siguiente"**

3. **Completar información básica:**
   - **Nombre de la App:** `ALMA Kids Website` (o el nombre que prefieras)
   - **Email de contacto:** Tu email
   - **Propósito de la App:** Selecciona "Negocio" o "Otro"
   - Haz clic en **"Crear App"**

---

## 📋 PASO 3: Agregar Instagram Basic Display

1. **En el dashboard de tu App:**
   - Busca en la lista de productos disponibles
   - Encuentra **"Instagram Basic Display"**
   - Haz clic en **"Configurar"** o **"Set Up"**

2. **Si no aparece:**
   - Ve a **"Agregar producto"** (Add Product)
   - Busca **"Instagram Basic Display"**
   - Haz clic en **"Configurar"**

---

## 📋 PASO 4: Configurar OAuth Redirect URIs

1. **En la configuración de Instagram Basic Display:**
   - Ve a **"Configuración Básica"** (Basic Settings)
   - Busca la sección **"OAuth Redirect URIs"**
   - Agrega estas URLs (una por línea):
     ```
     https://www.almakids.cl/
     https://almakids.cl/
     http://localhost:8000/  (para pruebas locales)
     ```
   - Haz clic en **"Guardar cambios"**

---

## 📋 PASO 5: Obtener Credenciales de la App

1. **En "Configuración Básica":**
   - Busca **"ID de la App"** (App ID) - cópialo
   - Busca **"Secreto de la App"** (App Secret) - haz clic en "Mostrar" y cópialo
   - ⚠️ **IMPORTANTE:** Guarda estos valores de forma segura

---

## 📋 PASO 6: Crear Usuario de Prueba (Opcional pero Recomendado)

1. **En el dashboard de tu App:**
   - Ve a **"Roles"** → **"Roles de la App"** (App Roles)
   - Haz clic en **"Agregar personas"**
   - Agrega tu cuenta de Facebook como administrador

---

## 📋 PASO 7: Generar Access Token

### Opción A: Token de Prueba (Más Fácil)

1. **En el dashboard de tu App:**
   - Ve a **"Herramientas"** → **"Explorador de Graph API"** (Graph API Explorer)
   - En la parte superior:
     - **Selecciona tu App** en el dropdown
     - **Selecciona "Instagram Basic Display"** como producto
   - Haz clic en **"Generar Token de Acceso"** (Generate Access Token)
   - Selecciona los permisos:
     - ✅ `instagram_graph_user_profile`
     - ✅ `instagram_graph_user_media`
   - Copia el token generado

### Opción B: Token de Producción (Para uso permanente)

1. **Crear URL de autorización:**
   ```
   https://api.instagram.com/oauth/authorize?client_id=TU_APP_ID&redirect_uri=https://www.almakids.cl/&scope=user_profile,user_media&response_type=code
   ```
   - Reemplaza `TU_APP_ID` con tu App ID
   - Abre esta URL en el navegador
   - Autoriza la aplicación
   - Serás redirigido a tu sitio con un código en la URL

2. **Intercambiar código por token:**
   - Usa este endpoint (desde tu servidor):
   ```
   POST https://api.instagram.com/oauth/access_token
   ```
   - Con estos parámetros:
     - `client_id`: Tu App ID
     - `client_secret`: Tu App Secret
     - `grant_type`: `authorization_code`
     - `redirect_uri`: `https://www.almakids.cl/`
     - `code`: El código recibido

---

## 📋 PASO 8: Actualizar el Código

1. **Abre el archivo:** `instagram-feed.js`

2. **Busca la sección de configuración (líneas 10-15):**

3. **Actualiza con tus datos:**
   ```javascript
   const INSTAGRAM_CONFIG = {
       username: 'almakids.cl',
       accessToken: 'TU_TOKEN_AQUI', // ← Pega tu token aquí
       useEmbed: false, // ← Cambia a false para usar API
   };
   ```

4. **Guarda el archivo**

---

## 📋 PASO 9: Verificar que Funciona

1. **Recarga tu sitio web**
2. **Ve a la sección de Instagram**
3. **Deberías ver:**
   - ✅ Estadísticas reales (356 seguidores)
   - ✅ Número de publicaciones
   - ✅ Feed de fotos recientes

---

## ⚠️ IMPORTANTE: Renovación del Token

Los tokens de Instagram expiran después de 60 días. Para renovarlo:

1. **Ve a Meta Developers**
2. **Genera un nuevo token** (Paso 7)
3. **Actualiza** `instagram-feed.js` con el nuevo token

---

## 🔧 Solución de Problemas

### Error: "Invalid Access Token"
- Verifica que copiaste el token completo
- Asegúrate de que el token no haya expirado
- Verifica que tu App esté en modo "Desarrollo" o "Producción"

### Error: "Permissions error"
- Verifica que agregaste los permisos correctos
- Asegúrate de que tu cuenta de Instagram esté conectada a Meta Business Suite

### No se muestran las fotos
- Verifica que tu cuenta de Instagram tenga publicaciones públicas
- Asegúrate de que `useEmbed: false` en la configuración
- Revisa la consola del navegador para errores

### Las estadísticas no se actualizan
- Los tokens de prueba tienen límites
- Considera usar un token de producción para mejor rendimiento

---

## 📞 Recursos Adicionales

- **Documentación oficial:** https://developers.facebook.com/docs/instagram-basic-display-api
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/
- **Meta Business Suite:** https://business.facebook.com/

---

## ✅ Checklist Final

- [ ] App creada en Meta Developers
- [ ] Instagram Basic Display agregado
- [ ] OAuth Redirect URIs configuradas
- [ ] App ID y App Secret guardados
- [ ] Access Token generado
- [ ] Token actualizado en `instagram-feed.js`
- [ ] `useEmbed: false` configurado
- [ ] Sitio web recargado y verificado

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu sitio web mostrará:
- ✅ Estadísticas reales de Instagram (356 seguidores)
- ✅ Feed completo de publicaciones
- ✅ Actualización automática

Si tienes problemas en algún paso, avísame y te ayudo a resolverlo.

