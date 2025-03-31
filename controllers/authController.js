const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, message: "User registered successfully", data: user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      await AuthService.forgotPassword(req.body.email);
      res.status(200).json({ success: true, message: "Password reset link sent" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
