import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateOtp } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "USER",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleRegister = async () => {
  setLoading(true);

  try {
    const res = await generateOtp(form.email, "REGISTER");
    console.log("OTP Response:", res.data); // check OTP sent message

    navigate("/verify-otp", {
      state: {
        form,
        profilePhoto,
      },
    });
  } catch (err) {
    console.error("OTP Error:", err.response?.data || err.message);

    // Show a proper alert
    alert(err.response?.data || err.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="USER">User</option>
            <option value="NGO">NGO</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </div>

        <p className="mt-4 text-center">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
