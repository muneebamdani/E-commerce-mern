import { Navigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Corrected admin check using role
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}
