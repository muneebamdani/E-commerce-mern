"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useAuth } from "../../context/auth-context"
import { apiService } from "../../services/api"

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchStats()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      // Fetch products, orders, and user count in parallel
      const [productsData, ordersData, usersCountData] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders(),
        apiService.getUserCount(), // returns { totalUsers: number }
      ])

      // Calculate total revenue
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.totalAmount, 0) || 0

      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalUsers: usersCountData?.totalUsers || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Tatheer Fatima Collection Admin
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link to="/admin" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
              <Link to="/admin/products/new">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store and track performance</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link to="/admin/products/new">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="outline" size="lg">
              <Package className="h-5 w-5 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" size="lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              View Orders
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs{stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Product Management</CardTitle>
              <CardDescription className="text-green-600">
                Add, edit, or remove products from your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/products">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products ({stats.totalProducts})
                </Button>
              </Link>
              <Link to="/admin/products/new">
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Order Management</CardTitle>
              <CardDescription className="text-blue-600">View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/orders">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View All Orders ({stats.totalOrders})
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Store Analytics</CardTitle>
              <CardDescription className="text-purple-600">View detailed analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                <TrendingUp className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
