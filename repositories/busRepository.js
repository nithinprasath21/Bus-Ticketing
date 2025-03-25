const Bus = require("../models/Bus");

class BusRepository {
  async createBus(busData) {
    return await Bus.create(busData);
  }

  async getAllBuses() {
    return await Bus.find();
  }

  async getBusById(busId) {
    return await Bus.findById(busId);
  }

  async updateBus(busId, busData) {
    return await Bus.findByIdAndUpdate(busId, busData, { new: true });
  }

  async deleteBus(busId) {
    return await Bus.findByIdAndDelete(busId);
  }
}

module.exports = new BusRepository();
