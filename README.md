# recital

## Deployment

The site is built and published by GitHub Actions; deployment does not require building the website on a visitor's computer.

1. In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL` = `https://nunpvhdlxlimwskyoonk.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = the project's public `sb_publishable_...` key
2. In **Settings → Actions → General → Workflow permissions**, allow workflows read and write access so the deploy workflow can update `gh-pages`.
3. Keep GitHub Pages configured to serve the `gh-pages` branch from its root.
4. Merge changes into `main` or run **Actions → Build and deploy GitHub Pages → Run workflow**. The workflow builds with the public Supabase variables and publishes `dist` to `gh-pages`.

The publishable key is expected to be present in the browser bundle. Never add a Supabase `service_role` or secret key to a `VITE_` variable, GitHub variable, or frontend file.

## Supabase setup

1. Run [`supabase/migrations/20261030120000_presentation_api.sql`](./supabase/migrations/20261030120000_presentation_api.sql) in the Supabase SQL Editor. It creates a stage-filtered public read RPC and denies direct client access to the underlying tables.
2. Import content from the private local file. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your local shell, then run `npm run import:presentation-content`. The service-role key must remain private and is used only by the import script.
3. Generate a unique random password of at least 32 characters with a password manager or a cryptographically secure generator. In Supabase, open **Edge Functions → Secrets** and set `PRESENTATION_ADMIN_PASSWORD`. Do not put this password in the app, GitHub, source code, or a Vite variable.
4. Deploy the password-protected stage function with the Supabase CLI:

   ```powershell
   npx supabase login
   npx supabase functions deploy set-stage --project-ref nunpvhdlxlimwskyoonk
   ```

   The function uses Supabase's server-side `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to update the stage. Its `verify_jwt = false` setting is intentional: public viewers don't sign in, and the function itself checks the password before changing anything.
5. Until the developer menu is available, set the current stage in the Supabase SQL Editor:

   ```sql
   update public.presentation_control
   set stage = 12
   where id = true;
   ```

The developer menu can POST `{ "password": "...", "stage": 12 }` to `https://nunpvhdlxlimwskyoonk.supabase.co/functions/v1/set-stage`, with `Content-Type: application/json` and `apikey: VITE_SUPABASE_ANON_KEY` headers. It should keep the password only in memory and send it over HTTPS; the function never returns or logs it. The shared password authorizes a stage change but does not create user accounts. Anyone with the password can control the shared presentation, so use a strong password and rotate it if it is exposed.

The viewer site polls `get_presentation` every two seconds. Supabase returns only content released at the current stage. If the backend is unavailable or misconfigured, the site shows an error rather than falling back to bundled setlist text.

The content seed is `supabase/private-content.json`, which is deliberately Git-ignored. Keep a private backup. Content already released to a browser cannot be recalled from that browser, and removing text from the current client bundle does not erase it from prior public Git commits or previously deployed assets. If the text must be confidential, move the source content to a private repository and consider removing old history/deployment artifacts as well.
