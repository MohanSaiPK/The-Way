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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isLoaded } = useUserItems();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(
          `api/${endpoint}/?search=${searchQuery}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setProducts([]); // fallback to empty
      }
    };

    fetchProducts();
  }, [searchQuery, endpoint]);

  if (!isLoaded) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="w-full h-full bg-cover bg-blackRedBG p-10">
      {/* 🔍 Search and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              isProductPage ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded ${
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
          className="px-4 py-2 rounded w-1/3 text-black"
        />
      </div>

      {/* 💳 Product Cards */}
      <div className="justify-center z-0">
        <ProductCards products={products} endpoint={endpoint} />
      </div>
    </div>
  );
};
