const AdminRepository = require("../repositories/adminRepository");

class AdminService {
  static async getAllUsers() {
    return await AdminRepository.getAllUsers();
  }

  static async blockUser(userId) {
    await AdminRepository.updateUserStatus(userId, true);
  }

  static async unblockUser(userId) {
    await AdminRepository.updateUserStatus(userId, false);
  }

  static async getTripDetails(tripId) {
    return await AdminRepository.getTripDetails(tripId);
  }

  static async cancelTrip(tripId) {
    await AdminRepository.cancelTrip(tripId);
  }

  static async getPassengerBookings(userId) {
    return await AdminRepository.getPassengerBookings(userId);
  }

  static async deletePassengerBooking(userId, bookingId) {
    await AdminRepository.deletePassengerBooking(userId, bookingId);
  }
}

module.exports = AdminService;
