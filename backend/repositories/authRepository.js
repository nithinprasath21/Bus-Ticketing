const User = require("../models/userModel");

class AuthRepository {
    async createUser(userData) {
        return User.create(userData);
    }

    async findUserByEmail(email) {
        return User.findOne({ email });
    }

    async updateUserPasswordByEmail(email, hashedPassword) {
        return User.updateOne({ email }, { $set: { password: hashedPassword } });
    }

    async updateUser(userId, updateData) {
        return User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async saveUser(user) {
        return user.save();
    }
}

module.exports = AuthRepository;
