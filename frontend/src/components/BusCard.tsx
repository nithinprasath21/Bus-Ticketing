import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const BusCard: React.FC<{ bus: any }> = ({ bus }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const navigate = useNavigate();
  const { busId, source, destination, departureTime, arrivalTime, price, availableSeats } = bus;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const departureFormatted = formatDateTime(departureTime);
  const arrivalFormatted = formatDateTime(arrivalTime);

  const handleClick = () => {
    navigate(`/booking/${bus._id}`, { state: { bus } });
  };

  return (
    <div ref={ref} className="min-h-[180px]">
      {!inView ? (
        <div className="h-[180px] bg-gray-900 animate-pulse rounded-md" />
      ) : (
        <div
          className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 hover:bg-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
          onClick={handleClick}
        >
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{busId.busName}</h2>
            <p className="text-sm text-gray-400 mb-3">{busId.busNumber}</p>

            <p className="text-lg font-semibold text-white mb-2">
              {source} → {destination}
            </p>

            <div className="text-sm text-gray-300 space-y-1">
              <p>
                Type: {busId.busType.acType} | {busId.busType.seatType}
              </p>
              <p>Features: {busId.features.join(", ")}</p>
            </div>
          </div>

          <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start items-end sm:items-end w-full sm:w-auto">
            <div>
              <p className="text-xl font-bold text-green-400">₹{price}</p>
              <p className="text-sm text-gray-400">
                {departureFormatted} → {arrivalFormatted}
              </p>
            </div>

            <div className="mt-3 sm:mt-6">
              <p className="text-base text-white">
                Seats Left:{" "}
                <span className="text-lg font-bold text-yellow-400">
                  {availableSeats.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusCard;
