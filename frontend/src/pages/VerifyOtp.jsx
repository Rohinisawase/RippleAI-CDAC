import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/authApi";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async () => {
    const email = localStorage.getItem("otpEmail");

    if (!email) {
      alert("Email missing. Please start again.");
      navigate("/register");
      return;
    }

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp({
        email,
        otp: otp.trim(),
      });

      localStorage.removeItem("otpEmail");
      alert("OTP verified successfully");
      navigate("/login");

    } catch (err) {
      alert("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: 360 }}>
        <h4 className="text-center mb-3">Verify OTP</h4>

        <input
          className="form-control mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
