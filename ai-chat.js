// Chat IA ALMA Kids - Sistema Inteligente
// ========================================

class ALChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.conversationContext = [];
        this.init();
    }

    init() {
        this.createChatHTML();
        this.bindEvents();
        this.addWelcomeMessage();
        console.log('🤖 IA ALMA Kids inicializada correctamente');
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

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
    }

    toggle() {
        const container = document.getElementById('ai-chat-container');
        if (this.isOpen) {
            container.classList.remove('active');
            this.isOpen = false;
        } else {
            container.classList.add('active');
            this.isOpen = true;
            document.getElementById('ai-chat-input').focus();
        }
    }

    close() {
        const container = document.getElementById('ai-chat-container');
        container.classList.remove('active');
        this.isOpen = false;
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

    sendMessage() {
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

        // Simular typing
        this.showTyping();

        // Generar respuesta después de un delay
        setTimeout(() => {
            this.hideTyping();
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
   • 🏕️ Carpa Tipi: $15.000 IVA incluido
   • 🎈 Inflable Saltarín Carestino: $15.000 IVA incluido
   • 🫧 Máquina de Burbujas: $15.000 IVA incluido
   • 🎯 Set Motricidad: $45.000 IVA incluido

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

        if (message.includes('cumpleaños') || message.includes('cumple')) {
            return {
                type: 'ai',
                content: `🎂 <strong>¡Perfecto para cumpleaños!</strong>

🎪 <strong>Recomendaciones según la edad:</strong>

👶 <strong>1-3 años:</strong>
• Piscina de Pelotas (segura y divertida)
• Carpa Tipi (rincón de calma)
• Inflable Saltarín Carestino

🧒 <strong>4-7 años:</strong>
• Castillo Inflable (diversión garantizada)
• Piscina de Pelotas
• Máquina de Burbujas (magia total)

🎁 <strong>Pack Cumpleaños Completo:</strong>
• Castillo + Piscina + Servicios Adicionales
• Decoración con globos metalizados
• 4 horas de diversión

💡 <strong>¿Necesitas ayuda para elegir?</strong>
<a href="https://wa.me/56969073306?text=Hola!%20Quiero%20cotizar%20para%20un%20cumpleaños" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Te ayudo por WhatsApp
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('baby shower') || message.includes('baby')) {
            return {
                type: 'ai',
                content: `👶 <strong>¡Baby Shower especial!</strong>

🎪 <strong>Servicios ideales para Baby Showers:</strong>

🏕️ <strong>Carpa Tipi:</strong> Rincón perfecto para hermanitos
🎈 <strong>Inflable Saltarín:</strong> Diversión para niños pequeños
🫧 <strong>Máquina de Burbujas:</strong> Ambiente mágico
🎈 <strong>Globos Metalizados:</strong> Decoración temática

💡 <strong>Pack Baby Shower:</strong>
• Carpa Tipi + Inflable Saltarín + Decoración
• Perfecto para hermanitos de 1-5 años
• Ambiente seguro y controlado

🎨 <strong>Temáticas disponibles:</strong>
• Rosa/Azul clásico
• Arcoíris
• Animales
• Estrellas

<a href="https://wa.me/56969073306?text=Hola!%20Quiero%20cotizar%20para%20un%20Baby%20Shower" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Cotiza tu Baby Shower
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('servicios') || message.includes('que ofrecen')) {
            return {
                type: 'ai',
                content: `🎪 <strong>Servicios completos de ALMA Kids:</strong>

🏰 <strong>Castillos Inflables:</strong>
• Castillo Piscina Cuadrada
• Castillo Inflable Portada
• Castillo Piscina Redonda

🏊‍♀️ <strong>Piscina de Pelotas:</strong>
• Pelotas celestes, rosadas, blancas
• Materiales seguros y no tóxicos
• Estimulación sensorial

🎪 <strong>Servicios Adicionales:</strong>
• 🏕️ Carpa Tipi (160cm alto)
• 🎈 Inflable Saltarín Carestino
• 🫧 Máquina de Burbujas (2000+ burbujas/min)
• 🎯 Set Motricidad

🎈 <strong>Globos Metalizados:</strong>
• +200 diseños únicos
• Decoración temática
• Presentación profesional

📍 <strong>Cobertura:</strong> Machalí, Rancagua y región

<a href="https://wa.me/56969073306?text=Hola!%20Quiero%20conocer%20todos%20los%20servicios" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Más información por WhatsApp
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('contacto') || message.includes('telefono') || message.includes('whatsapp')) {
            return {
                type: 'ai',
                content: `📞 <strong>Contacto ALMA Kids:</strong>

📱 <strong>WhatsApp:</strong>
• +56 9 6907 3306
• +56 9 2060 9796

📧 <strong>Email:</strong>
• info.almakids@gmail.com

📍 <strong>Ubicación:</strong>
• Machalí, Región de O'Higgins

🕒 <strong>Horario de Atención:</strong>
• Lunes a Domingo: 8:00 - 20:00 hrs

💬 <strong>¡Escríbenos ahora!</strong>
<a href="https://wa.me/56969073306?text=Hola!%20Me%20interesa%20conocer%20sus%20servicios" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 WhatsApp Directo
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('edad') || message.includes('años')) {
            return {
                type: 'ai',
                content: `👶 <strong>Edades recomendadas:</strong>

🏰 <strong>Castillos Inflables:</strong>
• 6 meses a 7 años
• Supervisión adulta siempre

🏊‍♀️ <strong>Piscina de Pelotas:</strong>
• 6 meses a 7 años
• Perfecta para desarrollo motor

🎈 <strong>Inflable Saltarín Carestino:</strong>
• 18 meses a 5 años
• Capacidad: hasta 20 kg

🏕️ <strong>Carpa Tipi:</strong>
• Todas las edades
• Rincón de calma y lectura

🫧 <strong>Máquina de Burbujas:</strong>
• Todas las edades
• Operada por adulto

💡 <strong>¿Necesitas recomendaciones específicas?</strong>
<a href="https://wa.me/56969073306?text=Hola!%20Necesito%20recomendaciones%20para%20niños%20de%20X%20años" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Te ayudo a elegir
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('hola') || message.includes('buenas') || message.includes('saludos')) {
            return {
                type: 'ai',
                content: `¡Hola! 😊 ¡Qué gusto saludarte!

🎪 Soy tu asistente de ALMA Kids, especialistas en entretenciones infantiles.

¿En qué puedo ayudarte hoy? Puedo contarte sobre:
• 💰 Nuestros precios
• 🎂 Servicios para cumpleaños
• 👶 Baby Showers
• 🏰 Castillos inflables
• 🏊‍♀️ Piscina de pelotas
• 📞 Información de contacto

¡Pregúntame lo que necesites! 😄`,
                timestamp: new Date()
            };
        }

        if (message.includes('ubicacion') || message.includes('donde') || message.includes('machali') || message.includes('rancagua')) {
            return {
                type: 'ai',
                content: `📍 <strong>Ubicación y Cobertura:</strong>

🏠 <strong>Base:</strong> Machalí, Región de O'Higgins

🚚 <strong>Cobertura Regional:</strong>
• Machalí (base)
• Rancagua
• Rengo
• Coya
• Codegua
• Olivar
• Gultro
• Los Lirios
• Graneros

💡 <strong>¿Estás fuera de nuestra área?</strong>
Consulta disponibilidad para otras ubicaciones.

<a href="https://wa.me/56969073306?text=Hola!%20Estoy%20en%20[tu%20ubicación]%20¿hacen%20servicios%20allí?" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Consulta tu ubicación
</a>`,
                timestamp: new Date()
            };
        }

        if (message.includes('reserva') || message.includes('disponibilidad') || message.includes('fecha')) {
            return {
                type: 'ai',
                content: `📅 <strong>Reservas y Disponibilidad:</strong>

⏰ <strong>Horario de Atención:</strong>
• Lunes a Domingo: 8:00 - 20:00 hrs

📞 <strong>Para reservar:</strong>
• WhatsApp: +56 9 6907 3306
• Email: info.almakids@gmail.com

💡 <strong>Recomendaciones:</strong>
• Reserva con anticipación
• Especialmente en fines de semana
• Verifica disponibilidad para tu fecha

🎪 <strong>Duración estándar:</strong> 4 horas

<a href="https://wa.me/56969073306?text=Hola!%20Quiero%20reservar%20para%20el%20día%20[tu%20fecha]" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 Reserva ahora
</a>`,
                timestamp: new Date()
            };
        }

        // Respuesta por defecto
        return {
            type: 'ai',
            content: `🤔 <strong>Hmm, no estoy seguro de entenderte completamente.</strong>

💡 <strong>Puedo ayudarte con:</strong>
• 💰 Precios y cotizaciones
• 🎂 Servicios para cumpleaños
• 👶 Baby Showers
• 🏰 Información de castillos
• 🏊‍♀️ Piscina de pelotas
• 📞 Contacto y reservas
• 📍 Ubicación y cobertura

<a href="https://wa.me/56969073306?text=Hola!%20Necesito%20ayuda%20con%20[tu%20consulta]" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">
    📱 ¿Prefieres hablar con un humano?
</a>`,
            timestamp: new Date()
        };
    }

    addMessage(message) {
        this.messages.push(message);
        this.displayMessage(message);
        this.scrollToBottom();
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${message.type}`;
        
        const time = message.timestamp.toLocaleTimeString('es-CL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            <div class="ai-message-content">
                ${message.content}
            </div>
            <div class="ai-message-time">${time}</div>
        `;

        messagesContainer.appendChild(messageElement);
    }

    showTyping() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        if (!messagesContainer) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'ai-message ai typing';
        typingElement.id = 'ai-typing';
        typingElement.innerHTML = `
            <div class="ai-message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                Escribiendo...
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingElement = document.getElementById('ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

// Inicializar el chat cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.aiChat = new ALChat();
    console.log('✅ Chat IA ALMA Kids cargado correctamente');
});