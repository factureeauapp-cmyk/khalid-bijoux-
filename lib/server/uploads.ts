import { promises as fs } from "fs"
import path from "path"

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024
const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
])

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "produits")

function sanitizeName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function saveProductImage(file: File, productName: string) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("INVALID_FILE_TYPE")
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("FILE_TOO_LARGE")
  }

  await fs.mkdir(uploadDirectory, { recursive: true })

  const extension = allowedMimeTypes.get(file.type) ?? ".jpg"
  const uniqueName = `${sanitizeName(productName || "product")}-${Date.now()}-${crypto.randomUUID()}${extension}`
  const absolutePath = path.join(uploadDirectory, uniqueName)
  const bytes = Buffer.from(await file.arrayBuffer())

  await fs.writeFile(absolutePath, bytes)

  return `/uploads/produits/${uniqueName}`
}
