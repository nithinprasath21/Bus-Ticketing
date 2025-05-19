import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames";
import {
  useCancelBookingMutation,
  usePartialCancelBookingMutation,
} from "../api/bookingApi";

const CancelBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [selectedSeats, setSelectedSeats] = useState<string[]>(
    booking.selectedSeats
      .filter((s: any) => s.status === "booked")
      .map((s: any) => s.seatNumber)
  );
  const [error, setError] = useState("");

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [partialCancelBooking, { isLoading: isPartialCancelling }] =
    usePartialCancelBookingMutation();

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure? Ticket cancellation is irreversible.")) return;

    setError("");

    try {
      const totalBookable = booking.selectedSeats.filter(
        (s: any) => s.status === "booked"
      ).length;

      if (selectedSeats.length === totalBookable) {
        await cancelBooking({ bookingId: booking._id }).unwrap();
      } else {
        await partialCancelBooking({
          bookingId: booking._id,
          seats: selectedSeats,
        }).unwrap();
      }

      alert("Cancellation successful!");
      navigate("/bookings");
    } catch (err) {
      console.error(err);
      setError("Failed to cancel seats. Try again.");
    }
  };

  const terms = [
    "Ticket cancellations are final and irreversible.",
    "Partial cancellations are allowed only before departure.",
    "Refunds, if any, depend on the provider's policy.",
    "Service charges may apply for cancellations.",
    "Contact support if your booking status does not update.",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-purple-400 hover:underline self-start mb-4"
      >
        ← Back
      </button>

      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Cancel Booking</h2>

        <div className="mb-6">
          <p className="text-xl font-semibold mb-2">
            {booking.tripId.source} ➝ {booking.tripId.destination}
          </p>
          <p className="text-base mb-1">
            <span className="font-medium">Departure:</span>{" "}
            {new Date(booking.tripId.departureTime).toLocaleString()}
          </p>
          <p className="text-base mb-1">
            <span className="font-medium">Arrival:</span>{" "}
            {new Date(booking.tripId.arrivalTime).toLocaleString()}
          </p>
          <p className="text-base">
            <span className="font-medium">Booking ID:</span>{" "}
            {booking._id.slice(-6)}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Select Seats to Cancel</h3>
          <div className="flex flex-wrap gap-3">
            {booking.selectedSeats.map((seat: any, i: number) => {
              const disabled = seat.status !== "booked";
              const selected = selectedSeats.includes(seat.seatNumber);
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => toggleSeat(seat.seatNumber)}
                  className={classNames(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    disabled
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : selected
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-black"
                  )}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleCancel}
            disabled={
              isCancelling || isPartialCancelling || selectedSeats.length === 0
            }
            className="bg-red-600 hover:bg-red-700 px-6 py-2 text-lg font-semibold rounded disabled:opacity-50"
          >
            {isCancelling || isPartialCancelling
              ? "Processing..."
              : "Cancel Selected Seats"}
          </button>
        </div>

        {error && <p className="text-red-400 mt-3">{error}</p>}

        <div className="mt-10 border-t border-gray-700 pt-6">
          <h4 className="text-lg font-semibold mb-3">
            Ticket Cancellation Terms & Conditions
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {terms.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingPage;
