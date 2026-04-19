import { cookies } from "next/headers"
import { sha256Hex, signAdminJwt, verifyAdminJwt, type AdminJwtPayload } from "@/lib/auth/jwt"

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || " ";
}

export function getJwtSecret() {
  return process.env.JWT_SECRET || "default_jwt_secret"
}

export async function buildAdminToken(email: string) {
  const payload: AdminJwtPayload = {
    sub: email,
    email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  }

  return signAdminJwt(payload, getJwtSecret())
}

export async function validateAdminCredentials(identifier: string, password: string) {
  const email = getAdminEmail().trim().toLowerCase()
  const username = email.split("@")[0]
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const passwordHash = await sha256Hex(password)
  const configuredPassword = process.env.ADMIN_PASSWORD 

  console.log("[AUTH DEBUG] validateAdminCredentials called:");
  console.log("  - Configured email:", email || "(NOT SET)");
  console.log("  - Configured username:", username);
  console.log("  - Identifier received:", normalizedIdentifier);
  console.log("  - Password hash:", passwordHash.substring(0, 16) + "...");
  console.log("  - Configured password:", configuredPassword ? configuredPassword.substring(0, 16) + "..." : "(NOT SET)");
  
  const emailMatch = normalizedIdentifier === email
  const usernameMatch = normalizedIdentifier === username
  const passwordMatch = passwordHash === configuredPassword
  
  console.log("  - Email match:", emailMatch);
  console.log("  - Username match:", usernameMatch);
  console.log("  - Password match:", passwordMatch);

  return (emailMatch || usernameMatch) && passwordMatch
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("kb-admin-token")?.value

  if (!token) {
    return null
  }

  return verifyAdminJwt(token, getJwtSecret())
}

export async function isAdminAuthenticated() {
  const payload = await getAuthenticatedAdmin()
  return Boolean(payload)
}
