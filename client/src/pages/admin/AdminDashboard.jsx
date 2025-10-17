"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Package, ShoppingCart, Users, TrendingUp, Menu, X } from "lucide-react"
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
  const [menuOpen, setMenuOpen] = useState(false) // toggle for navbar on mobile

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
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">Tatheer Fatima Collection Admin</Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/admin" className="text-blue-600 font-medium">Dashboard</Link>
              <Link to="/admin/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">Orders</Link>
              <Link to="/admin/products/new">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />Add Product
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">View Store</Button>
              </Link>
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t">
            <Link to="/admin" className="block text-blue-600 font-medium">Dashboard</Link>
            <Link to="/admin/products" className="block text-gray-600 hover:text-gray-900">Products</Link>
            <Link to="/admin/orders" className="block text-gray-600 hover:text-gray-900">Orders</Link>
            <Link to="/admin/products/new" className="block">
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />Add Product
              </Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="outline" size="sm" className="w-full">View Store</Button>
            </Link>
            <span className="block text-sm text-gray-600 mt-2">Welcome, {user.name}!</span>
          </div>
        )}
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalProducts}</div></CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalOrders}</div></CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">Rs{stats.totalRevenue.toFixed(2)}</div></CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
