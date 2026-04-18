import api from "../services/apiClient";

export const apiService = {

  /* ---------------- AUTH ---------------- */
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

  /* ---------------- DASHBOARD ---------------- */
  getDashboardCounts: async () => {
    const res = await api.get("/stats/overview");
    return res.data;
  },

  /* ---------------- PRODUCTS ---------------- */
  getProducts: async () => {
    const res = await api.get("/products");
    return res.data;
  },

  createProduct: async (data, isFormData = false) => {
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const res = await api.post("/products", data, config);
    return res.data;
  },

  updateProduct: async (id, data, isFormData = false) => {
    const config = isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const res = await api.put(`/products/${id}`, data, config);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  /* ---------------- ORDERS ---------------- */
  getOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },

  createOrder: async (data) => {
    const res = await api.post("/orders", data);
    return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  // ✅ NEW: DELETE ORDER
  deleteOrder: async (orderId) => {
    const res = await api.delete(`/orders/${orderId}`);
    return res.data;
  },

  /* ---------------- CART ---------------- */
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

  /* ---------------- CATEGORIES ---------------- */
  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },

  createCategory: async (data) => {
    const res = await api.post("/categories", data);
    return res.data;
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};