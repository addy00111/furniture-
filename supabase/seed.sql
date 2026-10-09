-- ==============================================================================
-- SEED DATA: 12 ARCHITECTURAL FURNITURE MASTERPIECES
-- Categories: Sofas, Beds, Tables, Chairs
-- High-Resolution Architectural Photography from Unsplash
-- ==============================================================================

INSERT INTO public.products (
    id, name, slug, description, price, discount_price, category, material, dimensions, colors, stock, images, featured, rating
) VALUES
-- 1. SOFAS
(
    'a1111111-1111-1111-1111-111111111101',
    'Kanso Minimalist Bouclé Sectional',
    'kanso-minimalist-boucle-sectional',
    'Sculptural curved modular sofa crafted from Italian textured bouclé with a solid kiln-dried European ash core. Low-profile silhouette designed for contemporary architectural living spaces.',
    3200.00,
    2850.00,
    'Sofas',
    'Italian Bouclé & Solid European Ash',
    '280cm W x 110cm D x 72cm H',
    ARRAY['Oatmeal Ivory', 'Charcoal Slate', 'Terracotta Taupe'],
    12,
    ARRAY[
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.95
),
(
    'a1111111-1111-1111-1111-111111111102',
    'Brutalist Aniline Leather Loveseat',
    'brutalist-aniline-leather-loveseat',
    'Full-grain Tuscan saddle leather with pronounced French seam stitching and brushed raw gunmetal steel plinth base. Ages gracefully with a rich natural patina.',
    2400.00,
    2150.00,
    'Sofas',
    'Tuscan Saddle Leather & Gunmetal Steel',
    '190cm W x 95cm D x 74cm H',
    ARRAY['Cognac Amber', 'Obsidian Black', 'Espresso'],
    8,
    ARRAY[
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.90
),
(
    'a1111111-1111-1111-1111-111111111103',
    'Nordic Monolith 3-Seater Sofa',
    'nordic-monolith-3-seater-sofa',
    'Streamlined Scandinavian design featuring heavy-weight virgin wool upholstery over multi-density foam cushions and tapered smoked oak feet.',
    1950.00,
    NULL,
    'Sofas',
    'Virgin Melange Wool & Smoked Oak',
    '230cm W x 92cm D x 76cm H',
    ARRAY['Fog Grey', 'Forest Moss', 'Pebble Sand'],
    15,
    ARRAY[
        'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1600&q=85'
    ],
    false,
    4.82
),

-- 2. BEDS
(
    'a1111111-1111-1111-1111-111111111104',
    'Aethel Low-Platform King Bed',
    'aethel-low-platform-king-bed',
    'Monolithic platform bed with seamless cantilevered floating side ledges, built from sustainably harvested Japanese Hinoki cypress and American white walnut.',
    2890.00,
    2600.00,
    'Beds',
    'Solid White Walnut & Japanese Cypress',
    '225cm L x 215cm W x 80cm H',
    ARRAY['Natural Walnut', 'Smoked Black Ash', 'Bleached Oak'],
    6,
    ARRAY[
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.98
),
(
    'a1111111-1111-1111-1111-111111111105',
    'Serenade Upholstered Linen Bed',
    'serenade-upholstered-linen-bed',
    'Fluted headboard wrapped in Belgian stonewashed natural flax linen, framed by softened radius corners and integrated hidden acoustic dampening.',
    2250.00,
    NULL,
    'Beds',
    'Belgian Flax Linen & Birch Core',
    '215cm L x 195cm W x 115cm H',
    ARRAY['Stonewashed Oatmeal', 'Chalk White', 'Sage Dune'],
    10,
    ARRAY[
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85'
    ],
    false,
    4.88
),
(
    'a1111111-1111-1111-1111-111111111106',
    'Brutalist Floating Bed Frame',
    'brutalist-floating-bed-frame',
    'Illusionary floating architecture with concealed recessed pedestal base and perimeter warm LED channel recess beneath hand-rubbed ebonized oak.',
    3100.00,
    2750.00,
    'Beds',
    'Ebonized Solid Oak & Cast Iron Base',
    '230cm L x 210cm W x 75cm H',
    ARRAY['Midnight Ebonized Oak', 'Warm Honey Oak'],
    7,
    ARRAY[
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.92
),

-- 3. TABLES
(
    'a1111111-1111-1111-1111-111111111107',
    'Calacatta Viola Marble Dining Table',
    'calacatta-viola-marble-dining-table',
    'Honed monolithic slab of Italian Calacatta Viola marble with bold burgundy and ivory veining, supported by twin fluted pedestal marble columns.',
    4200.00,
    3800.00,
    'Tables',
    'Honed Italian Calacatta Viola Marble',
    '240cm L x 105cm W x 76cm H',
    ARRAY['Honed Viola Burgundy', 'Carrara White Vein'],
    4,
    ARRAY[
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.99
),
(
    'a1111111-1111-1111-1111-111111111108',
    'Kyoto Solid Travertine Coffee Table',
    'kyoto-solid-travertine-coffee-table',
    'Geometric dual-level cocktail table sculpted from unfilled Roman silver travertine stone, highlighting organic fissures and tactile stone texture.',
    1450.00,
    1290.00,
    'Tables',
    'Roman Unfilled Silver Travertine',
    '130cm L x 85cm W x 38cm H',
    ARRAY['Roman Silver', 'Beige Warm Sand'],
    14,
    ARRAY[
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85'
    ],
    false,
    4.87
),
(
    'a1111111-1111-1111-1111-111111111109',
    'Vanguard Solid Walnut Extendable Table',
    'vanguard-solid-walnut-extendable-table',
    'Engineered brass mechanical extension system nested inside a hand-finished American black walnut top with beveled knife edges.',
    2650.00,
    NULL,
    'Tables',
    'American Black Walnut & Brushed Brass',
    '200-280cm L x 95cm W x 75cm H',
    ARRAY['Deep Walnut', 'Natural Muted Teak'],
    9,
    ARRAY[
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85'
    ],
    false,
    4.84
),

-- 4. CHAIRS
(
    'a1111111-1111-1111-1111-111111111110',
    'Pavilion Architectural Lounge Chair & Ottoman',
    'pavilion-architectural-lounge-chair-and-ottoman',
    'Curvilinear mid-century inspired bent plywood lounge chair with deep-tufted top-grain semi-aniline leather cushions and die-cast aluminum swivel base.',
    1850.00,
    1590.00,
    'Chairs',
    'Palisander Wood, Aniline Leather & Cast Aluminum',
    '85cm W x 88cm D x 84cm H',
    ARRAY['Espresso Black', 'Caramel Tan', 'Ivory Cream'],
    18,
    ARRAY[
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1580481077195-c99066601ea0?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.97
),
(
    'a1111111-1111-1111-1111-111111111111',
    'Atelier Solid Ash Dining Chair (Set of 2)',
    'atelier-solid-ash-dining-chair-set-of-2',
    'Mastercrafted steam-bent solid ash backrest with hand-woven paper cord seat, offering ergonomic lumbar support with featherweight structural rigidity.',
    890.00,
    NULL,
    'Chairs',
    'Steam-Bent Ash & Natural Paper Cord',
    '54cm W x 52cm D x 78cm H (Seat 45cm)',
    ARRAY['Natural Ash / Kraft Cord', 'Matte Black / Black Cord'],
    22,
    ARRAY[
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1600&q=85'
    ],
    false,
    4.89
),
(
    'a1111111-1111-1111-1111-111111111112',
    'Sculptural Shearling Accent Armchair',
    'sculptural-shearling-accent-armchair',
    'Organic cocooning silhouette enveloped in ultra-soft genuine Australian shearling with a 360-degree silent burnished brass swivel mechanism.',
    1680.00,
    1420.00,
    'Chairs',
    'Australian Shearling & Burnished Brass',
    '82cm W x 80cm D x 74cm H',
    ARRAY['Cloud Cream', 'Camel Warm', 'Charcoal Dusk'],
    11,
    ARRAY[
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
        'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1600&q=85'
    ],
    true,
    4.94
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    category = EXCLUDED.category,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    colors = EXCLUDED.colors,
    stock = EXCLUDED.stock,
    images = EXCLUDED.images,
    featured = EXCLUDED.featured,
    rating = EXCLUDED.rating,
    updated_at = NOW();
