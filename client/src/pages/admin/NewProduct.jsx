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
    stock: 0,
    sizes: [],
    colors: [],
  })

  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/")
  }, [user])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = new FormData()

      data.append("name", formData.name)
      data.append("price", Number(formData.price))
      data.append("stock", Number(formData.stock || 0))
      data.append("description", formData.description)
      data.append("category", formData.category)

      if (formData.category === "Night Suits") {
        formData.sizes.forEach((size) =>
          data.append("sizes[]", size)
        )
        formData.colors.forEach((color) =>
          data.append("colors[]", color)
        )
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <Link to="/admin/products">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          <h1 className="text-xl sm:text-3xl font-bold text-center sm:text-left">
            Add New Product
          </h1>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              {/* NAME */}
              <div>
                <Label>Product Name</Label>
                <Input
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <Label>Price</Label>
                  <Input
                    name="price"
                    type="number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Stock</Label>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* IMAGE */}
              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setImageFile(e.target.files[0])
                  }
                />
              </div>

              {/* CATEGORY */}
              <div>
                <Label>Category</Label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm sm:text-base"
                >
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Night Suits">Night Suits</option>
                  <option value="Watches">Watches</option>
                </select>
              </div>

              {/* NIGHT SUITS OPTIONS */}
              {formData.category === "Night Suits" && (
                <>
                  <div>
                    <Label>Sizes</Label>

                    <select
                      multiple
                      value={formData.sizes}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                        setFormData({ ...formData, sizes: selected })
                      }}
                      className="border p-2 rounded w-full h-24 text-sm"
                    >
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>

                  <div>
                    <Label>Colors</Label>

                    <Input
                      placeholder="Red, Blue, Green"
                      value={formData.colors.join(", ")}
                      onChange={(e) => {
                        const colors = e.target.value
                          .split(",")
                          .map((c) => c.trim())
                          .filter(Boolean)

                        setFormData({ ...formData, colors })
                      }}
                    />
                  </div>
                </>
              )}

              {/* DESCRIPTION */}
              <div>
                <Label>Description</Label>

                <Textarea
                  name="description"
                  onChange={handleChange}
                />
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm sm:text-base"
              >
                {isLoading ? "Creating..." : "Create Product"}
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}