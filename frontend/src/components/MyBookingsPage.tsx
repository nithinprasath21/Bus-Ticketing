import React, { useState, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useGetBookingsQuery } from "../api/passengerApi";

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useGetBookingsQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-yellow-400";
    }
  };

  const determineStatus = (seats: any[]) => {
    const total = seats.length;
    const cancelled = seats.filter((s: any) => s.status === "cancelled").length;
    if (cancelled === 0) return "confirmed";
    if (cancelled === total) return "cancelled";
    return "partial";
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    const trip = booking.tripId;
    const statusType = determineStatus(booking.selectedSeats);
    const statusMap: Record<string, string> = {
      confirmed: "Booked",
      partial: "Partially Cancelled",
      cancelled: "Cancelled",
    };
    const dotColor = getStatusColor(statusType);

    return (
      <div ref={ref} className="min-h-[200px]">
        {inView ? (
          <div
            className="bg-gray-800 rounded-xl p-6 min-h-[200px] text-lg hover:cursor-pointer relative shadow-lg"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="absolute top-3 right-4 flex items-center space-x-2">
              <span
                className={`w-4 h-4 rounded-full ${dotColor}`}
                title={statusMap[statusType]}
              ></span>
              <span className="text-sm">{statusMap[statusType]}</span>
            </div>

            <p className="text-xl font-semibold mb-2 pt-3">
              {trip.source} ➝ {trip.destination}
            </p>
            <p className="text-base mb-1">
              <span className="font-medium">Departure:</span>{" "}
              {formatDate(trip.departureTime)} {formatTime(trip.departureTime)}
            </p>
            <p className="text-base mb-1">
              <span className="font-medium">Arrival:</span>{" "}
              {formatDate(trip.arrivalTime)} {formatTime(trip.arrivalTime)}
            </p>
            <p className="text-base mb-1">
              <span className="font-medium">Booking ID:</span>{" "}
              {booking._id.slice(-6)}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 animate-pulse min-h-[200px]"></div>
        )}
      </div>
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center text-xl">
        Loading your bookings...
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="min-h-screen bg-gray-950 text-red-500 flex justify-center items-center text-xl">
        Failed to load bookings. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center relative">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-purple-400 hover:underline self-start mb-4"
      >
        ← Back
      </button>

      <div className="w-[90%] rounded-2xl bg-gray-900 p-8 relative">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">
          My Trip Bookings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking, idx) => (
            <BookingCard key={idx} booking={booking} />
          ))}
        </div>
      </div>

      {selectedBooking && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 text-white text-xl">
            Loading booking details...
          </div>
        }>
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-2xl w-[70%] max-h-[80%] overflow-y-auto p-8 relative text-lg">
              <button
                className="absolute top-4 right-4 text-white text-xl"
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>

              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-10">
                  <div className="flex gap-4">
                    <svg
                      className="w-6 h-6 text-blue-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2c4.418 0 8 3.582 8 8 0 6-8 12-8 12S4 16 4 10c0-4.418 3.582-8 8-8z"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="white"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-400">From</div>
                      <div className="text-xl font-bold">
                        {selectedBooking.tripId.source}
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 text-white text-2xl">➝</div>
                  <div className="flex gap-4">
                    <svg
                      className="w-6 h-6 text-red-500 mt-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 22s8-6 8-12c0-4.418-3.582-8-8-8S4 5.582 4 10c0 6 8 12 8 12z"
                      />
                      <circle
                        cx="12"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="white"
                      />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-400">To</div>
                      <div className="text-xl font-bold">
                        {selectedBooking.tripId.destination}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right pr-8 pt-3">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span
                      className={`w-4 h-4 rounded-full ${getStatusColor(
                        determineStatus(selectedBooking.selectedSeats)
                      )}`}
                    />
                    <span className="text-base">
                      {determineStatus(selectedBooking.selectedSeats).replace(
                        /^./,
                        (s: string) => s.toUpperCase()
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mb-6">
                <div>
                  <div className="text-sm text-gray-400">Booking ID</div>
                  <div className="text-xl">
                    {selectedBooking._id.slice(-6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="text-xl">
                    ₹ {selectedBooking.totalPrice}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mb-6">
                <div>
                  <div className="text-sm text-gray-400">Date of Journey</div>
                  <div className="text-xl">
                    {formatDate(selectedBooking.tripId.departureTime)}
                  </div>
                  <div className="text-lg">
                    {formatTime(selectedBooking.tripId.departureTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Arrival</div>
                  <div className="text-xl">
                    {formatDate(selectedBooking.tripId.arrivalTime)}
                  </div>
                  <div className="text-lg">
                    {formatTime(selectedBooking.tripId.arrivalTime)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-lg font-semibold mb-2">Selected Seats</p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                  {selectedBooking.selectedSeats.map((seat: any, i: number) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span
                        className={classNames(
                          "w-3 h-3 rounded-full",
                          seat.status === "booked"
                            ? "bg-green-500"
                            : "bg-red-500"
                        )}
                      />
                      <span className="text-base font-medium">
                        Seat {seat.seatNumber}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({seat.status})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-lg"
                  onClick={() =>
                    navigate("/cancel-booking", { state: { booking: selectedBooking } })
                  }
                >
                  Cancel Trip
                </button>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default MyBookingsPage;
