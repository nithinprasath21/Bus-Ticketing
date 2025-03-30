const PassengerService = require("../services/passengerService");
const PassengerRepository = require("../repositories/passengerRepository");

jest.mock("../repositories/passengerRepository");

describe("Passenger Service", () => {
  const mockBus = { _id: "bus123", availableSeats: ["A1", "A2"], price: 100 };
  const mockTrip = { _id: "trip123", busId: "bus123", availableSeats: ["A1", "A2"], status: "active", price: 100 };
  const mockBooking = { _id: "booking123", userId: "user123", tripId: "trip123", selectedSeats: ["A1"], totalPrice: 100, status: "confirmed" };

  test("should search for available buses", async () => {
    PassengerRepository.searchBuses.mockResolvedValue([mockTrip]);

    const result = await PassengerService.searchBuses({ source: "A", destination: "B", date: "2025-04-01" });

    expect(result).toEqual([mockTrip]);
  });

  test("should check seat availability", async () => {
    PassengerRepository.getAvailableSeats.mockResolvedValue(mockBus.availableSeats);

    const result = await PassengerService.checkSeatAvailability("bus123");

    expect(result).toEqual(["A1", "A2"]);
  });

  test("should successfully book a ticket", async () => {
    PassengerRepository.createBooking.mockResolvedValue(mockBooking);

    const result = await PassengerService.bookTicket("user123", { tripId: "trip123", selectedSeats: ["A1"] });

    expect(result).toEqual(mockBooking);
  });

  test("should cancel a booking", async () => {
    const canceledBooking = { ...mockBooking, status: "canceled" };
    PassengerRepository.cancelBooking.mockResolvedValue(canceledBooking);

    const result = await PassengerService.cancelBooking("user123", "booking123");

    expect(result).toEqual(canceledBooking);
  });

  test("should update user profile", async () => {
    const updatedUser = { _id: "user123", name: "New Name", email: "new@example.com" };
    PassengerRepository.updateUserProfile.mockResolvedValue(updatedUser);

    const result = await PassengerService.updateProfile("user123", { name: "New Name", email: "new@example.com" });

    expect(result).toEqual(updatedUser);
  });
});
