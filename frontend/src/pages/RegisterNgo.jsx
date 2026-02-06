import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { registerNgo } from "../api/authApi";

export default function RegisterNgo() {
  const [form, setForm] = useState({
    ngoName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [document, setDocument] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("role", "NGO");
      fd.append("ngoName", form.ngoName);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("ngoDetails", "");

      if (profileImage) fd.append("profileImage", profileImage);
      if (document) fd.append("ngoDocument", document);

      await registerNgo(fd);

      localStorage.setItem("otpEmail", form.email);
      alert("OTP Sent");
      navigate("/verify-otp");
    } catch (e) {
      alert("Registration failed");
    }
  };

  return (
    <AuthCard title="Register NGO">
      <input
        name="ngoName"
        placeholder="NGO Name"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full mb-4 px-3 py-2 border rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium mb-1">
        Profile Image
      </label>
      <input
        type="file"
        onChange={(e) => setProfileImage(e.target.files[0])}
        className="w-full mb-4 text-sm
                   file:mr-3 file:px-3 file:py-1.5
                   file:rounded-md file:border-0
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700"
      />

      <label className="block text-sm font-medium mb-1">
        NGO Document
      </label>
      <input
        type="file"
        onChange={(e) => setDocument(e.target.files[0])}
        className="w-full mb-6 text-sm
                   file:mr-3 file:px-3 file:py-1.5
                   file:rounded-md file:border-0
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2.5 rounded-md
                   hover:bg-blue-700 transition"
      >
        Register NGO
      </button>
    </AuthCard>
  );
}
