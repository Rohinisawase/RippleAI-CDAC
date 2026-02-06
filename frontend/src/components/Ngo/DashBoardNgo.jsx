import { useUI } from "../context/UIContext.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import SidebarContent from "../Sidebar/SidebarNgo.jsx";
import NGOProfileDashboard from "./NGOProfileDashboard.jsx";

const DashboardNgo = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar with slideable mobile behavior */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarContent />
        
      </Sidebar>

      
  <NGOProfileDashboard />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
      <header className="fixed md:hidden top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)}>☰</button>
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </header>


      </div>
    </div>
  );
};

export default DashboardNgo;
