"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { CheckCircle, Package, Truck, Calendar } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function OrderConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [deliveryDate, setDeliveryDate] = useState("")

  const searchParams = new URLSearchParams(location.search)
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) {
      navigate("/")
      return
    }

    // Calculate delivery date (2-3 working days from now)
    const today = new Date()
    const delivery = new Date(today)
    delivery.setDate(today.getDate() + 3)

    // Format date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setDeliveryDate(delivery.toLocaleDateString("en-US", options))
  }, [orderId, navigate])

  if (!orderId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              ShopEasy
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Order ID:</span>
              <span className="text-gray-600">#{orderId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-medium">Confirmed</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">Order Date:</span>
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Expected Delivery</span>
              </div>
              <p className="text-blue-800 font-semibold">{deliveryDate}</p>
              <p className="text-blue-700 text-sm mt-1">Your order will be delivered within 2-3 working days</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Delivery Timeline:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Order confirmed - Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>Processing - 1 working day</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>Shipped - 2 working days</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                  <span>Delivered - 2-3 working days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We'll send you email updates about your order status and tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link to="/orders">
              <Button>View Order History</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
