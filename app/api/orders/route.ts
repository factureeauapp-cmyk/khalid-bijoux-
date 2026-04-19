import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch orders from Spring Boot backend
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from backend" },
        { status: response.status }
      )
    }

    const orders = await response.json()
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customer?.firstName || !body.customer?.lastName || !body.items?.length) {
      return NextResponse.json(
        { error: "INVALID_ORDER_PAYLOAD" },
        { status: 400 }
      )
    }

    // Forward to Spring Boot backend
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const order = await response.json()
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
