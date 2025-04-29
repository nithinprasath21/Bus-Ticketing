const PassengerRepository = require("../repositories/passengerRepository");
const Trip = require("../models/tripModel");

class PassengerService {
    constructor() {
        this.passengerRepository = new PassengerRepository();
    }

    async searchBuses(query) {
        const { source, destination, date, acType, seatType } = query;
        if (!source || !destination) {
            throw new Error("Source and destination are required");
        }
        const searchQuery = {
            source,
            destination,
            status: "active",
        };
        if (date) {
            const from = new Date(date);
            const to = new Date(from);
            to.setDate(from.getDate() + 1);
            searchQuery.departureTime = { $gte: from, $lt: to };
        }
        const trips = await this.passengerRepository.searchBuses(searchQuery);    
        const filteredTrips = trips.filter(trip => {
            const bus = trip.busId;
            if (!bus || !bus.busType) return false;
            let match = true;
            if (acType) match = match && bus.busType.acType === acType;
            if (seatType) match = match && bus.busType.seatType === seatType;
    
            return match;
        });
        return filteredTrips;
    }

    async checkSeatAvailability(busId) {
        const seats = await this.passengerRepository.checkSeatAvailability(busId);
        if (!seats) throw new Error("Bus not found or no available seats");
        return seats.availableSeats;
    }

    async bookTicket(userId, bookingData) {
        const { tripId, selectedSeats } = bookingData;
        const trip = await Trip.findOne({ _id: tripId });
        if (!trip) {
            throw new Error("Trip not found");
        }
        const availableSeatsSet = new Set(trip.availableSeats);
        for (const seat of selectedSeats) {
            if (!availableSeatsSet.has(seat)) {
                throw new Error(`Seat ${seat} is not available`);
            }
        }
        const totalPrice = trip.price * selectedSeats.length;
        const bookingPayload = {
            userId,
            tripId,
            selectedSeats,
            totalPrice,
            status: "confirmed",
        };
        const booking = await this.passengerRepository.createBooking(bookingPayload);
        if (!booking) {
            throw new Error("Booking failed");
        }
        trip.availableSeats = trip.availableSeats.filter(seat => !selectedSeats.includes(seat));
        await trip.save();
        return booking;
    }

    async getBookingHistory(userId) {
        return this.passengerRepository.getBookingHistory(userId);
    }

    async getBooking(userId, bookingId) {
        const booking = await this.passengerRepository.getBookingById(bookingId);
        if (!booking || booking.userId.toString() !== userId) throw new Error("Booking not found or unauthorized");
        return booking;
    }

    async cancelBooking(userId, bookingId, reason = "User canceled") {
        const booking = await this.passengerRepository.cancelBooking(bookingId, userId, reason);
        if (!booking) throw new Error("Booking not found or already canceled");
        return booking;
    }
    
    async deleteBooking(userId, bookingId) {
        const booking = await this.passengerRepository.deleteBooking(bookingId, userId);
        if (!booking) throw new Error("Booking not found or already deleted");
        return booking;
    }

    async getProfile(userId) {
        return this.passengerRepository.getUserProfile(userId);
    }

    async updateProfile(userId, updateData) {
        const updatedProfile = await this.passengerRepository.updateUserProfile(userId, updateData);
        if (!updatedProfile) throw new Error("Profile update failed");
        return updatedProfile;
    }
}

module.exports = PassengerService;
