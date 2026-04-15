"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) {
        setCartItems(JSON.parse(saved))
      }
    } catch (err) {
      console.error("Cart load error:", err)
      localStorage.removeItem("cart")
    }
  }, [])

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // ✅ ADD TO CART (FIXED)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id
      )

      if (existingIndex !== -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // ✅ REMOVE FROM CART
  const removeFromCart = (product) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== product.id)
    )
  }

  // ✅ UPDATE QUANTITY
  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity }
          : item
      )
    )
  }

  // ✅ TOTAL PRICE
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // CLEAR CART
  const clearCart = () => setCartItems([])

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

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}