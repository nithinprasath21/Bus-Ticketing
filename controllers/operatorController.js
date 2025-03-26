const OperatorService = require("../services/operatorService");

class OperatorController {
  static async registerOperator(req, res, next) {
    try {
      const operator = await OperatorService.registerOperator(req.body);
      res.status(201).json({ success: true, data: operator });
    } catch (error) {
      next(error);
    }
  }

  static async createTrip(req, res, next) {
    try {
      const trip = await OperatorService.createTrip(req.body);
      res.status(201).json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  }

  static async modifyTrip(req, res, next) {
    try {
      const updatedTrip = await OperatorService.modifyTrip(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedTrip });
    } catch (error) {
      next(error);
    }
  }

  static async cancelTrip(req, res, next) {
    try {
      await OperatorService.cancelTrip(req.params.id);
      res.status(200).json({ success: true, message: "Trip canceled successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async viewTripBookings(req, res, next) {
    try {
      const bookings = await OperatorService.viewTripBookings(req.params.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OperatorController;
