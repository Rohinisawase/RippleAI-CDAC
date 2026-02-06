import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/authApi";
import { loginSuccess } from "../app/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      dispatch(
        loginSuccess({
          token: res.data.accessToken,
          role: res.data.role,
          user: { email },
        })
      );

      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <AuthCard title="Welcome Back">
      {/* Email */}
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Forgot password */}
      <div className="text-right mb-4">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Login */}
      <button
        onClick={handleLogin}
        className="w-full mb-4 bg-blue-600 text-white py-2.5 rounded-md
                   hover:bg-blue-700 transition"
      >
        Login
      </button>

      {/* Divider */}
      <div className="text-center mb-4 text-gray-400">
        — OR —
      </div>

      {/* Google */}
      <button
        className="w-full mb-4 border border-blue-600 text-blue-600 py-2.5 rounded-md
                   hover:bg-blue-600 hover:text-white transition"
      >
        Continue with Google
      </button>

      {/* Create account */}
      <div className="text-center text-sm">
        <Link
          to="/choose-role"
          className="text-blue-600 hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthCard>
  );
}
