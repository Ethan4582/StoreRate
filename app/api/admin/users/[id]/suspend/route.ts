import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUser = verifyToken(token)
    if (!adminUser || adminUser.role !== "system_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = parseInt(params.id, 10)
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Toggle status
    const newStatus = user.status === "active" ? "suspended" : "active"

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Admin user suspend error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
