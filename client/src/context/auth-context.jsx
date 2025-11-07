"use client"

import { createContext, useContext, useState, useEffect } from "react"
import jwtDecode from "jwt-decode" // ✅ install this: npm install jwt-decode

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // 🔐 Helper: check if JWT is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token)
      if (!decoded.exp) return false
      const now = Date.now() / 1000
      return decoded.exp < now
    } catch {
      return true // invalid token
    }
  }

  // 🪄 Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("jwt_token")

    if (savedUser && token) {
      if (isTokenExpired(token)) {
        console.warn("⏰ Token expired, logging out...")
        logout()
      } else {
        setUser(JSON.parse(savedUser))
      }
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("cart")
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
