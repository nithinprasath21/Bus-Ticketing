const AdminRepository = require("../repositories/adminRepository");

class AdminService {
  static async getAllUsers() {
    return await AdminRepository.getAllUsers();
  }

  static async blockUser(userId) {
    return await AdminRepository.updateUserStatus(userId, false);
  }

  static async unblockUser(userId) {
    return await AdminRepository.updateUserStatus(userId, true);
  }

  static async getAllOperators() {
    return await AdminRepository.getAllOperators();
  }

  static async verifyOperator(operatorId) {
    return await AdminRepository.verifyOperator(operatorId);
  }

  static async blockOperator(operatorId) {
    return await AdminRepository.updateOperatorStatus(operatorId, false);
  }

  static async unblockOperator(operatorId) {
    return await AdminRepository.updateOperatorStatus(operatorId, true);
  }
}

module.exports = AdminService;
