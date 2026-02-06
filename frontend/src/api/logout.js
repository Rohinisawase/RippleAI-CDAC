import { useNavigate } from "react-router-dom";
import api from "./axios";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    console.log("[Logout] Attempting to log out...");

    try {
      const response = await api.post("/auth/logout", {}, { withCredentials: true });
      console.log("[Logout] Response received:", response.status, response.data);

      // Optionally, clear any frontend state or local storage if used
      // localStorage.removeItem("token"); 

      console.log("[Logout] Navigation to /login");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        // Server responded with a status outside 2xx
        console.error("[Logout] Server error:", err.response.status, err.response.data);
      } else if (err.request) {
        // Request was made but no response
        console.error("[Logout] No response received:", err.request);
      } else {
        // Something else happened
        console.error("[Logout] Error:", err.message);
      }
    }
  };

  return logout;
};
