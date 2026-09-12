# Deploy to Hostinger — Node.js Web App (Passenger)

## Build

```bash
npm ci
npm run build
```

This produces `.next/standalone/` — a self-contained Node.js server.

The `postbuild` script runs automatically after `npm run build` and copies
`public/` and `.next/static/` into `.next/standalone/`. No manual step needed.

> **Note:** The `postbuild` script uses `cp -r` (Linux). It runs automatically
> on Hostinger's Linux build environment. On Windows, it will silently fail
> (non-fatal) — use WSL or Git Bash if building locally on Windows.

## hPanel "Setup Node.js App" Form

| Field | Value |
|---|---|
| **Application startup file** | `.next/standalone/server.js` |
| **Application root** | (project root — where `package.json` lives) |
| **Node.js version** | 24.x |
| **Installation command** | `npm ci` |
| **Build command** | `npm run build` |

> The build command triggers `postbuild` automatically, which copies static
> assets into `.next/standalone/`. No separate "After First Deploy" step needed.

## Required Environment Variables

Set these in hPanel's Node.js App → Environment Variables:

| Variable | Example | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Required for Next.js production mode |
| `PORT` | `3000` | Set automatically by hPanel, but verify |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **SECRET** — server-only, never exposed to client |
| `MIDTRANS_SERVER_KEY` | `SB-Mid-server-...` | Midtrans server key |
| `MIDTRANS_IS_PRODUCTION` | `false` | Set to `true` when Midtrans is live |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | `SB-Mid-client-...` | Midtrans client key (currently unused in code) |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Used in sitemap/robots |

## Health Check

After deploy, verify the process is alive:

```
GET https://yourdomain.com/api/health
→ {"status":"ok"}
```

## Important Notes

### Passenger Compatibility

This app uses **Next.js 16.3.0** with:
- **App Router** (all routes in `app/`)
- **Server Components** (SSR on every request)
- **`proxy.ts`** middleware (Next.js 16 naming convention)
- **Server Actions** (`"use server"`)

Hostinger's Passenger-based runtime may not fully support all Next.js 16 features. Verify after deploy:

1. `/api/health` returns `{"status":"ok"}` — confirms Node process is alive
2. Homepage renders HTML — confirms SSR works
3. `/admin/login` loads — confirms middleware (`proxy.ts`) is active
4. `/donasi` loads with campaign data — confirms Supabase connection works
5. Submit a test donation (Midtrans) — confirms payment flow works

If any of these fail, the issue is likely Passenger not supporting the full Next.js 16 runtime. In that case, consider Hostinger's dedicated Next.js/Node.js Web Apps hosting instead.

### Webhook

The Midtrans webhook endpoint (`/api/payments/webhook`) must be publicly accessible. Configure the webhook URL in Midtrans dashboard:

```
https://yourdomain.com/api/payments/webhook
```
