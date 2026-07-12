import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import type { CustomerOrder } from "@/lib/store-types"

const STORE_FILE = join(process.cwd(), "data", "store.json")

async function readStore() {
  try {
    const content = await readFile(STORE_FILE, "utf-8")
    return JSON.parse(content)
  } catch {
    return { products: [], orders: [] }
  }
}

async function writeStore(data: any) {
  await writeFile(STORE_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const store = await readStore()
    const orders = store.orders || []
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields - accept the frontend payload format
    if (!body.customerName?.trim() || !body.address?.trim() || !body.phone?.trim() || !body.items?.length) {
      return NextResponse.json(
        { 
          error: "Veuillez remplir tous les champs obligatoires (nom, adresse, téléphone) et avoir au moins un article.",
          code: "INVALID_ORDER_PAYLOAD"
        },
        { status: 400 }
      )
    }

    // Read existing store
    const store = await readStore()
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`
    
    // Create order object
    const newOrder: CustomerOrder = {
      id: orderNumber,
      orderNumber,
      customerName: body.customerName.trim(),
      address: body.address.trim(),
      phone: body.phone.trim(),
      notes: body.notes?.trim() || "",
      items: body.items.map((item: any) => ({
        productId: item.productId,
        productNameFr: item.productNameFr || item.productName || item.nameFr || "",
        productNameAr: item.productNameAr || item.nameAr || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice || item.price || 0,
        image: item.image || "/placeholder.svg",
      })),
      total: body.total || 0,
      paymentMethod: "cash_on_delivery",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Add order to store
    store.orders = store.orders || []
    store.orders.push(newOrder)

    // Write updated store
    await writeStore(store)

    return NextResponse.json(
      {
        success: true,
        message: "Commande créée avec succès ! Nous vous contacterons bientôt.",
        order: newOrder,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { 
        error: "Impossible de créer la commande. Veuillez réessayer.",
        code: "FAILED_TO_CREATE_ORDER",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
