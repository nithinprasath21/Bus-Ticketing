import React, { useState } from "react";
import axios from "axios";
import BusCard from "./BusCard";

interface PassengerLandingProps {
  onLogout: () => void;
}

const PassengerLanding: React.FC<PassengerLandingProps> = ({ onLogout }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [acType, setAcType] = useState("");
  const [seatType, setSeatType] = useState("");
  const [buses, setBuses] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    if (!source || !destination) {
      setError("Pick-up and Destination are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ source, destination });

      if (date) params.append("date", date);
      if (acType) params.append("acType", acType);
      if (seatType) params.append("seatType", seatType);

      const res = await axios.get(`http://localhost:3000/api/passenger/buses/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBuses(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch buses.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md">
        <h1 className="text-xl font-semibold">Bus Ticketing</h1>
        <button onClick={onLogout} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition">
          Logout
        </button>
      </nav>

      {/* Search Inputs */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <label className="block mb-1 text-sm text-gray-300">Pick-up <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm text-gray-300">Destination <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Date, Time, Bus Types */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Date and Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm text-gray-300">AC Type</label>
              <select
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                value={acType}
                onChange={(e) => setAcType(e.target.value)}
              >
                <option value="">Select AC Type</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm text-gray-300">Seat Type</label>
              <select
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
              >
                <option value="">Select Seat Type</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Seater">Seater</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700 transition mb-6"
        >
          Search Buses
        </button>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Bus Results */}
        <div className="space-y-4">
          {buses.map((bus) => (
            <BusCard key={bus._id} bus={bus} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerLanding;
