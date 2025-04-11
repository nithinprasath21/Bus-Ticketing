const Booking = require("../models/bookingModel");
const Trip = require("../models/tripModel");
const Cancellation = require("../models/cancellationModel");
const User = require("../models/userModel");

class PassengerRepository {
    async searchBuses(query) {
        return Trip.find({ source: query.source, destination: query.destination, status: "active" });
    }

    async checkSeatAvailability(busId) {
        return Trip.findOne({ _id : busId }).select("availableSeats");
    }

    async createBooking(bookingData) {
        return Booking.create(bookingData);
    }

    async getBookingHistory(userId) {
        return Booking.find({ userId }).populate("tripId");
    }

    async getBookingById(bookingId) {
        return Booking.findById(bookingId).populate("tripId");
    }

    async cancelBooking(bookingId, userId, reason) {
        const booking = await Booking.findOneAndUpdate(
            { _id: bookingId, userId },
            { status: "canceled" },
            { new: true }
        );
        if (booking) {
            await Cancellation.create({ bookingId, userId, reason });
        }
        return booking;
    }

    async getUserProfile(userId) {
        return User.findById(userId).select("-password");
    }

    async updateUserProfile(userId, updateData) {
        return User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    }
}

module.exports = PassengerRepository;
