/**
 * Floating Action Button (FAB) Expandible
 * Botón flotante con menú expandible para contacto
 */

(function() {
    'use strict';
    
    let fabInitialized = false;
    let fabContainer = null;
    
    // Crear el HTML del FAB
    function createFAB() {
        const container = document.createElement('div');
        container.className = 'fab-container';
        container.id = 'fabContainer';
        
        container.innerHTML = `
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
            
            <!-- Overlay para cerrar al hacer clic fuera (al final para no bloquear) -->
            <div class="fab-overlay" id="fabOverlay"></div>
        `;
        
        return container;
    }
    
    // Inicializar el FAB
    function initFAB() {
        // Evitar múltiples inicializaciones
        if (fabInitialized) {
            console.log('FAB ya inicializado, omitiendo...');
            return;
        }
        
        // Remover completamente el botón de WhatsApp antiguo si existe
        const oldWhatsApp = document.querySelector('.whatsapp-float');
        if (oldWhatsApp) {
            oldWhatsApp.remove();
            console.log('✅ Botón WhatsApp antiguo eliminado');
        }
        
        // Verificar si ya existe un FAB
        const existingFAB = document.getElementById('fabContainer');
        if (existingFAB) {
            existingFAB.remove();
            console.log('✅ FAB existente eliminado, recreando...');
        }
        
        // Crear y agregar el nuevo FAB
        fabContainer = createFAB();
        document.body.appendChild(fabContainer);
        console.log('✅ FAB creado y agregado al DOM');
        
        // Esperar un momento para que el DOM se actualice
        setTimeout(() => {
            // Elementos del FAB
            const mainBtn = document.getElementById('fabMainBtn');
            const actions = document.getElementById('fabActions');
            const overlay = document.getElementById('fabOverlay');
            const container = document.getElementById('fabContainer');
            const helpMessage = document.getElementById('fabHelpMessage');
            
            // Verificar que todos los elementos existan
            if (!mainBtn || !actions || !overlay || !container) {
                console.error('❌ Error: No se encontraron todos los elementos del FAB');
                console.log('mainBtn:', mainBtn);
                console.log('actions:', actions);
                console.log('overlay:', overlay);
                console.log('container:', container);
                return;
            }
            
            console.log('✅ Todos los elementos del FAB encontrados');
            
            // Toggle del menú
            function toggleFAB() {
                const isActive = container.classList.contains('active');
                console.log('🔄 Toggle FAB - Estado actual:', isActive ? 'abierto' : 'cerrado');
                
                if (isActive) {
                    // Cerrar
                    container.classList.remove('active');
                    overlay.classList.remove('active');
                    const icon = mainBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-comments');
                    }
                    console.log('✅ FAB cerrado');
                } else {
                    // Abrir
                    container.classList.add('active');
                    overlay.classList.add('active');
                    const icon = mainBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-comments');
                        icon.classList.add('fa-times');
                    }
                    console.log('✅ FAB abierto');
                }
            }
            
            // Event listeners
            mainBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Click en botón principal FAB');
                toggleFAB();
            });
            
            overlay.addEventListener('click', function(e) {
                e.stopPropagation();
                if (container.classList.contains('active')) {
                    console.log('🖱️ Click en overlay, cerrando FAB');
                    toggleFAB();
                }
            });
            
            // Cerrar al hacer clic en cualquier botón de acción
            const actionButtons = actions.querySelectorAll('.fab-action-btn');
            console.log('✅ Botones de acción encontrados:', actionButtons.length);
            actionButtons.forEach((btn, index) => {
                btn.addEventListener('click', function(e) {
                    console.log('🖱️ Click en botón de acción:', index);
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
            
            fabInitialized = true;
            console.log('✅ FAB completamente inicializado y funcional');
        }, 100);
    }
    
    // Inicializar cuando el DOM esté listo
    function startFAB() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initFAB, 200);
            });
        } else {
            setTimeout(initFAB, 200);
        }
    }
    
    // Iniciar
    startFAB();
})();

