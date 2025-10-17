"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Package, ShoppingCart, Users, TrendingUp, Menu } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchStats()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const [productsData, ordersData, dashboardCounts] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders(),
        apiService.getDashboardCounts(),
      ])
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.totalAmount, 0) || 0
      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalUsers: dashboardCounts?.totalUsers || 0,
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
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900">
                Tatheer Fatima Admin
              </Link>
              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-6">
                <Link to="/admin" className="text-blue-600 font-medium">Dashboard</Link>
                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.name}!</span>
              <Link to="/admin/products/new">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 hidden sm:flex">
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">View Store</Button>
              </Link>
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 space-y-2">
              <Link to="/admin" className="block px-2 py-1 text-blue-600 font-medium rounded hover:bg-gray-100">Dashboard</Link>
              <Link to="/admin/products" className="block px-2 py-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100">Products</Link>
              <Link to="/admin/orders" className="block px-2 py-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100">Orders</Link>
              <Link to="/admin/products/new" className="block px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                Add Product
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your store and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
