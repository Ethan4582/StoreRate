import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function GET() {
  try {
    const stores = await prisma.store.findMany()
    let count = 0
    
    for (const store of stores) {
      let slug = generateSlug(store.name)
      if (!slug) slug = `store-${store.id}`
      
      let isUnique = false
      let counter = 1
      let finalSlug = slug
      
      while (!isUnique) {
        const existing = await prisma.store.findFirst({
          where: { slug: finalSlug, id: { not: store.id } }
        })
        if (existing) {
          finalSlug = `${slug}-${counter}`
          counter++
        } else {
          isUnique = true
        }
      }
      
      await prisma.store.update({
        where: { id: store.id },
        data: { slug: finalSlug }
      })
      count++
    }
    
    return NextResponse.json({ success: true, count })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
