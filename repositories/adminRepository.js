const User = require("../models/userModel");
const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");

class AdminRepository {
  static async getAllUsers() {
    return await User.find({}, "-password");
  }

  static async updateUserStatus(userId, isBlocked) {
    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });
    if (!user) throw new Error("User not found");
  }

  static async getTripDetails(tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) throw new Error("Trip not found");
    return trip;
  }

  static async cancelTrip(tripId) {
    const trip = await Trip.findByIdAndUpdate(tripId, { status: "canceled" }, { new: true });
    if (!trip) throw new Error("Trip not found");
  }

  static async getPassengerBookings(userId) {
    return await Booking.find({ userId }).populate("tripId");
  }

  static async deletePassengerBooking(userId, bookingId) {
    const booking = await Booking.findOneAndDelete({ _id: bookingId, userId });
    if (!booking) throw new Error("Booking not found");
  }
}

module.exports = AdminRepository;
