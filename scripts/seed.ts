import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { NORD_JAPANDI_PRODUCTS } from '../src/data/products'

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
let envVars: Record<string, string> = {}
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim()
      let val = trimmed.substring(eqIdx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      envVars[key] = val
    }
  })
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function seed() {
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
    console.log('No live Supabase credentials in .env.local; skipping live seed.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  console.log(`Seeding 8 definitive products to ${supabaseUrl}...`)

  const { error } = await supabase
    .from('products')
    .upsert(
      NORD_JAPANDI_PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discount_price: p.discount_price,
        category: p.category,
        material: p.material,
        dimensions: p.dimensions,
        colors: p.colors,
        stock: p.stock,
        images: p.images,
        featured: p.featured,
        rating: p.rating,
      })),
      { onConflict: 'id' }
    )

  if (error) {
    console.error('Error seeding products:', error.message)
  } else {
    console.log('Successfully seeded 8 definitive Nord-Japandi products to Supabase!')
  }
}

seed().catch(console.error)
