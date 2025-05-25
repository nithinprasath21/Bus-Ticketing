const mongoose = require("mongoose");
const PassengerRepository = require("../repositories/passengerRepository");

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
        const session = await mongoose.startSession();
        session.startTransaction();
        let seatsReserved = false;
        try {
            const { tripId, selectedSeats } = bookingData;
            const seatNumbers = selectedSeats.map(seat => seat.seatNumber);
            const trip = await this.passengerRepository.reserveSeatsIfAvailable(tripId, seatNumbers, session);
            if (!trip) {
                throw new Error("Some or all selected seats are already booked.");
            }
            const totalPrice = trip.price * selectedSeats.length;
            const formattedSeats = selectedSeats.map(seat => ({
                seatNumber: seat.seatNumber,
                status: 'booked'
            }));
            const bookingPayload = {
                userId,
                tripId,
                selectedSeats: formattedSeats,
                totalPrice,
                status: "confirmed"
            };
            const booking = await this.passengerRepository.createBooking(bookingPayload, session);
            if (!booking) {
                throw new Error("Booking creation failed.");
            }
            await session.commitTransaction();
            session.endSession();
            return booking;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (seatsReserved) {
                const seatNumbers = bookingData.selectedSeats.map(seat => seat.seatNumber);
                await this.passengerRepository.restoreSeats(bookingData.tripId, seatNumbers);
            }
            throw new Error("Booking failed. Please try again.");
        }
    }

    async getBookingHistory(userId) {
        return this.passengerRepository.getBookingHistory(userId);
    }

    async getBooking(userId, bookingId) {
        const booking = await this.passengerRepository.getBookingById(bookingId);
        if (!booking || booking.userId.toString() !== userId) throw new Error("Booking not found or unauthorized");
        return booking;
    }

    async cancelBooking(userId, bookingId, reason = "Complete Booking Cancelled") {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const booking = await this.passengerRepository.findBookingByIdAndUser(bookingId, userId, session);
            if (!booking || booking.status === 'cancelled') {
                throw new Error("Booking not found or already cancelled");
            }
            const now = new Date();
            const updatedSeats = booking.selectedSeats.map(seat => ({
                ...seat.toObject(),
                status: 'cancelled',
                cancelledAt: now
            }));
            const cancelledSeatNumbers = updatedSeats.map(seat => seat.seatNumber);
            const updatePayload = {
                selectedSeats: updatedSeats,
                status: 'cancelled',
                totalPrice: 0,
                updatedAt: now
            };
            const updatedBooking = await this.passengerRepository.updateBookingFull(bookingId, updatePayload, session);
            if (!updatedBooking) {
                throw new Error("Failed to update booking status");
            }
            const tripDoc = await this.passengerRepository.getTripById(booking.tripId, session);
            if (!tripDoc) {
                throw new Error("Associated trip not found");
            }
            const updatedTrip = await this.passengerRepository.addSeatsBackToTrip(
                tripDoc,
                cancelledSeatNumbers,
                session
            );
            if (!updatedTrip) {
                throw new Error("Failed to add cancelled seats back to trip");
            }
            const cancellationLog = await this.passengerRepository.createCancellationEntry(
                bookingId,
                userId,
                reason,
                session
            );
            if (!cancellationLog || cancellationLog.length === 0) {
                throw new Error("Failed to log cancellation entry");
            }
            await session.commitTransaction();
            session.endSession();
            return updatedBooking;
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
    
    async cancelPartialBooking(userId, bookingId, seatNumbers, reason = "Partial Booking Cancelled") {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const booking = await this.passengerRepository.findBookingByIdAndUser(bookingId, userId, session);
            if (!booking || booking.status === "cancelled") {
                throw new Error("Booking not found or already cancelled");
            }
            const now = new Date();
            const updatedSeats = [];
            const cancelledSeatNumbers = [];
            for (let seat of booking.selectedSeats) {
                if (seatNumbers.includes(seat.seatNumber) && seat.status !== 'cancelled') {
                    seat.status = 'cancelled';
                    seat.cancelledAt = now;
                    cancelledSeatNumbers.push(seat.seatNumber);
                }
                updatedSeats.push(seat);
            }
            if (cancelledSeatNumbers.length === 0) {
                throw new Error("No valid seats to cancel");
            }
            const activeSeatsCount = updatedSeats.filter(seat => seat.status !== 'cancelled').length;
            const trip = await this.passengerRepository.getTripById(booking.tripId, session);
            if (!trip) {
                throw new Error("Trip not found");
            }
            const updatedTotalPrice = activeSeatsCount * trip.price;
            const newStatus = activeSeatsCount === 0 ? 'cancelled' : booking.status;
            await this.passengerRepository.updateBookingFull(bookingId, {
                selectedSeats: updatedSeats,
                totalPrice: updatedTotalPrice,
                status: newStatus
            }, session);
            const seatUpdateResult = await this.passengerRepository.addSeatsBackToTrip(
                trip,
                cancelledSeatNumbers,
                session
            );
            if (!seatUpdateResult) {
                for (let seat of booking.selectedSeats) {
                    if (cancelledSeatNumbers.includes(seat.seatNumber)) {
                        seat.status = 'booked';
                        seat.cancelledAt = null;
                    }
                }
                throw new Error("Failed to add cancelled seats back to trip");
            }
            const cancellationLog = await this.passengerRepository.createCancellationEntry(
                bookingId, userId, reason, session
            );
            if (!cancellationLog) {
                for (let seat of booking.selectedSeats) {
                    if (cancelledSeatNumbers.includes(seat.seatNumber)) {
                        seat.status = 'booked';
                        seat.cancelledAt = null;
                    }
                }
                throw new Error("Failed to create cancellation record");
            }
            await session.commitTransaction();
            session.endSession();
            return {
                ...booking.toObject(),
                selectedSeats: updatedSeats,
                totalPrice: updatedTotalPrice,
                status: newStatus
            };
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Partial cancellation failed. No changes were made.");
        }
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
