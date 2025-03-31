const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwtUtils");
const AuthRepository = require("../repositories/authRepository");
const { generateResetToken, sendResetEmail } = require("../utils/passwordUtils");

class AuthService {
  static async register(userData) {
    const existingUser = await AuthRepository.findByEmail(userData.email);
    if (existingUser) throw new Error("User already exists");

    userData.password = await bcrypt.hash(userData.password, 10);
    return await AuthRepository.createUser(userData);
  }

  static async login(email, password) {
    const user = await AuthRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    return jwtUtils.generateToken(user);
  }

  static async forgotPassword(email) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const resetToken = generateResetToken();
    await AuthRepository.saveResetToken(email, resetToken);
    await sendResetEmail(email, resetToken);
  }
}

module.exports = AuthService;
