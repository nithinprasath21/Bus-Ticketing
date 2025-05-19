import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useBookSeatsMutation,
  useGetAvailableSeatsQuery,
} from "../api/bookingApi";

const BusBookingPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bus = state?.bus;

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const tripId = bus?._id;

  const {
    data: availableSeats = [],
    refetch: refetchSeats,
  } = useGetAvailableSeatsQuery(tripId, { skip: !tripId });

  const [bookSeats, { isLoading: isBooking }] = useBookSeatsMutation();

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (!tripId) return;

    try {
      await bookSeats({ tripId, selectedSeats }).unwrap();
      setToastMessage("🎉 Booking Confirmed!");
      setShowConfirmDialog(false);
      setSelectedSeats([]);
      refetchSeats();
    } catch (err) {
      console.error("Booking failed:", err);
      setToastMessage("❌ Booking Failed. Please try again.");
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!bus) {
    return (
      <div className="p-6 text-white bg-gray-950 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Bus details not found</h2>
        <p>
          It seems you accessed this page directly or refreshed. Please go back
          and select a bus again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const {
    busId: details,
    source,
    destination,
    departureTime,
    arrivalTime,
    price,
    features,
  } = bus;

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  const formatTime = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 flex flex-col md:flex-row gap-6 relative">
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-900 text-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl border border-purple-600">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Confirm Your Booking
            </h2>
            <p className="text-center mb-6">
              You are about to book {selectedSeats.length} seat
              {selectedSeats.length > 1 ? "s" : ""}:{" "}
              <span className="text-purple-400 font-semibold">
                {selectedSeats.join(", ").toUpperCase()}
              </span>
              <br />
              Total: ₹{selectedSeats.length * (bus?.price || 0)}
            </p>
            <div className="flex justify-center gap-6">
              <button
                className="px-5 py-2 rounded-full bg-gray-700 hover:bg-gray-600"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700"
                onClick={handleBooking}
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg border border-purple-500 z-50">
          {toastMessage}
        </div>
      )}

      <div className="w-full md:w-2/5 bg-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          ← Back to Trips
        </button>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{details?.busName}</h1>
          <p className="text-green-400 text-3xl font-semibold">₹{price}</p>
        </div>

        <p className="text-lg text-gray-300">{details?.busNumber}</p>

        <div className="flex gap-4 items-start">
          <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c4.418 0 8 3.582 8 8 0 6-8 12-8 12S4 16 4 10c0-4.418 3.582-8 8-8z" />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="white" />
          </svg>
          <div>
            <div className="text-sm text-gray-400">From</div>
            <div className="text-lg font-semibold">{source}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-400">Date of Journey</div>
            <div className="text-base">{formatDate(departureTime)}</div>
            <div className="text-base">{formatTime(departureTime)}</div>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-6 8-12c0-4.418-3.582-8-8-8S4 5.582 4 10c0 6 8 12 8 12z" />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="white" />
          </svg>
          <div>
            <div className="text-sm text-gray-400">To</div>
            <div className="text-lg font-semibold">{destination}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-400">Arrival</div>
            <div className="text-base">{formatDate(arrivalTime)}</div>
            <div className="text-base">{formatTime(arrivalTime)}</div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">Bus Type</p>
          <ul className="list-disc ml-5">
            <li>{details?.busType?.acType}</li>
            <li>{details?.busType?.seatType}</li>
          </ul>
        </div>

        {features?.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Features</p>
            <ul className="list-disc ml-5">
              {features.map((feat: string, idx: number) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-full md:w-3/5 bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select your seats</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {details?.seats?.length > 0 ? (
              details.seats.map((seat: string) => {
                const isAvailable = availableSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && toggleSeat(seat)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      ${
                        isAvailable
                          ? isSelected
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-500 text-gray-300 cursor-not-allowed"
                      }`}
                  >
                    {seat.toUpperCase()}
                  </button>
                );
              })
            ) : (
              <p className="text-red-400">No seats found for this trip.</p>
            )}
          </div>

          <div className="mt-6 flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-700 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
              <span className="text-sm">Booked</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-evenly animate-fade-in">
          {selectedSeats.length > 0 && (
            <div className="text-base font-medium text-white bg-gray-700 px-4 py-2 rounded-xl transition-all duration-300">
              {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} &nbsp;
              ₹{selectedSeats.length * (bus?.price || 0)}
            </div>
          )}
          <button
            disabled={selectedSeats.length === 0}
            className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ease-in-out
              ${
                selectedSeats.length > 0
                  ? "bg-purple-600 hover:bg-purple-700 scale-105"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            onClick={() => setShowConfirmDialog(true)}
          >
            Book Seat{selectedSeats.length > 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusBookingPage;