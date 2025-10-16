/**
 * ALMA Kids - Chat IA FUNCIONAL (SIN ERRORES)
 * Versión corregida y simplificada
 */

console.log('🚀 Cargando chat IA corregido...');

// Estado del chat
let chatState = {
    isOpen: false,
    isLoading: false
};

// Base de conocimientos simple pero efectiva
const ALMA_RESPONSES = {
    saludo: [
        "¡Hola! 👋 Soy ALMA, tu asistente de ALMA Kids. ¿En qué puedo ayudarte?",
        "¡Hola! 😊 Bienvenido a ALMA Kids. ¿Necesitas información sobre nuestros servicios?",
        "¡Hola! 👋 Estoy aquí para ayudarte con entretenimiento infantil."
    ],
    precios: [
        "💰 **Precios ALMA Kids:**\n\n🏰 **Castillos Inflables:** $75,000 IVA incluido\n🎈 **Servicios Adicionales:** $15,000 - $30,000\n👑 **Combos Premium:** $100,000 - $180,000\n\n*Precios incluyen transporte, montaje y supervisión*",
        "💵 **Nuestros precios:**\n\n• Castillo básico: $75,000\n• Servicios extra: desde $15,000\n• Combos con descuento: hasta $180,000\n\n¿Te interesa algún servicio específico?"
    ],
    servicios: [
        "🎪 **Nuestros Servicios:**\n\n🏰 **Castillos Inflables** - Diversión garantizada\n🎈 **Servicios Adicionales** - Carpa Tipi, Saltarín, Burbujas\n👑 **Combos Premium** - Ahorra con paquetes completos\n🏊 **Piscina de Pelotas** - Zona de juegos segura\n\n¿Cuál te interesa más?",
        "🎉 **En ALMA Kids ofrecemos:**\n\n• Castillos inflables profesionales\n• Servicios adicionales para complementar\n• Combos que te permiten ahorrar\n• Cobertura en Machalí y Rancagua\n\n¿Qué tipo de evento estás organizando?"
    ],
    contacto: [
        "📞 **Contáctanos:**\n\n📱 **WhatsApp:** +56 9 6907 3306\n📧 **Email:** info@almakids.cl\n⏰ **Horario:** Lunes a Domingo 9:00-20:00 hrs\n\n¡Estamos aquí para ayudarte! 😊",
        "💬 **Formas de contacto:**\n\n• WhatsApp: 56969073306\n• Email: info@almakids.cl\n• Horario: Todos los días 9:00-20:00\n\n¡Escríbenos y te respondemos al instante!"
    ],
    cobertura: [
        "📍 **Zonas de Cobertura:**\n\n**Principales:**\n• Machalí\n• Rancagua\n\n**Ampliada:**\n• Graneros\n• Doñihue\n• Olivar\n• Codegua\n• Rengo\n\n¿En qué zona necesitas el servicio?",
        "🗺️ **Llegamos a:**\n\n✅ Machalí y Rancagua (zona principal)\n✅ Graneros, Doñihue, Olivar\n✅ Codegua y Rengo\n\n*Consulta por otras zonas, podemos evaluar*"
    ],
    reserva: [
        "📅 **Para Reservar:**\n\n1️⃣ Confirma disponibilidad\n2️⃣ Elige tus servicios\n3️⃣ Abona 50% de anticipo\n4️⃣ ¡Listo para la diversión!\n\n¿Qué fecha tienes en mente?",
        "🎯 **Proceso de Reserva:**\n\n• Consulta disponibilidad\n• Selecciona servicios\n• Anticipo del 50%\n• Coordinamos detalles\n\n¡Es muy fácil! ¿Cuándo es tu evento?"
    ],
    tiempo: [
        "⏰ **Tiempo de Servicio:**\n\n🕐 **Estándar:** 4 horas\n➕ **Horas adicionales:** Disponibles con costo extra\n🚚 **Incluye:** Transporte, montaje y supervisión\n\n¿Necesitas más de 4 horas?",
        "⏱️ **Duración:**\n\n• Tiempo base: 4 horas\n• Horas extra: Consulta precios\n• Todo incluido en el servicio\n\n¿Tu evento es de más de 4 horas?"
    ]
};

// Función para obtener respuesta
function getResponse(message) {
    const msg = message.toLowerCase().trim();
    
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
        return ALMA_RESPONSES.saludo[Math.floor(Math.random() * ALMA_RESPONSES.saludo.length)];
    }
    
    if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('vale') || msg.includes('cuánto')) {
        return ALMA_RESPONSES.precios[Math.floor(Math.random() * ALMA_RESPONSES.precios.length)];
    }
    
    if (msg.includes('servicio') || msg.includes('castillo') || msg.includes('inflable')) {
        return ALMA_RESPONSES.servicios[Math.floor(Math.random() * ALMA_RESPONSES.servicios.length)];
    }
    
    if (msg.includes('contacto') || msg.includes('teléfono') || msg.includes('whatsapp')) {
        return ALMA_RESPONSES.contacto[Math.floor(Math.random() * ALMA_RESPONSES.contacto.length)];
    }
    
    if (msg.includes('zona') || msg.includes('llegar') || msg.includes('machalí') || msg.includes('rancagua')) {
        return ALMA_RESPONSES.cobertura[Math.floor(Math.random() * ALMA_RESPONSES.cobertura.length)];
    }
    
    if (msg.includes('reserva') || msg.includes('reservar') || msg.includes('contratar')) {
        return ALMA_RESPONSES.reserva[Math.floor(Math.random() * ALMA_RESPONSES.reserva.length)];
    }
    
    if (msg.includes('tiempo') || msg.includes('hora') || msg.includes('duración')) {
        return ALMA_RESPONSES.tiempo[Math.floor(Math.random() * ALMA_RESPONSES.tiempo.length)];
    }
    
    if (msg.includes('gracias') || msg.includes('chao') || msg.includes('adiós')) {
        return "¡Gracias por contactarnos! 😊 ¡Esperamos hacer tu evento inolvidable!";
    }
    
    return "🤔 **No estoy segura de entenderte...**\n\nPuedo ayudarte con:\n\n💰 Precios y servicios\n📍 Zonas de cobertura\n📞 Información de contacto\n📅 Reservas y anticipos\n⏰ Tiempos de servicio\n\n¿Sobre qué te gustaría saber? 😊";
}

// Función para enviar mensaje
window.sendAIMessage = function() {
    console.log('📤 Enviando mensaje...');
    
    const input = document.getElementById('aiChatInput');
    if (!input) {
        console.error('❌ Input no encontrado');
        return;
    }
    
    const message = input.value.trim();
    if (!message) {
        console.log('❌ Mensaje vacío');
        return;
    }
    
    console.log('📝 Mensaje:', message);
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Simular procesamiento
    setTimeout(() => {
        hideTypingIndicator();
        const response = getResponse(message);
        addAIMessage(response);
    }, 1500);
};

// Función para agregar mensaje del usuario
function addUserMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'ai-chat-message user-message';
    div.innerHTML = `
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
    
    container.appendChild(div);
    scrollToBottom();
}

// Función para agregar mensaje de ALMA
function addAIMessage(message) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'ai-chat-message ai-message';
    div.innerHTML = `
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
    
    container.appendChild(div);
    scrollToBottom();
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    
    const existing = document.getElementById('typingIndicator');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'ai-chat-message ai-message typing-indicator';
    div.innerHTML = `
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
    
    container.appendChild(div);
    scrollToBottom();
}

// Función para ocultar indicador de escritura
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Función para toggle del chat
window.toggleAIChat = function() {
    console.log('🔄 Toggle chat...');
    
    const window = document.getElementById('aiChatWindow');
    const toggle = document.getElementById('aiChatToggle');
    
    if (!window || !toggle) {
        console.error('❌ Elementos del chat no encontrados');
        return;
    }
    
    if (chatState.isOpen) {
        window.style.display = 'none';
        toggle.classList.remove('active');
        chatState.isOpen = false;
        console.log('❌ Chat cerrado');
    } else {
        window.style.display = 'block';
        toggle.classList.add('active');
        chatState.isOpen = true;
        
        // Enfocar input
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 300);
        
        console.log('✅ Chat abierto');
    }
};

// Función para manejar tecla Enter
window.handleAIChatKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
};

// Función para enviar sugerencia
window.sendSuggestion = function(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        sendAIMessage();
    }
};

// Función para abrir WhatsApp
window.openWhatsApp = function() {
    const message = 'Hola! 👋 Me gustaría obtener más información sobre sus servicios.';
    const url = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Función para inicializar
window.initAIChat = function() {
    console.log('✅ Chat IA inicializado correctamente');
    
    // Verificar que todos los elementos existan
    const elements = ['aiChatWidget', 'aiChatToggle', 'aiChatWindow', 'aiChatMessages', 'aiChatInput'];
    const missing = elements.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
        console.error('❌ Elementos faltantes:', missing);
    } else {
        console.log('✅ Todos los elementos del chat encontrados');
    }
};

// Funciones auxiliares
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMessage(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function scrollToBottom() {
    const container = document.getElementById('aiChatMessages');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, inicializando chat...');
    setTimeout(initAIChat, 1000);
});

// También inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIChat);
} else {
    initAIChat();
}

console.log('✅ Chat IA corregido cargado correctamente');
