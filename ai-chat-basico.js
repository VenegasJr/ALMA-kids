/**
 * ALMA Kids - Chat Básico Inteligente (GRATUITO)
 * Sistema de chat con respuestas predefinidas inteligentes
 * Sin costos de API - 100% funcional
 */

// Estado del chat
let chatState = {
    isOpen: false,
    messages: [],
    isLoading: false,
    conversationHistory: []
};

// Base de conocimientos de ALMA Kids
const ALMA_KNOWLEDGE = {
    // Información general
    empresa: {
        nombre: "ALMA Kids",
        descripcion: "Empresa especializada en entretenimiento infantil en Machalí y Rancagua, Chile",
        fundacion: "2025",
        mision: "Entregar lo mejor para el correcto desarrollo, estimulación y crecimiento de los niños"
    },
    
    // Servicios principales
    servicios: {
        castillos: {
            nombre: "Castillos Inflables",
            precio: "$75,000 IVA incluido",
            descripcion: "Castillos inflables profesionales de alta calidad",
            incluye: "Transporte, montaje, desmontaje y supervisión",
            tiempo: "4 horas estándar"
        },
        adicionales: {
            nombre: "Servicios Adicionales",
            opciones: [
                "Inflable Saltarín Carestino - $15,000",
                "Carpa Tipi - $20,000", 
                "Máquina de Burbujas - $25,000",
                "Piscina de Pelotas - $30,000"
            ]
        },
        combos: {
            nombre: "Combos Premium",
            opciones: [
                "Set Básico (Castillo + Piscina) - $100,000",
                "Set Familiar (2 Castillos) - $140,000",
                "Set Premium (Todo incluido) - $180,000"
            ]
        }
    },
    
    // Zonas de cobertura
    cobertura: {
        principales: ["Machalí", "Rancagua"],
        ampliada: ["Graneros", "Doñihue", "Olivar", "Codegua", "Rengo"]
    },
    
    // Contacto
    contacto: {
        whatsapp: "56969073306",
        email: "info@almakids.cl",
        horario: "Lunes a Domingo de 9:00 a 20:00 hrs"
    },
    
    // Preguntas frecuentes
    faq: {
        tiempo: "El tiempo estándar es de 4 horas. Puedes agregar horas adicionales con costo extra.",
        reserva: "Para reservar necesitas un anticipo del 50% del valor total.",
        cancelacion: "Si cancelas con menos de 24 horas, se cobra el 50% del valor total.",
        clima: "En caso de lluvia, reprogramamos sin costo adicional.",
        espacio: "Necesitamos mínimo 4x4 metros para el castillo y acceso libre para el vehículo."
    }
};

// Sistema de respuestas inteligentes
const RESPONSE_SYSTEM = {
    // Saludos
    saludos: [
        "¡Hola! 👋 Soy ALMA, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
        "¡Hola! 😊 Bienvenido a ALMA Kids. ¿Necesitas información sobre nuestros servicios?",
        "¡Hola! 👋 Estoy aquí para ayudarte con información sobre entretenimiento infantil."
    ],
    
    // Despedidas
    despedidas: [
        "¡Gracias por contactarnos! 😊 ¡Esperamos hacer tu evento inolvidable!",
        "¡Fue un placer ayudarte! 🎉 ¡Nos vemos pronto en tu celebración!",
        "¡Hasta luego! 👋 ¡Recuerda que estamos aquí cuando nos necesites!"
    ],
    
    // Respuestas por categoría
    respuestas: {
        precio: [
            "💰 **Precios ALMA Kids:**\n\n🏰 **Castillos Inflables:** $75,000 IVA incluido\n🎈 **Servicios Adicionales:** $15,000 - $30,000\n👑 **Combos Premium:** $100,000 - $180,000\n\n*Precios incluyen transporte, montaje y supervisión*",
            "💵 **Nuestros precios son muy competitivos:**\n\n• Castillo básico: $75,000\n• Servicios extra: desde $15,000\n• Combos con descuento: hasta $180,000\n\n¿Te interesa algún servicio específico?"
        ],
        
        servicios: [
            "🎪 **Nuestros Servicios:**\n\n🏰 **Castillos Inflables** - Diversión garantizada\n🎈 **Servicios Adicionales** - Carpa Tipi, Saltarín, Burbujas\n👑 **Combos Premium** - Ahorra con paquetes completos\n🏊 **Piscina de Pelotas** - Zona de juegos segura\n\n¿Cuál te interesa más?",
            "🎉 **En ALMA Kids ofrecemos:**\n\n• Castillos inflables profesionales\n• Servicios adicionales para complementar\n• Combos que te permiten ahorrar\n• Cobertura en Machalí y Rancagua\n\n¿Qué tipo de evento estás organizando?"
        ],
        
        cobertura: [
            "📍 **Zonas de Cobertura:**\n\n**Principales:**\n• Machalí\n• Rancagua\n\n**Ampliada:**\n• Graneros\n• Doñihue\n• Olivar\n• Codegua\n• Rengo\n\n¿En qué zona necesitas el servicio?",
            "🗺️ **Llegamos a:**\n\n✅ Machalí y Rancagua (zona principal)\n✅ Graneros, Doñihue, Olivar\n✅ Codegua y Rengo\n\n*Consulta por otras zonas, podemos evaluar*"
        ],
        
        contacto: [
            "📞 **Contáctanos:**\n\n📱 **WhatsApp:** +56 9 6907 3306\n📧 **Email:** info@almakids.cl\n⏰ **Horario:** Lunes a Domingo 9:00-20:00 hrs\n\n¡Estamos aquí para ayudarte! 😊",
            "💬 **Formas de contacto:**\n\n• WhatsApp: 56969073306\n• Email: info@almakids.cl\n• Horario: Todos los días 9:00-20:00\n\n¡Escríbenos y te respondemos al instante!"
        ],
        
        reserva: [
            "📅 **Para Reservar:**\n\n1️⃣ Confirma disponibilidad\n2️⃣ Elige tus servicios\n3️⃣ Abona 50% de anticipo\n4️⃣ ¡Listo para la diversión!\n\n¿Qué fecha tienes en mente?",
            "🎯 **Proceso de Reserva:**\n\n• Consulta disponibilidad\n• Selecciona servicios\n• Anticipo del 50%\n• Coordinamos detalles\n\n¡Es muy fácil! ¿Cuándo es tu evento?"
        ],
        
        tiempo: [
            "⏰ **Tiempo de Servicio:**\n\n🕐 **Estándar:** 4 horas\n➕ **Horas adicionales:** Disponibles con costo extra\n🚚 **Incluye:** Transporte, montaje y supervisión\n\n¿Necesitas más de 4 horas?",
            "⏱️ **Duración:**\n\n• Tiempo base: 4 horas\n• Horas extra: Consulta precios\n• Todo incluido en el servicio\n\n¿Tu evento es de más de 4 horas?"
        ]
    }
};

/**
 * Analizar mensaje y generar respuesta inteligente
 */
function analyzeMessage(message) {
    const msg = message.toLowerCase().trim();
    
    console.log('🔍 Analizando mensaje:', msg);
    
    // Detectar saludos
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas') || msg.includes('saludos')) {
        return getRandomResponse(RESPONSE_SYSTEM.saludos);
    }
    
    // Detectar despedidas
    if (msg.includes('gracias') || msg.includes('chao') || msg.includes('adiós') || msg.includes('hasta luego')) {
        return getRandomResponse(RESPONSE_SYSTEM.despedidas);
    }
    
    // Detectar preguntas sobre precios
    if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('vale') || msg.includes('costo') || msg.includes('cuánto')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.precio);
    }
    
    // Detectar preguntas sobre servicios
    if (msg.includes('servicio') || msg.includes('castillo') || msg.includes('inflable') || msg.includes('que ofrecen') || msg.includes('que tienen')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.servicios);
    }
    
    // Detectar preguntas sobre cobertura
    if (msg.includes('zona') || msg.includes('llegar') || msg.includes('cobertura') || msg.includes('machalí') || msg.includes('rancagua')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.cobertura);
    }
    
    // Detectar preguntas sobre contacto
    if (msg.includes('contacto') || msg.includes('teléfono') || msg.includes('whatsapp') || msg.includes('llamar')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.contacto);
    }
    
    // Detectar preguntas sobre reservas
    if (msg.includes('reserva') || msg.includes('reservar') || msg.includes('contratar') || msg.includes('anticipo')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.reserva);
    }
    
    // Detectar preguntas sobre tiempo
    if (msg.includes('tiempo') || msg.includes('hora') || msg.includes('duración') || msg.includes('cuanto dura')) {
        return getRandomResponse(RESPONSE_SYSTEM.respuestas.tiempo);
    }
    
    // Detectar preguntas sobre clima
    if (msg.includes('lluvia') || msg.includes('clima') || msg.includes('mal tiempo')) {
        return "🌧️ **En caso de lluvia:**\n\n✅ Reprogramamos sin costo adicional\n✅ Tu anticipo queda reservado\n✅ Coordinamos nueva fecha\n\n¡No te preocupes por el clima! 😊";
    }
    
    // Detectar preguntas sobre espacio
    if (msg.includes('espacio') || msg.includes('metro') || msg.includes('tamaño') || msg.includes('medida')) {
        return "📏 **Requisitos de Espacio:**\n\n🏰 **Castillo:** Mínimo 4x4 metros\n🚚 **Acceso:** Libre para vehículo\n🏠 **Superficie:** Preferiblemente pasto o superficie plana\n\n¿Tienes el espacio adecuado?";
    }
    
    // Respuesta por defecto
    return "🤔 **Hmm, no estoy segura de entenderte...**\n\nPuedo ayudarte con:\n\n💰 Precios y servicios\n📍 Zonas de cobertura\n📞 Información de contacto\n📅 Reservas y anticipos\n⏰ Tiempos de servicio\n\n¿Sobre qué te gustaría saber? 😊";
}

/**
 * Obtener respuesta aleatoria de un array
 */
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Simular tiempo de escritura
 */
function simulateTypingTime(message) {
    // Calcular tiempo basado en la longitud del mensaje
    const baseTime = 1000; // 1 segundo base
    const charTime = 50; // 50ms por carácter
    const maxTime = 3000; // Máximo 3 segundos
    
    const calculatedTime = baseTime + (message.length * charTime);
    return Math.min(calculatedTime, maxTime);
}

/**
 * Inicializar el chat
 */
window.initAIChat = function() {
    console.log('🤖 Chat básico ALMA inicializado');
    
    // Agregar evento de clic fuera para cerrar
    document.addEventListener('click', function(e) {
        const chatWidget = document.getElementById('aiChatWidget');
        const chatToggle = document.getElementById('aiChatToggle');
        
        if (chatState.isOpen && 
            !chatWidget.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            closeAIChat();
        }
    });

    // Auto-scroll al final
    const messagesContainer = document.getElementById('aiChatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

/**
 * Abrir/cerrar el chat
 */
window.toggleAIChat = function() {
    if (chatState.isOpen) {
        closeAIChat();
    } else {
        openAIChat();
    }
}

/**
 * Abrir chat
 */
function openAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    const chatToggle = document.getElementById('aiChatToggle');
    
    if (chatWindow && chatToggle) {
        chatWindow.style.display = 'block';
        chatToggle.classList.add('active');
        chatState.isOpen = true;
        
        // Enfocar input
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 300);
        
        console.log('✅ Chat ALMA abierto');
    }
}

/**
 * Cerrar chat
 */
function closeAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    const chatToggle = document.getElementById('aiChatToggle');
    
    if (chatWindow && chatToggle) {
        chatWindow.style.display = 'none';
        chatToggle.classList.remove('active');
        chatState.isOpen = false;
        console.log('❌ Chat ALMA cerrado');
    }
}

/**
 * Enviar mensaje
 */
window.sendAIMessage = async function() {
    console.log('🚀 sendAIMessage llamada');
    
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    console.log('📝 Mensaje:', message);
    
    if (!message) {
        console.log('❌ Mensaje vacío, saliendo');
        return;
    }
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        // Simular tiempo de procesamiento
        const response = analyzeMessage(message);
        const typingTime = simulateTypingTime(response);
        
        await new Promise(resolve => setTimeout(resolve, typingTime));
        
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        // Agregar respuesta de ALMA
        addAIMessage(response);
        
    } catch (error) {
        console.error('Error al procesar mensaje:', error);
        hideTypingIndicator();
        showErrorMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.');
    }
}

/**
 * Agregar mensaje del usuario
 */
function addUserMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-chat-message user-message';
    
    messageDiv.innerHTML = `
        <div class="user-message-content">
            <div class="user-message-bubble">
                <p>${escapeHtml(message)}</p>
            </div>
            <span class="user-message-time">${getCurrentTime()}</span>
        </div>
        <div class="user-message-avatar">
            <i class="fas fa-user"></i>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Agregar mensaje de ALMA
 */
function addAIMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-chat-message ai-message';
    
    messageDiv.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fas fa-female"></i>
        </div>
        <div class="ai-message-content">
            <div class="ai-message-bubble">
                ${formatMessage(message)}
            </div>
            <span class="ai-message-time">${getCurrentTime()}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Formatear mensaje con Markdown básico
 */
function formatMessage(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/• /g, '• ')
        .replace(/\n/g, '<br>');
}

/**
 * Escapar HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Obtener hora actual
 */
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * Mostrar indicador de escritura
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    // Limpiar indicador anterior si existe
    const existingIndicator = document.getElementById('typingIndicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-chat-message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fas fa-female"></i>
        </div>
        <div class="ai-message-content">
            <div class="ai-message-bubble typing">
                <div class="typing-text">ALMA está escribiendo</div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Ocultar indicador de escritura
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Mostrar mensaje de error
 */
function showErrorMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-chat-message ai-message error-message';
    
    messageDiv.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="ai-message-content">
            <div class="ai-message-bubble error">
                <p>⚠️ ${message}</p>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Scroll al final
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

/**
 * Enviar sugerencia
 */
window.sendSuggestion = function(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        sendAIMessage();
    }
}

/**
 * Manejar tecla Enter
 */
window.handleAIChatKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

/**
 * Abrir WhatsApp
 */
window.openWhatsApp = function() {
    const message = 'Hola! 👋 Me gustaría obtener más información sobre sus servicios.';
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initAIChat();
});
