"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Package } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError("")
      try {
        // Admin token stored in localStorage
        const token = localStorage.getItem("admin_token")
        if (!token) {
          setError("You must be logged in as admin to view orders.")
          setLoading(false)
          return
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          setError("Failed to fetch orders.")
          setLoading(false)
          return
        }

        const data = await res.json()
        setOrders(data)
      } catch (err) {
        setError("Network error while fetching orders.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Admin Panel - Orders
            </Link>
            <Button onClick={() => navigate("/my-orders")}>Go to My Orders</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found.</p>
        ) : (
          orders.map(order => (
            <Card key={order._id} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order #{order._id}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">User:</span>
                  <span>{order.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mobile:</span>
                  <span>{order.userMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <span>{order.paymentStatus}</span>
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
