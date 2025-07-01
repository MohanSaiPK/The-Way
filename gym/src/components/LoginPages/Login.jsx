import React, { useState } from "react";
import axios from "axios";
import { useUserItems } from "../../context/UserItemsContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const { wishlist, cart, refresh } = useUserItems();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "https://gym-backend-nyw8.onrender.com/api/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      console.log("Token saved:", response.data.access); //
      await refresh();
      navigate("/homes");
    } catch (error) {
      alert("Login failed. Check your username/password.");
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white max-w-md mx-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="w-full p-2 rounded bg-gray-700"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full p-2 rounded bg-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
        >
          Login
        </button>
        <div>
          <h3>New Here?</h3>
          <a
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-500 underline"
          >
            Create a New Account
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
