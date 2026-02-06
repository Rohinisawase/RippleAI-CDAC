import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!token) {
      alert("Invalid or expired reset link");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password: newPassword,
      });

      alert("Password reset successful");
      navigate("/login");

    } catch (err) {
      alert("Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset Password">
      <input
        type="password"
        className="form-control mb-3"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </AuthCard>
  );
}
