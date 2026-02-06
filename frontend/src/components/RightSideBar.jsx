import React from "react";

export default function RightSideBar({ title = "Widget" }) {
  return (
    <div className="bg-white p-4 shadow rounded-lg mb-4">
      <h5 className="text-lg font-semibold mb-2">{title}</h5>
      <p className="text-gray-500 text-sm">
        This section is reserved for future content.
      </p>
    </div>
  );
}
