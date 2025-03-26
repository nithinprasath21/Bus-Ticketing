const User = require("../models/userModel");
const Operator = require("../models/operatorModel");

class AdminRepository {
  static async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async updateUserStatus(userId, isBlocked) {
    try {
      return await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });
    } catch (error) {
      throw new Error(`Error updating user status: ${error.message}`);
    }
  }

  static async getAllOperators() {
    try {
      return await Operator.find();
    } catch (error) {
      throw new Error(`Error fetching operators: ${error.message}`);
    }
  }

  static async verifyOperator(operatorId) {
    try {
      return await Operator.findByIdAndUpdate(operatorId, { isVerified: true }, { new: true });
    } catch (error) {
      throw new Error(`Error verifying operator: ${error.message}`);
    }
  }

  static async updateOperatorStatus(operatorId, isBlocked) {
    try {
      return await Operator.findByIdAndUpdate(operatorId, { isBlocked }, { new: true });
    } catch (error) {
      throw new Error(`Error updating operator status: ${error.message}`);
    }
  }
}

module.exports = AdminRepository;
