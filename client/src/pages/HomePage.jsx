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
  const [categories, setCategories] = useState([
    "Accessories",
    "Clothing",
    "Night Suits",
    "Watches"
  ])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState("Accessories")
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

      // ONLY merge if backend categories exist
      if (res && res.length > 0) {
        const names = res.map(c => c.name)
        setCategories(names)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
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

      {/* NAVBAR (UNCHANGED) */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-16">

            <Link to="/" className="text-2xl font-bold text-gray-900">
              Tatheer Fatima Collection
            </Link>

            <div className="hidden md:flex items-center space-x-4">

              {user ? (
                <>
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
                </>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              <Link to="/cart">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>

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

      {/* MOBILE MENU (UNCHANGED LOGIC FIXED) */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-3">

          {user ? (
            <>
              <p className="text-sm">Welcome, {user.name}</p>

              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">My Orders</Button>
              </Link>

              <Button
                className="w-full mt-2"
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
              <Button className="w-full">Login</Button>
            </Link>
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
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
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
          <p className="text-red-600">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => (
              <Card key={product._id}>
                <img src={product.image} className="h-60 w-full object-cover" />

                <CardContent>
                  <h3>{product.name}</h3>
                  <p className="text-blue-600 font-bold">
                    {formatCurrency(product.price)}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}