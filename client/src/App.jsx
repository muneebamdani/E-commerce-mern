import { Routes, Route } from "react-router-dom"
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

// ✅ Import user orders page
import MyOrdersPage from "./pages/MyOrdersPage.jsx"

function App() {
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


          {/* ✅ User orders route (normal logged-in user) */}
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
