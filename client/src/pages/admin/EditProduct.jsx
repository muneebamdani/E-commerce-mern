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
    stock: "",
    sizes: [],
    colors: [],
  })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/")
    else fetchProduct()
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
          category: product.category || "Accessories",
          stock: product.stock,
          sizes: product.sizes || [],
          colors: product.colors || [],
        })
      } else setError("Product not found")
    } catch {
      setError("Failed to load product")
    }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})
  const handleSizeChange = (e) => setFormData({...formData, sizes: Array.from(e.target.selectedOptions, o => o.value)})
  const handleColorsChange = (e) => setFormData({...formData, colors: e.target.value.split(",").map(c=>c.trim()).filter(Boolean)})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      let payload
      if (imageFile) {
        payload = new FormData()
        payload.append("name", formData.name)
        payload.append("price", Number(formData.price))
        payload.append("stock", Number(formData.stock))
        payload.append("description", formData.description)
        payload.append("category", formData.category)
        if (formData.category === "Night Suits") {
          formData.sizes.forEach(s => payload.append("sizes[]", s))
          formData.colors.forEach(c => payload.append("colors[]", c))
        }
        payload.append("image", imageFile)
      } else {
        payload = {...formData, price: Number(formData.price), stock: Number(formData.stock)}
      }

      await apiService.updateProduct(id, payload, !!imageFile)
      navigate("/admin/products")
    } catch (err) {
      setError(err.message || "Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <div className="p-4 text-gray-600">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/admin/products">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Edit Product</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-600">{error}</div>}

              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input name="price" type="number" value={formData.price} onChange={handleChange} required/>
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input name="stock" type="number" value={formData.stock} onChange={handleChange}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Image</Label>
                {formData.image && <img src={formData.image} alt="Current" className="w-32 h-32 object-cover rounded-md mb-2"/>}
                <Label>Upload New Image</Label>
                <Input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])}/>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded w-full" required>
                  <option value="">Select Category</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Night Suits">Night Suits</option>
                  <option value="Watches">Watches</option>
                </select>
              </div>

              {/* Night Suits Sizes */}
              {formData.category === "Night Suits" && (
                <>
                  <div className="space-y-2">
                    <Label>Sizes *</Label>
                    <select multiple value={formData.sizes} onChange={handleSizeChange} className="border p-2 rounded w-full">
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                    <p className="text-sm text-gray-500">Hold Ctrl/Cmd to select multiple sizes.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Colors *</Label>
                    <Input placeholder="Red, Blue" value={formData.colors.join(", ")} onChange={handleColorsChange}/>
                    <p className="text-sm text-gray-500">Enter colors separated by commas.</p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4}/>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Update Product"}</Button>
                <Link to="/admin/products"><Button variant="outline">Cancel</Button></Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
