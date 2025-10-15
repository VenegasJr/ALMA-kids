# 🤖 Configuración Rápida del Chat con IA

## ✅ Problemas Corregidos

### 1. Video que congela la página ❌ → ✅
**Problema:** Después de abrir un video, la página se quedaba congelada.

**Solución:** 
- ✅ El video ahora se pausa automáticamente al cerrar el modal
- ✅ El `overflow` del body se restaura correctamente
- ✅ El video se reinicia (vuelve al inicio) al cerrar

**Archivos modificados:**
- `index.html` - Función `closeImageModal()` mejorada

---

## 🚀 Configurar el Chat con IA (3 pasos)

### Paso 1: Obtener tu API Key de OpenAI

1. Ve a: https://platform.openai.com/api-keys
2. Inicia sesión con tu cuenta
3. Crea una nueva API key
4. Copia la key (se verá algo como: `sk-...`)

### Paso 2: Configurar la API Key

1. Abre el archivo: `ai-chat-config.js`
2. Busca esta línea:
   ```javascript
   apiKey: 'TU_API_KEY_AQUI',
   ```
3. Reemplázala con tu API key:
   ```javascript
   apiKey: 'sk-tu-api-key-real-aqui',
   ```
4. Guarda el archivo

### Paso 3: Probar el Chat

1. Abre `index.html` en tu navegador
2. Verás un botón flotante con un robot 🤖 en la esquina inferior derecha
3. Haz clic en el botón
4. Escribe: "¿Cuánto cuesta un castillo inflable?"
5. ¡El asistente responderá automáticamente!

---

## 📁 Archivos del Chat con IA

### Archivos creados:
- ✅ `ai-chat-widget.html` - Widget HTML del chat
- ✅ `ai-chat.js` - Lógica del chat con integración GPT
- ✅ `ai-chat.css` - Estilos del chat
- ✅ `ai-chat-config.js` - **Configuración (DEBES EDITAR ESTE)**
- ✅ `ai-chat-config.example.js` - Archivo de ejemplo

### Archivos de documentación:
- ✅ `INSTRUCCIONES-CHAT-IA.md` - Guía completa
- ✅ `RESUMEN-CHAT-IA.md` - Resumen de implementación
- ✅ `CONFIGURAR-CHAT-IA.md` - Este archivo

### Archivos de prueba:
- ✅ `test-chat.html` - Página de prueba del chat

---

## 💰 Costos Estimados

### GPT-3.5-turbo (Recomendado para empezar)
- **Input:** $0.50 por 1M tokens
- **Output:** $1.50 por 1M tokens
- **1,000 conversaciones:** ~$0.50

### GPT-4 (Más inteligente)
- **Input:** $30 por 1M tokens
- **Output:** $60 por 1M tokens
- **1,000 conversaciones:** ~$30

**💡 Recomendación:** Empieza con GPT-3.5-turbo para probar.

---

## 🎯 Características del Chat

- ✅ Asistente inteligente con GPT-4
- ✅ Respuestas contextuales sobre tus servicios
- ✅ Diseño moderno y responsive
- ✅ Integración con WhatsApp
- ✅ Sugerencias rápidas
- ✅ Modo oscuro automático
- ✅ Mobile friendly

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE
**NO subas `ai-chat-config.js` a repositorios públicos**

El archivo `.gitignore-chat` está listo para proteger tu API key.

---

## 🐛 Solución de Problemas

### El chat no responde
1. Verifica que la API key esté configurada en `ai-chat-config.js`
2. Abre la consola del navegador (F12)
3. Verifica tu saldo en: https://platform.openai.com/usage

### El chat no se ve
1. Verifica que todos los archivos estén en la misma carpeta
2. Abre la consola del navegador (F12)
3. Busca errores de carga

### El video congela la página
✅ **Ya está corregido** - El video ahora se pausa automáticamente al cerrar

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `INSTRUCCIONES-CHAT-IA.md`
2. Verifica la consola del navegador (F12)
3. Contacta a tu desarrollador

---

## 🎉 ¡Listo!

Ya tienes:
- ✅ Chat con IA configurado
- ✅ Problema del video corregido
- ✅ Todo listo para usar

**Próximos pasos:**
1. Configura tu API key
2. Prueba el chat localmente
3. Sube a producción (con las precauciones de seguridad)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0

