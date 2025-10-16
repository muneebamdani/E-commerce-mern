import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return { "Content-Type": "application/json" };
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const apiService = {
  // AUTH
  signin: async ({ email, password }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  },

signup: async (name, email, mobile, password, address) => { // ✅ added address
  try {
    const res = await axios.post(
      `${API_BASE_URL}/register`,
      { name, email, mobile, password, address }, // ✅ include address
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Registration failed");
  }
}
,

  // PRODUCTS
  getProducts: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  createProduct: async (productData, isFormData = false) => {
  try {
    const headers = getAuthHeaders()
    // Remove Content-Type if FormData; browser will set it automatically
    if (isFormData) delete headers["Content-Type"]

    const res = await axios.post(
      `${API_BASE_URL}/products`,
      productData,
      { headers }
    )
    return res.data
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create product")
  }
},


  updateProduct: async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/products/${id}`, updatedData, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update product");
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete product");
    }
  },

  // ORDERS
  createOrder: async (orderData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/orders`, orderData, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      console.error("Order API error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to place order");
    }
  },

  placeOrder: async (orderData) => apiService.createOrder(orderData),

  getOrders: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch orders");
    }
  },

getUserOrders: async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/orders/user`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch your orders");
  }
},


  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update order status");
    }
  },

  // USERS
  getUserCount: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/count`, { headers: getAuthHeaders() });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch user count");
    }
  },

  // DASHBOARD COUNTS
  getDashboardCounts: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/overview`, { headers: getAuthHeaders() });
      return res.data; // { totalUsers, totalProducts, totalOrders }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch dashboard counts");
    }
  },
  // 🛒 CART
getCart: async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch cart");
  }
},

addToCart: async (productId, quantity = 1) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/cart`,
      { productId, quantity },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to add to cart");
  }
},

updateCartItem: async (productId, quantity) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/cart/${productId}`,
      { quantity },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update cart item");
  }
},

removeFromCart: async (productId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/cart/${productId}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to remove from cart");
  }
},

clearCart: async () => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to clear cart");
  }
}

};
