"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      // Check if same product with same size & color exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === (product.size || "") &&
          item.color === (product.color || "")
      )

      if (existingIndex !== -1) {
        // Increment quantity if same product + same options
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      }

      // Otherwise, add as new item
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove product from cart
  const removeFromCart = (product) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === product.id &&
            item.size === (product.size || "") &&
            item.color === (product.color || "")
          )
      )
    )
  }

  // Update quantity of a product
  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id &&
        item.size === (product.size || "") &&
        item.color === (product.color || "")
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Get total price of cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
