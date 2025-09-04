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
    const role = searchParams.get("role") || ""
    const sortBy = searchParams.get("sortBy") || "newest"

    const users = await prisma.user.findMany({
      where: {
        role: { not: "system_admin" },
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(role && { role: role as any }),
      },
      include: {
        stores: { select: { id: true } },
        ratings: { select: { id: true } },
      },
      orderBy:
        sortBy === "oldest"
          ? { createdAt: "asc" }
          : sortBy === "name_asc"
            ? { name: "asc" }
            : sortBy === "name_desc"
              ? { name: "desc" }
              : { createdAt: "desc" }, 
    })

    const processedUsers = users
      .map((user) => ({
        ...user,
        store_count: user.stores.length,
        rating_count: user.ratings.length,
      }))
      .sort((a, b) => {
        if (sortBy === "most_active") {
          return b.store_count + b.rating_count - (a.store_count + a.rating_count)
        }
        return 0 // 
      })

    return NextResponse.json({ users: processedUsers })
  } catch (error) {
    console.error("Admin users search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
