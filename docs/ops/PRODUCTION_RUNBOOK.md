# CuidAR Production Runbook

## Scope
This runbook covers operation of:
- Frontend on Vercel
- Supabase Auth/Postgres
- Supabase Edge Functions (`admin`, `formularios`)

## Critical URLs
Set and verify these values for each environment:
- Frontend URL: `https://<your-vercel-domain>`
- Supabase project URL: `https://<project-ref>.supabase.co`
- Admin function health: `https://<project-ref>.supabase.co/functions/v1/admin/health`
- Formularios function health: `https://<project-ref>.supabase.co/functions/v1/formularios/health`

## Secrets Required
- `ALLOWED_ORIGINS`
- `ADMIN_EMAILS`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Standard Health Check
Run from repo root:

```powershell
./scripts/smoke-test.ps1 -FrontendUrl "https://<your-vercel-domain>" -SupabaseProjectUrl "https://<project-ref>.supabase.co" -AllowedOrigin "https://<your-vercel-domain>"
```

Expected:
- Frontend returns HTTP 200
- `/admin/health` returns `{ ok: true }`
- `/formularios/health` returns `{ ok: true }`

## SLO Targets (initial)
- Availability: >= 99.5%
- P95 response time for health and list endpoints: <= 1200 ms
- 5xx error rate: < 1% over 15 minutes

## Daily Operation Checklist
1. Check Vercel deployment status and failed builds.
2. Check Supabase Edge Function error logs.
3. Run smoke test script.
4. Confirm no spike in 403/429/5xx for last 24h.

## Weekly Operation Checklist
1. Run `npm audit --omit=dev` in `cuidar-frontend`.
2. Verify CI passed on latest `main` commit.
3. Review admin user list in `public.admin_users`.
4. Verify RLS policies still enabled on all business tables.

## Escalation Path
1. On-call developer investigates.
2. If user impact > 15 minutes, trigger rollback.
3. If auth/data risk is suspected, disable admin access temporarily and rotate credentials.
