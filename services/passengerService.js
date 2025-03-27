const PassengerRepository = require("../repositories/passengerRepository");

class PassengerService {
  static async searchBuses(filters) {
    try {
      return await PassengerRepository.searchBuses(filters);
    } catch (error) {
      throw new Error(`Error searching buses: ${error.message}`);
    }
  }

  static async checkSeatAvailability(busId) {
    try {
      return await PassengerRepository.getAvailableSeats(busId);
    } catch (error) {
      throw new Error(`Error checking seat availability: ${error.message}`);
    }
  }

  static async bookTicket(userId, bookingData) {
    try {
      return await PassengerRepository.createBooking(userId, bookingData);
    } catch (error) {
      throw new Error(`Error booking ticket: ${error.message}`);
    }
  }

  static async viewBookingHistory(userId) {
    try {
      return await PassengerRepository.getBookingHistory(userId);
    } catch (error) {
      throw new Error(`Error fetching booking history: ${error.message}`);
    }
  }

  static async cancelBooking(userId, bookingId) {
    try {
      return await PassengerRepository.cancelBooking(userId, bookingId);
    } catch (error) {
      throw new Error(`Error canceling booking: ${error.message}`);
    }
  }

  static async updateProfile(userId, profileData) {
    try {
      return await PassengerRepository.updateUserProfile(userId, profileData);
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
}

module.exports = PassengerService;
