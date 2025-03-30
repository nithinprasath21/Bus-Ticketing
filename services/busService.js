const BusRepository = require("../repositories/busRepository");

class BusService {
  static async createBus(busData) {
    return await BusRepository.createBus(busData);
  }

  static async getAllBuses() {
    return await BusRepository.getAllBuses();
  }

  static async getBusById(busId) {
    return await BusRepository.getBusById(busId);
  }

  static async updateBus(busId, busData) {
    return await BusRepository.updateBus(busId, busData);
  }

  static async deleteBus(busId) {
    return await BusRepository.deleteBus(busId);
  }
}

module.exports = BusService;
