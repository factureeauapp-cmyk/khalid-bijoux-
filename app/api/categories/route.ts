import { NextResponse } from "next/server"
import { readStore, writeStore } from "@/lib/server/store"
import { isAdminAuthenticated } from "@/lib/server/admin-auth"
import { slugifyCategoryName } from "@/lib/product-utils"

export async function GET() {
  const store = await readStore()
  return NextResponse.json(store.categories)
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { nameFr, nameAr } = (await request.json()) as { nameFr?: string; nameAr?: string }
  const categoryNameFr = String(nameFr ?? "").trim()
  const categoryNameAr = String(nameAr ?? "").trim()

  if (!categoryNameFr || !categoryNameAr) {
    return NextResponse.json({ error: "INVALID_CATEGORY_PAYLOAD" }, { status: 400 })
  }

  const store = await readStore()
  const id = slugifyCategoryName(categoryNameFr)
  if (store.categories.some((category) => category.id === id)) {
    return NextResponse.json({ error: "CATEGORY_ALREADY_EXISTS" }, { status: 409 })
  }

  const category = { id, nameFr: categoryNameFr, nameAr: categoryNameAr }
  store.categories.push(category)
  await writeStore(store)
  return NextResponse.json(category, { status: 201 })
}
