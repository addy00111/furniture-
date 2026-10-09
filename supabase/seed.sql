-- ==============================================================================
-- SEED DATA: 8 DEFINITIVE ARCHITECTURAL NORD-JAPANDI FURNITURE PIECES
-- Categories: Living Room, Dining Room, Bedroom, Home Office, Decor
-- High-Resolution Architectural Photography from Unsplash
-- ==============================================================================

TRUNCATE TABLE public.products CASCADE;

INSERT INTO public.products (
    id, name, slug, description, price, discount_price, category, material, dimensions, colors, stock, images, featured, rating
) VALUES
-- 1. LIVING ROOM
(
    'nj-lounge-01',
    'Kanso Curved Bouclé Sofa',
    'kanso-curved-boucle-sofa',
    'Sculptural curved sofa upholstered in heavy Italian bouclé over a solid kiln-dried European ash frame. Low-profile silhouette designed for comfort and modern living spaces.',
    320000.00,
    285000.00,
    'Living Room',
    'Italian Bouclé & Solid European Ash',
    '280cm W x 110cm D x 72cm H (Seat 40cm)',
    ARRAY['Ivory Bouclé', 'Oatmeal Chenille', 'Charcoal Wool'],
    8,
    ARRAY[
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    4.96
),
(
    'nj-lounge-02',
    'Kyoto Minimalist Linen Daybed',
    'kyoto-minimalist-linen-daybed',
    'Low-slung daybed with Japanese Hinoki slatted base and removable cylindrical bolster wrapped in premium Belgian flax linen.',
    210000.00,
    195000.00,
    'Living Room',
    'Japanese Hinoki Cypress & Belgian Flax Linen',
    '205cm L x 85cm W x 42cm H',
    ARRAY['Dusk Grey', 'Stonewashed Oatmeal', 'Moss Olive'],
    6,
    ARRAY[
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    4.89
),

-- 2. DINING ROOM
(
    'nj-dining-01',
    'Sora Solid White-Oak Dining Table',
    'sora-solid-white-oak-dining-table',
    'Monolithic 8-seater dining table handcrafted from sustainably harvested European white oak with subtle bullnose radius edging and trestle joinery.',
    275000.00,
    245000.00,
    'Dining Room',
    'Solid European White Oak',
    '240cm L x 100cm W x 76cm H',
    ARRAY['Bleached White Oak', 'Smoked Muted Oak', 'Ebonized Black'],
    5,
    ARRAY[
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    4.98
),
(
    'nj-dining-02',
    'Cane-Back Atelier Bistro Chair',
    'cane-back-atelier-bistro-chair',
    'Steam-bent solid ash frame paired with natural French hand-woven cane rattan backrest and contoured seat cushion.',
    98000.00,
    88000.00,
    'Dining Room',
    'Steam-Bent Ash & French Natural Cane',
    '52cm W x 54cm D x 79cm H (Seat 45cm)',
    ARRAY['Natural Ash / Cane', 'Matte Black / Cane'],
    14,
    ARRAY[
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    4.91
),

-- 3. BEDROOM
(
    'nj-bed-01',
    'Aethel Low-Profile Platform Bed',
    'aethel-low-profile-hinoki-platform-bed',
    'Modern platform bed with seamless cantilevered floating side ledges, crafted from Japanese Hinoki cypress and American walnut.',
    289000.00,
    260000.00,
    'Bedroom',
    'Japanese Hinoki Cypress & American Walnut',
    '225cm L x 215cm W x 78cm H',
    ARRAY['Natural Hinoki', 'Smoked Charcoal Oak'],
    6,
    ARRAY[
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    4.99
),
(
    'nj-bed-02',
    'Serenade Upholstered Linen Bed',
    'serenade-tailored-linen-bed',
    'Generously proportioned headboard wrapped in tactile Belgian stonewashed flax linen with comfortable high-density padding and solid birch inner structure.',
    235000.00,
    215000.00,
    'Bedroom',
    'Belgian Flax Linen & Birch Core',
    '215cm L x 195cm W x 110cm H',
    ARRAY['Chalk Oatmeal', 'Soft Sage Dune', 'Pebble Grey'],
    9,
    ARRAY[
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    4.88
),

-- 4. HOME OFFICE
(
    'nj-studio-01',
    'Atelier Solid Oak Writing Desk',
    'atelier-minimalist-oak-writing-desk',
    'Minimalist executive writing desk with concealed cable management channel, precision beveled edge, and dual felt-lined storage drawers.',
    165000.00,
    145000.00,
    'Home Office',
    'European White Oak & Powdercoat Steel',
    '160cm W x 75cm D x 74cm H',
    ARRAY['Natural Matte Oak', 'Smoked Black Ash'],
    7,
    ARRAY[
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    false,
    4.92
),

-- 5. DECOR
(
    'nj-accent-01',
    'Alabaster Spherical Pedestal Table',
    'alabaster-spherical-pedestal-table',
    'Sculptural accent table carved from a single block of natural translucent Spanish alabaster with subtle amber veining.',
    85000.00,
    75000.00,
    'Decor',
    'Honed Natural Spanish Alabaster',
    '42cm Dia x 48cm H',
    ARRAY['Translucent Amber Cloud', 'Pure White Vein'],
    10,
    ARRAY[
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    true,
    4.98
);
