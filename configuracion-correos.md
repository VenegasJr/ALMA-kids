# 📧 GUÍA DE CONFIGURACIÓN - SISTEMA DE CORREOS ALMA KIDS

## 🎯 **MÉTODOS DISPONIBLES PARA ENVÍO DE CORREOS**

---

## 🥇 **MÉTODO 1: FORMSPREE (RECOMENDADO)**

### ✅ **Ventajas:**
- **Gratuito** hasta 50 envíos/mes
- **Configuración súper fácil** (5 minutos)
- **Funciona inmediatamente**
- **No requiere servidor propio**

### 🔧 **Configuración Paso a Paso:**

#### **1. Crear Cuenta en Formspree:**
1. Ve a: https://formspree.io/
2. Haz clic en "Get Started"
3. Regístrate con tu email: `info.almakids@gmail.com`
4. Confirma tu email

#### **2. Crear Formulario:**
1. En el dashboard, haz clic en "+ New Form"
2. Nombre: "ALMA Kids Cotizaciones"
3. Email endpoint: `info.almakids@gmail.com`
4. Copia el **Form ID** (ej: `xvgpkjql`)

#### **3. Actualizar el Código:**
Abre `email-system.js` y busca esta línea:
```javascript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

Reemplaza `YOUR_FORM_ID` con tu Form ID real:
```javascript
const response = await fetch('https://formspree.io/f/xvgpkjql', {
```

#### **4. ¡Listo!**
- Los correos llegarán automáticamente a `info.almakids@gmail.com`
- Formspree manejará todo el envío
- Recibirás notificaciones por cada cotización

---

## 🥈 **MÉTODO 2: NETLIFY FORMS**

### ✅ **Ventajas:**
- **Integrado** con hosting Netlify
- **Gratuito** hasta 100 envíos/mes
- **Dashboard incluido**

### 🔧 **Configuración (Solo si usas Netlify):**

#### **1. Verificar si usas Netlify:**
- ¿Tu sitio está en `https://tudominio.netlify.app`?
- ¿Tienes cuenta en Netlify?

#### **2. Si SÍ usas Netlify:**
1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio ALMA Kids
3. Ve a "Forms" en el menú lateral
4. ¡Ya está configurado! Los formularios se detectan automáticamente

#### **3. Si NO usas Netlify:**
- Salta este método
- Usa Formspree o Mailto

---

## 🥉 **MÉTODO 3: MAILTO (SIEMPRE FUNCIONA)**

### ✅ **Ventajas:**
- **Funciona al 100%** en cualquier dispositivo
- **No requiere configuración**
- **Usa el email del usuario**

### 🔧 **Cómo Funciona:**
1. El usuario llena el formulario
2. Se abre su cliente de email (Gmail, Outlook, etc.)
3. El correo está **pre-escrito** con toda la información
4. Solo tiene que hacer clic en "Enviar"

### 📱 **Para el Usuario:**
- **Móvil:** Abre la app de email
- **Desktop:** Abre el programa de email
- **Web:** Abre Gmail/Outlook en navegador

---

## 🚀 **CONFIGURACIÓN RÁPIDA (5 MINUTOS)**

### **Opción A: Solo Formspree (Recomendado)**
1. Regístrate en Formspree.io
2. Crea un formulario
3. Copia el Form ID
4. Pégalo en `email-system.js`
5. ¡Listo!

### **Opción B: Solo Mailto (Inmediato)**
1. No requiere configuración
2. Ya está funcionando
3. Los usuarios pueden enviar correos directamente

---

## 🛠️ **INSTRUCCIONES TÉCNICAS**

### 📝 **Para Configurar Formspree:**

#### **Archivo a modificar:** `email-system.js`
#### **Línea a cambiar:** 89
```javascript
// ANTES:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {

// DESPUÉS:
const response = await fetch('https://formspree.io/f/TU_FORM_ID_REAL', {
```

### 🔍 **Para Verificar que Funciona:**
1. Llena el formulario de cotización
2. Envía una prueba
3. Revisa tu email `info.almakids@gmail.com`
4. Deberías recibir la cotización automáticamente

---

## 📊 **COMPARACIÓN DE MÉTODOS**

| Método | Configuración | Costo | Confiabilidad | Velocidad |
|--------|---------------|-------|---------------|-----------|
| **Formspree** | ⭐⭐⭐⭐⭐ | Gratis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐⭐⭐ | Gratis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Mailto** | ⭐⭐⭐⭐⭐ | Gratis | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎯 **RECOMENDACIÓN FINAL**

### **Para ALMA Kids:**
1. **Configura Formspree** (5 minutos, máximo beneficio)
2. **Mantén Mailto** como respaldo
3. **Tendrás correos automáticos** + respaldo manual

### **Resultado:**
- ✅ **100% de cotizaciones** llegan a tu email
- ✅ **Respaldo automático** siempre disponible
- ✅ **Sin configuración compleja**
- ✅ **Gratis** para tu volumen de cotizaciones

---

## 📞 **¿NECESITAS AYUDA?**

Si tienes problemas configurando:
1. **WhatsApp:** +56 9 6907 3306
2. **Email:** info.almakids@gmail.com
3. **Mensaje:** "Necesito ayuda configurando el sistema de correos"

---

## ⚡ **CONFIGURACIÓN EXPRESS (2 MINUTOS)**

### **Solo haz esto:**
1. Ve a: https://formspree.io/
2. Regístrate con: `info.almakids@gmail.com`
3. Crea formulario llamado: "ALMA Kids"
4. Copia el Form ID
5. Pégalo en línea 89 de `email-system.js`
6. ¡Funciona!

**¿Quieres que te ayude a configurar Formspree ahora mismo?** 🚀

---

*Documento creado el 19 de septiembre de 2025*
*ALMA Kids - Sistema de Correos Automáticos*
