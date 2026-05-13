const META_VERSION = 'v21.0';
const META_BASE    = `https://graph.facebook.com/${META_VERSION}`;

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() };
  }

  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'META_ACCESS_TOKEN não configurado nas variáveis de ambiente do Netlify' }),
    };
  }

  const params   = event.queryStringParameters || {};
  const metaPath = params.path || '/me';

  const metaParams = new URLSearchParams();
  metaParams.set('access_token', ACCESS_TOKEN);

  for (const [key, value] of Object.entries(params)) {
    if (key === 'path') continue;
    metaParams.set(key, value);
  }

  const metaUrl = `${META_BASE}${metaPath}?${metaParams.toString()}`;

  try {
    const res  = await fetch(metaUrl);
    const json = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      body: JSON.stringify(json),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders(),
      body: JSON.stringify({ error: String(err) }),
    };
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}