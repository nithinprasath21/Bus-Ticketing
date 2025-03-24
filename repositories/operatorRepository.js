const Operator = require("../models/operatorSchema");
const Trip = require("../models/tripSchema");
const Booking = require("../models/bookingSchema");

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
