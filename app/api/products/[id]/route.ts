import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/server/admin-auth"
import { readStore, writeStore } from "@/lib/server/store"
import { parseProductFormData, resolveCategory } from "@/lib/server/product-payload"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await params
  const store = await readStore()
  const existingProduct = store.products.find((product) => product.id === id)

  if (!existingProduct) {
    return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 })
  }

  try {
    const formData = await request.formData()
    const categoryResolution = resolveCategory(formData, store.categories)
    const nextProduct = await parseProductFormData(formData, categoryResolution.categoryId, existingProduct)
    const nextStore = {
      ...store,
      categories: categoryResolution.categories,
      products: store.products.map((product) => (product.id === id ? { ...nextProduct, id } : product)),
    }
    await writeStore(nextStore)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "PRODUCT_UPDATE_FAILED" }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }
  const { id } = await params
  const store = await readStore()
  store.products = store.products.filter((product) => product.id !== id)
  await writeStore(store)
  return NextResponse.json({ ok: true })
}
