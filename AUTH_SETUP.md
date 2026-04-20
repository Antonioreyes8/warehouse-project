# Artist Authentication Setup Guide

This guide walks you through setting up Google OAuth authentication for artists in your Supabase-powered Next.js app.

## Prerequisites

- Supabase project created
- Next.js app with the authentication code implemented
- Artist profiles table exists in Supabase

## Step 1: Set Up Google OAuth in Supabase

### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret

### 1.2 Configure Supabase Auth

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication > Providers**
4. Find **Google** and click to enable it
5. Enter the Client ID and Client Secret from step 1.1
6. Click "Save"

## Step 2: Set Up Database Tables and Policies

### 2.1 Run Database Setup SQL

1. In your Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database-setup.sql`
3. Run the SQL commands

This will:

- Enable Row Level Security on the profiles table
- Create the authorized_artists table
- Set up RLS policies for secure access

### 2.2 Add Authorized Artist Emails

For each artist you want to grant access:

```sql
INSERT INTO authorized_artists (email) VALUES ('artist1@gmail.com');
INSERT INTO authorized_artists (email) VALUES ('artist2@gmail.com');
```

## Step 3: Create Artist Profiles

For each authorized artist, you need to create their profile manually:

### 3.1 Get the User's Auth ID

1. Have the artist sign in once (they'll see an error about profile not found)
2. In Supabase Dashboard, go to **Authentication > Users**
3. Find the user's email and copy their UUID (id column)

### 3.2 Create the Profile

In SQL Editor, run:

```sql
INSERT INTO profiles (id, email, name, username, is_artist)
VALUES (
    'paste-user-uuid-here',
    'artist@gmail.com',
    'Artist Name',
    'artist_username',
    true
);
```

## Step 4: Configure Environment Variables

Make sure your `.env.local` file has:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Test the Authentication Flow

1. Start your development server: `npm run dev`
2. Go to `/login`
3. Sign in with an authorized Google account
4. You should be redirected to `/dashboard/profile`
5. You should see your profile and be able to edit it
6. Changes should save to the database

## Step 6: Set Up Production Redirect URLs

When deploying to production:

1. In Supabase Auth settings, add production redirect URLs:
   - `https://yourdomain.com/dashboard/profile`
2. Update Google OAuth credentials with production domain if needed

## Troubleshooting

### "Email not authorized"

- Check that the email is in the `authorized_artists` table
- Verify the email matches exactly (case-sensitive)

### "Profile not found"

- Ensure the profile exists in the `profiles` table
- Prefer setting `profiles.id` to `auth.users.id` for clean ownership policies
- If your setup links by email, ensure `profiles.email` matches the signed-in Google email

### OAuth redirect issues

- Check that redirect URLs are correctly set in both Google Cloud Console and Supabase
- Ensure the URLs match your domain exactly

### Can't save changes

- Verify RLS policies are applied correctly
- Check that the user owns the profile (id matches auth.uid())

## Security Notes

- Only authorized emails can sign in
- Users can only edit their own profiles
- Public profile viewing is allowed for all users
- All database operations go through RLS policies

## Next Steps

- Consider adding profile pictures upload
- Add email notifications for profile updates
- Create an admin interface for managing authorized artists
- Add audit logging for profile changes
