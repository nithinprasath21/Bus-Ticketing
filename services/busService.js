const BusRepository = require("../repositories/busRepository");

class BusService {
  async createBus(busData) {
    return await BusRepository.createBus(busData);
  }

  async getAllBuses() {
    return await BusRepository.getAllBuses();
  }

  async getBusById(busId) {
    return await BusRepository.getBusById(busId);
  }

  async updateBus(busId, busData) {
    return await BusRepository.updateBus(busId, busData);
  }

  async deleteBus(busId) {
    return await BusRepository.deleteBus(busId);
  }
}

module.exports = new BusService();
