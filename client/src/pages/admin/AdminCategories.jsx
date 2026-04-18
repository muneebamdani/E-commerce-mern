"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiService } from "../../services/api"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { useAuth } from "../../context/auth-context"

export default function AdminCategories() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    fetchCategories()
  }, [user, navigate])

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories()

      const data =
        res?.categories ||
        res?.data ||
        res ||
        []

      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Category fetch error:", err)
      setCategories([])
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) return

    if (editingId) {
      await apiService.updateCategory(editingId, { name })
    } else {
      await apiService.createCategory({ name })
    }

    setName("")
    setEditingId(null)
    fetchCategories()
  }

  const handleEdit = (cat) => {
    setName(cat.name)
    setEditingId(cat._id)
  }

  const handleDelete = async (id) => {
    await apiService.deleteCategory(id)
    fetchCategories()
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center space-x-8">

              <Link to="/" className="text-2xl font-bold text-gray-900">
                Tatheer Fatima Collection Admin
              </Link>

              <div className="hidden md:flex space-x-6">

                <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>

                <Link to="/admin/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>

                <Link to="/admin/categories" className="text-blue-600 font-medium">
                  Categories
                </Link>

                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>

              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
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

      {/* MAIN */}
      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-4">
          Manage Categories
        </h1>

        {/* INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="Category name"
          />

          <Button onClick={handleSubmit}>
            {editingId ? "Update" : "Add"}
          </Button>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {categories.map((cat) => (
            <Card key={cat._id}>
              <CardContent className="flex justify-between items-center p-3">

                <span>{cat.name}</span>

                <div className="flex gap-2">

                  <Button size="sm" onClick={() => handleEdit(cat)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>

      </div>

    </div>
  )
}