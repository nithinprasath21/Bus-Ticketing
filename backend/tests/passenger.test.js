const mongoose = require("mongoose");
const PassengerService = require("../services/passengerService");
const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

jest.mock("../repositories/passengerRepository");
const PassengerRepository = require("../repositories/passengerRepository");

describe("PassengerService Unit Tests", () => {
  let passengerService;
  let passengerRepositoryMock;

  beforeEach(() => {
    passengerRepositoryMock = new PassengerRepository();
    passengerService = new PassengerService();
    passengerService.passengerRepository = passengerRepositoryMock;
  });

  describe("searchBuses", () => {
    it("should return matching buses", async () => {
      const trips = [
        {
          source: "A",
          destination: "B",
          busId: {
            busType: {
              acType: "AC",
              seatType: "Sleeper",
            },
          },
        },
      ];
      passengerRepositoryMock.searchBuses.mockResolvedValue(trips);
      const result = await passengerService.searchBuses({ source: "A", destination: "B" });
      expect(result).toEqual(trips);
    });

    it("should filter by AC and seatType", async () => {
      const trips = [
        {
          source: "A",
          destination: "B",
          busId: {
            busType: {
              acType: "AC",
              seatType: "Sleeper",
            },
          },
        },
        {
          source: "A",
          destination: "B",
          busId: {
            busType: {
              acType: "Non-AC",
              seatType: "Seater",
            },
          },
        },
      ];
      passengerRepositoryMock.searchBuses.mockResolvedValue(trips);
      const result = await passengerService.searchBuses({ source: "A", destination: "B", acType: "AC", seatType: "Sleeper" });
      expect(result).toEqual([trips[0]]);
    });
  });

  describe("checkSeatAvailability", () => {
    it("should return available seats", async () => {
      passengerRepositoryMock.checkSeatAvailability.mockResolvedValue({ availableSeats: ["1A", "1B"] });
      const result = await passengerService.checkSeatAvailability("bus123");
      expect(result).toEqual(["1A", "1B"]);
    });

    it("should throw error if trip not found", async () => {
      passengerRepositoryMock.checkSeatAvailability.mockResolvedValue(null);
      await expect(passengerService.checkSeatAvailability("badBus")).rejects.toThrow("Bus not found or no available seats");
    });
  });

  describe("bookTicket", () => {
    beforeEach(() => {
      mongoose.startSession = jest.fn().mockResolvedValue({
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      });
    });

    it("should throw error if seats are already booked", async () => {
      passengerRepositoryMock.reserveSeatsIfAvailable.mockResolvedValue(null);

      await expect(
        passengerService.bookTicket("u1", {
          tripId: "t1",
          selectedSeats: [{ seatNumber: "2A" }],
        })
      ).rejects.toThrow("Booking failed. Please try again.");
    });
  });

  describe("getBookingHistory", () => {
    it("should return list of bookings", async () => {
      const bookings = [{ _id: "b1" }];
      passengerRepositoryMock.getBookingHistory.mockResolvedValue(bookings);
      const result = await passengerService.getBookingHistory("u1");
      expect(result).toEqual(bookings);
    });
  });

  describe("getBooking", () => {
    it("should throw if booking not found", async () => {
      passengerRepositoryMock.getBookingById.mockResolvedValue(null);
      await expect(passengerService.getBooking("u1", "not-found")).rejects.toThrow("Booking not found or unauthorized");
    });

    it("should throw if user does not match", async () => {
      const booking = { _id: "b1", userId: "anotherUser" };
      passengerRepositoryMock.getBookingById.mockResolvedValue(booking);
      await expect(passengerService.getBooking("u1", "b1")).rejects.toThrow("Booking not found or unauthorized");
    });

    it("should return booking if user matches", async () => {
      const booking = { _id: "b1", userId: "u1" };
      passengerRepositoryMock.getBookingById.mockResolvedValue(booking);
      const result = await passengerService.getBooking("u1", "b1");
      expect(result).toEqual(booking);
    });
  });

  describe("updateProfile", () => {
    it("should return updated profile", async () => {
      const updated = { name: "Alice Updated", email: "alice@example.com" };
      passengerRepositoryMock.updateUserProfile.mockResolvedValue(updated);
      const result = await passengerService.updateProfile("u1", { name: "Alice Updated" });
      expect(result).toEqual(updated);
    });

    it("should throw error if update fails", async () => {
      passengerRepositoryMock.updateUserProfile.mockResolvedValue(null);
      await expect(passengerService.updateProfile("u1", {})).rejects.toThrow("Profile update failed");
    });
  });
});
