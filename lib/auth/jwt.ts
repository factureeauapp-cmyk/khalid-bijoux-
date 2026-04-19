const encoder = new TextEncoder()

export interface AdminJwtPayload {
  sub: string
  email: string
  role: "admin"
  exp: number
}

function toBase64Url(input: string | Uint8Array) {
  const bytes = typeof input === "string" ? encoder.encode(input) : input

  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "")
  }

  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4)

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"))
  }

  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function importSecret(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function signAdminJwt(payload: AdminJwtPayload, secret: string) {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = toBase64Url(JSON.stringify(header))
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  const key = await importSecret(secret)
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(unsignedToken))
  return `${unsignedToken}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifyAdminJwt(token: string, secret: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".")

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null
  }

  const key = await importSecret(secret)
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(encodedSignature),
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  )

  if (!isValid) {
    return null
  }

  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as AdminJwtPayload
  if (!payload.exp || payload.exp * 1000 < Date.now()) {
    return null
  }

  return payload
}
