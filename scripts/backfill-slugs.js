const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function main() {
  const stores = await prisma.store.findMany()
  
  for (const store of stores) {
    let slug = generateSlug(store.name)
    
    // Ensure uniqueness
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
    console.log(`Updated store ${store.id} with slug: ${finalSlug}`)
  }
  
  console.log('Finished backfilling slugs.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
