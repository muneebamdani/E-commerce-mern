import express from "express"
import Category from "../../models/Category.js"
import { requireAdmin } from "../../utils/auth.js"

const router = express.Router()

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ADD CATEGORY (ADMIN)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE CATEGORY (ADMIN)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE CATEGORY (ADMIN)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: "Category deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router