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
            content: `¡Hola! 👋 Soy tu asistente de ALMA Kids. 

Puedo ayudarte con:
• 📋 Información sobre nuestros servicios
• 💰 Precios y cotizaciones
• 📅 Disponibilidad para eventos
• 🎪 Recomendaciones para tu fiesta
• 📞 Datos de contacto

¿En qué puedo ayudarte hoy?`,
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
                content: `💰 <strong>Precios de nuestros servicios:</strong>

🏰 <strong>Castillo Inflable:</strong> $25.000
🏊‍♀️ <strong>Piscina de Pelotas:</strong> $15.000
🎈 <strong>Globos Metalizados:</strong> Desde $2.000
🎪 <strong>Servicios Adicionales:</strong> Desde $10.000

💡 <strong>¡Mejores precios en combos!</strong>

💬 <strong>Para cotización personalizada:</strong>
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
                content: `🎪 <strong>Nuestros servicios:</strong>

🏰 <strong>Castillos Inflables:</strong> 3D profesionales, seguros
🏊‍♀️ <strong>Piscina de Pelotas:</strong> Materiales no tóxicos
🎈 <strong>Globos Metalizados:</strong> +200 diseños disponibles
🎪 <strong>Servicios Adicionales:</strong>
   • Carpa Tipi
   • Inflable Saltarín
   • Máquina de Burbujas

👶 <strong>Edades:</strong> 6 meses a 7 años
🛡️ <strong>Seguridad:</strong> Materiales certificados`,
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
