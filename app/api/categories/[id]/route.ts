import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Call Spring Boot backend to delete category
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${id}`,
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
      { error: "Failed to delete category", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
