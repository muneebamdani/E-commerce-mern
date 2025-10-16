"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { useAuth } from "../../context/auth-context"
import { apiService } from "../../services/api"

export default function EditProduct() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchProduct()
  }, [user])

  const fetchProduct = async () => {
    try {
      const products = await apiService.getProducts()
      const product = products.find((p) => p._id === id)
      if (product) {
        setFormData({
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          stock: product.stock,
        })
      } else {
        setError("Product not found")
      }
    } catch (error) {
      setError("Failed to load product")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await apiService.updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      })
      navigate("/admin/products")
    } catch (error) {
      setError("Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">Tatheer Fatima Collection Admin</Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
              <Link to="/"><Button variant="outline" size="sm">View Store</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product details</p>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Edit Product</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-600">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input name="stock" type="number" value={formData.stock} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input name="image" value={formData.image} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input name="category" value={formData.category} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Update Product"}
                </Button>
                <Link to="/admin/products"><Button variant="outline">Cancel</Button></Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
