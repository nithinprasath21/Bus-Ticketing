const User = require("../models/userSchema");
const Operator = require("../models/operatorSchema");

class AdminRepository {
  static async getAllUsers() {
    return await User.find();
  }

  static async updateUserStatus(userId, status) {
    return await User.findByIdAndUpdate(userId, { isActive: status });
  }

  static async getAllOperators() {
    return await Operator.find();
  }

  static async verifyOperator(operatorId) {
    return await Operator.findByIdAndUpdate(operatorId, { isVerified: true });
  }

  static async updateOperatorStatus(operatorId, status) {
    return await Operator.findByIdAndUpdate(operatorId, { isActive: status });
  }
}

module.exports = AdminRepository;
