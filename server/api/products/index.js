import express from "express";
import connectDB from "../../utils/db.js";
import Product from "../../models/Product.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";
import multer from "multer";
import cloudinary from "../../utils/cloudinary.js";

const router = express.Router();

// Ensure DB connection
router.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload helper
const uploadToCloudinary = (fileBuffer) => {
  if (!fileBuffer) return null;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

/* -------------------- GET ALL PRODUCTS -------------------- */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- CREATE PRODUCT -------------------- */
router.post(
  "/",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;

      // Parse sizes & colors (can arrive as JSON strings in FormData)
      let sizes = [];
      let colors = [];

      if (req.body.sizes) {
        sizes = typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
      }

      if (req.body.colors) {
        colors = typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors;
      }

      // Basic validation
      if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Night Suits validation
      if (category === "Night Suits") {
        if (sizes.length === 0 || colors.length === 0) {
          return res.status(400).json({
            error: "Night Suits must have at least one size and one color"
          });
        }
      }

      // Upload image
      let image = "";
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        image = result.secure_url;
      }

      const newProduct = new Product({
        name,
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        category,
        image,
        sizes,
        colors
      });

      await newProduct.save();
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct
      });

    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

/* -------------------- UPDATE PRODUCT -------------------- */
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { price, category, description, name, stock } = req.body;

      let sizes = [];
      let colors = [];

      if (req.body.sizes) {
        sizes = typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
      }

      if (req.body.colors) {
        colors = typeof req.body.colors === "string"
          ? JSON.parse(req.body.colors)
          : req.body.colors;
      }

      // Night Suits validation
      if (category === "Night Suits") {
        if (sizes.length === 0 || colors.length === 0) {
          return res.status(400).json({
            error: "Night Suits must have sizes and colors"
          });
        }
      }

      // Upload new image if provided
      let updatedFields = {
        name,
        description,
        category,
        stock: Number(stock),
        sizes,
        colors
      };

      if (price !== undefined) {
        updatedFields.price = Number(price);
      }

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        updatedFields.image = result.secure_url;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        product: updatedProduct
      });

    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

/* -------------------- DELETE PRODUCT -------------------- */
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

/* -------------------- PRODUCT COUNT -------------------- */
router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Product count error:", error);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
});

export default router;
