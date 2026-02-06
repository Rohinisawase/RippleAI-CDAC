export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[420px] bg-white shadow-lg p-6 rounded-[14px]">
        <h3 className="text-center text-blue-600 text-xl font-semibold mb-6">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
