require("dotenv").config();

const PassengerService = require("../services/passengerService");
const Booking = require("../models/bookingModel");
const Trip = require("../models/tripModel");
const Cancellation = require("../models/cancellationModel");
const User = require("../models/userModel");

jest.mock("../models/bookingModel");
jest.mock("../models/tripModel");
jest.mock("../models/cancellationModel");
jest.mock("../models/userModel");

describe("PassengerService Unit Tests", () => {
  let passengerService;

  beforeEach(() => {
    passengerService = new PassengerService();
    jest.clearAllMocks();
  });

  describe("searchBuses", () => {
    it("should return matching buses", async () => {
      const trips = [{ source: "A", destination: "B" }];
      Trip.find.mockResolvedValue(trips);

      const result = await passengerService.searchBuses({ source: "A", destination: "B" });
      expect(result).toEqual(trips);
      expect(Trip.find).toHaveBeenCalledWith({ source: "A", destination: "B", status: "active" });
    });
  });

  describe("checkSeatAvailability", () => {
    it("should return available seats", async () => {
      const mockTrip = { availableSeats: ["1A", "1B"] };
      Trip.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockTrip)
      });

      const result = await passengerService.checkSeatAvailability("bus123");
      expect(result).toEqual(["1A", "1B"]);
      expect(Trip.findOne).toHaveBeenCalledWith({ _id: "bus123" });
    });

    it("should throw error if trip not found", async () => {
      Trip.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        passengerService.checkSeatAvailability("badBus")
      ).rejects.toThrow("Bus not found or no available seats");
    });
  });

  describe("bookTicket", () => {
    it("should return booking on success", async () => {
      const tripData = {
        _id: "t1",
        availableSeats: ["2A", "2B"],
        price: 500,
        save: jest.fn().mockResolvedValue(true),
      };
      Trip.findOne.mockResolvedValue(tripData);
      const booking = { userId: "u1", tripId: "t1", selectedSeats: ["2A"] };
      Booking.create.mockResolvedValue(booking);

      const result = await passengerService.bookTicket("u1", { tripId: "t1", selectedSeats: ["2A"] });
      expect(result).toEqual(booking);
      expect(Booking.create).toHaveBeenCalledWith({
        userId: "u1",
        tripId: "t1",
        selectedSeats: ["2A"],
        totalPrice: 500,
        status: "confirmed",
      });
      expect(tripData.save).toHaveBeenCalled();
    });
  
    it("should throw error if booking fails", async () => {
      const tripData = {
        _id: "t1",
        availableSeats: ["2A", "2B"],
        price: 500,
        save: jest.fn().mockResolvedValue(true),
      };
  
      Trip.findOne.mockResolvedValue(tripData);
      Booking.create.mockResolvedValue(null);
  
      await expect(
        passengerService.bookTicket("u1", { tripId: "t1", selectedSeats: ["2A"] })
      ).rejects.toThrow("Booking failed");
    });
  
    it("should throw error if trip not found", async () => {
      Trip.findOne.mockResolvedValue(null);
  
      await expect(
        passengerService.bookTicket("u1", { tripId: "badTrip", selectedSeats: ["2A"] })
      ).rejects.toThrow("Trip not found");
    });
  });

  describe("getBookingHistory", () => {
    it("should return list of bookings", async () => {
      const bookings = [{ tripId: "t1" }];
      Booking.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(bookings) });

      const result = await passengerService.getBookingHistory("u1");
      expect(result).toEqual(bookings);
      expect(Booking.find).toHaveBeenCalledWith({ userId: "u1" });
    });
  });

  describe("getBooking", () => {
    it("should return specific booking if user matches", async () => {
      const booking = { _id: "b1", userId: { toString: () => "u1" }, tripId: "t1" };
      Booking.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(booking) });

      const result = await passengerService.getBooking("u1", "b1");
      expect(result._id).toBe("b1");
    });

    it("should throw if booking not found", async () => {
      Booking.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

      await expect(passengerService.getBooking("u1", "not-found")).rejects.toThrow("Booking not found or unauthorized");
    });

    it("should throw if user does not match", async () => {
      const booking = { userId: { toString: () => "someone-else" } };
      Booking.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(booking) });

      await expect(passengerService.getBooking("u1", "b1")).rejects.toThrow("Booking not found or unauthorized");
    });
  });

  describe("cancelBooking", () => {
    it("should cancel and return updated booking", async () => {
      const booking = { _id: "b1", status: "canceled" };
      Booking.findOneAndUpdate.mockResolvedValue(booking);
      Cancellation.create.mockResolvedValue({});

      const result = await passengerService.cancelBooking("u1", "b1", "no need");
      expect(result.status).toBe("canceled");
    });

    it("should throw error if booking not found", async () => {
      Booking.findOneAndUpdate.mockResolvedValue(null);

      await expect(passengerService.cancelBooking("u1", "b1")).rejects.toThrow("Booking not found or already canceled");
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const user = { name: "Alice", email: "alice@example.com" };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });

      const result = await passengerService.getProfile("u1");
      expect(result.name).toBe("Alice");
    });
  });

  describe("updateProfile", () => {
    it("should update and return profile", async () => {
      const updated = { name: "Alice Updated", email: "alice@example.com" };
      User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(updated) });

      const result = await passengerService.updateProfile("u1", { name: "Alice Updated" });
      expect(result.name).toBe("Alice Updated");
    });

    it("should throw error if update fails", async () => {
      User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(passengerService.updateProfile("u1", {})).rejects.toThrow("Profile update failed");
    });
  });
});
