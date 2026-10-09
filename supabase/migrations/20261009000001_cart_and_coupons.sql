-- ==============================================================================
-- CART SYNC & COUPONS SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    max_discount NUMERIC(10, 2),
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default architectural promo codes
INSERT INTO public.coupons (code, discount_percent, max_discount, min_order_value, is_active)
VALUES 
    ('ARCHITECT10', 10.00, 50000.00, 10000.00, true),
    ('NOBLE15', 15.00, 100000.00, 25000.00, true),
    ('WELCOME5', 5.00, 20000.00, 0.00, true)
ON CONFLICT (code) DO NOTHING;

-- RLS
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
    ON public.user_carts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true);
