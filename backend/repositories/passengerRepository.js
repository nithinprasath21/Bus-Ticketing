const Booking = require("../models/bookingModel");
const Trip = require("../models/tripModel");
const Cancellation = require("../models/cancellationModel");
const User = require("../models/userModel");

class PassengerRepository {
    async searchBuses(query) {
        return Trip.find(query).populate("busId");
    }

    async checkSeatAvailability(busId) {
        return Trip.findOne({ _id : busId }).select("availableSeats");
    }

    async createBooking(bookingData, session) {
        return Booking.create([bookingData], { session }).then(res => res[0]);
    }

    async reserveSeatsIfAvailable(tripId, seatNumbers, session) {
        return Trip.findOneAndUpdate(
            {
                _id: tripId,
                availableSeats: { $all: seatNumbers }
            },
            {
                $pull: { availableSeats: { $in: seatNumbers } }
            },
            { new: true, session }
        );
    }

    async restoreSeats(tripId, seatNumbers) {
        return Trip.updateOne(
            { _id: tripId },
            { $push: { availableSeats: { $each: seatNumbers } } }
        );
    }

    async getBookingHistory(userId) {
        return Booking.find({ userId }).populate("tripId");
    }

    async getBookingById(bookingId) {
        return Booking.findById(bookingId).populate("tripId");
    }

    async findBookingByIdAndUser(bookingId, userId, session = null) {
        return Booking.findOne({ _id: bookingId, userId }).session(session);
    }

    async updateBookingFull(bookingId, updatePayload, session) {
        return await Booking.findByIdAndUpdate(
            bookingId,
            updatePayload,
            { new: true, session }
        );
    }

    async getTripById(tripId, session = null) {
        return Trip.findById(tripId).session(session);
    }

    async addSeatsBackToTrip(tripDoc, seatNumbers, session = null) {
        if (!tripDoc) return null;
        tripDoc.availableSeats = [...new Set([...tripDoc.availableSeats, ...seatNumbers])];
        return await tripDoc.save({ session });
    }
    
    async createCancellationEntry(bookingId, userId, reason, session = null) {
        return await Cancellation.create([{ bookingId, userId, reason }], { session });
    }

    async getUserProfile(userId) {
        return User.findById(userId).select("-password");
    }

    async updateUserProfile(userId, updateData) {
        return User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    }
}

module.exports = PassengerRepository;
