const NavButton = ({ active, icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-left transition
      ${active
        ? danger
          ? "bg-rose-50 text-rose-600"
          : "bg-gray-100 text-gray-900 border-l-4 border-black"
        : danger
        ? "text-rose-500 hover:bg-rose-50"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
    `}
  >
    {icon}
    {label}
  </button>
);

export default NavButton;
