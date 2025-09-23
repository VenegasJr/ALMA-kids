/**
 * ALMA Kids - Verificador de Enlaces
 * Monitorea y reporta enlaces rotos automáticamente
 */

class LinkChecker {
    constructor() {
        this.checkedLinks = new Set();
        this.brokenLinks = [];
        this.init();
    }

    init() {
        this.checkAllLinks();
        this.setupLinkMonitoring();
        this.setupPeriodicCheck();
    }

    async checkAllLinks() {
        const links = document.querySelectorAll('a[href]');
        const imageLinks = document.querySelectorAll('img[src]');
        
        console.log(`🔍 ALMA Kids: Verificando ${links.length} enlaces y ${imageLinks.length} imágenes...`);

        // Verificar enlaces
        for (const link of links) {
            await this.checkLink(link);
        }

        // Verificar imágenes
        for (const img of imageLinks) {
            await this.checkImage(img);
        }

        this.reportResults();
    }

    async checkLink(linkElement) {
        const href = linkElement.href;
        
        // Skip external links, mailto, tel, etc.
        if (href.startsWith('mailto:') || 
            href.startsWith('tel:') || 
            href.startsWith('https://wa.me') ||
            href.startsWith('https://www.instagram.com') ||
            href.startsWith('https://www.facebook.com')) {
            return true;
        }

        // Check internal links
        if (href.includes('#')) {
            return this.checkInternalAnchor(href);
        }

        // Check relative links
        if (href.includes('.html')) {
            return this.checkHTMLFile(href, linkElement);
        }

        return true;
    }

    checkInternalAnchor(href) {
        const anchorId = href.split('#')[1];
        if (anchorId) {
            const targetElement = document.getElementById(anchorId);
            if (!targetElement) {
                this.brokenLinks.push({
                    type: 'anchor',
                    url: href,
                    error: `Anchor #${anchorId} no encontrado`
                });
                return false;
            }
        }
        return true;
    }

    async checkHTMLFile(href, linkElement) {
        try {
            // Extraer nombre del archivo
            const fileName = href.split('/').pop().split('?')[0];
            
            // Lista de archivos que sabemos que existen
            const existingFiles = [
                'index.html',
                'eventos.html', 
                'globos-metalizados.html',
                'faq.html'
            ];

            if (!existingFiles.includes(fileName)) {
                this.brokenLinks.push({
                    type: 'file',
                    url: href,
                    element: linkElement,
                    error: `Archivo ${fileName} no encontrado`
                });
                
                // Marcar visualmente el enlace roto
                linkElement.style.color = '#e74c3c';
                linkElement.title = `⚠️ Enlace roto: ${fileName}`;
                
                return false;
            }
            
            return true;
        } catch (error) {
            this.brokenLinks.push({
                type: 'file',
                url: href,
                element: linkElement,
                error: error.message
            });
            return false;
        }
    }

    async checkImage(imgElement) {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                // Imagen carga correctamente
                imgElement.classList.add('image-verified');
                resolve(true);
            };
            
            img.onerror = () => {
                // Imagen rota
                this.brokenLinks.push({
                    type: 'image',
                    url: imgElement.src,
                    element: imgElement,
                    error: 'Imagen no se puede cargar'
                });
                
                // Añadir placeholder
                imgElement.style.border = '2px dashed #e74c3c';
                imgElement.alt = '⚠️ Imagen no disponible';
                imgElement.title = `Imagen rota: ${imgElement.src}`;
                
                resolve(false);
            };
            
            img.src = imgElement.src;
        });
    }

    setupLinkMonitoring() {
        // Monitorear clicks en enlaces
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const href = e.target.href;
                
                // Log analytics
                if (window.gtag) {
                    gtag('event', 'click', {
                        event_category: 'Link',
                        event_label: href,
                        value: 1
                    });
                }
            }
        });
    }

    setupPeriodicCheck() {
        // Verificar enlaces cada 5 minutos
        setInterval(() => {
            this.checkAllLinks();
        }, 300000);
    }

    reportResults() {
        if (this.brokenLinks.length === 0) {
            console.log('✅ ALMA Kids: Todos los enlaces funcionan correctamente');
            return;
        }

        console.warn(`⚠️ ALMA Kids: ${this.brokenLinks.length} enlaces rotos encontrados:`);
        this.brokenLinks.forEach(link => {
            console.warn(`- ${link.type}: ${link.url} - ${link.error}`);
        });

        // Mostrar notificación al administrador
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.showAdminNotification();
        }
    }

    showAdminNotification() {
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.innerHTML = `
            <div class="admin-notification-content">
                <h4>🔧 Modo Desarrollo - Enlaces Detectados</h4>
                <p>${this.brokenLinks.length} problemas encontrados:</p>
                <ul>
                    ${this.brokenLinks.map(link => 
                        `<li>${link.type}: ${link.url.split('/').pop()}</li>`
                    ).join('')}
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;

        document.body.appendChild(notification);
    }

    // Método público para verificar enlaces específicos
    static async verifyLink(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// CSS para el verificador
const linkCheckerCSS = `
    .image-verified {
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
    }

    .admin-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        max-width: 300px;
        z-index: 10000;
        box-shadow: var(--shadow-lg);
    }

    .admin-notification-content h4 {
        margin: 0 0 0.5rem 0;
        color: #3498db;
    }

    .admin-notification-content ul {
        margin: 0.5rem 0;
        padding-left: 1rem;
        font-size: 0.875rem;
    }

    .admin-notification-content button {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
    }
`;

// Inyectar CSS
const style = document.createElement('style');
style.textContent = linkCheckerCSS;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new LinkChecker();
    console.log('🎪 ALMA Kids: Verificador de enlaces activado');
});

export default LinkChecker;


