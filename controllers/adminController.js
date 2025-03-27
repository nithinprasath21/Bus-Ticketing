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

  static async getAllOperators(req, res, next) {
    try {
      const operators = await AdminService.getAllOperators();
      res.status(200).json({ success: true, data: operators });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOperator(req, res, next) {
    try {
      await AdminService.verifyOperator(req.params.id);
      res.status(200).json({ success: true, message: "Operator verified successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async blockOperator(req, res, next) {
    try {
      await AdminService.blockOperator(req.params.id);
      res.status(200).json({ success: true, message: "Operator blocked successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async unblockOperator(req, res, next) {
    try {
      await AdminService.unblockOperator(req.params.id);
      res.status(200).json({ success: true, message: "Operator unblocked successfully" });
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
}

module.exports = AdminController;
