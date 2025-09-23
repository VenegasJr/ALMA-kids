# Plantillas de EmailJS para ALMA Kids

## Configuración Requerida

### 1. Crear cuenta en EmailJS
- Visitar: https://www.emailjs.com/
- Crear cuenta gratuita
- Obtener Public Key, Service ID y Template IDs

### 2. Configurar Servicio de Email
- Conectar con Gmail (info.almakids@gmail.com)
- Configurar SMTP si es necesario

## Plantilla 1: Confirmación para Cliente

**Template ID:** `customer_confirmation`

**Subject:** `🎪 ALMA Kids - Confirmación de Cotización Recibida`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(233, 30, 99, 0.1); }
        .header { background: linear-gradient(135deg, #E91E63, #FF6B9D); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .info-box { background: linear-gradient(135deg, #FFF0F5, #F0F8FF); padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 2px solid rgba(233, 30, 99, 0.1); }
        .footer { background: #2c3e50; color: white; padding: 1.5rem; text-align: center; }
        .highlight { color: #E91E63; font-weight: bold; }
        .emoji { font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🎪</span> ALMA Kids</h1>
            <h2>¡Cotización Recibida!</h2>
        </div>
        
        <div class="content">
            <p>¡Hola <strong>{{customer_name}}</strong>!</p>
            
            <p>¡Gracias por contactar a <span class="highlight">ALMA Kids Entretenciones Infantiles</span>! 
            Hemos recibido tu solicitud de cotización y queremos confirmarte que estamos procesando todos los detalles para hacer de tu evento algo extraordinario.</p>
            
            <div class="info-box">
                <h3><span class="emoji">📋</span> RESUMEN DE TU COTIZACIÓN:</h3>
                <p><strong><span class="emoji">🆔</span> Número:</strong> {{quote_id}}</p>
                <p><strong><span class="emoji">📅</span> Fecha del Evento:</strong> {{event_date}}</p>
                <p><strong><span class="emoji">⏰</span> Horario:</strong> {{event_time}}</p>
                <p><strong><span class="emoji">📍</span> Ubicación:</strong> {{event_location}}</p>
                <p><strong><span class="emoji">🎪</span> Servicio:</strong> {{event_service}}</p>
                <p><strong><span class="emoji">🎨</span> Decoración:</strong> {{event_decoration}}</p>
                <p><strong><span class="emoji">🛒</span> Productos Adicionales:</strong> {{total_products}} items</p>
                <p><strong><span class="emoji">💰</span> Valor Estimado:</strong> {{estimated_value}}</p>
            </div>
            
            <div class="info-box">
                <h3><span class="emoji">🌟</span> PRÓXIMOS PASOS:</h3>
                <ol>
                    <li>Nuestro equipo revisará todos los detalles</li>
                    <li>Te contactaremos en las próximas 2-4 horas</li>
                    <li>Coordinaremos una visita técnica si es necesario</li>
                    <li>Te enviaremos la cotización detallada</li>
                </ol>
            </div>
            
            <div class="info-box">
                <h3><span class="emoji">📞</span> CONTACTO DIRECTO:</h3>
                <p><strong>WhatsApp:</strong> +56 9 6907 3306</p>
                <p><strong>WhatsApp:</strong> +56 9 2060 9796</p>
                <p><strong>Email:</strong> info.almakids@gmail.com</p>
            </div>
            
            <p><span class="emoji">💡</span> <strong>TIP:</strong> Mantén este correo como referencia de tu cotización.</p>
            
            <p>¡Estamos emocionados de ser parte de tu celebración especial!</p>
            
            <p>Con cariño,<br>
            <strong>El Equipo de ALMA Kids</strong> <span class="emoji">🎈</span></p>
        </div>
        
        <div class="footer">
            <p><strong>ALMA Kids Entretenciones Infantiles Ltda.</strong></p>
            <p>Creando recuerdos mágicos para nuestros pequeños ✨</p>
            <p>Recibido: {{submission_date}}</p>
        </div>
    </div>
</body>
</html>
```

## Plantilla 2: Notificación Interna

**Template ID:** `internal_template`

**Subject:** `📋 Nueva Cotización Recibida - ALMA Kids`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .section { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border-left: 4px solid #E91E63; }
        .alert { background: #FFF3CD; border: 1px solid #E91E63; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        .actions { background: #D4EDDA; padding: 1.5rem; border-radius: 12px; margin: 1rem 0; }
        .highlight { color: #E91E63; font-weight: bold; }
        .urgent { background: #F8D7DA; border-color: #dc3545; }
        .emoji { font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🚨</span> NUEVA COTIZACIÓN RECIBIDA</h1>
            <p>ID: <strong>{{quote_id}}</strong></p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3><span class="emoji">📋</span> INFORMACIÓN DEL CLIENTE:</h3>
                <p><strong><span class="emoji">👤</span> Nombre:</strong> {{customer_name}}</p>
                <p><strong><span class="emoji">📧</span> Email:</strong> {{customer_email}}</p>
                <p><strong><span class="emoji">📱</span> Teléfono:</strong> {{customer_phone}}</p>
            </div>
            
            <div class="section">
                <h3><span class="emoji">🎪</span> DETALLES DEL EVENTO:</h3>
                <p><strong><span class="emoji">📅</span> Fecha:</strong> {{event_date}}</p>
                <p><strong><span class="emoji">⏰</span> Inicio:</strong> {{event_start_time}}</p>
                <p><strong><span class="emoji">⏰</span> Término:</strong> {{event_end_time}}</p>
                <p><strong><span class="emoji">📍</span> Ubicación:</strong> {{event_location}}</p>
                <p><strong><span class="emoji">🎪</span> Servicio:</strong> {{event_service}}</p>
                <p><strong><span class="emoji">🎨</span> Decoración:</strong> {{event_decoration}}</p>
            </div>
            
            <div class="section">
                <h3><span class="emoji">💬</span> MENSAJE ADICIONAL:</h3>
                <p style="background: white; padding: 1rem; border-radius: 8px; font-style: italic;">
                    {{additional_message}}
                </p>
            </div>
            
            <div class="section">
                <h3><span class="emoji">🛒</span> CARRITO DE COMPRAS:</h3>
                <pre style="background: white; padding: 1rem; border-radius: 8px; white-space: pre-wrap;">{{cart_items}}</pre>
                <p><strong><span class="emoji">📊</span> Total Productos:</strong> {{total_products}}</p>
                <p><strong><span class="emoji">💰</span> Valor Estimado:</strong> {{estimated_value}}</p>
            </div>
            
            {{#if has_conflicts}}
            <div class="alert urgent">
                <h3><span class="emoji">⚠️</span> ALERTAS IMPORTANTES:</h3>
                <p><strong>Conflictos de Fecha:</strong> {{has_conflicts}}</p>
                <p><strong>Cantidad de Conflictos:</strong> {{conflicts_count}}</p>
                <p><em>Revisar disponibilidad inmediatamente</em></p>
            </div>
            {{/if}}
            
            <div class="actions">
                <h3><span class="emoji">🎯</span> ACCIONES REQUERIDAS:</h3>
                <ol>
                    <li><strong>Contactar cliente en máximo 2 horas</strong></li>
                    <li>Verificar disponibilidad de fecha</li>
                    <li>Preparar cotización detallada</li>
                    <li>Coordinar visita técnica si es necesario</li>
                </ol>
            </div>
            
            <div class="section">
                <p><strong><span class="emoji">📅</span> Recibido:</strong> {{submission_date}}</p>
                <p><em>Sistema Automático ALMA Kids</em></p>
            </div>
        </div>
    </div>
</body>
</html>
```

## Variables Disponibles

### Para ambas plantillas:
- `{{customer_name}}` - Nombre del cliente
- `{{customer_email}}` - Email del cliente
- `{{customer_phone}}` - Teléfono del cliente
- `{{quote_id}}` - ID único de la cotización
- `{{event_date}}` - Fecha del evento (formateada)
- `{{event_start_time}}` - Hora de inicio
- `{{event_end_time}}` - Hora de término
- `{{event_location}}` - Ubicación del evento
- `{{event_service}}` - Tipo de servicio
- `{{event_decoration}}` - Tipo de decoración
- `{{additional_message}}` - Mensaje adicional del cliente
- `{{cart_items}}` - Detalles del carrito (texto)
- `{{total_products}}` - Cantidad de productos
- `{{estimated_value}}` - Valor estimado (formateado)
- `{{submission_date}}` - Fecha y hora de envío
- `{{has_conflicts}}` - Si hay conflictos de fecha
- `{{conflicts_count}}` - Cantidad de conflictos

## Configuración en el código

Reemplazar en `email-system.js`:
```javascript
// Línea 27: Reemplazar con tu Public Key de EmailJS
emailjs.init("TU_PUBLIC_KEY_AQUI");

// Líneas en sendCustomerConfirmation y sendInternalNotification:
return await emailjs.send('TU_SERVICE_ID', 'customer_confirmation', templateParams);
return await emailjs.send('TU_SERVICE_ID', 'internal_template', templateParams);
```

## Pasos para Implementar

1. **Crear cuenta en EmailJS**
2. **Conectar servicio de email (Gmail)**
3. **Crear las dos plantillas con los HTML proporcionados**
4. **Obtener Public Key y Service ID**
5. **Actualizar el código JavaScript con las credenciales**
6. **Probar el sistema**

## Notas Importantes

- El servicio gratuito de EmailJS permite 200 emails/mes
- Para mayor volumen, considerar plan pagado
- Siempre probar en entorno de desarrollo primero
- Verificar que los correos no lleguen a spam


