import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const store = await readStore()
    const orderIndex = store.orders?.findIndex((o: any) => o.orderNumber === id)

    if (orderIndex === undefined || orderIndex === -1) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Update order status
    store.orders[orderIndex].status = body.status
    await writeStore(store)

    return NextResponse.json(store.orders[orderIndex])
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order status", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const store = await readStore()
    const orderIndex = store.orders?.findIndex((o: any) => o.orderNumber === id)

    if (orderIndex === undefined || orderIndex === -1) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Remove order
    store.orders.splice(orderIndex, 1)
    await writeStore(store)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel order", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
