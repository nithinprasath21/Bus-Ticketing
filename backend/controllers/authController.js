const AuthService = require("../services/authService");

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });
        } catch (err) {
            next(err);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { token, role } = await this.authService.login(email, password);
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: {
                    token,
                    email,
                    role
                }
            });
        } catch (err) {
            next(err);
        }
    };

    logout = async (req, res, next) => {
        try {
            await this.authService.logout(req.user);
            return res.status(200).json({
                success: true,
                message: "User logged out successfully",
                data: null
            });
        } catch (err) {
            next(err);
        }
    };

    forgotPassword = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            await this.authService.updateForgottenPassword(email, password);
            return res.status(200).json({
                success: true,
                message: "Password updated successfully",
                data: null
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = AuthController;
