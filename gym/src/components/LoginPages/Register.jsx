import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://gym-backend-nyw8.onrender.com/api/register/", {
        username,
        password,
      });

      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error) {
      alert(
        "Registration failed: " + error.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white max-w-md mx-auto rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
