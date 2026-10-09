import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/admin/products - List all products
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: products || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/admin/products - Add a new product
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Verify admin role
    const body = await req.json()
    const {
      name,
      slug,
      description,
      price,
      discount_price,
      category,
      material,
      dimensions,
      colors,
      stock,
      images,
      featured,
    } = body

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 })
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const newProduct = {
      name,
      slug: generatedSlug,
      description: description || '',
      price: Number(price),
      discount_price: discount_price ? Number(discount_price) : null,
      category,
      material: material || '',
      dimensions: dimensions || '',
      colors: Array.isArray(colors) ? colors : (colors ? colors.split(',').map((c: string) => c.trim()) : []),
      stock: Number(stock) || 10,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'],
      featured: Boolean(featured),
      rating: 4.9,
    }

    const { data, error } = await (supabase.from('products' as any) as any)
      .insert(newProduct)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (err: any) {
    console.error('Error adding product:', err)
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 })
  }
}

// PUT /api/admin/products - Update product
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    if (updates.colors && typeof updates.colors === 'string') {
      updates.colors = updates.colors.split(',').map((c: string) => c.trim())
    }
    if (updates.price) updates.price = Number(updates.price)
    if (updates.discount_price !== undefined) {
      updates.discount_price = updates.discount_price ? Number(updates.discount_price) : null
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock)

    const { data, error } = await (supabase.from('products' as any) as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products - Delete product
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const { error } = await (supabase.from('products' as any) as any)
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 })
  }
}
