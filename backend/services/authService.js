const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthRepository = require("../repositories/authRepository");

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }

    async register(userData) {
        const { name, email, phone, password, role } = userData;
        if (await this.authRepository.findUserByEmail(email)) {
            throw new Error("User already exists with this email");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.authRepository.createUser({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });
    }

    async login(email, password) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return {
            token,
            email: user.email,
            role: user.role
        };
    }

    async logout(user) {
        return true;
    }

    async updateForgottenPassword(email, newPassword) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            const error = new Error("Email does not exist");
            error.statusCode = 404;
            throw error;
        }
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.authRepository.updateUserPasswordByEmail(email, hashedPassword);
        return true;
    }
}

module.exports = AuthService;
