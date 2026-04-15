"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { useCart } from "../context/cart-context"
import { useAuth } from "../context/auth-context"
import Footer from "../components/Footer"
import { apiService } from "../services/api"

export default function HomePage() {
  const { addToCart, cartItems } = useCart()
  const { user, logout } = useAuth()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedOptions, setSelectedOptions] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts()
      setProducts(data || [])
    } catch (err) {
      console.error(err)
      setError("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories()
      setCategories(res || [])

      // auto select first category
      if (res && res.length > 0) {
        setSelectedCategory(res[0].name)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSizeChange = (productId, size) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: { ...prev[productId], size }
    }))
  }

  const handleColorChange = (productId, color) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: { ...prev[productId], color }
    }))
  }

  const filteredProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() === selectedCategory?.toLowerCase()
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" className="text-2xl font-bold text-gray-900">
              Tatheer Fatima Collection
            </Link>

            <div className="hidden md:flex items-center space-x-4">

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}!
                  </span>

                  {user.role === "admin" && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm">
                        Admin Panel
                      </Button>
                    </Link>
                  )}

                  <Link to="/my-orders">
                    <Button variant="ghost" size="sm">
                      My Orders
                    </Button>
                  </Link>

                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart

                  {totalCartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalCartQuantity}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-b px-4 py-4 space-y-3">

          {user ? (
            <>
              <p className="text-sm text-gray-600">
                Welcome, {user.name}!
              </p>

              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  My Orders
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Login
              </Button>
            </Link>
          )}

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">
              Cart ({totalCartQuantity})
            </Button>
          </Link>

        </div>
      )}

      {/* CATEGORY */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}

        </div>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to Tatheer Fatima Collection
        </h1>
        <p className="text-xl">
          Discover amazing products at unbeatable prices
        </p>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => {

              const cartItem = cartItems.find((i) => i.id === product._id)
              const quantity = cartItem ? cartItem.quantity : 0

              const isOutOfStock = product.stock === 0

              const handleAddToCart = () => {
                if (isOutOfStock) return

                addToCart({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                })
              }

              return (
                <Card key={product._id} className="overflow-hidden">

                  <img
                    src={product.image}
                    className="w-full h-60 object-cover"
                  />

                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-blue-600 font-bold">
                      {formatCurrency(product.price)}
                    </p>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="w-full"
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : quantity > 0
                        ? `Add to Cart (${quantity})`
                        : "Add to Cart"}
                    </Button>
                  </CardFooter>

                </Card>
              )
            })}

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}