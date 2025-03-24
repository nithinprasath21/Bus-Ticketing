const AuthService = require("../services/authService");

class AuthController {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const token = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json({ success: true, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
