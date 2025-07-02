import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartPlus,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUserItems } from "../../context/UserItemsContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ProductDetail = ({ endpoint }) => {
  const { id } = useParams(); // from route /products/:id or /supplements/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const { wishlist, cart, refresh } = useUserItems();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`api/${endpoint}/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setLoading(false);
      });
  }, [id, endpoint]);

  const handleWishlistToggle = async () => {
    if (!token) return alert("Login required");

    setWishlistLoading(true);
    try {
      await axiosInstance.post(
        `${endpoint}/${id}/toggle_wishlist/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refresh();
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCartToggle = async () => {
    if (!token) return alert("Login required");

    setCartLoading(true);
    try {
      await axiosInstance.post(
        `${endpoint}/${id}/toggle_cart/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refresh();
    } catch (error) {
      console.error("Cart toggle failed:", error);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!product) return <div className="text-white p-8">Product not found.</div>;

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="w-full min-h-screen bg-blackRedBG bg-cover bg-center text-white p-10">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-[400px] object-contain rounded-lg"
        />

        <div className="flex flex-col gap-4 md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-300">₹{product.price}</p>
          <p className="text-md text-gray-400">{product.description}</p>

          <div className="flex gap-4 items-center">
            <button
              onClick={handleWishlistToggle}
              className={`px-4 py-2 rounded ${
                isWishlisted ? "bg-red-600" : "bg-gray-700"
              }`}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faHeart} />
              )}{" "}
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>

            <button
              onClick={handleCartToggle}
              className={`px-4 py-2 rounded ${
                isInCart ? "bg-green-600" : "bg-gray-700"
              }`}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={isInCart ? faCheck : faCartPlus} />
              )}{" "}
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>

            <button
              className="px-4 py-2 bg-blue-600 rounded"
              onClick={() => navigate(`/payment/${endpoint}/${product.id}`)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
