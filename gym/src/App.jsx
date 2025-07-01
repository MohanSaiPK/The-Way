import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./App.css";
import { Home } from "./components/Home.jsx";
import Login from "./components/LoginPages/Login.jsx";
import Register from "./components/LoginPages/Register.jsx";
import { ProductDisplay } from "./components/Display/ProductDisplay.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserItemsProvider } from "./context/UserItemsContext.jsx";
import ProductDetail from "./components/Display/ProductDetails.jsx";
import PaymentPage from "./components/Payment/PaymentPage";
import CartCheckoutPage from "./components/Checkout/CartCheckoutPage.jsx";

function App() {
  return (
    <UserItemsProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/homes"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductDisplay endpoint="products" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplements"
          element={
            <ProtectedRoute>
              <ProductDisplay endpoint="supplements" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail endpoint="products" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplements/:id"
          element={
            <ProtectedRoute>
              <ProductDetail endpoint="supplements" />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/payment/:category/:id"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart-checkout"
          element={
            <ProtectedRoute>
              <CartCheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserItemsProvider>
  );
}

export default App;
