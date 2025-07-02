import { useUserItems } from "../context/UserItemsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { wishlist, cart, refresh } = useUserItems();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [showWishlist, setShowWishlist] = useState(false);
  const [showCartList, setCartList] = useState(false);

  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const handleProductClick = (productId, category) => {
    const endpoint = category === "supplement" ? "supplements" : "products";
    navigate(`/${endpoint}/${productId}`);
    setShowWishlist(false);
    setCartList(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleRemove = async (type, id) => {
    const itemList = type === "wishlist" ? wishlist : cart;
    const item = itemList.find((i) => i.id === id);
    const endpoint =
      item?.category === "supplement" ? "supplements" : "products";
    const action = type === "wishlist" ? "toggle_wishlist" : "toggle_cart";

    try {
      await axiosInstance.post(
        `${endpoint}/${id}/${action}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await refresh();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center relative z-50">
      <div className="text-2xl font-bold">GYM STORE</div>

      {isAuthPage && token && (
        <div className="flex items-center space-x-6">
          {/* Wishlist */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faHeart}
              className="cursor-pointer"
              onClick={() => {
                setShowWishlist((prev) => !prev);
                setCartList(false);
              }}
            />
            <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
              {wishlist.length}
            </span>
            <div
              className={`absolute right-0 top-8 w-64 bg-white text-black rounded shadow transition-all duration-300 ease-in-out z-50 ${
                showWishlist
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="max-h-64 overflow-y-auto p-4">
                {wishlist.length === 0 ? (
                  <p>No wishlist items</p>
                ) : (
                  wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b p-1"
                    >
                      <span
                        className="text-sm cursor-pointer flex items-center gap-2 w-48"
                        onClick={() =>
                          handleProductClick(item.id, item.category)
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="truncate">
                          {item.name} ₹{item.price}
                        </div>
                      </span>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => handleRemove("wishlist", item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="cursor-pointer"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  navigate("/cart-checkout");
                } else {
                  setCartList((prev) => !prev);
                  setShowWishlist(false);
                }
              }}
            />
            <span className="absolute -top-1 -right-2 bg-green-600 text-xs px-1 rounded-full">
              {cart.length}
            </span>

            <div
              className={`absolute right-0 top-8 w-64 bg-white text-black rounded shadow transition-all duration-300 ease-in-out z-50 ${
                showCartList
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Scrollable list with bottom padding */}
              <div className="max-h-64 overflow-y-auto p-4 pb-16">
                {cart.length === 0 ? (
                  <p>No cart items</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b p-1"
                    >
                      <span
                        className="text-sm cursor-pointer flex items-center gap-2 w-48"
                        onClick={() =>
                          handleProductClick(item.id, item.category)
                        }
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="truncate">
                          {item.name} ₹{item.price}
                        </div>
                      </span>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => handleRemove("cart", item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Fixed bottom total bar */}
              {cart.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full bg-gray-200 px-3 py-2 text-sm font-semibold border-t flex justify-between items-center">
                  <span>
                    Total: ₹
                    {cart
                      .reduce((sum, item) => sum + parseFloat(item.price), 0)
                      .toFixed(2)}
                  </span>
                  <button
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                    onClick={() => {
                      navigate("/cart-checkout");
                      setCartList(false);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
