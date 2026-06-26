import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Missing or invalid ids array" }, { status: 400 })
    }

    if (ids.length === 0) {
      return NextResponse.json({ stores: [] })
    }

    const stores = await prisma.store.findMany({
      where: {
        id: { in: ids }
      },
      include: {
        owner: {
          select: { name: true },
        },
        ratings: {
          select: { rating: true },
        },
      },
    })

    const processedStores = stores.map((store) => {
      const avgRating =
        store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

      return {
        ...store,
        owner_name: (store as any).owner?.name,
        avg_rating: avgRating,
        review_count: store.ratings.length,
      }
    })

    return NextResponse.json({ stores: processedStores })
  } catch (error) {
    console.error("Error fetching batch stores:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
