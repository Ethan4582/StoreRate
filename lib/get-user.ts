import { cookies } from "next/headers"
import { verifyToken } from "./auth"

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
