const AdminService = require("../services/adminService");

class AdminController {
  static async getAllUsers(req, res) {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async blockUser(req, res) {
    try {
      await AdminService.blockUser(req.params.id);
      res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async unblockUser(req, res) {
    try {
      await AdminService.unblockUser(req.params.id);
      res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllOperators(req, res) {
    try {
      const operators = await AdminService.getAllOperators();
      res.status(200).json(operators);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyOperator(req, res) {
    try {
      await AdminService.verifyOperator(req.params.id);
      res.status(200).json({ message: "Operator verified successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async blockOperator(req, res) {
    try {
      await AdminService.blockOperator(req.params.id);
      res.status(200).json({ message: "Operator blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async unblockOperator(req, res) {
    try {
      await AdminService.unblockOperator(req.params.id);
      res.status(200).json({ message: "Operator unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AdminController;
