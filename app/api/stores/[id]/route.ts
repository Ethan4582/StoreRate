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
    if (!user || user.role !== "store_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, address, phone, email, website } = await request.json()

    
    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 })
    }

    const existingStore = await prisma.store.findFirst({
      where: {
        id: Number.parseInt(id),
        ownerId: user.id,
      },
    })

    if (!existingStore) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 })
    }

    const updatedStore = await prisma.store.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        description: description || null,
        address,
        phone: phone || null,
        email: email || null,
        website: website || null,
      },
    })

    return NextResponse.json({
      message: "Store updated successfully",
      store: updatedStore,
    })
  } catch (error) {
    console.error("Store update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
