const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");
const Cancellation = require("../models/cancellationModel");
const User = require("../models/userModel");

class PassengerRepository {
  static async searchBuses({ source, destination, date, busType }) {
    try {
      if (!source || !destination || !date) {
        throw new Error("Source, destination, and date are required.");
      }

      const query = { source, destination, departureTime: { $gte: new Date(date) }, status: "active" };
      if (busType) query.busType = busType;

      return await Trip.find(query).populate("busId");
    } catch (error) {
      throw new Error(`Error searching buses: ${error.message}`);
    }
  }

  static async getAvailableSeats(tripId) {
    try {
      if (!tripId) throw new Error("Trip ID is required.");

      const trip = await Trip.findById(tripId);
      if (!trip) throw new Error("Trip not found.");

      return trip.availableSeats;
    } catch (error) {
      throw new Error(`Error checking seat availability: ${error.message}`);
    }
  }

  static async createBooking(userId, { tripId, selectedSeats }) {
    try {
      if (!userId || !tripId || !selectedSeats || selectedSeats.length === 0) {
        throw new Error("User ID, Trip ID, and selected seats are required.");
      }

      const trip = await Trip.findById(tripId);
      if (!trip || trip.status === "canceled") {
        throw new Error("Trip is not available for booking.");
      }

      const unavailableSeats = selectedSeats.filter(seat => !trip.availableSeats.includes(seat));
      if (unavailableSeats.length) {
        throw new Error(`Seats not available: ${unavailableSeats.join(", ")}`);
      }

      const totalPrice = selectedSeats.length * trip.price;
      const booking = await Booking.create({ userId, tripId, selectedSeats, totalPrice });

      trip.availableSeats = trip.availableSeats.filter(seat => !selectedSeats.includes(seat));
      await trip.save();

      return booking;
    } catch (error) {
      throw new Error(`Error booking ticket: ${error.message}`);
    }
  }

  static async getBookingHistory(userId) {
    try {
      if (!userId) throw new Error("User ID is required.");

      return await Booking.find({ userId }).populate("tripId");
    } catch (error) {
      throw new Error(`Error fetching booking history: ${error.message}`);
    }
  }

  static async cancelBooking(userId, bookingId) {
    try {
      if (!userId || !bookingId) {
        throw new Error("User ID and Booking ID are required.");
      }

      const booking = await Booking.findOne({ _id: bookingId, userId });
      if (!booking) throw new Error("Booking not found.");
      if (booking.status === "canceled") throw new Error("Booking is already canceled.");

      booking.status = "canceled";
      await booking.save();

      await Cancellation.create({ bookingId, userId, reason: "User request", refundStatus: "pending" });

      const trip = await Trip.findById(booking.tripId);
      if (trip) {
        trip.availableSeats.push(...booking.selectedSeats);
        await trip.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Error canceling booking: ${error.message}`);
    }
  }

  static async updateUserProfile(userId, { name, email, phone, password }) {
    try {
      if (!userId) throw new Error("User ID is required.");

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (password) updateData.password = password;

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) throw new Error("User not found.");

      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
}

module.exports = PassengerRepository;
