import bcrypt from "bcryptjs"
import clientPromise from "./mongodb"

export interface User {
  _id?: string
  name: string
  email: string
  mobile: string
  password?: string
  role?: "user" | "admin"
  createdAt: Date
}

export interface Product {
  _id?: string
  id: number
  name: string
  price: number
  image: string
  description?: string
  category?: string
  stock?: number
  createdAt: Date
}

export interface Order {
  _id?: string
  userId: string
  userName: string
  userEmail: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
  deliveryDate: Date
}

export async function createUser(userData: {
  name: string
  email: string
  mobile: string
  password: string
  role?: "user" | "admin"
}) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  // Create user
  const user = {
    ...userData,
    password: hashedPassword,
    role: userData.role || "user", // Default to user if no role specified
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)

  // Return user without password
  const { password, ...userWithoutPassword } = user
  return { ...userWithoutPassword, _id: result.insertedId.toString() }
}

export async function authenticateUser(email: string, password: string) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const user = await db.collection("users").findOne({ email })
  if (!user) {
    throw new Error("No user found with this email")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Invalid password")
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return { ...userWithoutPassword, _id: user._id.toString() }
}

export async function createAdminUser() {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  // Check if admin already exists
  const existingAdmin = await db.collection("users").findOne({ email: "admin@Tatheer Fatima Collection.com" })
  if (existingAdmin) {
    return existingAdmin
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = {
    name: "Admin",
    email: "admin@Tatheer Fatima Collection.com",
    mobile: "1234567890",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
  }

  const result = await db.collection("users").insertOne(adminUser)

  // Return admin without password
  const { password, ...adminWithoutPassword } = adminUser
  return { ...adminWithoutPassword, _id: result.insertedId.toString() }
}

export async function createOrder(orderData: {
  userId: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  totalAmount: number
}) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  // Get user details
  const user = await db.collection("users").findOne({ _id: orderData.userId })
  if (!user) {
    throw new Error("User not found")
  }

  // Calculate delivery date (2-3 working days)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)

  const order = {
    ...orderData,
    userName: user.name,
    userEmail: user.email,
    status: "confirmed" as const,
    createdAt: new Date(),
    deliveryDate,
  }

  const result = await db.collection("orders").insertOne(order)
  return { ...order, _id: result.insertedId.toString() }
}

// Product functions
export async function getAllProducts() {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray()
  return products.map((product) => ({ ...product, _id: product._id.toString() }))
}

export async function createProduct(productData: {
  name: string
  price: number
  image: string
  description?: string
  category?: string
  stock?: number
}) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  // Get next ID
  const lastProduct = await db.collection("products").findOne({}, { sort: { id: -1 } })
  const nextId = lastProduct ? lastProduct.id + 1 : 1

  const product = {
    ...productData,
    id: nextId,
    stock: productData.stock || 100,
    createdAt: new Date(),
  }

  const result = await db.collection("products").insertOne(product)
  return { ...product, _id: result.insertedId.toString() }
}

export async function updateProduct(
  productId: string,
  productData: {
    name?: string
    price?: number
    image?: string
    description?: string
    category?: string
    stock?: number
  },
) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const result = await db.collection("products").updateOne({ _id: productId }, { $set: productData })

  if (result.matchedCount === 0) {
    throw new Error("Product not found")
  }

  return result
}

export async function deleteProduct(productId: string) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const result = await db.collection("products").deleteOne({ _id: productId })

  if (result.deletedCount === 0) {
    throw new Error("Product not found")
  }

  return result
}

// Order functions
export async function getAllOrders() {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
  return orders.map((order) => ({ ...order, _id: order._id.toString() }))
}

export async function updateOrderStatus(orderId: string, status: string) {
  const client = await clientPromise
  const db = client.db("Tatheer Fatima Collection")

  const result = await db.collection("orders").updateOne({ _id: orderId }, { $set: { status } })

  if (result.matchedCount === 0) {
    throw new Error("Order not found")
  }

  return result
}
