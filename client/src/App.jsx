import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect } from "react" // ✅ ADD
import { AuthProvider } from "./context/auth-context"
import { CartProvider } from "./context/cart-context"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CartPage from "./pages/CartPage"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminOrders from "./pages/admin/AdminOrders"
import NewProduct from "./pages/admin/NewProduct"
import EditProduct from "./pages/admin/EditProduct"
import PrivateRoute from "./components/PrivateRoute.jsx"
import MyOrdersPage from "./pages/MyOrdersPage.jsx"

// ✅ import your file (you named it auther.js)
import { isTokenExpired } from "./utils/auther"

function App() {
  const navigate = useNavigate(); // ✅ ADD

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (token && isTokenExpired(token)) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user"); // ✅ important (you store user too)
      navigate("/login");
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* User orders */}
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrdersPage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminProducts />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <PrivateRoute adminOnly={true}>
                <NewProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <PrivateRoute adminOnly={true}>
                <EditProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminOrders />
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App