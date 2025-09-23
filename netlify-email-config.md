# 📧 Configuración de Emails Automáticos con Netlify

## 🎯 **CONFIGURACIÓN NETLIFY FORMS**

### **1. Configuración Automática en Netlify**

Una vez que subas el sitio a Netlify, los formularios se configuran automáticamente. Netlify detectará el formulario oculto en `index.html` y creará el endpoint automáticamente.

### **2. Configurar Notificaciones por Email**

#### **Paso 1: Ir al Panel de Netlify**
1. Ve a tu sitio en Netlify Dashboard
2. Navega a `Settings` > `Forms`
3. Busca el formulario `alma-kids-quotes`

#### **Paso 2: Configurar Notificaciones**
1. Haz clic en `Settings & Usage`
2. Ve a la sección `Form notifications`
3. Haz clic en `Add notification`

#### **Paso 3: Configurar Email de Notificación**
```
Notification type: Email notification
Event to listen for: New form submission
Email to notify: info.almakids@gmail.com
Subject: 🎪 Nueva Cotización ALMA Kids - {{quote_id}}
```

#### **Paso 4: Configurar Template del Email**
En el campo "Email template", usa:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nueva Cotización ALMA Kids</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    
    <div style="background: linear-gradient(135deg, #E91E63, #FF6B9D); padding: 2rem; text-align: center; color: white;">
        <h1>🎪 NUEVA COTIZACIÓN ALMA KIDS</h1>
        <p>ID: {{quote_id}}</p>
    </div>
    
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        
        <h2 style="color: #E91E63; border-bottom: 2px solid #E91E63; padding-bottom: 0.5rem;">👤 INFORMACIÓN DEL CLIENTE</h2>
        <p><strong>Nombre:</strong> {{customer_name}}</p>
        <p><strong>Email:</strong> {{customer_email}}</p>
        <p><strong>Teléfono:</strong> {{customer_phone}}</p>
        
        <h2 style="color: #E91E63; border-bottom: 2px solid #E91E63; padding-bottom: 0.5rem;">🎪 DETALLES DEL EVENTO</h2>
        <p><strong>Fecha:</strong> {{event_date}}</p>
        <p><strong>Hora Inicio:</strong> {{event_start_time}}</p>
        <p><strong>Hora Término:</strong> {{event_end_time}}</p>
        <p><strong>Ubicación:</strong> {{event_location}}</p>
        <p><strong>Servicio:</strong> {{event_service}}</p>
        <p><strong>Decoración:</strong> {{event_decoration}}</p>
        
        <h2 style="color: #E91E63; border-bottom: 2px solid #E91E63; padding-bottom: 0.5rem;">💬 MENSAJE ADICIONAL</h2>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #E91E63;">
            {{additional_message}}
        </div>
        
        <h2 style="color: #E91E63; border-bottom: 2px solid #E91E63; padding-bottom: 0.5rem;">🛒 PRODUCTOS ADICIONALES</h2>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">{{cart_items}}</pre>
        </div>
        
        <div style="background: linear-gradient(135deg, #FFF3CD, #FCF4A3); border: 2px solid #FFC107; border-radius: 12px; padding: 1.5rem; margin: 2rem 0;">
            <h3 style="color: #856404; margin-top: 0;">📧 EMAILS PREPARADOS</h3>
            <p style="color: #856404; margin: 0;">Los emails para el cliente y administrador están listos en los campos de abajo:</p>
        </div>
        
        <details style="margin: 1rem 0; border: 1px solid #ddd; border-radius: 8px;">
            <summary style="background: #E91E63; color: white; padding: 1rem; cursor: pointer; border-radius: 8px 8px 0 0;">📧 Email para Administrador</summary>
            <div style="padding: 1rem; background: #f8f9fa;">
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 0.9rem;">{{email_content_admin}}</pre>
            </div>
        </details>
        
        <details style="margin: 1rem 0; border: 1px solid #ddd; border-radius: 8px;">
            <summary style="background: #27ae60; color: white; padding: 1rem; cursor: pointer; border-radius: 8px 8px 0 0;">📧 Email para Cliente</summary>
            <div style="padding: 1rem; background: #f8f9fa;">
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 0.9rem;">{{email_content_customer}}</pre>
            </div>
        </details>
        
        <div style="background: linear-gradient(135deg, #E91E63, #FF6B9D); color: white; padding: 1.5rem; border-radius: 12px; text-align: center; margin-top: 2rem;">
            <h3 style="margin: 0 0 1rem 0;">🎯 ACCIONES REQUERIDAS</h3>
            <ol style="text-align: left; margin: 0; padding-left: 1.5rem;">
                <li>Contactar cliente en máximo 2 horas</li>
                <li>Verificar disponibilidad de fecha</li>
                <li>Preparar cotización detallada</li>
                <li>Enviar email de confirmación al cliente</li>
            </ol>
        </div>
        
    </div>
    
    <div style="background: #f8f9fa; padding: 1rem; text-align: center; color: #666; font-size: 0.9rem;">
        <p>ALMA Kids Entretenciones Infantiles Ltda.</p>
        <p>Sistema Automático de Cotizaciones</p>
    </div>
    
</body>
</html>
```

### **3. Configurar Email Automático para Cliente**

#### **Crear Segunda Notificación:**
1. Agrega otra notificación email
2. Configura:
```
Email to notify: {{customer_email}}
Subject: 🎪 Confirmación de Cotización - ALMA Kids
```

#### **Template para Cliente:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmación ALMA Kids</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    
    <div style="background: linear-gradient(135deg, #E91E63, #FF6B9D); padding: 2rem; text-align: center; color: white;">
        <h1>🎪 ¡Gracias por elegir ALMA Kids!</h1>
        <p>Hola {{customer_name}}</p>
    </div>
    
    <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        
        <div style="background: linear-gradient(135deg, #D4EDDA, #C3E6CB); border: 2px solid #27ae60; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <h2 style="color: #27ae60; margin-top: 0;">✅ Cotización Recibida</h2>
            <p style="margin: 0; color: #155724;">Hemos recibido tu solicitud y estamos procesando todos los detalles para hacer de tu evento algo extraordinario.</p>
        </div>
        
        <h2 style="color: #E91E63; border-bottom: 2px solid #E91E63; padding-bottom: 0.5rem;">📋 RESUMEN DE TU COTIZACIÓN</h2>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
            <p><strong>🆔 Número de Cotización:</strong> {{quote_id}}</p>
            <p><strong>📅 Fecha del Evento:</strong> {{event_date}}</p>
            <p><strong>⏰ Horario:</strong> {{event_start_time}} - {{event_end_time}}</p>
            <p><strong>📍 Ubicación:</strong> {{event_location}}</p>
            <p><strong>🎪 Servicio:</strong> {{event_service}}</p>
            <p><strong>🎨 Decoración:</strong> {{event_decoration}}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #FFF3CD, #FCF4A3); border: 2px solid #FFC107; border-radius: 12px; padding: 1.5rem; margin: 2rem 0;">
            <h3 style="color: #856404; margin-top: 0;">🌟 PRÓXIMOS PASOS</h3>
            <ol style="color: #856404; margin: 0; padding-left: 1.5rem;">
                <li>Nuestro equipo revisará todos los detalles</li>
                <li>Te contactaremos en las próximas 2-4 horas</li>
                <li>Coordinaremos una visita técnica si es necesario</li>
                <li>Te enviaremos la cotización detallada</li>
            </ol>
        </div>
        
        <div style="background: #E91E63; color: white; border-radius: 12px; padding: 1.5rem; text-align: center;">
            <h3 style="margin: 0 0 1rem 0;">📞 CONTACTO DIRECTO</h3>
            <p style="margin: 0.25rem 0;"><strong>WhatsApp:</strong> +56 9 6907 3306</p>
            <p style="margin: 0.25rem 0;"><strong>WhatsApp:</strong> +56 9 2060 9796</p>
            <p style="margin: 0.25rem 0;"><strong>Email:</strong> info.almakids@gmail.com</p>
        </div>
        
        <div style="text-align: center; margin: 2rem 0; color: #666;">
            <p>💡 <strong>TIP:</strong> Mantén este correo como referencia de tu cotización.</p>
        </div>
        
    </div>
    
    <div style="background: linear-gradient(135deg, #E91E63, #FF6B9D); color: white; padding: 2rem; text-align: center;">
        <h2 style="margin: 0 0 1rem 0;">¡Estamos emocionados de ser parte de tu celebración especial!</h2>
        <p style="margin: 0; font-size: 1.1rem;">Con cariño, El Equipo de ALMA Kids 🎈</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 1rem; text-align: center; color: #666; font-size: 0.9rem;">
        <p>ALMA Kids Entretenciones Infantiles Ltda.</p>
        <p>¡Donde los sueños se inflan y la diversión nunca termina! ✨</p>
    </div>
    
</body>
</html>
```

---

## 🚀 **RESULTADO FINAL**

### **✅ Lo que pasará:**
1. **Cliente llena formulario** → Se envía a Netlify Forms
2. **Netlify detecta envío** → Activa notificaciones automáticas
3. **Email a info.almakids@gmail.com** → Con toda la información de la cotización
4. **Email al cliente** → Confirmación profesional automática
5. **Datos guardados** → En panel de Netlify para seguimiento

### **📧 Emails Automáticos:**
- ✅ **Administrador recibe:** Cotización completa con todos los detalles
- ✅ **Cliente recibe:** Confirmación profesional con próximos pasos
- ✅ **Sin configuración adicional:** Todo automático una vez configurado en Netlify
- ✅ **Respaldo garantizado:** Datos guardados en Netlify Forms

### **🎯 Ventajas:**
- **Completamente automático** una vez configurado
- **Sin límites de envío** (incluido en Netlify)
- **Templates profesionales** con diseño ALMA Kids
- **Respaldo de datos** en panel de Netlify
- **Notificaciones instantáneas** tanto para admin como cliente

---

## 📝 **INSTRUCCIONES RÁPIDAS**

1. **Sube el sitio a Netlify**
2. **Ve a Settings > Forms**
3. **Configura 2 notificaciones email** (admin y cliente)
4. **Copia los templates de arriba**
5. **¡Listo! Los emails serán automáticos**

**¡El sistema está listo para funcionar una vez que configures las notificaciones en Netlify!** 🎪
