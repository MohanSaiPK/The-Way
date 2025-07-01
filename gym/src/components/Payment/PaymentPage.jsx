import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { id, category } = useParams(); // now you're using both
  const [product, setProduct] = useState(null);
  const delivery = 10;
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleMockPayment = () => {
    setShowModal(true);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setTimeout(() => {
        setShowModal(false);
        alert("✅ Payment Successful!");
        navigate("/homes"); // Or /success page
      }, 1000);
    }, 2000); // fake payment delay
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://127.0.0.1:8000/api/${category}/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id, category]);

  if (!product) return <div className="text-white p-6">Loading product...</div>;

  const total = parseFloat(product.price) + delivery;

  return (
    <div className="min-h-screen bg-blackRedBG bg-cover text-white p-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="flex gap-10">
        <img src={product.image} className="w-64 h-64 object-cover rounded" />
        <div>
          <h2 className="text-2xl">{product.name}</h2>
          <p className="text-lg text-gray-300 mb-4">Price: ₹{product.price}</p>
          <p className="text-lg text-gray-300 mb-4">
            Delivery Charges: ₹{delivery}
          </p>

          <h1 className="text-3xl font-bold mb-4">Total: ₹{total}</h1>

          <button
            className="bg-green-600 px-4 py-2 rounded text-white"
            onClick={handleMockPayment}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Processing Payment</h2>
            <p className="mb-4">Pay ₹{total.toFixed(2)}</p>
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

export default PaymentPage;
