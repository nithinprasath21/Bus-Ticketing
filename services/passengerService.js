const PassengerRepository = require("../repositories/passengerRepository");

class PassengerService {
    constructor() {
        this.passengerRepository = new PassengerRepository();
    }

    async searchBuses(query) {
        return this.passengerRepository.searchBuses(query);
    }

    async checkSeatAvailability(busId) {
        const seats = await this.passengerRepository.checkSeatAvailability(busId);
        if (!seats) throw new Error("Bus not found or no available seats");
        return seats;
    }

    async bookTicket(userId, bookingData) {
        const booking = await this.passengerRepository.createBooking({ ...bookingData, userId });
        if (!booking) throw new Error("Booking failed");
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
