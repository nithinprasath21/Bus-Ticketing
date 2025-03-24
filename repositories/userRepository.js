const User = require("../models/userSchema");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserRepository();
