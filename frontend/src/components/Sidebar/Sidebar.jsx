import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout } from "../../api/logout"; // your custom hook for logout

const Sidebar = ({ open = true, setOpen = () => {}, children, user }) => {
  const navigate = useNavigate();
  const logout = useLogout(); // get your logout function from the hook


  console.log({user})
  const handleLogout = async () => {
    try {
      await logout(); // call logout API
      navigate("/login"); // redirect to login
      
    } catch (err) {
      console.error("Logout failed", err);
      // Optional: show a toast or alert
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50
          bg-white border-r shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
          w-72 md:w-auto
        `}
      >
        {/* User info */}
        {user ? (
          <div className="p-6 border-b border-gray-100 flex flex-col items-center gap-2">
                <img
          src={
            user.profilePhotoUrl
              ? `https://rippleaibucket.s3.eu-north-1.amazonaws.com/${user.profilePhotoUrl}`
              : "https://via.placeholder.com/80"
          }
          alt="User"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        />

            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">ID: {user.accountId}</p>
          </div>
        ) : (
          <div className="p-6 text-gray-400 text-center">Not logged in</div>
        )}

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Logout */}
        {user && (
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                bg-[#0A66C2] text-white rounded-lg
                hover:bg-[#004182] transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
