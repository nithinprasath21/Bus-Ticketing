import React from "react";

interface AdminLandingProps {
  onLogout: () => void;
}

const AdminLanding: React.FC<AdminLandingProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Bus Ticketing</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm transition"
        >
          Logout
        </button>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Welcome, Admin!</h2>
        <p className="mt-2 text-gray-400">Explore and book your bus tickets.</p>
      </div>
    </div>
  );
};

export default AdminLanding;
