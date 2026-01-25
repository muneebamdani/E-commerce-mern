import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper: Auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("jwt_token");

  if (!token) return { "Content-Type": "application/json" };

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const apiService = {
  // -------------------- AUTH --------------------
  signin: async ({ email, password }) => {
    const res = await axios.post(`${API_BASE_URL}/login`, { email, password }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  signup: async (name, email, mobile, password, address) => {
    const res = await axios.post(`${API_BASE_URL}/register`, { name, email, mobile, password, address }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  // -------------------- DASHBOARD / STATS --------------------
  getDashboardCounts: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/overview`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch dashboard counts");
    }
  },

  // -------------------- PRODUCTS --------------------
  getProducts: async () => {
    const res = await axios.get(`${API_BASE_URL}/products`, { headers: getAuthHeaders() });
    return res.data;
  },

  createProduct: async (productData, isFormData = false) => {
    const headers = getAuthHeaders();
    if (isFormData) delete headers["Content-Type"]; // let browser handle FormData
    const res = await axios.post(`${API_BASE_URL}/products`, productData, { headers });
    return res.data;
  },

  updateProduct: async (id, updatedData, isFormData = false) => {
    try {
      const headers = getAuthHeaders();
      if (isFormData) delete headers["Content-Type"];
      const res = await axios.put(`${API_BASE_URL}/products/${id}`, updatedData, { headers });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update product");
    }
  },

  deleteProduct: async (id) => {
    const res = await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  // -------------------- ORDERS --------------------
  getOrders: async () => {
    const res = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
    return res.data;
  },

  createOrder: async (orderData) => {
    // ✅ Added function to place order
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData, { headers: getAuthHeaders() });
    return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status }, { headers: getAuthHeaders() });
    return res.data;
  },

  // -------------------- CART --------------------
  getCart: async () => {
    const res = await axios.get(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
    return res.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await axios.post(`${API_BASE_URL}/cart`, { productId, quantity }, { headers: getAuthHeaders() });
    return res.data;
  },

  updateCartItem: async (productId, quantity) => {
    const res = await axios.put(`${API_BASE_URL}/cart/${productId}`, { quantity }, { headers: getAuthHeaders() });
    return res.data;
  },

  removeFromCart: async (productId) => {
    const res = await axios.delete(`${API_BASE_URL}/cart/${productId}`, { headers: getAuthHeaders() });
    return res.data;
  },

  clearCart: async () => {
    const res = await axios.delete(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
    return res.data;
  },
};
