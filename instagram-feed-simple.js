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
 * Cargar estadísticas con actualización automática diaria
 * Intenta obtener datos automáticamente y los cachea por 24 horas
 */
async function loadInstagramStatsSimple() {
    // Verificar si hay datos en caché y si son recientes (menos de 24 horas)
    const cachedData = getCachedStats();
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
    
    // Si hay datos en caché y tienen menos de 24 horas, usarlos
    if (cachedData && (now - cachedData.timestamp) < oneDay) {
        console.log('📊 Usando estadísticas en caché (actualizadas hace menos de 24h)');
        updateStats(cachedData.followers, cachedData.posts, cachedData.following);
        
        // Intentar actualizar en segundo plano sin bloquear la UI
        updateStatsInBackground();
        return;
    }
    
    // Si no hay caché o está vencido, intentar obtener datos nuevos
    console.log('🔄 Actualizando estadísticas de Instagram...');
    await fetchAndUpdateStats();
}

/**
 * Intentar obtener estadísticas desde Instagram (múltiples métodos)
 */
async function fetchAndUpdateStats() {
    // Método 1: Intentar desde el perfil público de Instagram
    try {
        const response = await fetch(`https://www.instagram.com/${INSTAGRAM_USERNAME}/?__a=1&__d=dis`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.graphql && data.graphql.user) {
                const user = data.graphql.user;
                const stats = {
                    followers: user.edge_followed_by?.count || 0,
                    posts: user.edge_owner_to_timeline_media?.count || 0,
                    following: user.edge_follow?.count || 0
                };
                
                // Guardar en caché
                saveCachedStats(stats);
                updateStats(stats.followers, stats.posts, stats.following);
                console.log('✅ Estadísticas actualizadas automáticamente desde Instagram');
                return;
            }
        }
    } catch (error) {
        console.log('⚠️ No se pudo obtener datos automáticamente, usando caché o valores manuales');
    }
    
    // Método 2: Intentar desde el embed de Instagram (extraer del DOM)
    try {
        await extractStatsFromEmbed();
    } catch (error) {
        console.log('⚠️ No se pudieron extraer datos del embed');
    }
    
    // Método 3: Usar datos en caché si existen (aunque estén vencidos)
    const cachedData = getCachedStats();
    if (cachedData) {
        console.log('📊 Usando estadísticas en caché (aunque estén vencidas)');
        updateStats(cachedData.followers, cachedData.posts, cachedData.following);
        return;
    }
    
    // Método 4: Fallback a valores manuales
    console.log('📝 Usando valores manuales como fallback');
    showManualStats();
}

/**
 * Actualizar estadísticas en segundo plano (sin bloquear la UI)
 */
async function updateStatsInBackground() {
    // Esperar un poco para no interferir con la carga inicial
    setTimeout(async () => {
        await fetchAndUpdateStats();
    }, 3000);
}

/**
 * Extraer estadísticas del embed de Instagram después de que cargue
 */
async function extractStatsFromEmbed() {
    return new Promise((resolve) => {
        // Esperar a que el embed de Instagram cargue
        const checkEmbed = setInterval(() => {
            const embed = document.querySelector('.instagram-media');
            if (embed) {
                // Intentar extraer datos del embed si están disponibles
                // Nota: Instagram limita el acceso, pero podemos intentar
                clearInterval(checkEmbed);
                resolve();
            }
        }, 1000);
        
        // Timeout después de 10 segundos
        setTimeout(() => {
            clearInterval(checkEmbed);
            resolve();
        }, 10000);
    });
}

/**
 * Guardar estadísticas en localStorage con timestamp
 */
function saveCachedStats(stats) {
    try {
        const data = {
            ...stats,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('instagram_stats_cache', JSON.stringify(data));
        console.log('💾 Estadísticas guardadas en caché:', data);
    } catch (error) {
        console.warn('⚠️ No se pudo guardar en caché (localStorage no disponible)');
    }
}

/**
 * Obtener estadísticas desde localStorage
 */
function getCachedStats() {
    try {
        const cached = localStorage.getItem('instagram_stats_cache');
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (error) {
        console.warn('⚠️ No se pudo leer caché');
    }
    return null;
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
    // Cargar estadísticas (con actualización automática diaria)
    loadInstagramStatsSimple();
    
    // Cargar feed embed
    loadInstagramEmbed();
    
    // Programar actualización automática cada 24 horas
    scheduleDailyUpdate();
}

/**
 * Programar actualización automática diaria
 */
function scheduleDailyUpdate() {
    // Calcular tiempo hasta la próxima medianoche (o 24 horas desde ahora)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Medianoche
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Actualizar a medianoche y luego cada 24 horas
    setTimeout(() => {
        console.log('🔄 Actualización automática diaria de estadísticas de Instagram');
        fetchAndUpdateStats();
        
        // Programar siguiente actualización (cada 24 horas)
        setInterval(() => {
            console.log('🔄 Actualización automática diaria de estadísticas de Instagram');
            fetchAndUpdateStats();
        }, 24 * 60 * 60 * 1000); // 24 horas
    }, msUntilMidnight);
    
    console.log(`⏰ Próxima actualización automática: ${tomorrow.toLocaleString()}`);
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

