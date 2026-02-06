import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Custom hook for easier usage
export const useUI = () => useContext(UIContext);
