# Artist Authentication Setup

This guide describes the authentication flow implemented in this repository and the Supabase configuration it depends on. The repository does not include SQL migrations or database setup scripts, so provision and verify the schema and policies separately.

## Prerequisites

- A Supabase project.
- A Google OAuth client configured as a web application.
- A deployed or local copy of this Next.js application.
- The database tables and policies described under [Database prerequisites](#database-prerequisites).

## 1. Configure Google OAuth

1. In Google Cloud Console, create OAuth credentials for a web application.
2. Set the authorized redirect URI to Supabase's provider callback:
   `https://<project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase Dashboard, open **Authentication > Providers > Google**, enable
   Google, and enter the Google client ID and secret.
4. In Supabase **Authentication > URL Configuration**, set the Site URL to the
   application origin and add each permitted application callback URL, such as
   `http://localhost:3000/auth/callback` and
   `https://your-domain.example/auth/callback`.

The Google redirect URI is the Supabase callback. The application redirect URI is `/auth/callback`; they are different hops in the OAuth flow.

## 2. Configure Environment Variables

Create `.env.local` in the project root. There is no `.env.example` file in this repository.

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

The first two values are used by the browser and server Supabase clients. The service-role key is used only for administrator data operations. Keep it server-side, do not prefix it with `NEXT_PUBLIC_`, and do not commit it. CI builds with placeholder public values and does not require the service-role key until an admin operation is invoked.

## 3. Database Prerequisites

The application references these resources:

- `allowed_users`: email, role, account status, and invitation metadata used for artist/admin authorization.
- `profiles`: public artist profile fields.
- `artist_works`: portfolio work rows associated with a profile.
- `admin_audit_log`: audit entries attempted by privileged admin mutations.
- `projects`: project data shown on home and project pages.

These tables, their columns, constraints, and indexes are not created by this repository. Confirm them in the target Supabase project before using the app. Enable and test Row Level Security for all browser-accessible data, and configure Storage policies for uploads. Client-side checks are not a security boundary.

To grant access, add an active row to `allowed_users` for the artist email. To bootstrap an administrator, ensure the first administrator's row has `role = 'admin'`. The admin feature also requires `SUPABASE_SERVICE_ROLE_KEY` in the server deployment.

An artist profile may need to be provisioned separately before the artist can edit it. The dashboard currently finds profiles by email. The repository has a known historical mismatch between `profiles.id` and the Supabase Auth UUID, so do not assume they can be joined directly without checking the deployed schema.

## 4. Authentication Flow

1. The artist chooses Google sign-in on `/login`.
2. The browser Supabase client starts OAuth and uses `/auth/callback` as the application redirect.
3. The callback exchanges the PKCE authorization code for a session.
4. The user is redirected to `/dashboard/profile` after successful session setup.
5. Artist authorization checks the signed-in email against an active `allowed_users` row.
6. The profile dashboard loads profile and work records and submits edits through the data helpers.

`middleware.ts` refreshes auth cookies for requests. Admin page/API handlers also check the current session and admin role server-side. The artist profile dashboard includes client-side access checks; production data security must therefore be enforced by database and Storage policies as well.

Suspension is an application allowlist state: it blocks authorization checks that consult `allowed_users`, but does not disable the Supabase Auth account and does not hide public artist pages.

## 5. Verify the Setup

1. Start the app with `npm run dev`.
2. Open `/login` and complete Google sign-in with an email present in `allowed_users`.
3. Confirm the callback returns to `/dashboard/profile` and that the profile row can be loaded.
4. Test profile edits and uploads against the configured RLS and Storage policies.
5. For admin setup, confirm `/dashboard/admin` is reachable only by an active administrator and verify each admin API rejects a non-admin.

## Troubleshooting

- **OAuth returns to the wrong page:** Check Supabase Site URL and Redirect URLs. The application callback is `/auth/callback`; ensure it is allowlisted for the correct origin.
- **Access denied after sign-in:** Confirm the authenticated email has an active `allowed_users` row. The app normalizes email case and whitespace for lookup.
- **Profile not found:** Confirm a `profiles` row exists for the signed-in email. The dashboard read currently uses email lookup.
- **Admin page/API unavailable:** Confirm the user has `role = 'admin'` and the server environment contains the correct `SUPABASE_SERVICE_ROLE_KEY` and project URL.
- **Database or upload permission errors:** Verify the deployed RLS policies, table schema, Storage bucket names, and Storage policies. Those are not installed by this repository.
