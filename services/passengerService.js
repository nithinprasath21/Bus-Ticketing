const PassengerRepository = require("../repositories/passengerRepository");

class PassengerService {
  static async searchBuses(filters) {
    return await PassengerRepository.searchBuses(filters);
  }

  static async checkSeatAvailability(busId) {
    return await PassengerRepository.getAvailableSeats(busId);
  }

  static async bookTicket(userId, bookingData) {
    return await PassengerRepository.createBooking(userId, bookingData);
  }

  static async viewBookingHistory(userId) {
    return await PassengerRepository.getBookingHistory(userId);
  }

  static async cancelBooking(userId, bookingId) {
    return await PassengerRepository.cancelBooking(userId, bookingId);
  }

  static async updateProfile(userId, profileData) {
    return await PassengerRepository.updateUserProfile(userId, profileData);
  }
}

module.exports = PassengerService;
