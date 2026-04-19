import { promises as fs } from "fs"
import path from "path"
import { PRODUCTS } from "@/lib/data"
import { slugifyCategoryName } from "@/lib/product-utils"
import type { Category, CustomerOrder, Product } from "@/lib/store-types"

interface LegacyProduct {
  id: string
  name?: string
  category?: string
  price: number
  originalPrice?: number
  material?: string
  tag?: string
  description?: string
  image: string
}

interface StoreFile {
  products: Product[]
  orders: CustomerOrder[]
  categories: Category[]
}

const storePath = path.join(process.cwd(), "data", "store.json")

function normalizeArabicPlaceholder(value: string) {
  return value
}

function buildCategory(categoryName: string): Category {
  const nameFr = categoryName || "Sans categorie"
  return {
    id: slugifyCategoryName(nameFr),
    nameFr,
    nameAr: normalizeArabicPlaceholder(nameFr),
  }
}

function normalizeProduct(product: Product | LegacyProduct, categories: Category[]): Product {
  if ("nameFr" in product) {
    return product
  }

  const categoryName = product.category || "Sans categorie"
  let category = categories.find((item) => item.nameFr === categoryName)
  if (!category) {
    category = buildCategory(categoryName)
    categories.push(category)
  }

  return {
    id: product.id,
    nameFr: product.name || "Produit",
    nameAr: product.name || "Produit",
    categoryId: category.id,
    price: product.price,
    originalPrice: product.originalPrice,
    tag: product.tag,
    descriptionFr: product.description || "",
    descriptionAr: product.description || "",
    image: product.image,
  }
}

function normalizeStore(rawStore: Partial<StoreFile> | undefined): StoreFile {
  const seedCategories: Category[] = []
  const seedProducts = (PRODUCTS as LegacyProduct[]).map((product) => normalizeProduct(product, seedCategories))
  const incomingCategories = rawStore?.categories ? [...rawStore.categories] : seedCategories
  const normalizedProducts = (rawStore?.products?.length ? rawStore.products : seedProducts).map((product) =>
    normalizeProduct(product as Product | LegacyProduct, incomingCategories)
  )

  return {
    products: normalizedProducts,
    orders: rawStore?.orders ?? [],
    categories: incomingCategories,
  }
}

async function ensureStore() {
  try {
    await fs.access(storePath)
  } catch {
    const initialData = normalizeStore(undefined)
    await fs.writeFile(storePath, JSON.stringify(initialData, null, 2), "utf-8")
  }
}

export async function readStore(): Promise<StoreFile> {
  await ensureStore()
  const content = await fs.readFile(storePath, "utf-8")
  const parsed = JSON.parse(content) as Partial<StoreFile>
  const normalized = normalizeStore(parsed)
  await writeStore(normalized)
  return normalized
}

export async function writeStore(data: StoreFile) {
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), "utf-8")
}
