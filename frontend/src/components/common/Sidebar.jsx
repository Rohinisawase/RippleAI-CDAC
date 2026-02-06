// src/components/common/Sidebar.jsx

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-[220px] bg-blue-600 text-white p-4">
      <h5 className="mb-6 text-lg font-semibold">Menu</h5>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `block mb-3 px-2 py-1 rounded transition ${
            isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-500"
          }`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `block px-2 py-1 rounded transition ${
            isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-500"
          }`
        }
      >
        My Profile
      </NavLink>
    </div>
  );
}
