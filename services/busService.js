const BusRepository = require("../repositories/busRepository");

class BusService {
  async createBus(busData) {
    try {
      return await BusRepository.createBus(busData);
    } catch (error) {
      throw new Error(`Error creating bus: ${error.message}`);
    }
  }

  async getAllBuses() {
    try {
      return await BusRepository.getAllBuses();
    } catch (error) {
      throw new Error(`Error fetching buses: ${error.message}`);
    }
  }

  async getBusById(busId) {
    try {
      return await BusRepository.getBusById(busId);
    } catch (error) {
      throw new Error(`Error fetching bus by ID: ${error.message}`);
    }
  }

  async updateBus(busId, busData) {
    try {
      return await BusRepository.updateBus(busId, busData);
    } catch (error) {
      throw new Error(`Error updating bus: ${error.message}`);
    }
  }

  async deleteBus(busId) {
    try {
      return await BusRepository.deleteBus(busId);
    } catch (error) {
      throw new Error(`Error deleting bus: ${error.message}`);
    }
  }
}

module.exports = new BusService();
