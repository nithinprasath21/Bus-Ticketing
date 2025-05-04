const PassengerService = require("../services/passengerService.js");

class PassengerController {
    constructor() {
        this.passengerService = new PassengerService();
    }

    searchBuses = async (req, res, next) => {
        try {
            const buses = await this.passengerService.searchBuses(req.query);
            return res.status(200).json({
                success: true,
                message: "Buses found successfully",
                data: buses
            });
        } catch (err) {
            next(err);
        }
    };

    checkSeatAvailability = async (req, res, next) => {
        try {
            const busId = req.params.id;
            const seats = await this.passengerService.checkSeatAvailability(busId);
            return res.status(200).json({
                success: true,
                message: "Seat availability fetched successfully",
                data: seats
            });
        } catch (err) {
            next(err);
        }
    };

    bookTicket = async (req, res, next) => {
        try {
            const booking = await this.passengerService.bookTicket(req.user.id, req.body);
            return res.status(201).json({
                success: true,
                message: "Ticket booked successfully",
                data: booking
            });
        } catch (err) {
            next(err);
        }
    };

    viewBookingHistory = async (req, res, next) => {
        try {
            const bookings = await this.passengerService.getBookingHistory(req.user.id);
            return res.status(200).json({
                success: true,
                message: "Booking history fetched successfully",
                data: bookings
            });
        } catch (err) {
            next(err);
        }
    };

    getBooking = async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.passengerService.getBooking(req.user.id, bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking details fetched successfully",
                data: booking
            });
        } catch (err) {
            next(err);
        }
    };

    cancelBooking = async (req, res, next) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.passengerService.cancelBooking(req.user.id, bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking canceled successfully",
                data: booking
            });
        } catch (err) {
            next(err);
        }
    };

    cancelPartialBooking = async (req, res, next) => {
        try {
          const bookingId = req.params.id;
          const { seats } = req.body;
          if (!Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ success: false, message: "Seats array required" });
          }
          const booking = await this.passengerService.cancelPartialBooking(req.user.id, bookingId, seats);
          return res.status(200).json({
            success: true,
            message: "Seats cancelled successfully",
            data: booking
          });
        } catch (err) {
            next(err);
        }
      };

    viewProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.passengerService.getProfile(userId);
            return res.status(200).json({
                success: true,
                message: "Profile fetched successfully",
                data: profile
            });
        } catch (err) {
            next(err);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updatedProfile = await this.passengerService.updateProfile(userId, req.body);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedProfile
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = PassengerController;
