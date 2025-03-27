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

  static async getTripDetails(tripId) {
    try {
      return await Trip.findById(tripId).populate("busId operatorId");
    } catch (error) {
      throw new Error(`Error fetching trip details: ${error.message}`);
    }
  }

  static async cancelTrip(tripId) {
    try {
      return await Trip.findByIdAndUpdate(tripId, { status: "canceled" }, { new: true });
    } catch (error) {
      throw new Error(`Error canceling trip: ${error.message}`);
    }
  }
}

module.exports = AdminRepository;
