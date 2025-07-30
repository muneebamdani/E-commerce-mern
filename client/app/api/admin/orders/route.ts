import { NextResponse } from "next/server"
import { getAllOrders } from "@/lib/auth"

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ orders }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
