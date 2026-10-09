import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let products: any[] = [...NORD_JAPANDI_PRODUCTS]

    try {
      const supabase = await createClient()
      let query = supabase.from('products').select('*')

      if (category && category !== 'All') {
        query = query.eq('category', category)
      }
      if (featured === 'true') {
        query = query.eq('featured', true)
      }

      const { data, error } = await query

      if (!error && data && data.length > 0) {
        // Merge Supabase products with fallback products to ensure complete catalog availability
        const dbMap = new Map((data as any[]).map((p) => [p.id, p]))
        products = (data as any[]).concat(
          NORD_JAPANDI_PRODUCTS.filter((fallback) => !dbMap.has(fallback.id))
        )
      }
    } catch (supabaseErr) {
      console.warn('Supabase products fetch fallback to Nord-Japandi static catalog:', supabaseErr)
    }

    // Apply filtering on the final dataset
    if (category && category !== 'All') {
      products = products.filter((p) => p.category === category)
    }
    if (featured === 'true') {
      products = products.filter((p) => p.featured)
    }

    return NextResponse.json({
      products: products.length > 0 ? products : NORD_JAPANDI_PRODUCTS,
    })
  } catch (err: any) {
    console.error('Error fetching products:', err)
    return NextResponse.json({
      products: NORD_JAPANDI_PRODUCTS,
    })
  }
}
