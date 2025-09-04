import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development-only"

export interface User {
  id: number
  email: string
  name: string
  role: "system_admin" | "normal_user" | "store_owner"
}

export function generateToken(user: User): string {
  if (!user || !user.id || !user.email || !user.role) {
    throw new Error("Invalid user data for token generation")
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, 
    iat: Date.now(),
  }

 
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64")
  const signature = Buffer.from(JWT_SECRET + encodedPayload).toString("base64")

  return `${encodedPayload}.${signature}`
}

export function verifyToken(token: string): User | null {
  try {
    if (!token || typeof token !== "string") {
      return null
    }

    const [encodedPayload, signature] = token.split(".")
    if (!encodedPayload || !signature) {
      return null
    }

    
    const expectedSignature = Buffer.from(JWT_SECRET + encodedPayload).toString("base64")
    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString())


    if (!payload.exp || Date.now() > payload.exp) {
      return null
    }

    if (!payload.id || !payload.email || !payload.role) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password for hashing")
  }
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash || typeof password !== "string" || typeof hash !== "string") {
    return false
  }
  return bcrypt.compare(password, hash)
}
