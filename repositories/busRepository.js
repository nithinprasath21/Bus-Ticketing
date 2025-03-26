const Bus = require("../models/busModel");

class BusRepository {
  async createBus(busData) {
    try {
      return await Bus.create(busData);
    } catch (error) {
      throw new Error(`Error creating bus: ${error.message}`);
    }
  }

  async getAllBuses() {
    try {
      return await Bus.find();
    } catch (error) {
      throw new Error(`Error fetching buses: ${error.message}`);
    }
  }

  async getBusById(busId) {
    try {
      return await Bus.findById(busId);
    } catch (error) {
      throw new Error(`Error fetching bus by ID: ${error.message}`);
    }
  }

  async updateBus(busId, busData) {
    try {
      return await Bus.findByIdAndUpdate(busId, busData, { new: true });
    } catch (error) {
      throw new Error(`Error updating bus: ${error.message}`);
    }
  }

  async deleteBus(busId) {
    try {
      return await Bus.findByIdAndDelete(busId);
    } catch (error) {
      throw new Error(`Error deleting bus: ${error.message}`);
    }
  }
}

module.exports = new BusRepository();
