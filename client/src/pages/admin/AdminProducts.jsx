"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { useAuth } from "../../context/auth-context"
import { apiService } from "../../services/api"

export default function AdminProducts() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchProducts()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts()
      setProducts(Array.isArray(data) ? data : data.products || [])
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await apiService.deleteProduct(productId)
      setProducts(products.filter((p) => p._id !== productId))
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product")
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount || 0)

  if (!user || user.role !== "admin") return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 flex-wrap">
            <div className="flex items-center space-x-2 sm:space-x-8 flex-wrap">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900">
                Tatheer Fatima Collection Admin
              </Link>
              <div className="hidden md:flex space-x-6 flex-wrap">
                <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-blue-600 font-medium">
                  Products
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 md:mt-0 flex-wrap">
              <span className="text-sm text-gray-600 truncate max-w-[100px] sm:max-w-[150px]">
                Welcome, {user.name}!
              </span>
              <Link to="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your store products</p>
            </div>
          </div>
          <Link to="/admin/products/new">
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product</p>
              <Link to="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden flex flex-col">
                <div className="aspect-square relative w-full">
                  <img
                    src={
                      product.image
                        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`
                        : "https://via.placeholder.com/300x300?text=Product"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col space-y-2">
                  {product.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link to={`/admin/products/edit/${product._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
