import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import RightSidebar from "../components/common/RightSidebar";

export default function UserLayout() {
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
          <Outlet />
        </div>

        <div className="p-3" style={{ width: "300px" }}>
          <RightSidebar title="Upcoming Features" />
        </div>
      </div>
    </>
  );
}
