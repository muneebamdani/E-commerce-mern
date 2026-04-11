import { useEffect } from "react";
import jwtDecode from "jwt-decode";

export const useAutoLogout = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      const expiryTime = decoded.exp * 1000; // ms
      const currentTime = Date.now();

      const timeLeft = expiryTime - currentTime;

      console.log("⏳ Time left (ms):", timeLeft);

      if (timeLeft <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(() => {
        console.log("🚪 Auto logout triggered");
        logout();
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch (err) {
      console.log("❌ Invalid token");
      logout();
    }
  }, []);
};

const logout = () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};