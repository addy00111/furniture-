import { Product } from '@/types'

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'

export const FINISH_IMAGE_MAP: Record<string, string> = {
  // Product 1: Kanso Curved Bouclé Sofa
  'Ivory Bouclé': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  'Oatmeal Chenille': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
  'Charcoal Wool': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',

  // Product 2: Kyoto Minimalist Linen Daybed
  'Dusk Grey': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
  'Stonewashed Oatmeal': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  'Moss Olive': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',

  // Product 3: Sora Solid White-Oak Dining Table
  'Bleached White Oak': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
  'Smoked Muted Oak': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
  'Ebonized Black': 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',

  // Product 4: Cane-Back Atelier Bistro Chair
  'Natural Ash / Cane': 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
  'Matte Black / Cane': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80',

  // Product 5: Aethel Low-Profile Platform Bed
  'Natural Hinoki': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
  'Smoked Charcoal Oak': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',

  // Product 6: Serenade Upholstered Linen Bed
  'Chalk Oatmeal': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'Soft Sage Dune': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
  'Pebble Grey': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',

  // Product 7: Atelier Solid Oak Writing Desk
  'Natural Matte Oak': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
  'Smoked Black Ash': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',

  // Product 8: Alabaster Spherical Pedestal Table
  'Translucent Amber Cloud': 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80',
  'Pure White Vein': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
}

export const NORD_JAPANDI_PRODUCTS: Product[] = [
  // 1. LIVING ROOM
  {
    id: 'nj-lounge-01',
    name: 'Kanso Curved Bouclé Sofa',
    slug: 'kanso-curved-boucle-sofa',
    description: 'Sculptural curved sofa upholstered in heavy Italian bouclé over a solid kiln-dried European ash frame. Low-profile silhouette designed for comfort and modern living spaces.',
    price: 320000,
    discount_price: 285000,
    category: 'Living Room',
    material: 'Italian Bouclé & Solid European Ash',
    dimensions: '280cm W x 110cm D x 72cm H (Seat 40cm)',
    colors: ['Ivory Bouclé', 'Oatmeal Chenille', 'Charcoal Wool'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
    rating: 4.96,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-lounge-02',
    name: 'Kyoto Minimalist Linen Daybed',
    slug: 'kyoto-minimalist-linen-daybed',
    description: 'Low-slung daybed with Japanese Hinoki slatted base and removable cylindrical bolster wrapped in premium Belgian flax linen.',
    price: 210000,
    discount_price: 195000,
    category: 'Living Room',
    material: 'Japanese Hinoki Cypress & Belgian Flax Linen',
    dimensions: '205cm L x 85cm W x 42cm H',
    colors: ['Dusk Grey', 'Stonewashed Oatmeal', 'Moss Olive'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
    rating: 4.89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // 2. DINING ROOM
  {
    id: 'nj-dining-01',
    name: 'Sora Solid White-Oak Dining Table',
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
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
    rating: 4.98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'nj-dining-02',
    name: 'Cane-Back Atelier Bistro Chair',
    slug: 'cane-back-atelier-bistro-chair',
    description: 'Steam-bent solid ash frame paired with natural French hand-woven cane rattan backrest and contoured seat cushion.',
    price: 98000,
    discount_price: 88000,
    category: 'Dining Room',
    material: 'Steam-Bent Ash & French Natural Cane',
    dimensions: '52cm W x 54cm D x 79cm H (Seat 45cm)',
    colors: ['Natural Ash / Cane', 'Matte Black / Cane'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
    rating: 4.91,
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
    colors: ['Natural Hinoki', 'Smoked Charcoal Oak'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
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
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
    rating: 4.88,
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
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
    rating: 4.92,
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
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
    rating: 4.98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
