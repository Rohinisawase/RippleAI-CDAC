import { User, Lock, Trash2 } from "lucide-react";
import NavButton from "./NavButton.jsx";
import { useUI } from "../context/UIContext.jsx"; // import context

const SidebarContent = () => {
  const { activeTab, setActiveTab, setSidebarOpen } = useUI();

  const handleClick = (tab) => {
    console.log({"ttt" : tab});
    setActiveTab(tab);
    setSidebarOpen(false); // close mobile sidebar after selection
  };

  return (
    <aside className="w-full md:w-64 border-r border-gray-100 bg-white">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          RippleAI
        </h2>
      </div>

      <nav className="flex flex-col gap-1 px-3">
          <NavButton
          active={activeTab === "feed"}
          onClick={() => handleClick("feed")}
          icon={<User size={18} />}
          label=" General Feed"
        />

         <NavButton
          active={activeTab === "createPost"}
          onClick={() => handleClick("createPost")}
          icon={<User size={18} />}
          label="Create"
        />

         <NavButton
          active={activeTab === "managePosts"}
          onClick={() => handleClick("managePosts")}
          icon={<Lock size={18} />}
          label="Manage Post"
        />


        <NavButton
          active={activeTab === "edit"}
          onClick={() => handleClick("edit")}
          icon={<User size={18} />}
          label="Edit Profile"
        />

        <NavButton
          active={activeTab === "password"}
          onClick={() => handleClick("password")}
          icon={<Lock size={18} />}
          label="Change Password"
        />

  
        <div className="h-px bg-gray-100 my-2 mx-3" />

        <NavButton
          danger
          active={activeTab === "danger"}
          onClick={() => handleClick("danger")}
          icon={<Trash2 size={18} />}
          label="Delete Account"
        />
      </nav>
    </aside>
  );
};

export default SidebarContent;
