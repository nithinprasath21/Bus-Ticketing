const OperatorRepository = require("../repositories/operatorRepository");

class OperatorService {
  static async registerOperator(operatorData) {
    try {
      return await OperatorRepository.createOperator(operatorData);
    } catch (error) {
      throw new Error(`Error registering operator: ${error.message}`);
    }
  }

  static async createTrip(tripData) {
    try {
      return await OperatorRepository.createTrip(tripData);
    } catch (error) {
      throw new Error(`Error creating trip: ${error.message}`);
    }
  }

  static async modifyTrip(tripId, updateData) {
    try {
      return await OperatorRepository.updateTrip(tripId, updateData);
    } catch (error) {
      throw new Error(`Error modifying trip: ${error.message}`);
    }
  }

  static async cancelTrip(tripId) {
    try {
      return await OperatorRepository.deleteTrip(tripId);
    } catch (error) {
      throw new Error(`Error canceling trip: ${error.message}`);
    }
  }

  static async viewTripBookings(tripId) {
    try {
      return await OperatorRepository.getTripBookings(tripId);
    } catch (error) {
      throw new Error(`Error viewing trip bookings: ${error.message}`);
    }
  }
}

module.exports = OperatorService;
