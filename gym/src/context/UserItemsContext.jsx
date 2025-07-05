// context/UserItemsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

const UserItemsContext = createContext();

function useUserItems() {
  return useContext(UserItemsContext);
}

const UserItemsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const isAccessTokenValid = () => {
    const access = localStorage.getItem("token");
    if (!access) return false;
    if (access) {
      try {
        const decoded = jwtDecode(access);
        return decoded.exp > Date.now() / 1000;
      } catch (err) {
        return false;
      }
    }
  };

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) return false;

    try {
      const response = await axiosInstance.post("token/refresh/", { refresh });

      localStorage.setItem("token", response.data.access);
      console.log("✅ Token refreshed");
      return true;
    } catch (err) {
      console.error("🔴 Refresh failed", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/");
      return false; // Or use navigate("/login")
    }
  };

  const refreshUserItems = async () => {
    try {
      const [wishlistRes, cartRes] = await Promise.all([
        axiosInstance.get("/user/wishlist/"),
        axiosInstance.get("/user/cart/"),
      ]);
      setWishlist(wishlistRes.data);
      setCart(cartRes.data);
    } catch (err) {
      console.error("❌ Error fetching user items", err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    const validateAndLoad = async () => {
      const valid = isAccessTokenValid();
      if (!valid) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          setIsLoaded(true);
          return;
        }
      }
      await refreshUserItems();
    };
    validateAndLoad();
  }, []);

  return (
    <UserItemsContext.Provider
      value={{
        wishlist,
        cart,
        setWishlist,
        setCart,
        refresh: refreshUserItems,
        isLoaded,
      }}
    >
      {children}
    </UserItemsContext.Provider>
  );
};

export { UserItemsContext, useUserItems, UserItemsProvider };
