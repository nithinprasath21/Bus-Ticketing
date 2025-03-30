const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwtUtils");
const UserRepository = require("../repositories/userRepository");

class AuthService {
  static async register(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) throw new Error("User already exists");

    userData.password = await bcrypt.hash(userData.password, 10);
    return await UserRepository.createUser(userData);
  }

  static async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    return jwt.generateToken(user);
  }
}

module.exports = AuthService;
