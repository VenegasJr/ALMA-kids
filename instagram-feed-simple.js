/**
 * Instagram Feed - Versión Simple (Sin API)
 * Usa widgets de terceros y scraping básico para mostrar el feed
 */

const INSTAGRAM_USERNAME = 'almakids.cl';

/**
 * Cargar feed usando widget embed oficial de Instagram
 */
function loadInstagramEmbed() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;

    // Widget embed oficial de Instagram (más confiable)
    const embedHTML = `
        <div style="max-width: 100%; margin: 0 auto;">
            <blockquote class="instagram-media" 
                data-instgrm-permalink="https://www.instagram.com/${INSTAGRAM_USERNAME}/"
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
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };
        document.body.appendChild(script);
    } else {
        window.instgrm.Embeds.process();
    }
}

/**
 * Cargar estadísticas usando SnapWidget API (gratis y sin configuración)
 */
async function loadInstagramStatsSimple() {
    try {
        // Intentar obtener datos básicos desde el perfil público
        // Nota: Esto es solo para mostrar, los números pueden no ser exactos
        const response = await fetch(`https://www.instagram.com/${INSTAGRAM_USERNAME}/?__a=1&__d=dis`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        // Si funciona, parsear datos
        if (response.ok) {
            const data = await response.json();
            if (data.graphql && data.graphql.user) {
                const user = data.graphql.user;
                updateStats(user.edge_followed_by.count, user.edge_owner_to_timeline_media.count, user.edge_follow.count);
                return;
            }
        }
    } catch (error) {
        console.log('Usando método alternativo para estadísticas');
    }
    
    // Método alternativo: mostrar valores desde Meta Business Suite manualmente
    // Puedes actualizar estos valores manualmente cuando veas las estadísticas en Meta
    showManualStats();
}

/**
 * Actualizar estadísticas en el DOM
 */
function updateStats(followers, posts, following) {
    const followerEl = document.getElementById('followerCount');
    const postEl = document.getElementById('postCount');
    const followingEl = document.getElementById('followingCount');
    
    if (followerEl) followerEl.textContent = formatNumber(followers);
    if (postEl) postEl.textContent = formatNumber(posts);
    if (followingEl) followingEl.textContent = formatNumber(following);
}

/**
 * Mostrar estadísticas manuales (actualizar desde Meta Business Suite)
 */
function showManualStats() {
    // Estos valores puedes actualizarlos manualmente cuando veas las estadísticas en Meta
    // Por ahora, mostrar valores por defecto con emojis
    const followerEl = document.getElementById('followerCount');
    const postEl = document.getElementById('postCount');
    const followingEl = document.getElementById('followingCount');
    
    // Valores desde Meta Business Suite (actualizar manualmente)
    // Ve a Meta Business Suite → Dashboard → Ver estadísticas de Instagram
    // Y actualiza estos números con los valores que ves:
    const manualStats = {
        followers: 356, // ← Actualizado: Seguidores de Instagram
        posts: 13,      // ← Actualizado: Número de publicaciones en Instagram
        following: 0    // ← Actualizar: Copia el número de "Siguiendo" desde tu perfil de Instagram
    };
    
    if (followerEl) followerEl.textContent = formatNumber(manualStats.followers);
    if (postEl) postEl.textContent = formatNumber(manualStats.posts);
    if (followingEl) followingEl.textContent = formatNumber(manualStats.following);
}

/**
 * Formatear números (ej: 356 → "356", 1000 → "1K")
 */
function formatNumber(num) {
    if (!num && num !== 0) return '✨';
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Inicializar feed de Instagram
 */
function initInstagramFeedSimple() {
    // Cargar estadísticas
    loadInstagramStatsSimple();
    
    // Cargar feed embed
    loadInstagramEmbed();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstagramFeedSimple);
} else {
    initInstagramFeedSimple();
}

// Re-procesar embeds si se carga después
window.addEventListener('load', () => {
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
});

// Reintentar cargar embed cada vez que Instagram esté listo
setInterval(() => {
    if (window.instgrm && document.getElementById('instagramFeed')) {
        window.instgrm.Embeds.process();
    }
}, 2000);

