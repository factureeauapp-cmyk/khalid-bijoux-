import { NextRequest, NextResponse } from "next/server"

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

    // Call Spring Boot backend to update order status
    const response = await fetch(
      `${process.env.SPRING_API_URL}/api/v1/orders/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: body.status }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const updatedOrder = await response.json()
    return NextResponse.json(updatedOrder)
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

    // Call Spring Boot backend to cancel order
    const response = await fetch(
      `${process.env.SPRING_API_URL}/api/v1/orders/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel order", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
