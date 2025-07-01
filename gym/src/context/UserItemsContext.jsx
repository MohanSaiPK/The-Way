// context/UserItemsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const UserItemsContext = createContext();

export const useUserItems = () => useContext(UserItemsContext);

export const UserItemsProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const location = useLocation();

  const refresh = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      setCart([]);
      setIsLoaded(true);
      return;
    }

    try {
      const [wishlistRes, cartRes] = await Promise.all([
        axiosInstance.get("/user/wishlist/"),
        axiosInstance.get("/user/cart/"),
      ]);
      setWishlist(wishlistRes.data);
      setCart(cartRes.data);
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setIsLoaded(true); // ✅ mark as loaded whether success/fail
    }
  };

  useEffect(() => {
    refresh();
  }, [location.pathname]);

  return (
    <UserItemsContext.Provider
      value={{ wishlist, cart, setWishlist, setCart, refresh, isLoaded }}
    >
      {children}
    </UserItemsContext.Provider>
  );
};
