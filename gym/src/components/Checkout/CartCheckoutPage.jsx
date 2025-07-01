// src/components/Cart/CartCheckoutPage.jsx
import React from "react";
import { useUserItems } from "../../context/UserItemsContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const CartCheckoutPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { cart, setCart, refresh } = useUserItems();
  const [isPaying, setIsPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMockPayment = async () => {
    setShowModal(true);
    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);
      setTimeout(async () => {
        try {
          await axios.post(
            "http://127.0.0.1:8000/api/cart/clear/",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          await refresh();
          setCart([]);
          setShowModal(false);
          alert("✅ Payment Successful!");
          navigate("/homes");
        } catch (err) {
          console.error("Error clearing cart:", err);
          alert("❌ Error clearing cart after payment");
        }
      }, 1000);
    }, 2000);
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="min-h-screen bg-blackRedBG bg-cover text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-xl font-semibold">{item.name}</p>
                    <p className="text-gray-300">₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Total: ₹{total.toFixed(2)}</h2>
            <button
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
              onClick={handleMockPayment}
            >
              Proceed to Pay
            </button>
          </div>
        </>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl text-blue-800 font-semibold mb-4">
              Processing Payment
            </h2>
            <p className="mb-4 text-black">Pay ₹{total.toFixed(2)}</p>
            {isProcessing ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <p className="text-green-600 font-bold">Payment Successful!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckoutPage;
