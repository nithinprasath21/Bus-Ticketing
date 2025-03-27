const PassengerService = require("../services/passengerService");

class PassengerController {
  static async searchBuses(req, res, next) {
    try {
      const buses = await PassengerService.searchBuses(req.query);
      res.status(200).json({ success: true, data: buses });
    } catch (error) {
      next(error);
    }
  }

  static async checkSeatAvailability(req, res, next) {
    try {
      const seats = await PassengerService.checkSeatAvailability(req.params.id);
      res.status(200).json({ success: true, data: seats });
    } catch (error) {
      next(error);
    }
  }

  static async bookTicket(req, res, next) {
    try {
      const booking = await PassengerService.bookTicket(req.user.id, req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  static async viewBookingHistory(req, res, next) {
    try {
      const bookings = await PassengerService.viewBookingHistory(req.user.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  static async cancelBooking(req, res, next) {
    try {
      await PassengerService.cancelBooking(req.user.id, req.params.id);
      res.status(200).json({ success: true, message: "Booking canceled successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updatedUser = await PassengerService.updateProfile(req.user.id, req.body);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PassengerController;
