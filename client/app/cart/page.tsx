"use client"

import { useCart } from "../context/cart-context"
import { useAuth } from "../context/auth-context"
import { useState } from "react"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handlePlaceOrder = async () => {
  if (!user) {
    setError("You must be logged in to place an order")
    return
  }

  setLoading(true)
  setError(null)
  setSuccess(null)

  try {
    // 🟢 Debug payload before sending
    const payload = {
      userId: user._id,
      items: cartItems.map(item => ({
        product: item.id || item._id, // adjust depending on product schema
        quantity: item.quantity,
      })),
      totalPrice: getTotalPrice(),
    }

    console.log("📦 Sending order payload:", payload)

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // if backend needs auth
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.message || "Failed to place order")
    }

    const data = await response.json()
    setSuccess("Order placed successfully!")
    clearCart()
    console.log("✅ Order saved:", data)

  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="text-red-500" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p className="font-semibold">Total: ${getTotalPrice()}</p>
            <button
              onClick={handlePlaceOrder}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}
