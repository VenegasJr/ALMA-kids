# 🤖 Chat con IA - ALMA Kids

## 📋 Instrucciones de Configuración

### Paso 1: Obtener tu API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Inicia sesión con tu cuenta de OpenAI
3. Haz clic en **"Create new secret key"**
4. Copia tu API key (se verá algo como: `sk-...`)
5. **⚠️ IMPORTANTE:** Guarda esta key en un lugar seguro, no la compartas

### Paso 2: Configurar la API Key

1. Abre el archivo `ai-chat-config.js`
2. Busca la línea que dice:
   ```javascript
   apiKey: 'TU_API_KEY_AQUI',
   ```
3. Reemplaza `'TU_API_KEY_AQUI'` con tu API key real:
   ```javascript
   apiKey: 'sk-tu-api-key-aqui',
   ```
4. Guarda el archivo

### Paso 3: Probar el Chat

1. Abre `index.html` en tu navegador
2. Verás un botón flotante con un ícono de robot en la esquina inferior derecha
3. Haz clic en el botón para abrir el chat
4. Escribe un mensaje de prueba, por ejemplo: "¿Cuánto cuesta un castillo inflable?"
5. El asistente debería responder con información sobre tus servicios

---

## 🎨 Personalización

### Cambiar el Modelo de IA

En el archivo `ai-chat-config.js`, puedes cambiar el modelo:

```javascript
model: 'gpt-4',  // Opciones: 'gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'
```

**Recomendaciones:**
- **GPT-4**: Más inteligente y contextual (más caro)
- **GPT-3.5-turbo**: Más rápido y económico (recomendado para empezar)

### Ajustar la Temperatura

```javascript
temperature: 0.7,  // Rango: 0.0 a 1.0
```

- **0.0**: Respuestas más deterministas y consistentes
- **0.7**: Balance entre creatividad y consistencia (recomendado)
- **1.0**: Respuestas más creativas y variadas

### Cambiar el Máximo de Tokens

```javascript
maxTokens: 500,  // Ajusta según necesites respuestas más largas o cortas
```

---

## 📊 Costos

### Estimación de Costos (GPT-3.5-turbo)
- **Input**: $0.50 por 1M tokens
- **Output**: $1.50 por 1M tokens

**Ejemplo:**
- 1 conversación promedio = ~500 tokens
- 1,000 conversaciones = ~$0.50

### Estimación de Costos (GPT-4)
- **Input**: $30 por 1M tokens
- **Output**: $60 por 1M tokens

**Ejemplo:**
- 1 conversación promedio = ~500 tokens
- 1,000 conversaciones = ~$30

**💡 Recomendación:** Empieza con GPT-3.5-turbo para probar, luego cambia a GPT-4 si necesitas más inteligencia.

---

## 🔒 Seguridad

### ⚠️ IMPORTANTE: No subir la API Key a repositorios públicos

1. **Para desarrollo local:** Está bien tener la key en `ai-chat-config.js`
2. **Para producción:** Considera usar una de estas opciones:

#### Opción 1: Backend Proxy (Recomendado)
- Crea un backend que maneje las llamadas a la API
- El frontend llama a tu backend, no directamente a OpenAI
- La API key queda segura en el servidor

#### Opción 2: Variables de Entorno (Netlify/Vercel)
```javascript
// En Netlify, configura la variable de entorno OPENAI_API_KEY
apiKey: process.env.OPENAI_API_KEY,
```

#### Opción 3: Rate Limiting
- Implementa límites de uso por IP
- Previene abuso de tu API key

---

## 🚀 Despliegue a Producción

### En Netlify:

1. **Configurar Variables de Entorno:**
   - Ve a tu proyecto en Netlify
   - Settings → Environment Variables
   - Agrega: `OPENAI_API_KEY` con tu API key

2. **Modificar `ai-chat-config.js`:**
   ```javascript
   apiKey: window.OPENAI_API_KEY || 'TU_API_KEY_LOCAL',
   ```

3. **Agregar al `netlify.toml`:**
   ```toml
   [build.environment]
     OPENAI_API_KEY = "@openai_api_key"
   ```

### En Vercel:

1. **Configurar Variables de Entorno:**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega: `OPENAI_API_KEY`

2. **Modificar `ai-chat-config.js`** (igual que Netlify)

---

## 🐛 Solución de Problemas

### El chat no responde

1. **Verifica la API Key:**
   - Abre la consola del navegador (F12)
   - Busca errores relacionados con la API
   - Verifica que la API key sea correcta

2. **Verifica el saldo de tu cuenta OpenAI:**
   - Ve a [OpenAI Usage](https://platform.openai.com/usage)
   - Asegúrate de tener créditos disponibles

3. **Verifica los límites de rate:**
   - Ve a [OpenAI Limits](https://platform.openai.com/account/limits)
   - Verifica que no hayas excedido los límites

### El chat no se ve

1. **Verifica que los archivos estén cargados:**
   - `ai-chat-widget.html`
   - `ai-chat.css`
   - `ai-chat.js`
   - `ai-chat-config.js`

2. **Abre la consola del navegador (F12):**
   - Busca errores de carga
   - Verifica que no haya errores 404

### La API key no funciona

1. **Verifica que la key sea válida:**
   - Copia y pega la key exactamente como aparece
   - No dejes espacios extra

2. **Verifica que la key tenga permisos:**
   - Ve a [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Verifica que la key esté activa

---

## 📱 Características del Chat

### ✅ Funcionalidades Incluidas:

- 🤖 **Asistente Inteligente:** Responde preguntas sobre tus servicios
- 💬 **Conversación Contextual:** Recuerda el contexto de la conversación
- 🎨 **Diseño Moderno:** Interfaz atractiva y responsive
- 📱 **Mobile Friendly:** Funciona perfectamente en móviles
- ⚡ **Respuestas Rápidas:** Respuestas en menos de 3 segundos
- 🔗 **Integración WhatsApp:** Botón directo para hablar con humanos
- 🎯 **Sugerencias Rápidas:** Botones con preguntas comunes
- 🌙 **Modo Oscuro:** Se adapta al tema del sistema

### 🎯 Preguntas que puede responder:

- Precios de servicios
- Información sobre productos
- Zonas de cobertura
- Disponibilidad
- Características de servicios
- Y cualquier pregunta relacionada con ALMA Kids

---

## 📞 Soporte

Si tienes problemas con el chat:

1. Revisa esta documentación
2. Verifica la consola del navegador (F12)
3. Contacta a tu desarrollador

---

## 🎉 ¡Listo!

Ya tienes un chat con IA funcionando en tu sitio web. ¡Disfruta de las respuestas automáticas e inteligentes para tus clientes!

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0

