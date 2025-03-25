const BusService = require("../services/busService");

class BusController {
  async createBus(req, res) {
    try {
      const bus = await BusService.createBus(req.body);
      res.status(201).json(bus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllBuses(req, res) {
    try {
      const buses = await BusService.getAllBuses();
      res.status(200).json(buses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBusById(req, res) {
    try {
      const bus = await BusService.getBusById(req.params.id);
      if (!bus) return res.status(404).json({ message: "Bus not found" });
      res.status(200).json(bus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateBus(req, res) {
    try {
      const bus = await BusService.updateBus(req.params.id, req.body);
      res.status(200).json(bus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteBus(req, res) {
    try {
      await BusService.deleteBus(req.params.id);
      res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new BusController();
