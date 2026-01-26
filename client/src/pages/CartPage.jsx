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
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Tatheer Fatima Collection
              </Link>
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
                    <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
                  </div>
                ) : (
                  <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/"><Button><ArrowLeft className="h-4 w-4 mr-2"/>Continue Shopping</Button></Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login")
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
        user: user._id,
        userName: user.name,
        userEmail: user.email,
        items: orderItems,
        totalAmount: getTotalPrice(),
      }

      await apiService.createOrder(orderData, {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      clearCart()
      navigate(`/my-orders`)
    } catch (error) {
      console.error("Order API error:", error.response?.data)
      alert("Failed to place order: " + (error.response?.data?.message || error.message))
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Tatheer Fatima Collection
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
                  <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
                </div>
              ) : (
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2"/>Continue Shopping</Button></Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Please <Link to="/login" className="font-medium underline">sign in</Link> to place your order.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="relative h-20 w-20 flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={item.image || "https://via.placeholder.com/80x80?text=Product"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/80x80?text=Product")}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">Rs{item.price.toFixed(2)}</p>
                    {item.size && <p className="text-gray-600 text-sm">Size: {item.size}</p>}
                    {item.color && <p className="text-gray-600 text-sm">Color: {item.color}</p>}
                  </div>

                  <div className="flex items-center space-x-2 justify-center sm:justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-2">{item.quantity || 1}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <Card className="p-4 sm:p-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>Total Items</span>
                <span>{cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Price</span>
                <span>Rs{getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={!user || isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
