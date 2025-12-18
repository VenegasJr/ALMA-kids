/**
 * Instagram Feed Integration
 * Muestra las últimas publicaciones de @almakids.cl
 * 
 * NOTA: Para usar la API oficial de Instagram necesitas:
 * 1. Crear una app en Meta Developers (developers.facebook.com)
 * 2. Obtener un Access Token
 * 3. Configurar las credenciales abajo
 * 
 * Alternativa: Usar un servicio como SnapWidget o Elfsight
 */

// Configuración - REEMPLAZAR con tus credenciales reales
const INSTAGRAM_CONFIG = {
    username: 'almakids.cl',
    // Opción 1: Usar API de Instagram (requiere token)
    accessToken: '', // Obtener de Meta Developers
    // Opción 2: Usar widget embed (más simple)
    useEmbed: true,
    embedUrl: 'https://www.instagram.com/almakids.cl/embed'
};

/**
 * Cargar estadísticas de Instagram usando la API
 */
async function loadInstagramStats() {
    const statsContainer = document.getElementById('instagramStats');
    if (!statsContainer) return;

    try {
        // Si tienes access token, usar API oficial
        if (INSTAGRAM_CONFIG.accessToken) {
            const response = await fetch(
                `https://graph.instagram.com/me?fields=username,media_count&access_token=${INSTAGRAM_CONFIG.accessToken}`
            );
            const data = await response.json();
            
            document.getElementById('followerCount').textContent = 'Cargando...';
            document.getElementById('postCount').textContent = data.media_count || '-';
            document.getElementById('followingCount').textContent = '-';
        } else {
            // Mostrar valores por defecto o usar scraping (solo para mostrar)
            // NOTA: Scraping puede violar términos de servicio de Instagram
            showDefaultStats();
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        showDefaultStats();
    }
}

/**
 * Mostrar estadísticas por defecto
 */
function showDefaultStats() {
    // Estos valores se pueden actualizar manualmente o usar un servicio externo
    document.getElementById('followerCount').textContent = '✨';
    document.getElementById('postCount').textContent = '📸';
    document.getElementById('followingCount').textContent = '❤️';
}

/**
 * Cargar feed de Instagram usando embed
 */
function loadInstagramEmbed() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;

    // Opción 1: Usar iframe embed oficial de Instagram
    const embedHTML = `
        <div style="max-width: 100%; margin: 0 auto;">
            <blockquote class="instagram-media" 
                data-instgrm-permalink="https://www.instagram.com/${INSTAGRAM_CONFIG.username}/"
                data-instgrm-version="14"
                style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:100%; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
            </blockquote>
        </div>
    `;
    
    feedContainer.innerHTML = embedHTML;
    
    // Cargar script de Instagram embed
    if (!window.instgrm) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.instagram.com/embed.js';
        document.body.appendChild(script);
    } else {
        window.instgrm.Embeds.process();
    }
}

/**
 * Cargar feed usando API de Instagram (requiere token)
 */
async function loadInstagramFeedAPI() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer || !INSTAGRAM_CONFIG.accessToken) {
        loadInstagramEmbed(); // Fallback a embed
        return;
    }

    try {
        // Obtener media reciente
        const response = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=9&access_token=${INSTAGRAM_CONFIG.accessToken}`
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            renderInstagramGrid(data.data);
        } else {
            loadInstagramEmbed(); // Fallback si no hay datos
        }
    } catch (error) {
        console.error('Error cargando feed:', error);
        loadInstagramEmbed(); // Fallback a embed
    }
}

/**
 * Renderizar grid de posts de Instagram
 */
function renderInstagramGrid(posts) {
    const feedContainer = document.getElementById('instagramFeed');
    
    const gridHTML = `
        <div class="instagram-grid">
            ${posts.map(post => `
                <a href="${post.permalink}" target="_blank" class="instagram-post" rel="noopener">
                    <img src="${post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}" 
                         alt="${post.caption ? post.caption.substring(0, 100) : 'Instagram post'}">
                    <div class="instagram-post-overlay">
                        <div class="instagram-post-stat">
                            <i class="fas fa-heart"></i>
                            <span>Me gusta</span>
                        </div>
                        <div class="instagram-post-stat">
                            <i class="fas fa-comment"></i>
                            <span>Comentar</span>
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
    
    feedContainer.innerHTML = gridHTML;
}

/**
 * Inicializar feed de Instagram
 */
function initInstagramFeed() {
    // Cargar estadísticas
    loadInstagramStats();
    
    // Cargar feed
    if (INSTAGRAM_CONFIG.useEmbed || !INSTAGRAM_CONFIG.accessToken) {
        loadInstagramEmbed();
    } else {
        loadInstagramFeedAPI();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstagramFeed);
} else {
    initInstagramFeed();
}

// Re-procesar embeds si se carga después
window.addEventListener('load', () => {
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
});

