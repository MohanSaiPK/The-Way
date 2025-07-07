import React, { useState } from "react";
import axios from "axios";
import { useUserItems } from "../../context/UserItemsContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const { refresh } = useUserItems();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, SetLoading] = useState(false);

  const handleLogin = async (e) => {
    SetLoading(true);
    e.preventDefault();

    try {
      const response = await axiosInstance.post("token/", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      console.log("Token saved:", response.data.access); //
      await new Promise((resolve) => setTimeout(resolve, 300));
      await refresh();
      navigate("/homes");
    } catch (error) {
      alert("Login failed. Check your username/password.");
      console.error(error);
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blackRedBG bg-cover">
      <div className="p-8 bg-gray-800 text-white max-w-md w-full mx-4 rounded-xl">
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
            disabled={loading}
            className="w-full p-2 rounded bg-green-600"
          >
            {loading ? "Logging in..." : "Login"}
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
    </div>
  );
};
export default Login;
