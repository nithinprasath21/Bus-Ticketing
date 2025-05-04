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

    async createBooking(bookingData) {
        return Booking.create(bookingData);
    }

    async reserveSeatsIfAvailable(tripId, seatNumbers) {
        return Trip.findOneAndUpdate(
            {
                _id: tripId,
                availableSeats: { $all: seatNumbers }
            },
            {
                $pull: { availableSeats: { $in: seatNumbers } }
            },
            { new: true }
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

    async cancelBooking(bookingId, userId, reason) {
        const booking = await Booking.findOne({ _id: bookingId, userId });
        if (!booking || booking.status === 'cancelled') return null;    
        const now = new Date();
        booking.selectedSeats = booking.selectedSeats.map(seat => ({
            ...seat,
            status: 'cancelled',
            cancelledAt: now
        }));
        booking.status = 'cancelled';
        await booking.save();
    
        await Cancellation.create({ bookingId, userId, reason });
        return booking;
    }

    async findBookingByIdAndUser(bookingId, userId) {
        return await Booking.findOne({ _id: bookingId, userId });
    }
    
    async updateBookingSeats(bookingId, updatedSeats) {
        return await Booking.findByIdAndUpdate(
            bookingId,
            { selectedSeats: updatedSeats },
            { new: true }
        );
    }

    async getTripById(tripId) {
        return Trip.findById(tripId);
    }
    
    async updateBookingPartial(bookingId, updatePayload) {
        return Booking.findByIdAndUpdate(bookingId, updatePayload, { new: true });
    }
    
    async addSeatsBackToTrip(tripId, seatNumbers) {
        const trip = await Trip.findById(tripId);
        if (!trip) return null;
    
        trip.availableSeats = [...new Set([...trip.availableSeats, ...seatNumbers])];
        return await trip.save();
    }
    
    async createCancellationEntry(bookingId, userId, reason) {
        return await Cancellation.create({
            bookingId,
            userId,
            reason
        });
    }

    async getUserProfile(userId) {
        return User.findById(userId).select("-password");
    }

    async updateUserProfile(userId, updateData) {
        return User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    }
}

module.exports = PassengerRepository;
