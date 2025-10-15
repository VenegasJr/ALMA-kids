/**
 * ALMA Kids - Chat con IA (GPT-4)
 * Sistema de chat inteligente con OpenAI
 */

// La configuración se carga desde ai-chat-config.js
// Esta variable se sobrescribirá cuando se cargue el archivo de configuración

// Estado del chat
let chatState = {
    isOpen: false,
    messages: [],
    isLoading: false,
    conversationHistory: []
};

/**
 * Inicializar el chat
 */
function initAIChat() {
    console.log('🤖 Chat con IA inicializado');
    
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
function toggleAIChat() {
    if (chatState.isOpen) {
        closeAIChat();
    } else {
        openAIChat();
    }
}

/**
 * Abrir el chat
 */
function openAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    const chatToggle = document.getElementById('aiChatToggle');
    
    if (chatWindow && chatToggle) {
        chatWindow.classList.add('active');
        chatToggle.classList.add('active');
        chatState.isOpen = true;
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }, 300);
    }
}

/**
 * Cerrar el chat
 */
function closeAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    const chatToggle = document.getElementById('aiChatToggle');
    
    if (chatWindow && chatToggle) {
        chatWindow.classList.remove('active');
        chatToggle.classList.remove('active');
        chatState.isOpen = false;
    }
}

/**
 * Enviar mensaje
 */
async function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Validar API key
    if (!AI_CHAT_CONFIG.apiKey) {
        showErrorMessage('⚠️ Error: API Key no configurada. Por favor configura tu API key en ai-chat-config.js');
        return;
    }
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        // Llamar a la API de OpenAI
        const response = await callOpenAI(message);
        
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        // Agregar respuesta de la IA
        addAIMessage(response);
        
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        hideTypingIndicator();
        showErrorMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo o contáctanos por WhatsApp.');
    }
}

/**
 * Llamar a la API de OpenAI
 */
async function callOpenAI(userMessage) {
    // Agregar mensaje a la historia
    chatState.conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    // Construir mensajes para la API
    const messages = [
        {
            role: 'system',
            content: AI_CHAT_CONFIG.systemPrompt
        },
        ...chatState.conversationHistory
    ];
    
    // Llamar a la API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CHAT_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: AI_CHAT_CONFIG.model,
            messages: messages,
            temperature: AI_CHAT_CONFIG.temperature,
            max_tokens: AI_CHAT_CONFIG.maxTokens
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API');
    }
    
    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    // Agregar respuesta a la historia
    chatState.conversationHistory.push({
        role: 'assistant',
        content: aiMessage
    });
    
    return aiMessage;
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
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Agregar mensaje de la IA
 */
function addAIMessage(message) {
    const messagesContainer = document.getElementById('aiChatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-chat-message ai-message';
    messageDiv.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fas fa-robot"></i>
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
 * Mostrar indicador de escritura
 */
function showTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) {
        indicator.style.display = 'block';
        scrollToBottom();
    }
}

/**
 * Ocultar indicador de escritura
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
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
            <div class="ai-message-bubble">
                <p>${escapeHtml(message)}</p>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Enviar sugerencia rápida
 */
function sendSuggestion(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        sendAIMessage();
    }
}

/**
 * Manejar tecla Enter
 */
function handleAIChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

/**
 * Abrir WhatsApp
 */
function openWhatsApp() {
    const message = 'Hola! 👋 Me gustaría obtener más información sobre sus servicios.';
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Formatear mensaje (convertir markdown básico a HTML)
 */
function formatMessage(text) {
    // Convertir negritas **texto** a <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir listas con -
    text = text.replace(/^\- (.*$)/gim, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Convertir saltos de línea a <br>
    text = text.replace(/\n/g, '<br>');
    
    // Envolver en párrafos
    const paragraphs = text.split('<br><br>');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

/**
 * Escape HTML
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

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIChat);
} else {
    initAIChat();
}

