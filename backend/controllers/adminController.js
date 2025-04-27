const AdminService = require('../services/adminService.js');

class AdminController {
    constructor() {
        this.adminService = new AdminService();
    }

    getAllUsers = async (req, res, next) => {
        try {
            const users = await this.adminService.getAllUsers();
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });
        } catch (err) {
            next(err);
        }
    };

    getUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.getUser(userId);
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (err) {
            next(err);
        }
    };

    blockUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.blockUser(userId);
            return res.status(200).json({
                success: true,
                message: "User blocked successfully",
                data: user
            });
        } catch (err) {
            next(err);
        }
    };

    unblockUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.unblockUser(userId);
            return res.status(200).json({
                success: true,
                message: "User unblocked successfully",
                data: user
            });
        } catch (err) {
            next(err);
        }
    };

    getOperators = async (req, res, next) => {
        try {
            const operators = await this.adminService.getOperators();
            return res.status(200).json({
                success: true,
                message: "Operators fetched successfully",
                data: operators
            });
        } catch (err) {
            next(err);
        }
    };

    getOperator = async (req, res, next) => {
        try {
            const operatorId = req.params.id;
            const operator = await this.adminService.getOperator(operatorId);
            return res.status(200).json({
                success: true,
                message: "Operator fetched successfully",
                data: operator
            });
        } catch (err) {
            next(err);
        }
    };

    blockUnblock = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.blockUnblock(userId);
            return res.status(200).json({
                success: true,
                message: "User block/unblock operation successful",
                data: user
            });
        } catch (err) {
            next(err);
        }
    };

    approveOperator = async (req, res, next) => {
        try {
            const operatorId = req.params.id;
            const operator = await this.adminService.approveOperator(operatorId);
            return res.status(200).json({
                success: true,
                message: "Operator approved successfully",
                data: operator
            });
        } catch (err) {
            next(err);
        }
    };

    getAllTrips = async (req, res, next) => {
        try {
            const trips = await this.adminService.getAllTrips();
            return res.status(200).json({
                success: true,
                message: "Trips fetched successfully",
                data: trips
            });
        } catch (err) {
            next(err);
        }
    };

    getTripDetails = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.getTripDetails(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip fetched successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    updateTrip = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.updateTrip(req.body, tripId);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    cancelTrip = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.cancelTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip cancelled successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    getPassengerBookings = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const bookings = await this.adminService.getPassengerBookings(userId);
            return res.status(200).json({
                success: true,
                message: "Passenger bookings fetched successfully",
                data: bookings
            });
        } catch (err) {
            next(err);
        }
    };

    deletePassengerBooking = async (req, res, next) => {
        try {
            const { id: userId, bookingId } = req.params;
            const booking = await this.adminService.deletePassengerBooking(userId, bookingId);
            return res.status(200).json({
                success: true,
                message: "Passenger booking deleted successfully",
                data: booking
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = AdminController;
