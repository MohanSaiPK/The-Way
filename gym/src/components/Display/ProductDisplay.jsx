// components/ProductDisplay.jsx
import React, { useEffect, useState } from "react";
import { ProductCards } from "../Cards/ProductCards";
import axios from "axios";
import { useUserItems } from "../../context/UserItemsContext";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export const ProductDisplay = ({ endpoint }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProductPage = location.pathname === "/products";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoaded } = useUserItems();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(
          `${endpoint}/?search=${searchQuery}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setProducts([]); // fallback to empty
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, endpoint]);

  if (!isLoaded) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-cover bg-blackRedBG px-10 pt-20">
      {/* 🔍 Search and Filter */}
      <div className="flex justify-between items-start my-6">
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
          <button
            className={`md:px-4 md:py-2 px-2 py-1 rounded ${
              isProductPage ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className={`md:px-4 md:py-2 px-2 py-1 rounded ${
              !isProductPage ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => navigate("/supplements")}
          >
            Supplements
          </button>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-1 py-1 md:p-2 rounded w-1/2 md:w-1/3 text-black"
        />
      </div>

      {/* 💳 Product Cards */}
      <div className="justify-center z-0">
        <ProductCards
          products={products}
          endpoint={endpoint}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
