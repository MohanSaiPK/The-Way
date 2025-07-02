import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartPlus,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useUserItems } from "../../context/UserItemsContext.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";

export const ProductCards = ({ products, endpoint }) => {
  const { wishlist, cart, refresh } = useUserItems();
  const navigate = useNavigate();
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(null);
  const [isLoadingCart, setIsLoadingCart] = useState(null);
  const token = localStorage.getItem("token");
  const handleProductClick = (productId) => {
    navigate(`${productId}`);
  };

  const handleWishlistToggle = async (productId) => {
    if (!token) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    setIsLoadingWishlist(productId);
    try {
      await axiosInstance.post(
        `${endpoint}/${productId}/toggle_wishlist/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refresh();
    } catch (error) {
      console.error("Wishlist error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoadingWishlist(null);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("Please log in to add to cart.");
      return;
    }

    setIsLoadingCart(productId);
    try {
      await axiosInstance.post(
        `${endpoint}/${productId}/toggle_cart/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refresh(); // ✅ Also here, after successful toggle_cart
    } catch (error) {
      console.error("Cart error:", error);
      alert("Could not update cart.");
    } finally {
      setIsLoadingCart(null);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    /* autoplay: true,
    autoplaySpeed: 3000, */
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="border-2 rounded-3xl w-full">
      {products.length === 0 ? (
        <div className="text-white text-center py-10">No results found.</div>
      ) : (
        <Slider {...settings} className="p-4">
          {products.map((item) => (
            <div key={item.id} className="flex flex-col items-center pt-16">
              <img
                src={item.image}
                className="w-10/12 h-64 hover:scale-105 duration-300"
                alt={item.name}
                onClick={() => handleProductClick(item.id)}
              />

              <div className="flex justify-center h-14 items-center">
                <h3 className="text-white text-lg mr-4">{item.name}</h3>

                {token &&
                  (isLoadingWishlist === item.id ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="text-white text-2xl"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`cursor-pointer text-2xl ${
                        wishlist.some((w) => w.id === item.id)
                          ? "text-red-600"
                          : "text-white hover:text-red-800"
                      }`}
                      onClick={() => handleWishlistToggle(item.id)}
                    />
                  ))}
              </div>

              <div className="text-2xl font-bold text-white">{item.price}</div>

              <div className="grid grid-cols-4 gap-1 justify-center h-16 mt-2">
                <button
                  className="border rounded-md col-span-3 text-white"
                  onClick={() => navigate(`/payment/${endpoint}/${item.id}`)}
                >
                  BUY NOW
                </button>

                {token && (
                  <div className="flex flex-col border rounded-md col-span-1 justify-center items-center p-1">
                    {isLoadingCart === item.id ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="text-lg"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={
                          cart.some((c) => c.id === item.id)
                            ? faCheck
                            : faCartPlus
                        }
                        className="text-lg text-white cursor-pointer"
                        onClick={() => handleAddToCart(item.id)}
                      />
                    )}
                    <button className="text-xs text-white whitespace-nowrap">
                      {cart.some((c) => c.id === item.id)
                        ? "Added"
                        : "Add to cart"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};
