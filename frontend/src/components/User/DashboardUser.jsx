import { useState, useEffect } from "react";
import { useUI } from "../context/UIContext.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import SidebarContent from "../Sidebar/SidebarUser.jsx";
import UserProfileDashboard from "./UserProfileDashboard.jsx";
import { getUserProfile } from "../../api/UserApis/userProfile.js";
const DashboardUser = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const [profile, setProfile] = useState(null);


  useEffect(() => {
  getUserProfile()
    .then(setProfile)
    .catch(() => console.error("Failed to load profile"));
}, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}  user={profile}>
        <SidebarContent />
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="fixed md:hidden top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="font-semibold text-lg">Dashboard</h1>
        </header>

        {/* Dashboard body */}
        <main className="flex-1 mt-16 md:mt-0 overflow-y-auto">
          <UserProfileDashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardUser;
