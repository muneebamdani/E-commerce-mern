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
    category: "Accessories",
    stock: 0,
    sizes: [],
    colors: [],
  })

  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (!user) return
    if (user.role !== "admin") navigate("/")
    else fetchProduct()
  }, [user])

  const fetchProduct = async () => {
    try {
      const products = await apiService.getProducts()
      const product = products.find((p) => p._id === id)

      if (!product) return setError("Product not found")

      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category || "Accessories",
        stock: product.stock ?? 0,
        sizes: product.sizes || [],
        colors: product.colors || [],
      })
    } catch {
      setError("Failed to load product")
    }
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleColorsChange = (e) => {
    const colors = e.target.value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)

    setFormData({ ...formData, colors })
  }

  const handleSizesChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )

    setFormData({ ...formData, sizes: selected })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const payload = new FormData()

      payload.append("name", formData.name)
      payload.append("price", Number(formData.price))
      payload.append("stock", Number(formData.stock || 0))
      payload.append("description", formData.description)
      payload.append("category", formData.category)

      if (formData.category === "Night Suits") {
        formData.sizes.forEach((size) =>
          payload.append("sizes[]", size)
        )
        formData.colors.forEach((color) =>
          payload.append("colors[]", color)
        )
      }

      if (imageFile) {
        payload.append("image", imageFile)
      }

      await apiService.updateProduct(id, payload, true)
      navigate("/admin/products")

    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update product"
      )
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

          {/* HEADER */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>

            <h1 className="text-3xl font-bold">
              Edit Product
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                  <p className="text-red-600">{error}</p>
                )}

                {/* NAME */}
                <div>
                  <Label>Product Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PRICE + STOCK */}
                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label>Price</Label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* 🔥 STOCK CONTROL SECTION */}
                  <div className="space-y-2">
                    <Label>Stock Control</Label>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setFormData({ ...formData, stock: 0 })
                        }
                      >
                        Out of Stock
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setFormData({ ...formData, stock: 10 })
                        }
                      >
                        Available
                      </Button>
                    </div>

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
                  <Label>Current Image</Label>

                  {formData.image && (
                    <img
                      src={formData.image}
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                  )}

                  <Label>Upload New Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
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
                    className="border p-2 rounded w-full"
                  >
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Night Suits">Night Suits</option>
                    <option value="Watches">Watches</option>
                  </select>
                </div>

                {/* NIGHT SUITS */}
                {formData.category === "Night Suits" && (
                  <>
                    <div>
                      <Label>Sizes</Label>

                      <select
                        multiple
                        value={formData.sizes}
                        onChange={handleSizesChange}
                        className="border p-2 rounded w-full"
                      >
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Extra Large">
                          Extra Large
                        </option>
                      </select>
                    </div>

                    <div>
                      <Label>Colors</Label>

                      <Input
                        value={formData.colors.join(", ")}
                        onChange={handleColorsChange}
                        placeholder="Red, Blue, Green"
                      />
                    </div>
                  </>
                )}

                {/* DESCRIPTION */}
                <div>
                  <Label>Description</Label>

                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading
                      ? "Saving..."
                      : "Update Product"}
                  </Button>

                  <Link to="/admin/products">
                    <Button variant="outline">
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