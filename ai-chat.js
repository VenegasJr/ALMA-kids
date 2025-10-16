// Chat IA ALMA Kids - JavaScript
// ========================================

class ALChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatHTML() {
        // Crear contenedor del chat
        const chatContainer = document.createElement('div');
        chatContainer.id = 'ai-chat-container';
        chatContainer.className = 'ai-chat-container';
        chatContainer.innerHTML = `
            <div class="ai-chat-header">
                <h3>
                    <div class="ai-icon">🤖</div>
                    Asistente ALMA Kids
                </h3>
                <button class="ai-chat-close" onclick="aiChat.close()">×</button>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages">
                <!-- Mensajes aparecerán aquí -->
            </div>
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Escribe tu pregunta...">
                <button class="ai-chat-send" id="ai-chat-send" onclick="aiChat.sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        // Crear botón toggle
        const toggleButton = document.createElement('button');
        toggleButton.id = 'ai-chat-toggle';
        toggleButton.className = 'ai-chat-toggle';
        toggleButton.innerHTML = '💬';
        toggleButton.onclick = () => this.toggle();

        // Agregar al DOM
        document.body.appendChild(chatContainer);
        document.body.appendChild(toggleButton);
    }

    bindEvents() {
        const input = document.getElementById('ai-chat-input');
        const sendButton = document.getElementById('ai-chat-send');

        // Enviar mensaje con Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enviar mensaje con botón
        sendButton.addEventListener('click', () => this.sendMessage());
    }

    toggle() {
        const container = document.getElementById('ai-chat-container');
        const toggle = document.getElementById('ai-chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('active');
            toggle.innerHTML = '✕';
            document.getElementById('ai-chat-input').focus();
        } else {
            container.classList.remove('active');
            toggle.classList.remove('active');
            toggle.innerHTML = '💬';
        }
    }

    close() {
        this.isOpen = false;
        const container = document.getElementById('ai-chat-container');
        const toggle = document.getElementById('ai-chat-toggle');
        
        container.classList.remove('active');
        toggle.classList.remove('active');
        toggle.innerHTML = '💬';
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'ai',
            content: `¡Hola! 👋 Soy tu asistente de ALMA Kids Entretenciones Infantiles.

🎪 <strong>Puedo ayudarte con:</strong>
• 💰 Precios actualizados (Castillos $75.000, Piscina $55.000)
• 🎂 Recomendaciones para cumpleaños y Baby Showers
• 🏰 Información detallada de castillos inflables
• 🏊‍♀️ Piscina de pelotas y servicios adicionales
• 🎈 Globos metalizados (+200 diseños)
• 📅 Disponibilidad y reservas
• 📞 Contacto y cotizaciones

💡 <strong>Pregúntame sobre:</strong>
• "precios" - Ver todos los precios actualizados
• "cumpleaños" - Recomendaciones para fiestas
• "baby shower" - Servicios para Baby Showers
• "servicios" - Lista completa de servicios
• "contacto" - Datos de contacto

¿En qué puedo ayudarte hoy? 😊`,
            timestamp: new Date()
        };

        this.addMessage(welcomeMessage);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${message.type}`;
        
        const avatar = message.type === 'ai' ? '🤖' : '👤';
        const avatarClass = message.type === 'ai' ? 'ai' : 'user';
        
        messageElement.innerHTML = `
            <div class="ai-message-avatar ${avatarClass}">${avatar}</div>
            <div class="ai-message-content">${message.content}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingElement = document.createElement('div');
        typingElement.id = 'ai-typing-indicator';
        typingElement.className = 'ai-typing-indicator active';
        typingElement.innerHTML = `
            <div class="ai-message-avatar ai">🤖</div>
            <div class="ai-typing-dots">
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('ai-typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
        this.isTyping = false;
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Agregar mensaje del usuario
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        
        this.addMessage(userMessage);
        input.value = '';
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        // Simular respuesta de IA
        setTimeout(() => {
            this.hideTypingIndicator();
            const aiResponse = this.generateResponse(message);
            this.addMessage(aiResponse);
        }, 1000 + Math.random() * 2000); // 1-3 segundos
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Respuestas predefinidas basadas en palabras clave
        if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
            return {
                type: 'ai',
                content: `💰 <strong>Precios actualizados de ALMA Kids:</strong>

🏰 <strong>Castillos Inflables:</strong> $75.000 IVA incluido
   • Castillo Piscina Cuadrada
   • Castillo Inflable Portada  
   • Castillo Piscina Redonda

🏊‍♀️ <strong>Piscina de Pelotas:</strong> $55.000 IVA incluido
   • Piscina + Pelotas (celestes, rosadas, blancas, transparentes)

🎪 <strong>Servicios Adicionales:</strong>
   • Carpa Tipi: $15.000 IVA incluido
   • Inflable Saltarín Carestino: $15.000 IVA incluido
   • Máquina de Burbujas: $15.000 IVA incluido
   • Set Motricidad: $45.000 IVA incluido

🎈 <strong>Globos Metalizados:</strong> Desde $2.000
   • +200 diseños disponibles

💡 <strong>¡Combos con descuentos!</strong>
   • Set Básico (Castillo + Piscina): $100.000 (Ahorro: $50.000)
   • Set Medio: $130.000 (Ahorro: $90.000)
   • Set Premium Todo Incluido: $180.000 (Ahorro: $200.000)

💬 <strong>Cotización personalizada:</strong>
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20me%20interesa%20cotizar%20sus%20servicios" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 WhatsApp: +56 9 6907 3306
</a>`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('disponibilidad') || message.includes('fecha') || message.includes('cuando')) {
            return {
                type: 'ai',
                content: `📅 <strong>Disponibilidad:</strong>

✅ Disponemos de servicios todos los días
🕐 Horarios: 9:00 AM - 8:00 PM
📍 Cobertura: Machalí, Rancagua y alrededores

📞 <strong>Para reservar:</strong> +56 9 6907 3306
💬 <strong>WhatsApp:</strong> +56 9 6907 3306

¡Reserva con anticipación para asegurar tu fecha!`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('servicio') || message.includes('que ofrecen') || message.includes('que tienen')) {
            return {
                type: 'ai',
                content: `🎪 <strong>Servicios completos de ALMA Kids:</strong>

🏰 <strong>Castillos Inflables Profesionales:</strong>
   • Castillo Piscina Cuadrada (2-7 años, hasta 4 niños)
   • Castillo Inflable Portada (diseño elegante)
   • Castillo Piscina Redonda (piscina integrada)
   • Materiales: Vinilo reforzado, no tóxico
   • Incluye: transporte, montaje y desmontaje

🏊‍♀️ <strong>Piscina de Pelotas - Zona Segura:</strong>
   • Medidas: 150x150x40cm
   • Pelotas: celestes, rosadas, blancas, transparentes
   • Edades: 6 meses a 7 años
   • Materiales seguros y no tóxicos
   • Estimulación sensorial y desarrollo motor

🎪 <strong>Servicios Adicionales:</strong>
   • 🏕️ Carpa Tipi (160cm alto, materiales nobles)
   • 🎈 Inflable Saltarín Carestino (18 meses+, 20kg)
   • 🫧 Máquina de Burbujas (2000+ burbujas/min)
   • 🎯 Set de Motricidad
   • 🎨 Decoración Temática

🎈 <strong>Globos Metalizados:</strong>
   • +200 diseños únicos
   • Animales, princesas, superhéroes, temáticas
   • Tamaños variados (23x47cm hasta 107x31cm)
   • Perfectos para decoración de eventos

🛡️ <strong>Seguridad y Calidad:</strong>
   • Materiales certificados y no tóxicos
   • Supervisión profesional incluida
   • Limpieza y desinfección garantizada
   • Seguro de responsabilidad civil`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('contacto') || message.includes('telefono') || message.includes('whatsapp')) {
            return {
                type: 'ai',
                content: `📞 <strong>Contacto ALMA Kids:</strong>

📱 <strong>WhatsApp:</strong> +56 9 6907 3306
📞 <strong>Teléfono:</strong> +56 9 2060 9796
📧 <strong>Email:</strong> info.almakids@gmail.com
📷 <strong>Instagram:</strong> @alma.kidscl

📍 <strong>Ubicación:</strong> Machalí, Región de O'Higgins
🌐 <strong>Web:</strong> www.almakids.cl

¡Estamos aquí para ayudarte! 💬`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('edad') || message.includes('niños') || message.includes('bebes')) {
            return {
                type: 'ai',
                content: `👶 <strong>Edades recomendadas:</strong>

🏰 <strong>Castillo Inflable:</strong> 2 a 7 años
🏊‍♀️ <strong>Piscina de Pelotas:</strong> 6 meses a 7 años
🎈 <strong>Globos Metalizados:</strong> Todas las edades
🎪 <strong>Servicios Adicionales:</strong>
   • Carpa Tipi: Todas las edades
   • Inflable Saltarín: 18 meses a 5 años
   • Máquina de Burbujas: Todas las edades

🛡️ <strong>Supervisión:</strong> Siempre con adulto responsable`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('gracias') || message.includes('muchas gracias')) {
            return {
                type: 'ai',
                content: `¡De nada! 😊 

Es un placer ayudarte. Si tienes más preguntas, no dudes en consultarme.

¡Esperamos hacer de tu evento algo inolvidable! 🎉✨`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('hola') || message.includes('buenos dias') || message.includes('buenas tardes')) {
            return {
                type: 'ai',
                content: `¡Hola! 👋 ¡Bienvenido a ALMA Kids!

Estoy aquí para ayudarte con información sobre nuestros servicios de entretención infantil.

¿En qué puedo ayudarte hoy? Puedo informarte sobre:
• 🏰 Castillos inflables
• 🏊‍♀️ Piscinas de pelotas  
• 🎈 Globos metalizados
• 🎪 Servicios adicionales
• 💰 Precios y cotizaciones

¡Pregúntame lo que necesites! 😊`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('ubicacion') || message.includes('donde') || message.includes('machali') || message.includes('rancagua')) {
            return {
                type: 'ai',
                content: `📍 <strong>Nuestra ubicación:</strong>

🏠 <strong>ALMA Kids Entretenciones Infantiles</strong>
📍 <strong>Ciudad:</strong> Machalí, Región de O'Higgins
🚗 <strong>Cobertura:</strong> Machalí, Rancagua y alrededores

📞 <strong>Contacto:</strong>
💬 <a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20me%20interesa%20cotizar%20sus%20servicios" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">WhatsApp: +56 9 6907 3306</a>
📱 Teléfono: +56 9 2060 9796

¡Llevamos la diversión hasta tu hogar! 🎉`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('reserva') || message.includes('reservar') || message.includes('contratar')) {
            return {
                type: 'ai',
                content: `📅 <strong>¡Perfecto! Para reservar:</strong>

✅ <strong>Disponibilidad:</strong> Todos los días
🕐 <strong>Horarios:</strong> 9:00 AM - 8:00 PM
📍 <strong>Cobertura:</strong> Machalí, Rancagua y alrededores

💬 <strong>Reserva por WhatsApp:</strong>
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20quiero%20reservar%20sus%20servicios%20para%20mi%20evento" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Reservar ahora
</a>

📞 <strong>O llama:</strong> +56 9 6907 3306

¡Reserva con anticipación para asegurar tu fecha! 🎉`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('cumpleaños') || message.includes('cumpleanos') || message.includes('fiesta')) {
            return {
                type: 'ai',
                content: `🎂 <strong>¡Perfecto para cumpleaños!</strong>

🎪 <strong>Recomendaciones para cumpleaños:</strong>

👶 <strong>Para bebés (6 meses - 2 años):</strong>
   • Piscina de Pelotas (zona segura)
   • Carpa Tipi (rincón de calma)
   • Globos metalizados decorativos

🧒 <strong>Para niños (2-7 años):</strong>
   • Castillo Inflable (diversión garantizada)
   • Piscina de Pelotas
   • Inflable Saltarín Carestino
   • Máquina de Burbujas (magia extra)

🎨 <strong>Combos populares:</strong>
   • Set Básico: Castillo + Piscina ($100.000)
   • Set Premium: Todo incluido ($180.000)

💡 <strong>Tips para tu evento:</strong>
   • Reserva con 1 semana de anticipación
   • Incluye supervisión de adultos
   • Considera el espacio disponible
   • Combina con globos metalizados

💬 <strong>Cotiza tu cumpleaños:</strong>
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20quiero%20cotizar%20para%20un%20cumpleaños" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 WhatsApp: +56 9 6907 3306
</a>`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('baby shower') || message.includes('babyshower') || message.includes('baby')) {
            return {
                type: 'ai',
                content: `👶 <strong>¡Baby Shower perfecto con ALMA Kids!</strong>

🎪 <strong>Servicios ideales para Baby Shower:</strong>

🏕️ <strong>Carpa Tipi:</strong> Rincón especial para hermanitos mayores
🏊‍♀️ <strong>Piscina de Pelotas:</strong> Zona segura para niños pequeños
🫧 <strong>Máquina de Burbujas:</strong> Ambiente mágico para fotos
🎈 <strong>Globos Metalizados:</strong> Decoración temática perfecta

👶 <strong>Beneficios para Baby Shower:</strong>
   • Entretenimiento para hermanitos
   • Zona segura para niños
   • Fotos espectaculares con burbujas
   • Decoración temática completa
   • Supervisión profesional incluida

🎨 <strong>Diseños de globos para Baby Shower:</strong>
   • Animales bebé
   • Princesas y príncipes
   • Temáticas de cuentos
   • Colores pasteles

💡 <strong>Recomendación especial:</strong>
   • Carpa Tipi + Piscina de Pelotas + Máquina de Burbujas
   • Perfecto para hermanitos de 6 meses a 7 años

💬 <strong>Cotiza tu Baby Shower:</strong>
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20quiero%20cotizar%20para%20un%20Baby%20Shower" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 WhatsApp: +56 9 6907 3306
</a>`,
                timestamp: new Date()
            };
        }
        
        if (message.includes('evento') || message.includes('eventos') || message.includes('celebración')) {
            return {
                type: 'ai',
                content: `🎉 <strong>¡Eventos especiales con ALMA Kids!</strong>

🎪 <strong>Tipos de eventos que atendemos:</strong>

🎂 <strong>Cumpleaños:</strong> Fiestas temáticas inolvidables
👶 <strong>Baby Showers:</strong> Entretenimiento para hermanitos
🎓 <strong>Graduaciones:</strong> Celebración de logros académicos
🏠 <strong>Eventos familiares:</strong> Reuniones y celebraciones
🏢 <strong>Eventos corporativos:</strong> Actividades empresariales
🎪 <strong>Ferias y festivales:</strong> Eventos comunitarios

🎨 <strong>Servicios por tipo de evento:</strong>

👶 <strong>Eventos infantiles (0-7 años):</strong>
   • Piscina de Pelotas (zona segura)
   • Carpa Tipi (rincón de calma)
   • Inflable Saltarín Carestino
   • Globos metalizados decorativos

🧒 <strong>Eventos mixtos (todas las edades):</strong>
   • Castillo Inflable (2-7 años)
   • Máquina de Burbujas (ambiente mágico)
   • Set de Motricidad
   • Decoración temática completa

💡 <strong>Ventajas de nuestros servicios:</strong>
   • Materiales seguros y no tóxicos
   • Supervisión profesional incluida
   • Transporte, montaje y desmontaje
   • Limpieza y desinfección garantizada
   • Seguro de responsabilidad civil

💬 <strong>Cotiza tu evento:</strong>
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20quiero%20cotizar%20para%20mi%20evento" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 WhatsApp: +56 9 6907 3306
</a>`,
                timestamp: new Date()
            };
        }
        
        // Respuesta por defecto
        return {
            type: 'ai',
            content: `Entiendo tu consulta. 😊

Para darte la mejor información, te recomiendo:

📞 <strong>Llamar directamente:</strong> +56 9 6907 3306
📧 <strong>Email:</strong> info.almakids@gmail.com

💬 <strong>WhatsApp directo:</strong> 
<a href="https://wa.me/56969073306?text=Hola%20ALMA%20Kids,%20me%20interesa%20cotizar%20sus%20servicios" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Chatear por WhatsApp
</a>

Nuestro equipo te ayudará con:
• Cotizaciones personalizadas
• Disponibilidad de fechas
• Recomendaciones específicas
• Información detallada

¿Hay algo más en lo que pueda ayudarte? 🤔`,
            timestamp: new Date()
        };
    }
}

// Inicializar el chat cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.aiChat = new ALChat();
});

// Función global para abrir el chat
function openAIChat() {
    if (window.aiChat) {
        window.aiChat.toggle();
    }
}
