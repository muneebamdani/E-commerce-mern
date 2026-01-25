"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useAuth } from "../context/auth-context"

export default function MyOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) {
        setError("Please log in to view your orders.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/my`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch your orders.")
        }

        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserOrders()
  }, [user])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your orders...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

            {/* Back to Home */}
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h6m8-11v10a1 1 0 01-1 1h-6"
                  />
                </svg>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Orders Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You haven’t placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order #{order._id}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">{order.status}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Items:</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {order.items.map(({ product, quantity, size, color }) => (
                      <li key={product._id}>
                        {product.name} x {quantity}
                        {size && <span className="ml-2 text-sm text-gray-500">| Size: {size}</span>}
                        {color && <span className="ml-2 text-sm text-gray-500">| Color: {color}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>Rs{order.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
