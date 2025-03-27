const Bus = require("../models/busModel");
const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");
const Cancellation = require("../models/cancellationModel");
const User = require("../models/userModel");

class PassengerRepository {
  static async searchBuses({ source, destination, date, busType }) {
    try {
      const query = { source, destination, departureTime: { $gte: new Date(date) }, status: "active" };
      if (busType) query.busType = busType;
      return await Trip.find(query).populate("busId");
    } catch (error) {
      throw new Error(`Database error while searching buses: ${error.message}`);
    }
  }

  static async getAvailableSeats(busId) {
    try {
      const trip = await Trip.findById(busId);
      if (!trip) throw new Error("Trip not found");
      return trip.availableSeats;
    } catch (error) {
      throw new Error(`Database error while fetching seat availability: ${error.message}`);
    }
  }

  static async createBooking(userId, { tripId, selectedSeats }) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip || trip.status === "canceled") throw new Error("Trip not available");

      const unavailableSeats = selectedSeats.filter(seat => !trip.availableSeats.includes(seat));
      if (unavailableSeats.length) throw new Error(`Seats not available: ${unavailableSeats.join(", ")}`);

      const totalPrice = selectedSeats.length * trip.price;
      const booking = await Booking.create({ userId, tripId, selectedSeats, totalPrice });

      trip.availableSeats = trip.availableSeats.filter(seat => !selectedSeats.includes(seat));
      await trip.save();

      return booking;
    } catch (error) {
      throw new Error(`Database error while booking ticket: ${error.message}`);
    }
  }

  static async getBookingHistory(userId) {
    try {
      return await Booking.find({ userId }).populate("tripId");
    } catch (error) {
      throw new Error(`Database error while fetching booking history: ${error.message}`);
    }
  }

  static async cancelBooking(userId, bookingId) {
    try {
      const booking = await Booking.findOne({ _id: bookingId, userId });
      if (!booking || booking.status === "canceled") throw new Error("Booking not found or already canceled");

      booking.status = "canceled";
      await booking.save();

      await Cancellation.create({ bookingId, userId, reason: "User request", refundStatus: "pending" });

      const trip = await Trip.findById(booking.tripId);
      trip.availableSeats.push(...booking.selectedSeats);
      await trip.save();

      return booking;
    } catch (error) {
      throw new Error(`Database error while canceling booking: ${error.message}`);
    }
  }

  static async updateUserProfile(userId, { name, email, phone, password }) {
    try {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (password) updateData.password = password;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) throw new Error("User not found");

      return updatedUser;
    } catch (error) {
      throw new Error(`Database error while updating profile: ${error.message}`);
    }
  }
}

module.exports = PassengerRepository;
