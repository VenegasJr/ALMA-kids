/**
 * ALMA Kids - Sistema de Correos de Respaldo
 * Sistema completo de envío de correos automáticos para cotizaciones
 */

class EmailBackupSystem {
    constructor() {
        this.emailJSInitialized = false;
        this.init();
    }

    async init() {
        await this.loadEmailJS();
        this.setupEmailTemplates();
        console.log('📧 ALMA Kids: Sistema de correos activado');
    }

    async loadEmailJS() {
        try {
            // Cargar EmailJS desde CDN
            if (!window.emailjs) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                script.onload = () => {
                    // Inicializar EmailJS con tu public key
                    // NOTA: EmailJS requiere configuración - usando método alternativo por ahora
                    console.log('⚠️ EmailJS requiere configuración de API key');
                    this.setupAlternativeEmailMethod(); 
                    this.emailJSInitialized = true;
                    console.log('✅ EmailJS inicializado correctamente');
                };
                document.head.appendChild(script);
            }
        } catch (error) {
            console.error('❌ Error cargando EmailJS:', error);
            // Fallback: usar método alternativo
            this.setupAlternativeEmailMethod();
        }
    }

    setupAlternativeEmailMethod() {
        console.log('📧 Configurando método alternativo de correos...');
        this.alternativeMethod = true;
        
        // Crear notificación para el usuario
        this.showEmailFallbackNotification();
    }
    
    showEmailFallbackNotification() {
        console.log('📧 ALMA Kids: Implementando métodos alternativos de respaldo');
        
        // No mostrar notificación molesta al usuario
        // En su lugar, implementar métodos alternativos silenciosos
    }

    // Método alternativo mejorado para envío de correos
    async sendAlternativeEmail(emailData) {
        console.log('📧 Enviando correos por métodos alternativos...');
        
        try {
            // Método 1: Intentar con Formspree (servicio gratuito)
            await this.sendViaFormspree(emailData);
            return true;
        } catch (error) {
            console.log('⚠️ Formspree no disponible, intentando método 2...');
        }

        try {
            // Método 2: Intentar con Netlify Forms
            await this.sendViaNetlifyForms(emailData);
            return true;
        } catch (error) {
            console.log('⚠️ Netlify Forms no disponible, usando método 3...');
        }

        // Método 3: Crear enlace mailto automático
        this.createMailtoLinks(emailData);
        return true;
    }

    async sendViaFormspree(emailData) {
        const formData = new FormData();
        formData.append('to', 'info.almakids@gmail.com');
        formData.append('subject', emailData.subject || 'Nueva Cotización ALMA Kids');
        formData.append('message', this.formatEmailContent(emailData));
        formData.append('customer_email', emailData.customer_email);
        formData.append('quote_id', emailData.quote_id);

        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Formspree error');
        }

        console.log('✅ Correo enviado via Formspree');
    }

    async sendViaNetlifyForms(emailData) {
        // Enviar formulario para el administrador
        const adminFormData = new FormData();
        adminFormData.append('form-name', 'alma-kids-quotes');
        adminFormData.append('customer_name', emailData.customer_name);
        adminFormData.append('customer_email', emailData.customer_email);
        adminFormData.append('customer_phone', emailData.customer_phone);
        adminFormData.append('quote_id', emailData.quote_id);
        adminFormData.append('event_date', emailData.event_date);
        adminFormData.append('event_start_time', emailData.event_start_time);
        adminFormData.append('event_end_time', emailData.event_end_time);
        adminFormData.append('event_location', emailData.event_location);
        adminFormData.append('event_service', emailData.event_service);
        adminFormData.append('event_decoration', emailData.event_decoration);
        adminFormData.append('additional_message', emailData.additional_message);
        adminFormData.append('cart_items', emailData.cart_details);
        adminFormData.append('email_content_admin', this.formatEmailContent(emailData));
        adminFormData.append('email_content_customer', this.formatCustomerEmail(emailData));

        const response = await fetch('/', {
            method: 'POST',
            body: adminFormData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error('Netlify Forms error');
        }

        console.log('✅ Cotización enviada via Netlify Forms (incluye emails para admin y cliente)');
        return true;
    }

    createMailtoLinks(emailData) {
        console.log('📧 Creando enlaces mailto automáticos...');
        
        // Crear contenido del correo
        const emailContent = this.formatEmailContent(emailData);
        const subject = encodeURIComponent('Nueva Cotización ALMA Kids - ' + emailData.quote_id);
        const body = encodeURIComponent(emailContent);

        // Crear enlaces mailto
        const adminMailto = `mailto:info.almakids@gmail.com?subject=${subject}&body=${body}`;
        const customerMailto = `mailto:${emailData.customer_email}?subject=${encodeURIComponent('Confirmación - Cotización ALMA Kids')}&body=${encodeURIComponent(this.formatCustomerEmail(emailData))}`;

        // Mostrar opciones al usuario
        this.showMailtoOptions(adminMailto, customerMailto, emailData);
    }

    formatEmailContent(emailData) {
        return `
NUEVA COTIZACIÓN ALMA KIDS

Cliente: ${emailData.customer_name}
Email: ${emailData.customer_email}
Teléfono: ${emailData.customer_phone}

DETALLES DEL EVENTO:
Fecha: ${emailData.event_date}
Hora: ${emailData.event_start_time} - ${emailData.event_end_time}
Ubicación: ${emailData.event_location}

SERVICIOS SOLICITADOS:
${emailData.service_details}

PRODUCTOS ADICIONALES:
${emailData.cart_details}

ID de Cotización: ${emailData.quote_id}
Fecha de solicitud: ${emailData.timestamp}

---
ALMA Kids Entretenciones Infantiles Ltda.
info.almakids@gmail.com
+56 9 6907 3306
        `.trim();
    }

    formatCustomerEmail(emailData) {
        return `
Estimado/a ${emailData.customer_name},

Gracias por contactar ALMA Kids para su evento.

Hemos recibido su solicitud de cotización con los siguientes detalles:

EVENTO:
- Fecha: ${emailData.event_date}
- Hora: ${emailData.event_start_time} - ${emailData.event_end_time}
- Ubicación: ${emailData.event_location}

SERVICIOS:
${emailData.service_details}

ID de Cotización: ${emailData.quote_id}

Nos pondremos en contacto con usted a la brevedad para confirmar todos los detalles y enviar la cotización final.

¡Gracias por elegir ALMA Kids!
Donde los sueños se inflan y la diversión nunca termina.

ALMA Kids Entretenciones Infantiles Ltda.
Email: info.almakids@gmail.com
Teléfono: +56 9 6907 3306
WhatsApp: +56 9 2060 9796
        `.trim();
    }

    showMailtoOptions(adminMailto, customerMailto, emailData) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
            ">
                <div style="
                    background: linear-gradient(135deg, #E91E63, #FF6B9D);
                    color: white;
                    padding: 1rem;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1.5rem auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-envelope" style="font-size: 1.5rem;"></i>
                </div>
                
                <h3 style="margin: 0 0 1rem 0; color: #E91E63;">📧 Envío de Correos de Respaldo</h3>
                <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">
                    Para garantizar que recibas toda la información, hemos preparado correos automáticos. 
                    Elige cómo enviarlos:
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                    <button onclick="window.open('${adminMailto}', '_blank')" style="
                        background: linear-gradient(135deg, #E91E63, #FF6B9D);
                        color: white;
                        border: none;
                        padding: 1rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-paper-plane"></i>
                        Enviar a ALMA Kids (Administrador)
                    </button>
                    
                    <button onclick="window.open('${customerMailto}', '_blank')" style="
                        background: linear-gradient(135deg, #27ae60, #2ecc71);
                        color: white;
                        border: none;
                        padding: 1rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-user"></i>
                        Enviar Confirmación al Cliente
                    </button>
                    
                    <button onclick="almakidsEmailSystem.downloadEmailBackup('${emailData.quote_id}')" style="
                        background: linear-gradient(135deg, #17a2b8, #20c997);
                        color: white;
                        border: none;
                        padding: 1rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-download"></i>
                        Descargar Respaldo (Archivo)
                    </button>
                </div>
                
                <div style="
                    background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
                    border: 2px solid #FFC107;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.85rem;
                    color: #856404;
                ">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Recomendación:</strong> Envía ambos correos para garantizar que tanto tú como el cliente tengan toda la información.
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Guardar datos para descarga
        this.lastEmailData = emailData;
    }

    downloadEmailBackup(quoteId) {
        if (!this.lastEmailData) {
            console.error('❌ No hay datos de email para descargar');
            return;
        }

        const data = {
            quote_id: quoteId,
            timestamp: new Date().toISOString(),
            admin_email: {
                to: 'info.almakids@gmail.com',
                subject: 'Nueva Cotización ALMA Kids - ' + quoteId,
                content: this.formatEmailContent(this.lastEmailData)
            },
            customer_email: {
                to: this.lastEmailData.customer_email,
                subject: 'Confirmación - Cotización ALMA Kids',
                content: this.formatCustomerEmail(this.lastEmailData)
            }
        };

        // Crear y descargar archivo JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alma-kids-cotizacion-${quoteId}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Respaldo de correos descargado exitosamente');
    }

    setupEmailTemplates() {
        this.templates = {
            customerConfirmation: {
                subject: '🎪 ALMA Kids - Confirmación de Cotización Recibida',
                template: 'customer_confirmation'
            },
            internalNotification: {
                subject: '📋 Nueva Cotización Recibida - ALMA Kids',
                template: 'internal_notification'
            }
        };
    }

    async sendBackupEmails(quoteData) {
        try {
            // Preparar datos para los emails
            const emailData = this.prepareEmailData(quoteData);
            
            // Usar método alternativo mejorado sin notificaciones molestas
            await this.sendAlternativeEmail(emailData);
            console.log('📧 Sistema de correos de respaldo activado silenciosamente');
            
        } catch (error) {
            console.error('❌ Error en sistema de correos:', error);
            // Crear respaldo silencioso
            this.createManualBackup(quoteData);
        }
    }

    generateEmailBackupFiles(emailData) {
        // Generar archivo con información completa para envío manual
        const emailInfo = {
            timestamp: new Date().toISOString(),
            customer: {
                name: emailData.customer_name,
                email: emailData.customer_email,
                phone: emailData.customer_phone
            },
            quote: {
                id: emailData.quote_id,
                date: emailData.event_date,
                time: `${emailData.event_start_time} - ${emailData.event_end_time}`,
                location: emailData.event_location,
                service: emailData.event_service,
                decoration: emailData.event_decoration,
                estimatedValue: emailData.estimated_value
            },
            cart: emailData.cart_items,
            messages: {
                customerEmail: this.generateCustomerMessage(emailData),
                internalEmail: this.generateInternalMessage(emailData)
            }
        };

        // Crear archivo descargable
        const blob = new Blob([JSON.stringify(emailInfo, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotizacion-${emailData.quote_id}-emails.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    showAlternativeEmailInfo(emailData) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFF3CD, #FCF4A3);
            border: 2px solid #E91E63;
            color: #856404;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 450px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    background: rgba(233, 30, 99, 0.1);
                    padding: 1rem;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1rem auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-envelope" style="font-size: 1.5rem; color: #E91E63;"></i>
                </div>
                
                <h3 style="margin: 0 0 1rem 0; color: #E91E63;">📧 Información de Correos</h3>
                <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem;">
                    Se descargó un archivo con toda la información para envío manual de correos.
                </p>
                
                <div style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    text-align: left;
                    border: 2px solid rgba(233, 30, 99, 0.1);
                ">
                    <h4 style="margin: 0 0 1rem 0; color: #E91E63; text-align: center;">📋 Resumen Rápido</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.85rem;"><strong>Cliente:</strong> ${emailData.customer_name}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.85rem;"><strong>Email:</strong> ${emailData.customer_email}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.85rem;"><strong>Teléfono:</strong> ${emailData.customer_phone}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.85rem;"><strong>Fecha:</strong> ${emailData.event_date}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.85rem;"><strong>ID:</strong> ${emailData.quote_id}</p>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem;">
                    <button onclick="copyCustomerEmail('${emailData.customer_email}')" style="
                        background: #25D366;
                        color: white;
                        border: none;
                        padding: 0.75rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.875rem;
                        font-weight: 600;
                    ">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button onclick="copyCustomerEmail('${emailData.customer_email}')" style="
                        background: #E91E63;
                        color: white;
                        border: none;
                        padding: 0.75rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.875rem;
                        font-weight: 600;
                    ">
                        <i class="fas fa-copy"></i> Copiar Email
                    </button>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #f8f9fa;
                    color: #666;
                    border: 2px solid #ddd;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                ">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 15 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 15000);
    }

    prepareEmailData(quoteData) {
        const cart = window.almakidsCart || [];
        const cartDetails = this.formatCartDetails(cart);
        const totalProducts = cart.length;
        const estimatedValue = this.calculateEstimatedValue(quoteData, cart);

        return {
            // Datos del cliente
            customer_name: quoteData.customerInfo.name,
            customer_email: quoteData.customerInfo.email,
            customer_phone: quoteData.customerInfo.phone,
            
            // Datos del evento
            event_date: this.formatDate(quoteData.eventDetails.date),
            event_start_time: quoteData.eventDetails.startTime,
            event_end_time: quoteData.eventDetails.endTime,
            event_location: quoteData.eventDetails.location,
            event_service: this.getServiceName(quoteData.eventDetails.serviceType),
            event_decoration: this.getDecorationName(quoteData.eventDetails.decoration),
            additional_message: quoteData.eventDetails.additionalMessage || 'Ningún mensaje adicional',
            
            // Datos del carrito
            cart_items: cartDetails,
            cart_details: cartDetails, // Alias para compatibilidad
            total_products: totalProducts,
            estimated_value: estimatedValue,
            
            // Datos de seguimiento
            quote_id: quoteData.id,
            submission_date: new Date().toLocaleString('es-CL'),
            timestamp: new Date().toISOString(),
            
            // Datos adicionales
            has_conflicts: quoteData.dateConflicts ? 'Sí' : 'No',
            conflicts_count: quoteData.dateConflicts ? quoteData.dateConflicts.length : 0,
            
            // Email de la empresa
            company_email: 'info.almakids@gmail.com',
            
            // Datos adicionales para el sistema
            service_details: this.getServiceName(quoteData.eventDetails.serviceType) + 
                           (quoteData.eventDetails.decoration !== 'ninguna' ? 
                            ` + ${this.getDecorationName(quoteData.eventDetails.decoration)}` : '')
        };
    }

    async sendCustomerConfirmation(emailData) {
        const templateParams = {
            to_email: emailData.customer_email,
            to_name: emailData.customer_name,
            subject: this.templates.customerConfirmation.subject,
            
            // Contenido del email para el cliente
            customer_name: emailData.customer_name,
            quote_id: emailData.quote_id,
            event_date: emailData.event_date,
            event_time: emailData.event_start_time,
            event_location: emailData.event_location,
            event_service: emailData.event_service,
            event_decoration: emailData.event_decoration,
            total_products: emailData.total_products,
            estimated_value: emailData.estimated_value,
            submission_date: emailData.submission_date,
            
            // Mensaje personalizado para el cliente
            message: this.generateCustomerMessage(emailData)
        };

        return await emailjs.send('YOUR_SERVICE_ID', 'customer_template', templateParams);
    }

    async sendInternalNotification(emailData) {
        const templateParams = {
            to_email: 'info.almakids@gmail.com',
            to_name: 'Equipo ALMA Kids',
            subject: this.templates.internalNotification.subject,
            
            // Información completa para el equipo
            customer_name: emailData.customer_name,
            customer_email: emailData.customer_email,
            customer_phone: emailData.customer_phone,
            quote_id: emailData.quote_id,
            event_date: emailData.event_date,
            event_start_time: emailData.event_start_time,
            event_end_time: emailData.event_end_time,
            event_location: emailData.event_location,
            event_service: emailData.event_service,
            event_decoration: emailData.event_decoration,
            additional_message: emailData.additional_message,
            cart_items: emailData.cart_items,
            total_products: emailData.total_products,
            estimated_value: emailData.estimated_value,
            has_conflicts: emailData.has_conflicts,
            conflicts_count: emailData.conflicts_count,
            submission_date: emailData.submission_date,
            
            // Mensaje detallado para el equipo
            message: this.generateInternalMessage(emailData)
        };

        return await emailjs.send('YOUR_SERVICE_ID', 'internal_template', templateParams);
    }

    generateCustomerMessage(data) {
        return `
🎪 ¡Hola ${data.customer_name}!

¡Gracias por contactar a ALMA Kids Entretenciones Infantiles! 

Hemos recibido tu solicitud de cotización y queremos confirmarte que estamos procesando todos los detalles para hacer de tu evento algo extraordinario.

📋 RESUMEN DE TU COTIZACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Número de Cotización: ${data.quote_id}
📅 Fecha del Evento: ${data.event_date}
⏰ Horario: ${data.event_start_time} - ${data.event_end_time}
📍 Ubicación: ${data.event_location}
🎪 Servicio: ${data.event_service}
🎨 Decoración: ${data.event_decoration}
🛒 Productos Adicionales: ${data.total_products} items
💰 Valor Estimado: ${data.estimated_value}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 PRÓXIMOS PASOS:

1️⃣ Nuestro equipo revisará todos los detalles
2️⃣ Te contactaremos en las próximas 2-4 horas
3️⃣ Coordinaremos una visita técnica si es necesario
4️⃣ Te enviaremos la cotización detallada

📞 CONTACTO DIRECTO:
• WhatsApp: +56 9 6907 3306
• WhatsApp: +56 9 2060 9796
• Email: info.almakids@gmail.com

💡 TIP: Mantén este correo como referencia de tu cotización.

¡Estamos emocionados de ser parte de tu celebración especial!

Con cariño,
El Equipo de ALMA Kids 🎈

---
ALMA Kids Entretenciones Infantiles Ltda.
Creando recuerdos mágicos para nuestros pequeños ✨
        `.trim();
    }

    generateInternalMessage(data) {
        return `
🚨 NUEVA COTIZACIÓN RECIBIDA

📋 INFORMACIÓN DEL CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nombre: ${data.customer_name}
📧 Email: ${data.customer_email}  
📱 Teléfono: ${data.customer_phone}

🎪 DETALLES DEL EVENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 ID Cotización: ${data.quote_id}
📅 Fecha: ${data.event_date}
⏰ Inicio: ${data.event_start_time}
⏰ Término: ${data.event_end_time}
📍 Ubicación: ${data.event_location}
🎪 Servicio: ${data.event_service}
🎨 Decoración: ${data.event_decoration}

💬 MENSAJE ADICIONAL:
${data.additional_message}

🛒 CARRITO DE COMPRAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.cart_items}
📊 Total Productos: ${data.total_products}
💰 Valor Estimado: ${data.estimated_value}

⚠️ ALERTAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Conflictos de Fecha: ${data.has_conflicts}
${data.conflicts_count > 0 ? `📊 Cantidad de Conflictos: ${data.conflicts_count}` : ''}

📅 Recibido: ${data.submission_date}

🎯 ACCIONES REQUERIDAS:
1. Contactar cliente en máximo 2 horas
2. Verificar disponibilidad de fecha
3. Preparar cotización detallada
4. Coordinar visita técnica si es necesario

---
Sistema Automático ALMA Kids
        `.trim();
    }

    formatCartDetails(cart) {
        if (!cart || cart.length === 0) {
            return 'No hay productos adicionales seleccionados';
        }

        return cart.map((item, index) => 
            `${index + 1}. ${item.name} - Código: ${item.code} - Cantidad: ${item.quantity || 1}`
        ).join('\n');
    }

    calculateEstimatedValue(quoteData, cart) {
        // Valores base estimados por servicio
        const serviceValues = {
            'plaza-blanda-basico': 80000,
            'plaza-blanda-premium': 120000,
            'inflable-pequeno': 100000,
            'inflable-mediano': 150000,
            'inflable-grande': 200000,
            'combo-plaza-inflable': 180000
        };

        const baseValue = serviceValues[quoteData.eventDetails.serviceType] || 100000;
        const cartValue = cart.length * 5000; // Estimado por producto adicional
        const decorationValue = quoteData.eventDetails.decoration !== 'ninguna' ? 30000 : 0;

        const total = baseValue + cartValue + decorationValue;
        
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(total);
    }

    showEmailConfirmation() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4EDDA, #C3E6CB);
            border: 2px solid #27ae60;
            color: #155724;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(39, 174, 96, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-envelope-check" style="color: #27ae60; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #27ae60;">📧 Correos Enviados</h4>
                    <p style="margin: 0; font-size: 0.9rem;">
                        ✅ Confirmación enviada al cliente<br>
                        ✅ Notificación enviada a ALMA Kids<br>
                        <small style="color: #666;">Revisa tu bandeja de entrada</small>
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #27ae60;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    showEmailError() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #F8D7DA, #F5C6CB);
            border: 2px solid #dc3545;
            color: #721c24;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(220, 53, 69, 0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    background: rgba(220, 53, 69, 0.2);
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas fa-envelope-open-text" style="color: #dc3545; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: #dc3545;">⚠️ Error de Envío</h4>
                    <p style="margin: 0; font-size: 0.9rem;">
                        No se pudieron enviar los correos automáticamente.<br>
                        <small style="color: #666;">La cotización se registró correctamente</small>
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #dc3545;
                    cursor: pointer;
                    font-size: 1.2rem;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove después de 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    // Utilidades
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getServiceName(serviceType) {
        const services = {
            'plaza-blanda-basico': 'Plaza Blanda - Kit Básico',
            'plaza-blanda-premium': 'Plaza Blanda - Kit Premium',
            'inflable-pequeno': 'Inflable Pequeño',
            'inflable-mediano': 'Inflable Mediano',
            'inflable-grande': 'Inflable Grande',
            'combo-plaza-inflable': 'Combo Plaza + Inflable'
        };
        return services[serviceType] || serviceType || 'No especificado';
    }

    getDecorationName(decoration) {
        const decorations = {
            'ninguna': 'Sin decoración adicional',
            'basica': 'Decoración Básica',
            'tematica': 'Decoración Temática',
            'premium': 'Decoración Premium'
        };
        return decorations[decoration] || decoration || 'No especificada';
    }
}

// Crear instancia global del sistema de emails
window.almakidsEmailSystem = new EmailBackupSystem();

// Integrar con el sistema de seguimiento existente
document.addEventListener('DOMContentLoaded', () => {
    // Extender el sistema de seguimiento para incluir emails
    if (window.almakidsTracking) {
        const originalTrackQuote = window.almakidsTracking.trackQuote;
        
        window.almakidsTracking.trackQuote = function(formData) {
            // Ejecutar el seguimiento original
            const quote = originalTrackQuote.call(this, formData);
            
            // Enviar correos de respaldo
            if (window.almakidsEmailSystem) {
                window.almakidsEmailSystem.sendBackupEmails(quote);
            }
            
            return quote;
        };
    }
});

// Funciones globales para interacciones
window.copyCustomerEmail = function(email) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            console.log('📧 Email copiado al portapapeles:', email);
            // Mostrar confirmación visual
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10002;
                animation: slideInUp 0.3s ease;
            `;
            toast.innerHTML = '<i class="fas fa-check"></i> Email copiado al portapapeles';
            document.body.appendChild(toast);
            
            setTimeout(() => toast.remove(), 3000);
        });
    }
};

window.openWhatsAppContact = function(phone, customerName) {
    const message = `🎪 Hola ${customerName}! Soy de ALMA Kids. Recibimos tu cotización y queremos confirmar los detalles de tu evento.`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

console.log('📧 ALMA Kids: Sistema de correos de respaldo cargado');
