import { NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/server/store"
import { isAdminAuthenticated } from "@/lib/server/admin-auth"
import { parseProductFormData, resolveCategory } from "@/lib/server/product-payload"

export async function GET() {
  const store = await readStore()
  return NextResponse.json(store.products)
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const store = await readStore()
    const categoryResolution = resolveCategory(formData, store.categories)
    const product = await parseProductFormData(formData, categoryResolution.categoryId)
    const nextStore = {
      ...store,
      categories: categoryResolution.categories,
      products: [
        {
          ...product,
          id: product.id || `product_${Date.now()}`,
        },
        ...store.products,
      ],
    }

    await writeStore(nextStore)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "PRODUCT_CREATE_FAILED" }, { status: 400 })
  }
}
