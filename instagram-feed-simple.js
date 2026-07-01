/**
 * ALMA Kids — Instagram en vivo
 * Obtiene datos desde una Netlify Function para mantener el token fuera del navegador.
 */
(() => {
  'use strict';

  const endpoint = '/.netlify/functions/instagram-profile';
  const profileUrl = 'https://www.instagram.com/almakids.cl/';
  const numberFormatter = new Intl.NumberFormat('es-CL');

  const byId = (id) => document.getElementById(id);

  function setText(id, value) {
    const element = byId(id);
    if (element) element.textContent = value;
  }

  function formatNumber(value) {
    return Number.isFinite(Number(value)) ? numberFormatter.format(Number(value)) : '—';
  }

  function setStatus(message, state = '') {
    const status = byId('instagramSyncStatus');
    if (!status) return;
    status.classList.remove('is-live', 'is-unavailable');
    if (state) status.classList.add(state);
    const dot = '<span class="instagram-live-dot" aria-hidden="true"></span>';
    status.innerHTML = `${dot}${message}`;
  }

  function createPost(media) {
    const url = media.permalink || profileUrl;
    const imageUrl = media.thumbnail_url || media.media_url;
    if (!imageUrl) return null;

    const link = document.createElement('a');
    link.className = 'instagram-live-post';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Abrir publicación de ALMA Kids en Instagram');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = media.caption ? media.caption.slice(0, 120) : 'Publicación de ALMA Kids en Instagram';
    image.loading = 'lazy';
    image.decoding = 'async';

    const icon = document.createElement('span');
    icon.innerHTML = media.media_type === 'VIDEO'
      ? '<i class="fas fa-play" aria-hidden="true"></i>'
      : '<i class="fab fa-instagram" aria-hidden="true"></i>';

    link.append(image, icon);
    return link;
  }

  function renderMedia(items) {
    const container = byId('instagramFeed');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    const fragment = document.createDocumentFragment();
    items.slice(0, 6).forEach((item) => {
      const post = createPost(item);
      if (post) fragment.appendChild(post);
    });

    if (fragment.childNodes.length) {
      container.replaceChildren(fragment);
    }
  }

  async function loadInstagramProfile() {
    if (!byId('instagramStats')) return;

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.configured === false) {
        setStatus('Perfil enlazado. La actualización automática se activará al conectar la API oficial de Meta.', 'is-unavailable');
        return;
      }

      setText('followerCount', formatNumber(payload.followers_count));
      setText('postCount', formatNumber(payload.media_count));
      setText('followingCount', formatNumber(payload.follows_count));

      const followingStat = byId('followingStat');
      if (followingStat && payload.follows_count == null) {
        followingStat.hidden = true;
      }

      renderMedia(payload.media);

      const updatedAt = payload.updated_at
        ? new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(payload.updated_at))
        : null;

      setStatus(
        updatedAt
          ? `Datos sincronizados automáticamente desde Instagram · ${updatedAt}`
          : 'Datos sincronizados automáticamente desde Instagram.',
        'is-live'
      );
    } catch (error) {
      console.warn('No fue posible sincronizar Instagram:', error);
      setStatus('No pudimos actualizar las cifras en este momento. El enlace al perfil sigue disponible.', 'is-unavailable');
    }
  }

  document.addEventListener('DOMContentLoaded', loadInstagramProfile, { once: true });
})();
