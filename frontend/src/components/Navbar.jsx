import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/userSlice";
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
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
      {/* Brand */}
      <span
        className="text-blue-600 font-bold text-lg cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        RippleAI
      </span>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <button
          onClick={() => navigate("/profile")}
          className="p-0 border-none bg-transparent"
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover shadow cursor-pointer"
          />
        </button>

        {/* Create Post */}
        <button
          onClick={() => navigate("/create-post")}
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md
                     hover:bg-blue-600 hover:text-white transition"
        >
          + Create Post
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-md
                     hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
