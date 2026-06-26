import { prisma } from "@/lib/db"
import { StoreGrid } from "@/components/store/store-grid"

interface StoreListProps {
  ownerId?: number
  showOwnerActions?: boolean
  storesData?: any[]
}

export async function StoreList({ ownerId, showOwnerActions = true, storesData }: StoreListProps) {
  let stores = storesData

  if (!stores) {
    if (ownerId) {
      stores = await prisma.store.findMany({
        where: { ownerId },
        include: {
          ratings: {
            select: { rating: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      stores = await prisma.store.findMany({
        include: {
          owner: {
            select: { name: true },
          },
          ratings: {
            select: { rating: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }
  }

  const processedStores = stores.map((store) => {
    const ratingsArray = store.ratings || []
    const avgRating =
      ratingsArray.length > 0 ? ratingsArray.reduce((sum: any, r: any) => sum + r.rating, 0) / ratingsArray.length : 0

    return {
      ...store,
      owner_name: ownerId ? undefined : (store as any).owner?.name,
      avg_rating: avgRating,
      review_count: ratingsArray.length,
    }
  })

  return <StoreGrid processedStores={processedStores} ownerId={ownerId} showOwnerActions={showOwnerActions} />
}
