import React, { useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
const BusBookingPage = lazy(() => import("./BusBookingPage"));
const CancelBookingPage = lazy(() => import("./CancelBookingPage"));
const BusCard = lazy(() => import("./BusCard"));
const MyBookingsPage = lazy(() => import("./MyBookingsPage"));
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLazySearchBusesQuery } from "../api/passengerApi";

interface PassengerLandingProps {
  onLogout: () => void;
}

const AC_TYPES = ["AC", "Non-AC"];
const SEAT_TYPES = ["Sleeper", "Seater"];

const PassengerLanding: React.FC<PassengerLandingProps> = ({ onLogout }) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [selectedAcTypes, setSelectedAcTypes] = useState<string[]>([]);
  const [selectedSeatTypes, setSelectedSeatTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [triggerSearch, { data, isFetching }] = useLazySearchBusesQuery();

  const toggleSelection = (
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSearch = async () => {
    setError("");
    if (!source || !destination) {
      setError("Pick-up and Destination are required.");
      return;
    }

    try {
      const result = await triggerSearch({ source, destination, date }).unwrap();
      const buses = result?.data || [];
      const prices = buses.map((b: any) => b.price);
      const max = Math.max(...prices, 0);
      setMaxPrice(max);
      setSelectedPriceRange([0, max]);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to fetch buses.");
    }
  };

  const buses: any[] = data?.data || [];

  const filteredBuses = buses.filter((bus: any) => {
    const acType = bus.busId?.busType?.acType?.toLowerCase();
    const seatType = bus.busId?.busType?.seatType?.toLowerCase();

    const acMatch = selectedAcTypes.length === 0 || selectedAcTypes.map(t => t.toLowerCase()).includes(acType);
    const seatMatch = selectedSeatTypes.length === 0 || selectedSeatTypes.map(t => t.toLowerCase()).includes(seatType);
    const priceMatch = bus.price >= selectedPriceRange[0] && bus.price <= selectedPriceRange[1];

    return acMatch && seatMatch && priceMatch;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-950 text-white">
            <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md relative">
              <h1 className="text-xl font-semibold">Bus Ticketing</h1>
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate("/bookings")}
                  className="hover:underline text-sm"
                >
                  View Bookings
                </button>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold"
                  >
                    P
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-md z-10">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          alert("Redirect to Profile Page");
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10">
              <div className="flex gap-4 mb-6">
                <div className="w-1/2">
                  <label htmlFor="pickup" className="block mb-1 text-sm text-gray-300">
                    Pick-up <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pickup"
                    type="text"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="destination" className="block mb-1 text-sm text-gray-300">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="destination"
                    type="text"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label htmlFor="datetime" className="block mb-1 text-sm text-gray-300"> Date and Time </label>
                  <input
                    id="datetime"
                    type="datetime-local"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-300">Search Filters</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {AC_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleSelection(type, setSelectedAcTypes)}
                        className={`px-4 py-1 rounded-full border text-sm ${selectedAcTypes.includes(type)
                          ? "bg-purple-600 border-purple-600"
                          : "bg-gray-800 border-gray-600"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                    {SEAT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleSelection(type, setSelectedSeatTypes)}
                        className={`px-4 py-1 rounded-full border text-sm ${selectedSeatTypes.includes(type)
                          ? "bg-purple-600 border-purple-600"
                          : "bg-gray-800 border-gray-600"
                          }`}
                      >
                        {type}
                      </button>
                    ))}

                    <div className="ml-auto w-full md:w-1/2 mt-4 md:mt-0">
                      <label className="block mb-2 text-sm text-gray-300">
                        Price Range: ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
                      </label>
                      <Slider
                        ariaLabelForHandle={["Minimum price", "Maximum price"]}
                        range
                        min={0}
                        max={maxPrice}
                        value={selectedPriceRange}
                        onChange={(value) => {
                          if (Array.isArray(value) && value.length === 2) {
                            setSelectedPriceRange([value[0], value[1]]);
                          }
                        }}
                        trackStyle={[{ backgroundColor: "#9333ea", height: 6 }]}
                        handleStyle={[
                          {
                            borderColor: "#9333ea",
                            height: 18,
                            width: 18,
                            marginTop: -6,
                            backgroundColor: "#9333ea",
                          },
                          {
                            borderColor: "#9333ea",
                            height: 18,
                            width: 18,
                            marginTop: -6,
                            backgroundColor: "#9333ea",
                          },
                        ]}
                        railStyle={{ backgroundColor: "#4b5563", height: 6 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700 transition mb-6"
              >
                {isFetching ? "Searching..." : "Search Buses"}
              </button>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {data && (
                <div className="space-y-4">
                  {filteredBuses.map((bus) => (
                    <Suspense
                      key={bus._id}
                      fallback={<div className="h-[180px] bg-gray-900 animate-pulse rounded-md" />}
                    >
                      <BusCard bus={bus} />
                    </Suspense>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />
      <Route
        path="/booking/:busId"
        element={
          <Suspense fallback={<div className="text-center mt-4">Loading booking page...</div>}>
            <BusBookingPage />
          </Suspense>
        }
      />
      <Route
        path="/bookings"
        element={
          <Suspense fallback={<div className="text-center mt-4">Loading bookings...</div>}>
            <MyBookingsPage />
          </Suspense>
        }
      />
      <Route
        path="/cancel-booking"
        element={
          <Suspense fallback={<div className="text-center mt-4">Cancelling booking...</div>}>
            <CancelBookingPage />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default PassengerLanding;
