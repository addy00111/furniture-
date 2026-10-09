import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

async function run() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('No Supabase credentials found in .env.local')
    return
  }

  console.log(`Connecting to Supabase at ${supabaseUrl}...`)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const newImages = [
    'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
  ]

  const { data, error } = await supabase
    .from('products')
    .update({ images: newImages })
    .ilike('name', '%Aethel%')
    .select()

  if (error) {
    console.error('Error updating Aethel bed in Supabase:', error.message)
  } else {
    console.log(`Successfully updated ${data?.length || 0} product(s) in Supabase:`, data?.map(p => ({ id: p.id, name: p.name, images: p.images })))
  }
}

run().catch(console.error)
