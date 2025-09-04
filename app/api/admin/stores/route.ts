import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "system_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const minRating = searchParams.get("minRating") || ""
    const sortBy = searchParams.get("sortBy") || "newest"

    const stores = await prisma.store.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
              { owner: { name: { contains: search, mode: "insensitive" } } },
              { owner: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {},
      include: {
        owner: {
          select: { name: true, email: true },
        },
        ratings: {
          select: { rating: true },
        },
      },
      orderBy:
        sortBy === "oldest" ? { createdAt: "asc" } : sortBy === "name_asc" ? { name: "asc" } : { createdAt: "desc" }, 
    })

    const processedStores = stores
      .map((store) => {
        const avgRating =
          store.ratings.length > 0 ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length : 0

        return {
          ...store,
          owner_name: store.owner.name,
          owner_email: store.owner.email,
          avg_rating: avgRating,
          review_count: store.ratings.length,
        }
      })
      .filter((store) => (minRating ? store.avg_rating >= Number.parseFloat(minRating) : true))
      .sort((a, b) => {
        switch (sortBy) {
          case "rating_high":
            return b.avg_rating - a.avg_rating || b.review_count - a.review_count
          case "rating_low":
            return a.avg_rating - b.avg_rating || a.review_count - b.review_count
          case "most_reviews":
            return b.review_count - a.review_count || b.avg_rating - a.avg_rating
          default:
            return 0 
        }
      })

    return NextResponse.json({ stores: processedStores })
  } catch (error) {
    console.error("Admin stores search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
