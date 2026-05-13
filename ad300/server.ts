const ACCESS_TOKEN = Bun.env.META_ACCESS_TOKEN || '';
const PORT         = parseInt(Bun.env.PORT || '3000');
const META_VERSION = 'v21.0';
const META_BASE    = `https://graph.facebook.com/${META_VERSION}`;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = Bun.serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const file = Bun.file('./public/index.html');
      return new Response(file, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS },
      });
    }

    if (url.pathname === '/api/meta') {
      if (!ACCESS_TOKEN) {
        return Response.json(
          { error: 'META_ACCESS_TOKEN não configurado no .env' },
          { status: 500, headers: CORS }
        );
      }

      const metaPath   = url.searchParams.get('path') || '/me';
      const metaParams = new URLSearchParams();
      metaParams.set('access_token', ACCESS_TOKEN);

      for (const [key, value] of url.searchParams.entries()) {
        if (key === 'path') continue;
        metaParams.set(key, value);
      }

      const metaUrl = `${META_BASE}${metaPath}?${metaParams.toString()}`;

      try {
        const res  = await fetch(metaUrl);
        const json = await res.json();
        return Response.json(json, { status: res.status, headers: CORS });
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 502, headers: CORS });
      }
    }

    return new Response('Not found', { status: 404, headers: CORS });
  },
});

console.log(`\n🚀 AD-300 rodando em http://localhost:${server.port}\n`);