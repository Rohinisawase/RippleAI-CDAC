import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
    age: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();

      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("phone", form.phone);
      fd.append("role", "USER");
      fd.append("name", form.name);
      fd.append("age", Number(form.age));
      fd.append("address", form.address);

      if (profileImage) {
        fd.append("profileImage", profileImage);
      }

      await registerUser(fd);

      localStorage.setItem("otpEmail", form.email);
      alert("OTP Sent");
      navigate("/verify-otp");
    } catch (err) {
      console.log(err.response?.data);
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-[420px] bg-white p-6 shadow rounded-lg">
        <h3 className="text-center text-xl font-semibold mb-4">
          User Registration
        </h3>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full mb-3 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
            className="w-full mb-3 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            className="w-full mb-3 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="w-full mb-3 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full mb-3 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full mb-4 px-3 py-2 border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full mb-5 text-sm
                       file:mr-3 file:px-3 file:py-1.5
                       file:rounded-md file:border-0
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md
                       hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
