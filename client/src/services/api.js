import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const apiService = {
  // Auth endpoints
  signup: async (name, email, mobile, password) => {
    try {
      const response = await api.post("/auth/signup", { name, email, mobile, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signup failed")
    }
  },

  signin: async (email, password) => {
    try {
      const response = await api.post("/auth/signin", { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signin failed")
    }
  },

  // Product endpoints
  getProducts: async () => {
    try {
      const response = await api.get("/products")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch products")
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create product")
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update product")
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete product")
    }
  },

  // Order endpoints
  createOrder: async (userId, items, totalAmount) => {
    try {
      const response = await api.post("/orders", { userId, items, totalAmount })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create order")
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get("/admin/orders")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch orders")
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}`, { status })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update order status")
    }
  },
}
