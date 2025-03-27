const PassengerService = require("../services/passengerService");
const PassengerRepository = require("../repositories/passengerRepository");

jest.mock("../repositories/passengerRepository");

describe("Passenger Service", () => {
  const mockBus = { _id: "bus123", availableSeats: ["A1", "A2"], price: 100 };
  const mockTrip = { _id: "trip123", busId: "bus123", availableSeats: ["A1", "A2"], status: "active", price: 100 };
  const mockBooking = { _id: "booking123", userId: "user123", tripId: "trip123", selectedSeats: ["A1"], totalPrice: 100, status: "confirmed" };

  describe("Search Buses", () => {
    it("should return available buses for a valid search", async () => {
      PassengerRepository.searchBuses.mockResolvedValue([mockTrip]);
      const result = await PassengerService.searchBuses({ source: "A", destination: "B", date: "2025-04-01" });
      expect(result).toEqual([mockTrip]);
    });

    it("should return an empty array if no buses are found", async () => {
      PassengerRepository.searchBuses.mockResolvedValue([]);
      const result = await PassengerService.searchBuses({ source: "A", destination: "B", date: "2025-04-01" });
      expect(result).toEqual([]);
    });

    it("should throw an error if the repository fails", async () => {
      PassengerRepository.searchBuses.mockRejectedValue(new Error("Database error"));
      await expect(PassengerService.searchBuses({})).rejects.toThrow("Error searching buses: Database error");
    });
  });

  describe("Check Seat Availability", () => {
    it("should return available seats for a valid bus ID", async () => {
      PassengerRepository.getAvailableSeats.mockResolvedValue(mockBus.availableSeats);
      const result = await PassengerService.checkSeatAvailability("bus123");
      expect(result).toEqual(["A1", "A2"]);
    });

    it("should throw an error if the bus is not found", async () => {
      PassengerRepository.getAvailableSeats.mockRejectedValue(new Error("Trip not found"));
      await expect(PassengerService.checkSeatAvailability("invalidBusId")).rejects.toThrow("Error checking seat availability: Trip not found");
    });
  });

  describe("Book Ticket", () => {
    it("should successfully book a ticket", async () => {
      PassengerRepository.createBooking.mockResolvedValue(mockBooking);
      const result = await PassengerService.bookTicket("user123", { tripId: "trip123", selectedSeats: ["A1"] });
      expect(result).toEqual(mockBooking);
    });

    it("should throw an error if seats are unavailable", async () => {
      PassengerRepository.createBooking.mockRejectedValue(new Error("Seats not available"));
      await expect(PassengerService.bookTicket("user123", { tripId: "trip123", selectedSeats: ["A3"] })).rejects.toThrow("Error booking ticket: Seats not available");
    });

    it("should throw an error if the trip is canceled", async () => {
      PassengerRepository.createBooking.mockRejectedValue(new Error("Trip not available"));
      await expect(PassengerService.bookTicket("user123", { tripId: "canceledTrip", selectedSeats: ["A1"] })).rejects.toThrow("Error booking ticket: Trip not available");
    });
  });

  describe("View Booking History", () => {
    it("should return a user's booking history", async () => {
      PassengerRepository.getBookingHistory.mockResolvedValue([mockBooking]);
      const result = await PassengerService.viewBookingHistory("user123");
      expect(result).toEqual([mockBooking]);
    });

    it("should return an empty array if no bookings are found", async () => {
      PassengerRepository.getBookingHistory.mockResolvedValue([]);
      const result = await PassengerService.viewBookingHistory("user123");
      expect(result).toEqual([]);
    });

    it("should throw an error if the repository fails", async () => {
      PassengerRepository.getBookingHistory.mockRejectedValue(new Error("Database error"));
      await expect(PassengerService.viewBookingHistory("user123")).rejects.toThrow("Error fetching booking history: Database error");
    });
  });

  describe("Cancel Booking", () => {
    it("should successfully cancel a booking", async () => {
      const canceledBooking = { ...mockBooking, status: "canceled" };
      PassengerRepository.cancelBooking.mockResolvedValue(canceledBooking);
      const result = await PassengerService.cancelBooking("user123", "booking123");
      expect(result).toEqual(canceledBooking);
    });

    it("should throw an error if the booking is already canceled", async () => {
      PassengerRepository.cancelBooking.mockRejectedValue(new Error("Booking not found or already canceled"));
      await expect(PassengerService.cancelBooking("user123", "booking123")).rejects.toThrow("Error canceling booking: Booking not found or already canceled");
    });
  });

  describe("Update Profile", () => {
    it("should update user profile successfully", async () => {
      const updatedUser = { _id: "user123", name: "New Name", email: "new@example.com", phone: "1234567890" };
      PassengerRepository.updateUserProfile.mockResolvedValue(updatedUser);
      const result = await PassengerService.updateProfile("user123", { name: "New Name", email: "new@example.com" });
      expect(result).toEqual(updatedUser);
    });

    it("should throw an error if the user is not found", async () => {
      PassengerRepository.updateUserProfile.mockRejectedValue(new Error("User not found"));
      await expect(PassengerService.updateProfile("user123", { name: "New Name" })).rejects.toThrow("Error updating profile: User not found");
    });
  });
});
