# CuidAR Release Checklist

## Pre-release (must pass)
1. `npm ci` on clean workspace.
2. `npm test -- --watch=false` passes.
3. `npm run build` passes.
4. `npm audit --omit=dev` reports 0 vulnerabilities.
5. Supabase migration status is clean (`supabase db push` already applied).
6. Edge function secrets are configured:
   - `ALLOWED_ORIGINS`
   - `ADMIN_EMAILS`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Deployment Steps
1. Deploy frontend to Vercel.
2. Deploy edge functions:

```bash
supabase functions deploy admin
supabase functions deploy formularios
```

3. Apply DB migrations if pending:

```bash
supabase db push
```

## Post-release validation (within 10 minutes)
1. Run smoke test script.
2. Login as admin and open panel.
3. Verify first tab loads quickly.
4. Verify page navigation works in panel.
5. Create one test form submission in non-production data path.

## Release Go/No-Go Rule
- Go only if all pre-release and post-release checks pass.
- No-Go if any of these fail:
  - smoke test
  - admin panel cannot list records
  - unexpected 5xx rate spike
