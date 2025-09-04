import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "normal_user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storeId, rating, review } = await request.json()


    if (!storeId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid store ID and rating (1-5) are required" }, { status: 400 })
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: storeId,
        },
      },
    })

    if (existingRating) {
      return NextResponse.json({ error: "You have already rated this store" }, { status: 409 })
    }

    const newRating = await prisma.rating.create({
      data: {
        userId: user.id,
        storeId,
        rating,
        review: review || null,
      },
    })

    return NextResponse.json(
      {
        message: "Rating submitted successfully",
        rating: newRating,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Rating creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
