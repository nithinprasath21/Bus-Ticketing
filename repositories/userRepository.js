const User = require("../models/userModel");

class UserRepository {
  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = UserRepository;
