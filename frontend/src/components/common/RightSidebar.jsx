// src/components/common/RightSidebar.jsx

export default function RightSidebar({ title }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h5 className="text-lg font-semibold mb-2">{title}</h5>
      <p className="text-gray-500 text-sm">
        This section is reserved for future content.
      </p>
    </div>
  );
}
