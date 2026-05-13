# AD-300

Dashboard de performance Meta Ads com proxy Bun.

## Estrutura

```
ad300/
├── server.ts          ← proxy Bun (appsecret_proof aqui, nunca no browser)
├── .env               ← suas credenciais (não commitar)
├── .env.example       ← template
└── public/
    └── index.html     ← dashboard
```

## Setup

### 1. Instalar Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Configurar .env
```bash
cp .env.example .env
```
Preencha no `.env`:
- `META_APP_SECRET` → developers.facebook.com → seu App → Configurações → Básico → App Secret
- `META_ACCESS_TOKEN` → System User Token com permissão `ads_read`

### 3. Rodar
```bash
bun run server.ts
```

### 4. Abrir
Acesse **http://localhost:3000** no browser.

---

## Como funciona

```
Browser → GET /api/meta?path=/me/adaccounts&fields=...
             ↓
         server.ts calcula appsecret_proof
             ↓
         graph.facebook.com/v21.0/me/adaccounts?access_token=...&appsecret_proof=...
             ↓
         Resposta volta para o browser
```

O token e o App Secret ficam **apenas no servidor**. O browser nunca os vê.
