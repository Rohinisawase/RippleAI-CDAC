// src/components/common/Navbar.jsx

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/authSlice";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.user.profile);

  const profileImage =
    profile?.profilePhotoUrl?.startsWith("http")
      ? profile.profilePhotoUrl
      : DEFAULT_AVATAR;

  const handleLogout = () => {
    dispatch(logout()); // clears redux + localStorage
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm px-4 py-3">
      {/* Logo / Brand */}
      <span
        className="font-bold text-blue-600 cursor-pointer text-lg"
        onClick={() => navigate("/dashboard")}
      >
        RippleAI
      </span>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => navigate("/profile")}
        />

        <button
          onClick={handleLogout}
          className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-md
                     hover:bg-blue-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
