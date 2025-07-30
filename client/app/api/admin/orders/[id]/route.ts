import { type NextRequest, NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    await updateOrderStatus(params.id, status)

    return NextResponse.json({ message: "Order status updated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
