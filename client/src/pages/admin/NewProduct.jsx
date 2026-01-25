"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { useAuth } from "../../context/auth-context"
import { apiService } from "../../services/api"

export default function NewProduct() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Accessories",
    stock: "",
    sizes: [],
    colors: [],
  })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/")
  }, [user])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSizeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value)
    setFormData({ ...formData, sizes: value })
  }

  const handleColorsChange = (e) => {
    const colors = e.target.value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
    setFormData({ ...formData, colors })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("price", Number(formData.price))
      data.append("stock", Number(formData.stock) || 100)
      data.append("description", formData.description)
      data.append("category", formData.category)

      if (formData.category === "Night Suits") {
        formData.sizes.forEach((size) => data.append("sizes[]", size))
        formData.colors.forEach((color) => data.append("colors[]", color))
      }

      if (imageFile) data.append("image", imageFile)

      await apiService.createProduct(data, true)
      navigate("/admin/products")
    } catch (err) {
      setError(err.message || "Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <div className="p-4 text-gray-600">Loading...</div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Create a new product for your store</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-red-600">{error}</div>}

                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Night Suits">Night Suits</option>
                    <option value="Watches">Watches</option>
                  </select>
                </div>

                {formData.category === "Night Suits" && (
                  <>
                    <div className="space-y-2">
                      <Label>Sizes *</Label>
                      <select
                        multiple
                        value={formData.sizes}
                        onChange={handleSizeChange}
                        className="border p-2 rounded w-full"
                      >
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Extra Large">Extra Large</option>
                      </select>
                      <p className="text-sm text-gray-500">
                        Hold Ctrl/Cmd to select multiple sizes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Colors *</Label>
                      <Input
                        placeholder="Red, Blue, Green"
                        value={formData.colors.join(", ")}
                        onChange={handleColorsChange}
                      />
                      <p className="text-sm text-gray-500">
                        Enter colors separated by commas.
                      </p>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Creating..." : "Create Product"}
                  </Button>
                  <Link to="/admin/products">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
