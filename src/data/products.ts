import { Product } from '@/types'

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'

export const FINISH_IMAGE_MAP: Record<string, string> = {
  // Serenade Bed
  'Chalk Oatmeal': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'Soft Sage Dune': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
  'Pebble Grey': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',

  // Aethel Platform Bed
  'Natural Hinoki & Walnut': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'Smoked Charcoal Oak': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',

  // Kanso Sectional
  'Oatmeal Ivory': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
  'Charcoal Slate': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85',
  'Terracotta Taupe': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',

  // Mori Lounge Chair
  'Natural Walnut / Cognac': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
  'Smoked Ash / Charcoal': 'https://images.unsplash.com/photo-1580481077195-c99066601ea0?auto=format&fit=crop&w=1600&q=85',

  // Kyoto Daybed
  'Stonewashed Oatmeal': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=85',
  'Dusk Grey': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
  'Moss Olive': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',

  // Sora Dining Table
  'Bleached White Oak': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
  'Smoked Muted Oak': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85',
  'Ebonized Black': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',

  // Cane Bistro Chair
  'Natural Ash / Cane': 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=85',
  'Matte Black / Cane': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1600&q=85',

  // Travertine Console
  'Roman Silver Travertine': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
  'Warm Ivory Sandstone': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85',

  // Monolith Nightstand
  'Natural White Oak': 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85',
  'Smoked Espresso': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85',

  // Atelier Writing Desk
  'Natural Matte Oak': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
  'Smoked Black Ash': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85',

  // Ribbed Credenza
  'Light White Oak': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85',
  'Deep Walnut': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85',

  // Alabaster Table
  'Translucent Amber Cloud': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
  'Pure White Vein': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85',

  // Ceramic Vessel
  'Raw Ash Taupe': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1600&q=85',
  'Charcoal Basalt': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=85',
}

export const NORD_JAPANDI_PRODUCTS: Product[] = [
  // 1. LIVING ROOM
  {
    id: 'nj-lounge-01',
    name: 'Kanso Curved Bouclé Sectional',
    slug: 'kanso-curved-boucle-sectional',
    description: 'Sculptural curved modular sofa upholstered in heavy Italian bouclé over a solid kiln-dried European ash frame. Low-profile silhouette designed for comfort and modern living spaces.',
    price: 320000,
    discount_price: 285000,
    category: 'Living Room',
    material: 'Italian Bouclé & Solid European Ash',
    dimensions: '280cm W x 110cm D x 72cm H (Seat 40cm)',
    colors: ['Oatmeal Ivory', 'Charcoal Slate', 'Terracotta Taupe'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.96,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-lounge-02',
    name: 'Mori Oiled Walnut Lounge Chair',
    slug: 'mori-oiled-walnut-lounge-chair',
    description: 'Hand-shaped solid American black walnut frame treated with natural Danish organic oils. Features deep-tufted semi-aniline saddle leather cushioning.',
    price: 185000,
    discount_price: 165000,
    category: 'Living Room',
    material: 'American Black Walnut & Saddle Leather',
    dimensions: '86cm W x 88cm D x 76cm H',
    colors: ['Natural Walnut / Cognac', 'Smoked Ash / Charcoal'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1580481077195-c99066601ea0?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.94,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-lounge-03',
    name: 'Kyoto Minimalist Linen Daybed',
    slug: 'kyoto-minimalist-linen-daybed',
    description: 'Low-slung daybed with Japanese Hinoki slatted base and removable cylindrical bolster wrapped in premium Belgian flax linen.',
    price: 210000,
    discount_price: null,
    category: 'Living Room',
    material: 'Japanese Hinoki Cypress & Belgian Flax Linen',
    dimensions: '205cm L x 85cm W x 42cm H',
    colors: ['Stonewashed Oatmeal', 'Dusk Grey', 'Moss Olive'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: false,
    rating: 4.89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 2. DINING ROOM
  {
    id: 'nj-dining-01',
    name: 'Sora Solid White Oak Dining Table',
    slug: 'sora-solid-white-oak-dining-table',
    description: 'Monolithic 8-seater dining table handcrafted from sustainably harvested European white oak with subtle bullnose radius edging and trestle joinery.',
    price: 275000,
    discount_price: 245000,
    category: 'Dining Room',
    material: 'Solid European White Oak',
    dimensions: '240cm L x 100cm W x 76cm H',
    colors: ['Bleached White Oak', 'Smoked Muted Oak', 'Ebonized Black'],
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-dining-02',
    name: 'Cane-Back Dining Bistro Chair (Set of 2)',
    slug: 'cane-back-dining-bistro-chair-pair',
    description: 'Steam-bent solid ash frame paired with natural French hand-woven cane rattan backrest and contoured seat cushion.',
    price: 98000,
    discount_price: 88000,
    category: 'Dining Room',
    material: 'Steam-Bent Ash & French Natural Cane',
    dimensions: '52cm W x 54cm D x 79cm H (Seat 45cm)',
    colors: ['Natural Ash / Cane', 'Matte Black / Cane'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: false,
    rating: 4.91,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-dining-03',
    name: 'Fluted Silver Travertine Console Table',
    slug: 'fluted-silver-travertine-console',
    description: 'Carved from Roman silver travertine stone, highlighting organic natural voids and architectural fluted pedestal pillars.',
    price: 195000,
    discount_price: null,
    category: 'Dining Room',
    material: 'Honed Roman Silver Travertine',
    dimensions: '160cm L x 42cm W x 82cm H',
    colors: ['Roman Silver Travertine', 'Warm Ivory Sandstone'],
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.97,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 3. BEDROOM
  {
    id: 'nj-bed-01',
    name: 'Aethel Low-Profile Platform Bed',
    slug: 'aethel-low-profile-hinoki-platform-bed',
    description: 'Modern platform bed with seamless cantilevered floating side ledges, crafted from Japanese Hinoki cypress and American walnut.',
    price: 289000,
    discount_price: 260000,
    category: 'Bedroom',
    material: 'Japanese Hinoki Cypress & American Walnut',
    dimensions: '225cm L x 215cm W x 78cm H',
    colors: ['Natural Hinoki & Walnut', 'Smoked Charcoal Oak'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
    rating: 4.99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-bed-02',
    name: 'Serenade Upholstered Linen Bed',
    slug: 'serenade-tailored-linen-bed',
    description: 'Generously proportioned headboard wrapped in tactile Belgian stonewashed flax linen with comfortable high-density padding and solid birch inner structure.',
    price: 235000,
    discount_price: 215000,
    category: 'Bedroom',
    material: 'Belgian Flax Linen & Birch Core',
    dimensions: '215cm L x 195cm W x 110cm H',
    colors: ['Chalk Oatmeal', 'Soft Sage Dune', 'Pebble Grey'],
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
    rating: 4.88,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-bed-03',
    name: 'Monolith Solid Oak Nightstand',
    slug: 'monolith-solid-wood-nightstand',
    description: 'Clean cubist bedside table with soft-close concealed drawer and hand-carved finger recess, finished in matte protective lacquer.',
    price: 68000,
    discount_price: null,
    category: 'Bedroom',
    material: 'Solid White Oak & Brushed Brass Accent',
    dimensions: '50cm W x 45cm D x 48cm H',
    colors: ['Natural White Oak', 'Smoked Espresso'],
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: false,
    rating: 4.86,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 4. HOME OFFICE
  {
    id: 'nj-studio-01',
    name: 'Atelier Solid Oak Writing Desk',
    slug: 'atelier-minimalist-oak-writing-desk',
    description: 'Minimalist executive writing desk with concealed cable management channel, precision beveled edge, and dual felt-lined storage drawers.',
    price: 165000,
    discount_price: 145000,
    category: 'Home Office',
    material: 'European White Oak & Powdercoat Steel',
    dimensions: '160cm W x 75cm D x 74cm H',
    colors: ['Natural Matte Oak', 'Smoked Black Ash'],
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: false,
    rating: 4.92,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-studio-02',
    name: 'Ribbed Fluted Glass TV Credenza',
    slug: 'ribbed-fluted-glass-tv-credenza',
    description: 'Low-profile media credenza featuring sliding fluted tempered glass doors, solid oak framework, and integrated wire passages.',
    price: 220000,
    discount_price: 195000,
    category: 'Home Office',
    material: 'Solid Oak & Tempered Moru Fluted Glass',
    dimensions: '200cm W x 45cm D x 52cm H',
    colors: ['Light White Oak', 'Deep Walnut'],
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.95,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 5. DECOR
  {
    id: 'nj-accent-01',
    name: 'Alabaster Spherical Pedestal Table',
    slug: 'alabaster-spherical-pedestal-table',
    description: 'Sculptural accent table carved from a single block of natural translucent Spanish alabaster with subtle amber veining.',
    price: 85000,
    discount_price: 75000,
    category: 'Decor',
    material: 'Honed Natural Spanish Alabaster',
    dimensions: '42cm Dia x 48cm H',
    colors: ['Translucent Amber Cloud', 'Pure White Vein'],
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: true,
    rating: 4.98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-accent-02',
    name: 'Handmade Stoneware Ceramic Vessel',
    slug: 'wabi-sabi-stoneware-ceramic-vessel',
    description: 'Hand-thrown stoneware vessel finished in natural wood-ash glaze, celebrating organic texture and warm earth tones.',
    price: 34000,
    discount_price: null,
    category: 'Decor',
    material: 'Wheel-Thrown Stoneware & Wood-Ash Glaze',
    dimensions: '32cm Dia x 45cm H',
    colors: ['Raw Ash Taupe', 'Charcoal Basalt'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=85',
    ],
    featured: false,
    rating: 4.90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]
