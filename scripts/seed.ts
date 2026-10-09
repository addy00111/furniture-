import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_URL.includes('placeholder')) {
  console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const products = [
  {
    id: 'a1111111-1111-1111-1111-111111111101',
    name: 'Kanso Minimalist Bouclé Sectional',
    slug: 'kanso-minimalist-boucle-sectional',
    description: 'Sculptural curved modular sofa crafted from Italian textured bouclé with a solid kiln-dried European ash core. Low-profile silhouette designed for contemporary architectural living spaces.',
    price: 3200.00,
    discount_price: 2850.00,
    category: 'Sofas',
    material: 'Italian Bouclé & Solid European Ash',
    dimensions: '280cm W x 110cm D x 72cm H',
    colors: ['Oatmeal Ivory', 'Charcoal Slate', 'Terracotta Taupe'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.95
  },
  {
    id: 'a1111111-1111-1111-1111-111111111102',
    name: 'Brutalist Aniline Leather Loveseat',
    slug: 'brutalist-aniline-leather-loveseat',
    description: 'Full-grain Tuscan saddle leather with pronounced French seam stitching and brushed raw gunmetal steel plinth base. Ages gracefully with a rich natural patina.',
    price: 2400.00,
    discount_price: 2150.00,
    category: 'Sofas',
    material: 'Tuscan Saddle Leather & Gunmetal Steel',
    dimensions: '190cm W x 95cm D x 74cm H',
    colors: ['Cognac Amber', 'Obsidian Black', 'Espresso'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.90
  },
  {
    id: 'a1111111-1111-1111-1111-111111111103',
    name: 'Nordic Monolith 3-Seater Sofa',
    slug: 'nordic-monolith-3-seater-sofa',
    description: 'Streamlined Scandinavian design featuring heavy-weight virgin wool upholstery over multi-density foam cushions and tapered smoked oak feet.',
    price: 1950.00,
    discount_price: null,
    category: 'Sofas',
    material: 'Virgin Melange Wool & Smoked Oak',
    dimensions: '230cm W x 92cm D x 76cm H',
    colors: ['Fog Grey', 'Forest Moss', 'Pebble Sand'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: false,
    rating: 4.82
  },
  {
    id: 'a1111111-1111-1111-1111-111111111104',
    name: 'Aethel Low-Platform King Bed',
    slug: 'aethel-low-platform-king-bed',
    description: 'Monolithic platform bed with seamless cantilevered floating side ledges, built from sustainably harvested Japanese Hinoki cypress and American white walnut.',
    price: 2890.00,
    discount_price: 2600.00,
    category: 'Beds',
    material: 'Solid White Walnut & Japanese Cypress',
    dimensions: '225cm L x 215cm W x 80cm H',
    colors: ['Natural Walnut', 'Smoked Black Ash', 'Bleached Oak'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.98
  },
  {
    id: 'a1111111-1111-1111-1111-111111111105',
    name: 'Serenade Upholstered Linen Bed',
    slug: 'serenade-upholstered-linen-bed',
    description: 'Fluted headboard wrapped in Belgian stonewashed natural flax linen, framed by softened radius corners and integrated hidden acoustic dampening.',
    price: 2250.00,
    discount_price: null,
    category: 'Beds',
    material: 'Belgian Flax Linen & Birch Core',
    dimensions: '215cm L x 195cm W x 115cm H',
    colors: ['Stonewashed Oatmeal', 'Chalk White', 'Sage Dune'],
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: false,
    rating: 4.88
  },
  {
    id: 'a1111111-1111-1111-1111-111111111106',
    name: 'Brutalist Floating Bed Frame',
    slug: 'brutalist-floating-bed-frame',
    description: 'Illusionary floating architecture with concealed recessed pedestal base and perimeter warm LED channel recess beneath hand-rubbed ebonized oak.',
    price: 3100.00,
    discount_price: 2750.00,
    category: 'Beds',
    material: 'Ebonized Solid Oak & Cast Iron Base',
    dimensions: '230cm L x 210cm W x 75cm H',
    colors: ['Midnight Ebonized Oak', 'Warm Honey Oak'],
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.92
  },
  {
    id: 'a1111111-1111-1111-1111-111111111107',
    name: 'Calacatta Viola Marble Dining Table',
    slug: 'calacatta-viola-marble-dining-table',
    description: 'Honed monolithic slab of Italian Calacatta Viola marble with bold burgundy and ivory veining, supported by twin fluted pedestal marble columns.',
    price: 4200.00,
    discount_price: 3800.00,
    category: 'Tables',
    material: 'Honed Italian Calacatta Viola Marble',
    dimensions: '240cm L x 105cm W x 76cm H',
    colors: ['Honed Viola Burgundy', 'Carrara White Vein'],
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.99
  },
  {
    id: 'a1111111-1111-1111-1111-111111111108',
    name: 'Kyoto Solid Travertine Coffee Table',
    slug: 'kyoto-solid-travertine-coffee-table',
    description: 'Geometric dual-level cocktail table sculpted from unfilled Roman silver travertine stone, highlighting organic fissures and tactile stone texture.',
    price: 1450.00,
    discount_price: 1290.00,
    category: 'Tables',
    material: 'Roman Unfilled Silver Travertine',
    dimensions: '130cm L x 85cm W x 38cm H',
    colors: ['Roman Silver', 'Beige Warm Sand'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: false,
    rating: 4.87
  },
  {
    id: 'a1111111-1111-1111-1111-111111111109',
    name: 'Vanguard Solid Walnut Extendable Table',
    slug: 'vanguard-solid-walnut-extendable-table',
    description: 'Engineered brass mechanical extension system nested inside a hand-finished American black walnut top with beveled knife edges.',
    price: 2650.00,
    discount_price: null,
    category: 'Tables',
    material: 'American Black Walnut & Brushed Brass',
    dimensions: '200-280cm L x 95cm W x 75cm H',
    colors: ['Deep Walnut', 'Natural Muted Teak'],
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: false,
    rating: 4.84
  },
  {
    id: 'a1111111-1111-1111-1111-111111111110',
    name: 'Pavilion Architectural Lounge Chair & Ottoman',
    slug: 'pavilion-architectural-lounge-chair-and-ottoman',
    description: 'Curvilinear mid-century inspired bent plywood lounge chair with deep-tufted top-grain semi-aniline leather cushions and die-cast aluminum swivel base.',
    price: 1850.00,
    discount_price: 1590.00,
    category: 'Chairs',
    material: 'Palisander Wood, Aniline Leather & Cast Aluminum',
    dimensions: '85cm W x 88cm D x 84cm H',
    colors: ['Espresso Black', 'Caramel Tan', 'Ivory Cream'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1580481077195-c99066601ea0?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.97
  },
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Atelier Solid Ash Dining Chair (Set of 2)',
    slug: 'atelier-solid-ash-dining-chair-set-of-2',
    description: 'Mastercrafted steam-bent solid ash backrest with hand-woven paper cord seat, offering ergonomic lumbar support with featherweight structural rigidity.',
    price: 890.00,
    discount_price: null,
    category: 'Chairs',
    material: 'Steam-Bent Ash & Natural Paper Cord',
    dimensions: '54cm W x 52cm D x 78cm H (Seat 45cm)',
    colors: ['Natural Ash / Kraft Cord', 'Matte Black / Black Cord'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: false,
    rating: 4.89
  },
  {
    id: 'a1111111-1111-1111-1111-111111111112',
    name: 'Sculptural Shearling Accent Armchair',
    slug: 'sculptural-shearling-accent-armchair',
    description: 'Organic cocooning silhouette enveloped in ultra-soft genuine Australian shearling with a 360-degree silent burnished brass swivel mechanism.',
    price: 1680.00,
    discount_price: 1420.00,
    category: 'Chairs',
    material: 'Australian Shearling & Burnished Brass',
    dimensions: '82cm W x 80cm D x 74cm H',
    colors: ['Cloud Cream', 'Camel Warm', 'Charcoal Dusk'],
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1600&q=85'
    ],
    featured: true,
    rating: 4.94
  }
]

async function seed() {
  console.log('🌱 Seeding architectural furniture products into Supabase...')
  const { data, error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Successfully seeded ${data?.length || 0} furniture products!`)
}

seed()
