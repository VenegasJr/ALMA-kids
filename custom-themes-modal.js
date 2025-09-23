/**
 * ALMA Kids - Modal de Temas Personalizados
 * Sistema para solicitar decoraciones personalizadas
 */

function openCustomThemeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'customThemeModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-magic"></i> Tema Personalizado</h3>
                <button class="close-modal" onclick="closeCustomThemeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="custom-theme-form">
                    <p class="theme-intro">¡Creamos la decoración perfecta para tu pequeño! Cuéntanos sus gustos y haremos magia.</p>
                    
                    <div class="form-group">
                        <label>¿Cuál es el tema favorito de tu pequeño?</label>
                        <input type="text" id="favoriteTheme" placeholder="Ej: Spiderman, Frozen, Minecraft, etc.">
                    </div>
                    
                    <div class="form-group">
                        <label>Edad del cumpleañero/a:</label>
                        <select id="childAge">
                            <option value="">Seleccionar edad...</option>
                            <option value="6-12 meses">6-12 meses</option>
                            <option value="1 año">1 año</option>
                            <option value="2 años">2 años</option>
                            <option value="3 años">3 años</option>
                            <option value="4 años">4 años</option>
                            <option value="5 años">5 años</option>
                            <option value="6 años">6 años</option>
                            <option value="7 años">7 años</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Colores favoritos:</label>
                        <div class="color-selection">
                            <label class="color-option">
                                <input type="checkbox" value="rosa"> 
                                <span class="color-box" style="background: #FFB6C1;"></span> Rosa
                            </label>
                            <label class="color-option">
                                <input type="checkbox" value="azul"> 
                                <span class="color-box" style="background: #87CEEB;"></span> Azul
                            </label>
                            <label class="color-option">
                                <input type="checkbox" value="verde"> 
                                <span class="color-box" style="background: #98FB98;"></span> Verde
                            </label>
                            <label class="color-option">
                                <input type="checkbox" value="amarillo"> 
                                <span class="color-box" style="background: #FFFFE0;"></span> Amarillo
                            </label>
                            <label class="color-option">
                                <input type="checkbox" value="morado"> 
                                <span class="color-box" style="background: #DDA0DD;"></span> Morado
                            </label>
                            <label class="color-option">
                                <input type="checkbox" value="rojo"> 
                                <span class="color-box" style="background: #FFB6B6;"></span> Rojo
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Personajes o elementos específicos:</label>
                        <textarea id="specificElements" placeholder="Ej: Quiere que aparezca Elsa, copos de nieve, castillo de hielo..." rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Tipo de evento:</label>
                        <select id="eventType">
                            <option value="">Seleccionar...</option>
                            <option value="cumpleanos">Cumpleaños</option>
                            <option value="baby-shower">Baby Shower</option>
                            <option value="bautizo">Bautizo</option>
                            <option value="graduacion">Graduación</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Presupuesto aproximado:</label>
                        <select id="budget">
                            <option value="">Seleccionar...</option>
                            <option value="30000-50000">$30.000 - $50.000</option>
                            <option value="50000-80000">$50.000 - $80.000</option>
                            <option value="80000-120000">$80.000 - $120.000</option>
                            <option value="120000+">Más de $120.000</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Tu nombre:</label>
                        <input type="text" id="customerName" placeholder="Tu nombre">
                    </div>
                    
                    <div class="form-group">
                        <label>Tu teléfono:</label>
                        <input type="tel" id="customerPhone" placeholder="+56 9 1234 5678">
                    </div>
                    
                    <div class="theme-examples">
                        <h4>💡 Ejemplos de temas que hemos creado:</h4>
                        <div class="examples-grid">
                            <div class="example-item">🦸‍♂️ Superhéroes Marvel</div>
                            <div class="example-item">❄️ Frozen/Elsa</div>
                            <div class="example-item">🚗 Cars/Rayo McQueen</div>
                            <div class="example-item">🦄 Unicornios mágicos</div>
                            <div class="example-item">🐾 Paw Patrol</div>
                            <div class="example-item">🌸 Flores y jardín</div>
                        </div>
                    </div>
                    
                    <div class="theme-actions">
                        <button class="btn btn-secondary" onclick="closeCustomThemeModal()">
                            Cancelar
                        </button>
                        <button class="btn btn-primary" onclick="submitCustomTheme()">
                            <i class="fas fa-paper-plane"></i> Solicitar Tema Personalizado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCustomThemeModal() {
    const modal = document.getElementById('customThemeModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function submitCustomTheme() {
    const favoriteTheme = document.getElementById('favoriteTheme').value;
    const childAge = document.getElementById('childAge').value;
    const specificElements = document.getElementById('specificElements').value;
    const eventType = document.getElementById('eventType').value;
    const budget = document.getElementById('budget').value;
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    
    // Obtener colores seleccionados
    const selectedColors = Array.from(document.querySelectorAll('.color-option input:checked'))
        .map(input => input.value);
    
    if (!favoriteTheme || !customerName || !customerPhone) {
        showNotification('Por favor completa los campos obligatorios', 'warning');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let message = '🎨 *ALMA Kids - Solicitud de Tema Personalizado*\n\n';
    message += `*Cliente:* ${customerName}\n`;
    message += `*Teléfono:* ${customerPhone}\n`;
    message += `*Tema Favorito:* ${favoriteTheme}\n`;
    message += `*Edad del niño/a:* ${childAge}\n`;
    
    if (selectedColors.length > 0) {
        message += `*Colores preferidos:* ${selectedColors.join(', ')}\n`;
    }
    
    if (specificElements) {
        message += `*Elementos específicos:* ${specificElements}\n`;
    }
    
    message += `*Tipo de evento:* ${eventType}\n`;
    message += `*Presupuesto:* ${budget}\n`;
    
    message += '\n¡Esperamos crear algo mágico para su pequeño! ✨';
    
    const whatsappUrl = `https://wa.me/56969073306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closeCustomThemeModal();
    showNotification('Solicitud enviada. Te contactaremos pronto para crear el tema perfecto!', 'success');
    
    // Analytics
    if (window.gtag) {
        gtag('event', 'custom_theme_request', {
            theme: favoriteTheme,
            child_age: childAge,
            event_type: eventType
        });
    }
}

// CSS para el modal de temas personalizados
const customThemeCSS = `
    .custom-theme-form {
        padding: 1.5rem;
    }

    .theme-intro {
        background: linear-gradient(135deg, #FFB6C1, #E6E6FA);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        text-align: center;
        color: var(--text-primary);
        font-weight: 500;
    }

    .color-selection {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .color-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        transition: background-color 0.2s;
    }

    .color-option:hover {
        background-color: #f8f9fa;
    }

    .color-box {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 2px solid #ddd;
        display: inline-block;
    }

    .color-option input:checked + .color-box {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
    }

    .theme-examples {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: var(--border-radius);
        margin: 1.5rem 0;
    }

    .theme-examples h4 {
        margin: 0 0 1rem 0;
        color: var(--primary-color);
    }

    .examples-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }

    .example-item {
        background: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        text-align: center;
        border: 1px solid #e0e0e0;
    }

    .theme-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
        .color-selection {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .examples-grid {
            grid-template-columns: 1fr;
        }
        
        .theme-actions {
            flex-direction: column;
        }
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = customThemeCSS;
document.head.appendChild(style);

console.log('🎪 ALMA Kids: Modal de temas personalizados cargado');


