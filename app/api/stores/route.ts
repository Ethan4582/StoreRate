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
    if (!user || user.role !== "store_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, address, phone, email, website } = await request.json()


    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 })
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        description: description || null,
        address,
        phone: phone || null,
        email: email || null,
        website: website || null,
        ownerId: user.id,
      },
    })

    return NextResponse.json(
      {
        message: "Store created successfully",
        store: newStore,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Store creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
