const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwtUtils");
const UserRepository = require("../repositories/userRepository");

class AuthService {
  async register(userData) {
    try {
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) throw new Error("User already exists");

      userData.password = await bcrypt.hash(userData.password, 10);
      return await UserRepository.createUser(userData);
    } catch (error) {
      throw new Error(`Error during registration: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return jwt.generateToken(user);
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
