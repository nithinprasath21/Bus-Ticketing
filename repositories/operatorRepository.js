const Operator = require("../models/operatorModel");
const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");

class OperatorRepository {
  static async createOperator(operatorData) {
    return await Operator.create(operatorData);
  }

  static async createTrip(tripData) {
    return await Trip.create(tripData);
  }

  static async updateTrip(tripId, updateData) {
    return await Trip.findByIdAndUpdate(tripId, updateData, { new: true });
  }

  static async deleteTrip(tripId) {
    return await Trip.findByIdAndDelete(tripId);
  }

  static async getTripBookings(tripId) {
    return await Booking.find({ tripId }).populate("userId", "name email");
  }
}

module.exports = OperatorRepository;
