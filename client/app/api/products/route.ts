import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, createProduct } from "@/lib/auth"

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json({ products }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, price, image, description, category, stock } = await request.json()

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    const product = await createProduct({ name, price, image, description, category, stock })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
