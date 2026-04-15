"use client"

import { useEffect, useState } from "react"
import { apiService } from "../../services/api"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories()

      // ✅ FIX: handle all backend response types
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

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">
        Manage Categories
      </h1>

      {/* INPUT */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 flex-1"
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
  )
}