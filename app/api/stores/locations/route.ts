import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const stores = await prisma.store.findMany({ select: { address: true } })
    
    // Extract unique cities (assuming format "... , City, State ZIP")
    // If not, fallback to the entire address string for simplicity,
    // but users typically want a cleaner list.
    const rawLocations = stores.map(store => {
      const parts = store.address.split(",")
      if (parts.length > 2) {
        // e.g. "221B MG Road, Bengaluru, Karnataka 560001" -> "Bengaluru"
        return parts[parts.length - 2].trim().replace(/\d/g, '').trim()
      } else if (parts.length > 1) {
        return parts[parts.length - 1].trim().replace(/\d/g, '').trim()
      }
      return store.address.trim()
    })

    const uniqueLocations = Array.from(new Set(rawLocations)).filter(Boolean).sort()

    return NextResponse.json({ locations: uniqueLocations })
  } catch (error) {
    console.error("Locations fetch error:", error)
    return NextResponse.json({ locations: [] })
  }
}
