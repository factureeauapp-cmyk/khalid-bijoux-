import { slugifyCategoryName } from "@/lib/product-utils"
import type { Category, Product } from "@/lib/store-types"
import { saveProductImage } from "@/lib/server/uploads"

function parseNumber(value: FormDataEntryValue | null) {
  if (!value) {
    return 0
  }
  return Number(value)
}

function buildCategory(nameFr: string, nameAr: string): Category {
  return {
    id: slugifyCategoryName(nameFr),
    nameFr,
    nameAr,
  }
}

export function resolveCategory(formData: FormData, categories: Category[]) {
  const existingCategoryId = String(formData.get("categoryId") ?? "").trim()
  const newCategoryNameFr = String(formData.get("newCategoryNameFr") ?? "").trim()
  const newCategoryNameAr = String(formData.get("newCategoryNameAr") ?? "").trim()

  // Si une catégorie existante est sélectionnée
  if (existingCategoryId) {
    const foundCategory = categories.find((category) => category.id === existingCategoryId)
    if (!foundCategory) {
      console.error(`[resolveCategory] Category not found with ID: "${existingCategoryId}". Available categories:`, categories.map(c => c.id))
      throw new Error("CATEGORY_NOT_FOUND")
    }
    return { categoryId: foundCategory.id, categories }
  }

  // Si on crée une nouvelle catégorie
  if (!newCategoryNameFr || !newCategoryNameAr) {
    throw new Error("CATEGORY_REQUIRED")
  }

  const candidateId = slugifyCategoryName(newCategoryNameFr)
  const existingCategory = categories.find((category) => category.id === candidateId)
  if (existingCategory) {
    return { categoryId: existingCategory.id, categories }
  }

  const nextCategories = [...categories, buildCategory(newCategoryNameFr, newCategoryNameAr)]
  return { categoryId: candidateId, categories: nextCategories }
}

export async function parseProductFormData(
  formData: FormData,
  categoryId: string,
  existingProduct?: Product
): Promise<Product> {
  const nameFr = String(formData.get("nameFr") ?? "").trim()
  const nameAr = String(formData.get("nameAr") ?? "").trim()
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim()
  const descriptionAr = String(formData.get("descriptionAr") ?? "").trim()
  const tag = String(formData.get("tag") ?? "").trim()
  const imageFile = formData.get("image")
  const existingImage = String(formData.get("existingImage") ?? existingProduct?.image ?? "").trim()

  if (!nameFr || !nameAr || !descriptionFr || !descriptionAr || !categoryId) {
    throw new Error("INVALID_PRODUCT_PAYLOAD")
  }

  let image = existingImage
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveProductImage(imageFile, nameFr)
  }

  if (!image) {
    throw new Error("IMAGE_REQUIRED")
  }

  return {
    id: existingProduct?.id ?? String(formData.get("id") ?? "").trim(),
    nameFr,
    nameAr,
    categoryId,
    price: parseNumber(formData.get("price")),
    originalPrice: parseNumber(formData.get("originalPrice")) || undefined,
    tag: tag || undefined,
    descriptionFr,
    descriptionAr,
    image,
  }
}
