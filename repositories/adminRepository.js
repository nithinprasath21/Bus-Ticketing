const userModel = require("../models/userModel.js")
const tripModel = require("../models/tripModel.js")
const bookingModel = require("../models/bookingModel.js")

class AdminRepository {
    async findAllUsers() {
        return await userModel.find({ role: "passenger" });
    }

    async findUserById(userId) {
        return await userModel.findById(userId);
    }

    async updateUser(userId, updateData) {
        return await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async findAllOperators() {
        return await userModel.find({ role: "operator" });
    }

    async findOperatorById(operatorId) {
        return await userModel.findById(operatorId);
    }

    async findAllTrips() {
        return await tripModel.find();
    }

    async findTripById(tripId) {
        return await tripModel.findById(tripId);
    }

    async updateTrip(tripId, updateData) {
        return await tripModel.findByIdAndUpdate(tripId, { $set: updateData }, { new: true });
    }

    async saveTrip(trip) {
        return await trip.save();
    }

    async saveUser(user) {
        return await user.save();
    }

    async saveOperator(operator) {
        return await operator.save();
    }

    async findBookingsByPassenger(userId) {
        return await bookingModel.find({ passenger: userId });
    }

    async findBookingById(bookingId) {
        return await bookingModel.findById(bookingId);
    }

    async deleteBooking(bookingId) {
        return await bookingModel.findByIdAndDelete(bookingId);
    }
}

module.exports = AdminRepository;
