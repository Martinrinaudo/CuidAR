# CuidAR Incident Response

## Severity Levels
- SEV-1: Full outage (frontend unavailable, auth down, all forms failing)
- SEV-2: Major feature broken (admin panel down, high 5xx)
- SEV-3: Degraded but usable (slow responses, intermittent failures)

## First 10 Minutes
1. Confirm incident scope (frontend, functions, or DB).
2. Run smoke test script.
3. Check Vercel deployment history.
4. Check Supabase Edge Function logs.
5. Decide rollback or hotfix path.

## Common Incidents

### 1) Admin panel returns 403 for all admins
Checks:
1. `ADMIN_EMAILS` secret is present and correct.
2. `ALLOWED_ORIGINS` includes current frontend URL.
3. `public.admin_users` contains active user email.

### 2) Admin panel returns 5xx / timeouts
Checks:
1. `admin/health` endpoint status.
2. Supabase function logs for query failures.
3. DB latency and row count growth.
Actions:
1. Reduce page size temporarily.
2. Roll back function to previous working version if needed.

### 3) Public forms fail to submit
Checks:
1. `formularios/health` endpoint status.
2. RLS insert policies still present.
3. CORS (`ALLOWED_ORIGINS`) includes frontend URL.

## Rollback Decision
Trigger rollback when:
1. SEV-1 or SEV-2 persists > 15 minutes.
2. Data integrity risk is detected.
3. Login/admin access is broken for all admins.

## Postmortem (within 24h)
1. Timeline of incident.
2. Root cause.
3. Corrective action.
4. Preventive action and owner.
