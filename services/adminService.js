const AdminRepository = require("../repositories/adminRepository");

class AdminService {
  static async getAllUsers() {
    try {
      return await AdminRepository.getAllUsers();
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async blockUser(userId) {
    try {
      return await AdminRepository.updateUserStatus(userId, true);
    } catch (error) {
      throw new Error(`Error blocking user: ${error.message}`);
    }
  }

  static async unblockUser(userId) {
    try {
      return await AdminRepository.updateUserStatus(userId, false);
    } catch (error) {
      throw new Error(`Error unblocking user: ${error.message}`);
    }
  }

  static async getAllOperators() {
    try {
      return await AdminRepository.getAllOperators();
    } catch (error) {
      throw new Error(`Error fetching operators: ${error.message}`);
    }
  }

  static async verifyOperator(operatorId) {
    try {
      return await AdminRepository.verifyOperator(operatorId);
    } catch (error) {
      throw new Error(`Error verifying operator: ${error.message}`);
    }
  }

  static async blockOperator(operatorId) {
    try {
      return await AdminRepository.updateOperatorStatus(operatorId, true);
    } catch (error) {
      throw new Error(`Error blocking operator: ${error.message}`);
    }
  }

  static async unblockOperator(operatorId) {
    try {
      return await AdminRepository.updateOperatorStatus(operatorId, false);
    } catch (error) {
      throw new Error(`Error unblocking operator: ${error.message}`);
    }
  }
}

module.exports = AdminService;
