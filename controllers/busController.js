const BusService = require("../services/busService");

class BusController {
  async createBus(req, res, next) {
    try {
      const bus = await BusService.createBus(req.body);
      res.status(201).json({ success: true, data: bus });
    } catch (error) {
      next(error);
    }
  }

  async getAllBuses(req, res, next) {
    try {
      const buses = await BusService.getAllBuses();
      res.status(200).json({ success: true, data: buses });
    } catch (error) {
      next(error);
    }
  }

  async getBusById(req, res, next) {
    try {
      const bus = await BusService.getBusById(req.params.id);
      if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });
      res.status(200).json({ success: true, data: bus });
    } catch (error) {
      next(error);
    }
  }

  async updateBus(req, res, next) {
    try {
      const bus = await BusService.updateBus(req.params.id, req.body);
      res.status(200).json({ success: true, data: bus });
    } catch (error) {
      next(error);
    }
  }

  async deleteBus(req, res, next) {
    try {
      await BusService.deleteBus(req.params.id);
      res.status(200).json({ success: true, message: "Bus deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BusController();
