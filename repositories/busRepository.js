const Bus = require("../models/busModel");

class BusRepository {
  static async createBus(busData) {
    return await Bus.create(busData);
  }

  static async getAllBuses() {
    return await Bus.find();
  }

  static async getBusById(busId) {
    return await Bus.findById(busId);
  }

  static async updateBus(busId, busData) {
    return await Bus.findByIdAndUpdate(busId, busData, { new: true });
  }

  static async deleteBus(busId) {
    return await Bus.findByIdAndDelete(busId);
  }
}

module.exports = BusRepository;
