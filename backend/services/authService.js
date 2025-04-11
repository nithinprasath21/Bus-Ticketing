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
            throw new Error("Invalid email or password");
        }

        return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    }

    async logout(user) {
        return true;
    }

    async forgotPassword(email) {
        if (!await this.authRepository.findUserByEmail(email)) {
            throw new Error("User not found");
        }
        return true;
    }
}

module.exports = AuthService;
