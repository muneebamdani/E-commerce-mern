import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useAutoLogout = () => {
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) return;

    let timer;

    const logout = () => {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    };

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp) {
        logout();
        return;
      }

      const expiryTime = decoded.exp * 1000; // convert to ms
      const currentTime = Date.now();

      const timeLeft = expiryTime - currentTime;

      console.log("⏳ Time left (ms):", timeLeft);

      // If token already expired
      if (timeLeft <= 0) {
        logout();
        return;
      }

      timer = setTimeout(() => {
        console.log("🚪 Auto logout triggered");
        logout();
      }, timeLeft);
    } catch (err) {
      console.log("❌ Invalid token");
      logout();
    }

    return () => clearTimeout(timer);
  }, []);
};