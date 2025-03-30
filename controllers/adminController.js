const AdminService = require("../services/adminService");

class AdminController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async blockUser(req, res, next) {
    try {
      await AdminService.blockUser(req.params.id);
      res.status(200).json({ success: true, message: "User blocked successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async unblockUser(req, res, next) {
    try {
      await AdminService.unblockUser(req.params.id);
      res.status(200).json({ success: true, message: "User unblocked successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getTripDetails(req, res, next) {
    try {
      const trip = await AdminService.getTripDetails(req.params.id);
      res.status(200).json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  }

  static async cancelTrip(req, res, next) {
    try {
      await AdminService.cancelTrip(req.params.id);
      res.status(200).json({ success: true, message: "Trip canceled successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getPassengerBookings(req, res, next) {
    try {
      const bookings = await AdminService.getPassengerBookings(req.params.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  static async deletePassengerBooking(req, res, next) {
    try {
      await AdminService.deletePassengerBooking(req.params.id, req.params.bookingId);
      res.status(200).json({ success: true, message: "Passenger booking deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
