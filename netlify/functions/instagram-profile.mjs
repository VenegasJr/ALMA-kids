const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

async function fetchGraphJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Meta Graph API respondió ${response.status}`;
    throw new Error(message);
  }
  return data;
}

export default async (request) => {
  if (request.method !== 'GET') {
    return json({ error: 'Método no permitido.' }, 405, { allow: 'GET' });
  }

  const userId = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = process.env.INSTAGRAM_API_VERSION || 'v25.0';

  if (!userId || !accessToken) {
    return json({
      configured: false,
      message: 'Faltan INSTAGRAM_USER_ID e INSTAGRAM_ACCESS_TOKEN en Netlify.'
    }, 503, { 'cache-control': 'no-store' });
  }

  try {
    const base = `https://graph.facebook.com/${encodeURIComponent(apiVersion)}`;
    const token = encodeURIComponent(accessToken);
    const fields = [
      'id',
      'username',
      'biography',
      'profile_picture_url',
      'followers_count',
      'follows_count',
      'media_count'
    ].join(',');

    const profileUrl = `${base}/${encodeURIComponent(userId)}?fields=${encodeURIComponent(fields)}&access_token=${token}`;
    const mediaUrl = `${base}/${encodeURIComponent(userId)}/media?fields=${encodeURIComponent('id,caption,media_type,media_url,permalink,thumbnail_url,timestamp')}&limit=6&access_token=${token}`;

    const [profileResult, mediaResult] = await Promise.allSettled([
      fetchGraphJson(profileUrl),
      fetchGraphJson(mediaUrl)
    ]);

    if (profileResult.status === 'rejected') {
      throw profileResult.reason;
    }

    const profile = profileResult.value;
    const media = mediaResult.status === 'fulfilled' && Array.isArray(mediaResult.value?.data)
      ? mediaResult.value.data
      : [];

    return json({
      configured: true,
      id: profile.id,
      username: profile.username,
      biography: profile.biography || '',
      profile_picture_url: profile.profile_picture_url || '',
      followers_count: profile.followers_count ?? null,
      follows_count: profile.follows_count ?? null,
      media_count: profile.media_count ?? null,
      media,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Instagram profile sync failed:', error?.message || error);
    return json({
      configured: true,
      error: 'No fue posible sincronizar Instagram en este momento.'
    }, 502, { 'cache-control': 'no-store' });
  }
};
