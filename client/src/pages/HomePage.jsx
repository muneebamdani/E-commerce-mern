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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState("Accessories")
  const [selectedSize, setSelectedSize] = useState({})
const [selectedColor, setSelectedColor] = useState({})

  const categories = ["Accessories", "Clothing", "Night Suits", "Watches"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts()
      setProducts(data || [])
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

 const cartCountForProduct = (productId) => {
  return cartItems
    .filter((item) => item.id === productId)
    .reduce((total, item) => total + item.quantity, 0)
}

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  )

  const filteredProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() === selectedCategory.toLowerCase()
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">

          <Link to="/" className="text-2xl font-bold text-gray-900">
            Tatheer Fatima Collection
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-4">

            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}!
                </span>

                <Link to="/my-orders">
                  <Button variant="ghost" size="sm">
                    My Orders
                  </Button>
                </Link>

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

                {user?.role?.toLowerCase() === "admin" && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-4 space-y-3">

          {user ? (
            <>
              <p className="text-sm text-gray-600">
                Welcome, {user.name}!
              </p>

              {/* CART BUTTON ADDED */}
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({totalCartQuantity})
                </Button>
              </Link>

              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-start" variant="ghost">
                  My Orders
                </Button>
              </Link>

              {user?.role?.toLowerCase() === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full justify-start" variant="ghost">
                    Admin Panel
                  </Button>
                </Link>
              )}

              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* CART ALSO FOR GUEST USERS */}
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({totalCartQuantity})
                </Button>
              </Link>

              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-start" variant="ghost">
                  Login
                </Button>
              </Link>
            </>
          )}

        </div>
      )}

      {/* CATEGORY */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to Tatheer Fatima Collection
        </h1>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => {
              const quantity = cartCountForProduct(product._id)
              const isOutOfStock = (product.stock ?? 0) <= 0

              return (
                <Card key={product._id} className="relative">

                  {/* BADGE */}
                  {isOutOfStock && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}

                  {/* IMAGE */}
                  <img
                    src={product.image}
                    className={`h-60 w-full object-cover ${
                      isOutOfStock ? "opacity-60" : ""
                    }`}
                  />

                  <CardContent className="p-4 space-y-1">

  <h3 className="font-semibold">{product.name}</h3>

  {product.category && (
    <p className="text-xs text-gray-500">
      {product.category}
    </p>
  )}

  <p className="text-blue-600 font-bold">
    {formatCurrency(product.price)}
  </p>

  {product.description && (
    <p className="text-sm text-gray-600 line-clamp-2">
      {product.description}
    </p>
  )}

  {/* Night Suit Options */}
  {product.category === "Night Suits" && (
    <>
      {/* Size */}
      <div className="mt-2">
        <label className="block text-sm font-medium mb-1">
          Size
        </label>

        <select
          className="w-full border rounded-md p-2"
          value={selectedSize[product._id] || ""}
          onChange={(e) =>
            setSelectedSize((prev) => ({
              ...prev,
              [product._id]: e.target.value,
            }))
          }
        >
          <option value="">Select Size</option>

          {product.sizes?.map((size) => (
            <option
              key={size}
              value={size}
            >
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div className="mt-2">
        <label className="block text-sm font-medium mb-1">
          Color
        </label>

        <select
          className="w-full border rounded-md p-2"
          value={selectedColor[product._id] || ""}
          onChange={(e) =>
            setSelectedColor((prev) => ({
              ...prev,
              [product._id]: e.target.value,
            }))
          }
        >
          <option value="">Select Color</option>

          {product.colors?.map((color) => (
            <option
              key={color}
              value={color}
            >
              {color}
            </option>
          ))}
        </select>
      </div>
    </>
  )}

  <p
    className={`text-xs font-medium ${
      isOutOfStock
        ? "text-red-600"
        : "text-green-600"
    }`}
  >
    {isOutOfStock
      ? "Out of Stock"
      : "In Stock"}
  </p>

  {quantity > 0 && (
    <p className="text-xs text-blue-600">
      In Cart: {quantity}
    </p>
  )}

</CardContent>

                  <CardFooter>

                    <Button
  className="w-full"
  disabled={isOutOfStock}
  onClick={() => {
    if (isOutOfStock) return

    if (product.category === "Night Suits") {
      if (!selectedSize[product._id]) {
        alert("Please select a size")
        return
      }

      if (!selectedColor[product._id]) {
        alert("Please select a color")
        return
      }
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      size:
        product.category === "Night Suits"
          ? selectedSize[product._id]
          : null,
      color:
        product.category === "Night Suits"
          ? selectedColor[product._id]
          : null,
    })
  }}
>
  {isOutOfStock
    ? "Out of Stock"
    : quantity > 0
    ? `Add More (${quantity})`
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