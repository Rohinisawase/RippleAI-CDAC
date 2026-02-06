import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <AuthCard title="Select Account Type">
      <p className="text-center text-gray-500 mb-6">
        Choose how you want to use RippleAI
      </p>

      <button
        onClick={() => navigate("/register-user")}
        className="w-full mb-4 bg-blue-600 text-white py-2.5 rounded-md
                   hover:bg-blue-700 transition"
      >
        👤 User
      </button>

      <button
        onClick={() => navigate("/register-ngo")}
        className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-md
                   hover:bg-blue-600 hover:text-white transition"
      >
        🏢 NGO
      </button>
    </AuthCard>
  );
}
