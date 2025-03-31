const User = require("../models/userModel");

class AuthRepository {
  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async createUser(userData) {
    return await User.create(userData);
  }

  static async saveResetToken(email, resetToken) {
    return await User.findOneAndUpdate({ email }, { resetToken }, { new: true });
  }
}

module.exports = AuthRepository;
