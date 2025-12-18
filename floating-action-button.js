/**
 * Floating Action Button (FAB) Expandible
 * Botón flotante con menú expandible para contacto
 */

(function() {
    'use strict';
    
    // Crear el HTML del FAB
    function createFAB() {
        const fabContainer = document.createElement('div');
        fabContainer.className = 'fab-container';
        fabContainer.id = 'fabContainer';
        
        fabContainer.innerHTML = `
            <!-- Overlay para cerrar -->
            <div class="fab-overlay" id="fabOverlay"></div>
            
            <!-- Mensaje de ayuda -->
            <div class="fab-help-message" id="fabHelpMessage">
                ¿Te ayudo?
            </div>
            
            <!-- Botones de acción -->
            <div class="fab-actions" id="fabActions">
                <a href="https://wa.me/56969073306?text=💖%20*¡Hola%20ALMA%20Kids!*%20💖%0A%0A✨%20Me%20encantaría%20cotizar%20sus%20servicios%20y%20solicitar%20información%20sobre%20disponibilidad%20y%20precios.%0A%0A💕%20¡Muchas%20gracias!%20💕" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="fab-action-btn whatsapp" 
                   data-tooltip="WhatsApp"
                   title="Escribir por WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>
                
                <a href="tel:+56969073306" 
                   class="fab-action-btn phone" 
                   data-tooltip="Llamar"
                   title="Llamar ahora">
                    <i class="fas fa-phone"></i>
                </a>
                
                <a href="mailto:info.almakids@gmail.com?subject=Consulta%20ALMA%20Kids&body=Hola%20ALMA%20Kids,%0D%0A%0D%0AMe%20interesa%20cotizar%20sus%20servicios.%0D%0A%0D%0A¡Gracias!" 
                   class="fab-action-btn email" 
                   data-tooltip="Email"
                   title="Enviar email">
                    <i class="fas fa-envelope"></i>
                </a>
                
                <a href="https://www.instagram.com/almakids.cl/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="fab-action-btn instagram" 
                   data-tooltip="Instagram"
                   title="Seguir en Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
            
            <!-- Botón principal -->
            <button class="fab-main-btn" id="fabMainBtn" aria-label="Abrir menú de contacto">
                <i class="fas fa-comments"></i>
            </button>
        `;
        
        return fabContainer;
    }
    
    // Inicializar el FAB
    function initFAB() {
        // Remover completamente el botón de WhatsApp antiguo si existe
        const oldWhatsApp = document.querySelector('.whatsapp-float');
        if (oldWhatsApp) {
            oldWhatsApp.remove();
        }
        
        // Crear y agregar el nuevo FAB
        const fabContainer = createFAB();
        document.body.appendChild(fabContainer);
        
        // Elementos del FAB
        const mainBtn = document.getElementById('fabMainBtn');
        const actions = document.getElementById('fabActions');
        const overlay = document.getElementById('fabOverlay');
        const container = document.getElementById('fabContainer');
        const helpMessage = document.getElementById('fabHelpMessage');
        
        // Toggle del menú
        function toggleFAB() {
            const isActive = container.classList.contains('active');
            
            if (isActive) {
                // Cerrar
                container.classList.remove('active');
                overlay.classList.remove('active');
                const icon = mainBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-comments');
            } else {
                // Abrir
                container.classList.add('active');
                overlay.classList.add('active');
                const icon = mainBtn.querySelector('i');
                icon.classList.remove('fa-comments');
                icon.classList.add('fa-times');
            }
        }
        
        // Event listeners
        mainBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFAB();
        });
        
        overlay.addEventListener('click', function() {
            if (container.classList.contains('active')) {
                toggleFAB();
            }
        });
        
        // Cerrar al hacer clic en cualquier botón de acción
        const actionButtons = actions.querySelectorAll('.fab-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Cerrar el menú después de un pequeño delay para que se vea la acción
                setTimeout(() => {
                    if (container.classList.contains('active')) {
                        toggleFAB();
                    }
                }, 300);
            });
        });
        
        // Cerrar al hacer scroll (opcional)
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (container.classList.contains('active')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (container.classList.contains('active')) {
                        toggleFAB();
                    }
                }, 100);
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && container.classList.contains('active')) {
                toggleFAB();
            }
        });
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAB);
    } else {
        initFAB();
    }
    
    // También inicializar después de un pequeño delay para asegurar que todo esté cargado
    setTimeout(initFAB, 500);
})();

