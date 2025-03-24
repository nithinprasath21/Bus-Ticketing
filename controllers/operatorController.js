const OperatorService = require("../services/operatorService");

class OperatorController {
  static async registerOperator(req, res) {
    try {
      const operator = await OperatorService.registerOperator(req.body);
      res.status(201).json({ success: true, operator });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createTrip(req, res) {
    try {
      const trip = await OperatorService.createTrip(req.body);
      res.status(201).json({ success: true, trip });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async modifyTrip(req, res) {
    try {
      const updatedTrip = await OperatorService.modifyTrip(req.params.id, req.body);
      res.status(200).json({ success: true, updatedTrip });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async cancelTrip(req, res) {
    try {
      await OperatorService.cancelTrip(req.params.id);
      res.status(200).json({ success: true, message: "Trip canceled successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async viewTripBookings(req, res) {
    try {
      const bookings = await OperatorService.viewTripBookings(req.params.id);
      res.status(200).json({ success: true, bookings });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = OperatorController;
