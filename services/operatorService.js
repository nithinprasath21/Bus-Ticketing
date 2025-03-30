const OperatorRepository = require("../repositories/operatorRepository");

class OperatorService {
  static async registerOperator(operatorData) {
    return await OperatorRepository.createOperator(operatorData);
  }

  static async createTrip(tripData) {
    return await OperatorRepository.createTrip(tripData);
  }

  static async modifyTrip(tripId, updateData) {
    return await OperatorRepository.updateTrip(tripId, updateData);
  }

  static async cancelTrip(tripId) {
    return await OperatorRepository.deleteTrip(tripId);
  }

  static async viewTripBookings(tripId) {
    return await OperatorRepository.getTripBookings(tripId);
  }
}

module.exports = OperatorService;
