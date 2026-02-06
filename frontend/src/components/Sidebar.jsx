// src/components/Sidebar.jsx

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Profile", path: "/profile" },
    { label: "My Posts", path: "/dashboard" },
    { label: "Settings", path: "/dashboard" },
  ];

  return (
    <aside className="w-[200px] min-h-screen bg-blue-600 text-white p-4">
      <h5 className="mb-6 text-lg font-semibold">Menu</h5>

      <div className="flex flex-col gap-2">
        {menu.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full text-left px-3 py-2 rounded-md
                       hover:bg-blue-700 transition"
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
