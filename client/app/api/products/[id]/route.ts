import { type NextRequest, NextResponse } from "next/server"
import { updateProduct, deleteProduct } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, price, image, description, category, stock } = await request.json()

    await updateProduct(params.id, { name, price, image, description, category, stock })

    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id)

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
