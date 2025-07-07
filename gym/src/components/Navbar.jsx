import { useUserItems } from "../context/UserItemsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faRightFromBracket,
  faTrash,
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
  const isAuthPage = ["/", "/register"].includes(location.pathname);

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

  /* const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0); */

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center z-50">
      <div className="text-2xl font-bold">GYM STORE</div>

      {!isAuthPage && token && (
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Wishlist */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faHeart}
              className="cursor-pointer md:text-lg"
              onClick={() => {
                setShowWishlist((prev) => !prev);
                setCartList(false);
              }}
            />
            <span className="absolute -top-1 -right-2 bg-red-600 text-xs px-1 rounded-full">
              {wishlist.length}
            </span>
            <div
              className={`absolute right-0 top-8 w-52 md:w-64 bg-white text-black rounded shadow transition-all duration-300 ease-in-out z-50 ${
                showWishlist
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* <div className="md:max-h-64 max-h-48  overflow-y-auto p-2"> */}
              <div className="md:max-h-60 max-h-48 overflow-y-auto p-2">
                {wishlist.length === 0 ? (
                  <p className="text-sm">No wishlist items</p>
                ) : (
                  <table className="w-full  text-[11px] md:text-xs table-fixed">
                    <tbody>
                      {wishlist.map((item) => (
                        <tr key={item.id} className="border-b align-middle">
                          <td className="p-1 w-12">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain rounded"
                              //className=" md:w-full md:h-full object-cover rounded"
                            />
                          </td>
                          <td
                            className="p-1 cursor-pointer align-top"
                            onClick={() =>
                              handleProductClick(item.id, item.category)
                            }
                          >
                            <div className="cursor-pointer hover:underline leading-tight">
                              <div className="font-semibold text-[12px] ">
                                {item.name}{" "}
                              </div>
                              <div className="text-gray-700 text-[10px]">
                                {item.price}
                              </div>
                            </div>
                          </td>

                          <td className="p-1 w-6 text-right align-middle">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className=" text-red-600 text-xs cursor-pointer"
                              onClick={() => handleRemove("wishlist", item.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="cursor-pointer md:text-lg"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  navigate("/cart-checkout");
                  setShowWishlist(false);
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
              className={`absolute right-0 top-8 w-52 md:w-64 bg-white text-black rounded shadow transition-all duration-300 ease-in-out z-50 ${
                showCartList
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Scrollable list with bottom padding */}
              <div className="max-h-60 overflow-y-auto p-4 pb-16">
                {cart.length === 0 ? (
                  <p className="text-sm">No cart items</p>
                ) : (
                  <table className="w-full  text-[11px] md:text-xs table-fixed">
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-b align-middle">
                          <td className="p-1 w-12">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-contain rounded"
                              //className=" md:w-full md:h-full object-cover rounded"
                            />
                          </td>
                          <td
                            className="p-1 cursor-pointer align-top"
                            onClick={() =>
                              handleProductClick(item.id, item.category)
                            }
                          >
                            <div className="cursor-pointer hover:underline leading-tight">
                              <div className="font-semibold text-[12px] ">
                                {item.name}{" "}
                              </div>
                              <div className="text-gray-700 text-[10px]">
                                {item.price}
                              </div>
                            </div>
                          </td>

                          <td className="p-1 w-6 text-right align-middle">
                            <FontAwesomeIcon
                              icon={faTrash}
                              className=" text-red-600 text-xs cursor-pointer"
                              onClick={() => handleRemove("cart", item.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm px-3 py-1 rounded"
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
