-- ==============================================================================
-- ADMIN ROLE & SUPABASE STORAGE POLICIES
-- ==============================================================================

-- 1. Add role to profiles table if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'artisan'));

-- 2. Storage Bucket for Furniture Assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture-assets', 'furniture-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public can view furniture assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'furniture-assets');

CREATE POLICY "Admins can upload furniture assets"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'furniture-assets' 
        AND (
            auth.role() = 'service_role' 
            OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
        )
    );

CREATE POLICY "Admins can update and delete furniture assets"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'furniture-assets' 
        AND (
            auth.role() = 'service_role' 
            OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
        )
    );
