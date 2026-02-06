import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import DashboardUser from "./components/User/DashboardUser";
import DashboardNgo from "./components/Ngo/DashboardNgo";
import { UIProvider } from "./components/context/UIContext";
import VerifyOtp from "./auth/VerifyOtp";
import Feed from "./components/Feed/Feed";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Public */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/feed" element={<Feed />} />

      {/* Protected */}
      <Route
        path="/dashboard/user"
        element={
            <UIProvider>
              <DashboardUser />
            </UIProvider>
        }
      />

      <Route
        path="/dashboard/ngo"
        element={
            <UIProvider>
              <DashboardNgo />
            </UIProvider>
        }
      />
    </Routes>
  );
}

export default App;
