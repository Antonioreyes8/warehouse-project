-- Database setup for artist authentication and profiles
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create authorized_artists table for email allowlist
CREATE TABLE IF NOT EXISTS authorized_artists (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert authorized artist emails (replace with actual emails)
-- INSERT INTO authorized_artists (email) VALUES ('artist1@example.com'), ('artist2@example.com');

-- Update profiles table to include auth fields if not already present
-- Assuming profiles table exists with basic fields, add these if missing:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id UUID REFERENCES auth.users(id) PRIMARY KEY;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_artist BOOLEAN DEFAULT false;

-- Row Level Security policies for profiles table
-- Allow users to read all profiles (for public viewing)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Note: No INSERT or DELETE policies since profiles are managed by admin

-- Policy for authorized_artists table (admin only)
-- This assumes you have an admin role or handle this through the dashboard
CREATE POLICY "Only admins can manage authorized artists" ON authorized_artists
    FOR ALL USING (false); -- Disable RLS for now, handle through dashboard

-- Optional: Create a function to check if user is authorized
CREATE OR REPLACE FUNCTION is_authorized_artist(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM authorized_artists
        WHERE email = user_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;