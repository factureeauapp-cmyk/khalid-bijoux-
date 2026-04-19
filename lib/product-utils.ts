import type { Category, Product } from "@/lib/store-types"
import type { Language } from "@/lib/i18n"

export function slugifyCategoryName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getProductName(product: Product, language: Language) {
  return language === "ar" ? product.nameAr : product.nameFr
}

export function getProductDescription(product: Product, language: Language) {
  return language === "ar" ? product.descriptionAr : product.descriptionFr
}

export function getCategoryName(category: Category | undefined, language: Language) {
  if (!category) {
    return language === "ar" ? "غير مصنف" : "Sans categorie"
  }
  return language === "ar" ? category.nameAr : category.nameFr
}

export function getCategoryById(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)
}
