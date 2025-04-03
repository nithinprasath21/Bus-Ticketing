import PassengerService from "../services/passengerService.js";

class PassengerController {
    constructor() {
        this.passengerService = new PassengerService();
    }

    searchBuses = async (req, res) => {
        try {
            const buses = await this.passengerService.searchBuses(req.query);
            return res.status(200).json({
                success: true,
                message: "Buses found successfully",
                data: buses
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    checkSeatAvailability = async (req, res) => {
        try {
            const busId = req.params.id;
            const seats = await this.passengerService.checkSeatAvailability(busId);
            return res.status(200).json({
                success: true,
                message: "Seat availability fetched successfully",
                data: seats
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    bookTicket = async (req, res) => {
        try {
            const booking = await this.passengerService.bookTicket(req.user.id, req.body);
            return res.status(201).json({
                success: true,
                message: "Ticket booked successfully",
                data: booking
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    viewBookingHistory = async (req, res) => {
        try {
            const bookings = await this.passengerService.getBookingHistory(req.user.id);
            return res.status(200).json({
                success: true,
                message: "Booking history fetched successfully",
                data: bookings
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getBooking = async (req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.passengerService.getBooking(req.user.id, bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking details fetched successfully",
                data: booking
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    cancelBooking = async (req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.passengerService.cancelBooking(req.user.id, bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking canceled successfully",
                data: booking
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    viewProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            const profile = await this.passengerService.getProfile(userId);
            return res.status(200).json({
                success: true,
                message: "Profile fetched successfully",
                data: profile
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    updateProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedProfile = await this.passengerService.updateProfile(userId, req.body);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedProfile
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };
}

export default PassengerController;
