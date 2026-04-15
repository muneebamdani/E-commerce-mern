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

  // ✅ FIXED CART COUNT (IMPORTANT)
  const cartCountForProduct = (productId) => {
    const item = cartItems.find((i) => i.id === productId)
    return item ? item.quantity : 0
  }

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
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
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center h-16">

            <Link to="/" className="text-2xl font-bold">
              Tatheer Fatima Collection
            </Link>

            <div className="hidden md:flex items-center space-x-4">

              {user ? (
                <>
                  <span>Welcome, {user.name}</span>

                  <Link to="/cart">
                    <Button className="relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart

                      {totalCartQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalCartQuantity}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Button onClick={logout}>Logout</Button>
                </>
              ) : (
                <Link to="/login">
                  <Button>
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

            </div>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </nav>

      {/* CATEGORY */}
      <div className="flex gap-3 p-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

        {filteredProducts.map((product) => {
          const quantity = cartCountForProduct(product._id)

          return (
            <Card key={product._id} className="relative">

              {/* BADGE */}
              {quantity > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
                  In Cart: {quantity}
                </div>
              )}

              <img
                src={product.image}
                className="h-60 w-full object-cover"
              />

              <CardContent>
                <h3>{product.name}</h3>
                <p className="font-bold">
                  {formatCurrency(product.price)}
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() =>
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                >
                  {quantity > 0
                    ? `Add More (${quantity})`
                    : "Add to Cart"}
                </Button>
              </CardFooter>

            </Card>
          )
        })}

      </div>

      <Footer />
    </div>
  )
}