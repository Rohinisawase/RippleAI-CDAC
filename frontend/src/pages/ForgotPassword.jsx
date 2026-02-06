import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await forgotPassword(email);
      alert("OTP sent to email");
      navigate("/verify-otp");
    } catch (err) {
      alert("Email not found");
    }
  };

  return (
    <AuthCard title="Forgot Password">
      <p className="text-gray-500 text-center mb-6">
        Enter your email to receive OTP
      </p>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSendOtp}
        className="w-full bg-blue-600 text-white py-2.5 rounded-md
                   hover:bg-blue-700 transition"
      >
        Send OTP
      </button>
    </AuthCard>
  );
}
