const Operator = require("../models/operatorModel");
const Trip = require("../models/tripModel");
const Booking = require("../models/bookingModel");

class OperatorRepository {
  static async createOperator(operatorData) {
    try {
      return await Operator.create(operatorData);
    } catch (error) {
      throw new Error(`Error creating operator: ${error.message}`);
    }
  }

  static async createTrip(tripData) {
    try {
      return await Trip.create(tripData);
    } catch (error) {
      throw new Error(`Error creating trip: ${error.message}`);
    }
  }

  static async updateTrip(tripId, updateData) {
    try {
      return await Trip.findByIdAndUpdate(tripId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating trip: ${error.message}`);
    }
  }

  static async deleteTrip(tripId) {
    try {
      return await Trip.findByIdAndDelete(tripId);
    } catch (error) {
      throw new Error(`Error deleting trip: ${error.message}`);
    }
  }

  static async getTripBookings(tripId) {
    try {
      return await Booking.find({ tripId }).populate("userId", "name email");
    } catch (error) {
      throw new Error(`Error fetching trip bookings: ${error.message}`);
    }
  }
}

module.exports = OperatorRepository;
