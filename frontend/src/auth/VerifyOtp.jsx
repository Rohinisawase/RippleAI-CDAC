import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, registerUser } from "../api/authApi";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation(); 

  const handleVerify = async () => {
    if (!otp) return alert("Please enter OTP");
    setLoading(true);

    try {
      // Verify OTP first
      await verifyOtp(state.form.email, otp);

      // Prepare FormData for registration
      const formData = new FormData();
      for (let key in state.form) {
        formData.append(key, state.form[key]);
      }
      if (state.profilePhoto) {
        formData.append("profilePhoto", state.profilePhoto);
      }

      // Call register API
      await registerUser(formData);

      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("OTP / Registration error:", err.response || err);
      alert(err.response?.data || "OTP verification or registration failed");
      navigate("/register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

        <input
          className="w-full border px-3 py-2 mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Register"}
        </button>
      </div>
    </div>
  );
}
