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
        const { tripId, selectedSeats } = bookingData;
        const seatNumbers = selectedSeats.map(seat => seat.seatNumber);
        const trip = await this.passengerRepository.reserveSeatsIfAvailable(tripId, seatNumbers);
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
        const booking = await this.passengerRepository.createBooking(bookingPayload);
        if (!booking) {
            await this.passengerRepository.restoreSeats(tripId, seatNumbers);
            throw new Error("Booking failed. Please try again.");
        }
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
        if (!booking) throw new Error("Booking not found or already cancelled");
    
        const cancelledSeats = booking.selectedSeats
            .filter(seat => seat.status === 'cancelled')
            .map(seat => seat.seatNumber);
    
        if (cancelledSeats.length > 0) {
            await this.passengerRepository.addSeatsBackToTrip(booking.tripId, cancelledSeats);
        }
        return booking;
    }
    
    async cancelPartialBooking(userId, bookingId, seatNumbers, reason = "User cancelled selected seats") {
        const booking = await this.passengerRepository.findBookingByIdAndUser(bookingId, userId);
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
    
        await this.passengerRepository.updateBookingSeats(bookingId, updatedSeats);
    
        const activeSeatsCount = updatedSeats.filter(seat => seat.status !== 'cancelled').length;
        const trip = await this.passengerRepository.getTripById(booking.tripId);
    
        const updatedTotalPrice = activeSeatsCount * trip.price;
        const newStatus = activeSeatsCount === 0 ? 'cancelled' : booking.status;

        await this.passengerRepository.updateBookingPartial(bookingId, {
            totalPrice: updatedTotalPrice,
            status: newStatus
        });
        await this.passengerRepository.addSeatsBackToTrip(booking.tripId, cancelledSeatNumbers);    
        await this.passengerRepository.createCancellationEntry(bookingId, userId, reason);    
        const updatedBooking = await this.passengerRepository.findBookingByIdAndUser(bookingId, userId);
        return updatedBooking;
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
