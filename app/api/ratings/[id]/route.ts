import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "normal_user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rating, review } = await request.json()


    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid rating (1-5) is required" }, { status: 400 })
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        id: Number.parseInt(id),
        userId: user.id,
      },
    })

    if (!existingRating) {
      return NextResponse.json({ error: "Rating not found or unauthorized" }, { status: 404 })
    }

    const updatedRating = await prisma.rating.update({
      where: { id: Number.parseInt(id) },
      data: {
        rating,
        review: review || null,
      },
    })

    return NextResponse.json({
      message: "Rating updated successfully",
      rating: updatedRating,
    })
  } catch (error) {
    console.error("Rating update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
