import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { userId, items, totalAmount } = await request.json()

    if (!userId || !items || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await createOrder({ userId, items, totalAmount })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
