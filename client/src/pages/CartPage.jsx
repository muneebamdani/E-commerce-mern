"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useCart } from "../context/cart-context"
import { useAuth } from "../context/auth-context"
import { apiService } from "../services/api"

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart
  } = useCart()

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const hasInvalidItems = cartItems.some(
    (item) =>
      item.stock !== undefined &&
      item.quantity > item.stock
  )

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold">
              Tatheer Fatima Collection
            </Link>

            {user ? (
              <div className="flex gap-4 items-center">
                <span>Welcome, {user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </nav>

        <div className="text-center py-20">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-gray-600 mt-2">Add some products</p>
          <Link to="/">
            <Button className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (hasInvalidItems) {
      alert("Some items exceed available stock. Please update cart.")
      return
    }

    setIsPlacingOrder(true)

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
      }))

      const orderData = {
        items: orderItems,
        totalAmount: getTotalPrice(),
      }

      await apiService.createOrder(orderData)

      clearCart()
      navigate("/my-orders")

    } catch (error) {
      console.error("Order error:", error)
      alert(
        error.response?.data?.error ||
        error.message ||
        "Failed to place order"
      )
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold">
            Tatheer Fatima Collection
          </Link>

          {user ? (
            <div className="flex gap-4 items-center">
              <span>Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {hasInvalidItems && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            Some items exceed available stock ⚠️
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => {

              const isOutOfStock = item.stock === 0
              const maxReached =
                item.stock !== undefined &&
                item.quantity >= item.stock

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">

                    {/* ✅ RESPONSIVE FIX */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          className={`w-20 h-20 rounded ${
                            isOutOfStock ? "opacity-50" : ""
                          }`}
                        />

                        <div>
                          <h2 className="font-semibold">{item.name}</h2>

                          {isOutOfStock && (
                            <p className="text-red-500 text-sm">
                              Out of Stock
                            </p>
                          )}

                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                          <p>Rs {item.price}</p>
                        </div>
                      </div>

                      {/* RIGHT CONTROLS */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item, item.quantity - 1)
                          }
                        >
                          <Minus />
                        </Button>

                        <span>{item.quantity}</span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item, item.quantity + 1)
                          }
                          disabled={maxReached || isOutOfStock}
                        >
                          <Plus />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item)}
                        >
                          <Trash2 />
                        </Button>

                      </div>
                    </div>

                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* SUMMARY */}
          <Card className="p-4">

            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              <div className="flex justify-between">
                <span>Total Items</span>
                <span>
                  {cartItems.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {getTotalPrice()}</span>
              </div>

              {/* ✅ DELIVERY MESSAGE */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span>Depends on location</span>
              </div>

              <p className="text-xs text-gray-500">
                Delivery charges will be shared after confirmation via call/WhatsApp.
              </p>

              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>Rs {getTotalPrice()}</span>
              </div>

            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                disabled={!user || isPlacingOrder || hasInvalidItems}
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </Button>
            </CardFooter>

          </Card>

        </div>
      </div>
    </div>
  )
}