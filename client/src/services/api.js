import api from "../services/apiClient";

// -------------------- AUTH --------------------
export const apiService = {
  signin: async ({ email, password }) => {
    const res = await api.post("/login", { email, password });
    return res.data;
  },

  signup: async (name, email, mobile, password, address) => {
    const res = await api.post("/register", {
      name,
      email,
      mobile,
      password,
      address,
    });
    return res.data;
  },

  // -------------------- DASHBOARD / STATS --------------------
  getDashboardCounts: async () => {
    try {
      const res = await api.get("/stats/overview");
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to fetch dashboard counts"
      );
    }
  },

  // -------------------- PRODUCTS --------------------
  getProducts: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  createProduct: async (productData, isFormData = false) => {
    try {
      const config = {};

      // ✅ important for image upload + stock support
      if (isFormData) {
        config.headers = { "Content-Type": "multipart/form-data" };
      }

      const res = await api.post("/products", productData, config);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Failed to create product"
      );
    }
  },

  updateProduct: async (id, updatedData, isFormData = false) => {
    try {
      const config = {};

      // ✅ supports image + stock updates
      if (isFormData) {
        config.headers = { "Content-Type": "multipart/form-data" };
      }

      const res = await api.put(`/products/${id}`, updatedData, config);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Failed to update product"
      );
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Failed to delete product"
      );
    }
  },

  // -------------------- ORDERS --------------------
  getOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },

  createOrder: async (orderData) => {
    try {
      const res = await api.post("/orders", orderData);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Order failed"
      );
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.error || "Failed to update order"
      );
    }
  },

  // -------------------- CART --------------------
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data;
  },

  updateCartItem: async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, { quantity });
    return res.data;
  },

  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await api.delete("/cart");
    return res.data;
  },
};