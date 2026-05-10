# Sprint 3 — Claude AI Integration Setup

## 1. Deploy the Edge Function

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set your Anthropic API key as a secret (never in .env)
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE

# Deploy the Edge Function
npx supabase functions deploy claude-proxy
```

## 2. Verify the function is live

```bash
npx supabase functions list
```

You should see `claude-proxy` with status `Active`.

## 3. Test the function

```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/claude-proxy \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello"}]}'
```

## 4. File placement in your project

Copy files to their matching paths:

| Sprint 3 file | Destination |
|---|---|
| `supabase/functions/claude-proxy/index.ts` | Same path in your project |
| `src/prompts/*.ts` | `src/prompts/` (new folder) |
| `src/api/claude.ts` | `src/api/claude.ts` |
| `src/stores/coachStore.ts` | `src/stores/coachStore.ts` |
| `src/hooks/useCoach.ts` | `src/hooks/useCoach.ts` |
| `src/components/coach/*.tsx` | `src/components/coach/` (new folder) |
| `src/screens/coach/CoachScreen.tsx` | Replace existing placeholder |

## 5. No new npm packages needed

All dependencies are already installed from Sprint 1.
