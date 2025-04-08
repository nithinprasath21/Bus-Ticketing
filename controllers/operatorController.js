const OperatorService = require("../services/operatorService.js");

class OperatorController {
    constructor() {
        this.operatorService = new OperatorService();
    }

    getBuses = async (req, res, next) => {
        try {
            const buses = await this.operatorService.getBuses();
            return res.status(200).json({
                success: true,
                message: "Buses fetched successfully",
                data: buses
            });
        } catch (err) {
            next(err);
        }
    };

    getBus = async (req, res, next) => {
        try {
            const busId = req.params.id;
            const bus = await this.operatorService.getBus(busId);
            return res.status(200).json({
                success: true,
                message: "Bus details fetched successfully",
                data: bus
            });
        } catch (err) {
            next(err);
        }
    };

    createBus = async (req, res, next) => {
        try {
            const bus = await this.operatorService.createBus(req.body);
            return res.status(201).json({
                success: true,
                message: "Bus created successfully",
                data: bus
            });
        } catch (err) {
            next(err);
        }
    };

    updateBus = async (req, res, next) => {
        try {
            const busId = req.params.id;
            const bus = await this.operatorService.updateBus(busId, req.body);
            return res.status(200).json({
                success: true,
                message: "Bus updated successfully",
                data: bus
            });
        } catch (err) {
            next(err);
        }
    };

    deleteBus = async (req, res, next) => {
        try {
            await this.operatorService.deleteBus(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Bus deleted successfully",
                data: null
            });
        } catch (err) {
            next(err);
        }
    };

    createTrip = async (req, res, next) => {
        try {
            const trip = await this.operatorService.createTrip(req.body);
            return res.status(201).json({
                success: true,
                message: "Trip created successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    getMyTrips = async (req, res, next) => {
        try {
            const trips = await this.operatorService.getMyTrips(req.user.id);
            return res.status(200).json({
                success: true,
                message: "Trips fetched successfully",
                data: trips
            });
        } catch (err) {
            next(err);
        }
    };

    getTrip = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.getTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip details fetched successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    updateTrip = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.updateTrip(tripId, req.body);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };

    deleteTrip = async (req, res, next) => {
        try {
            await this.operatorService.deleteTrip(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Trip deleted successfully",
                data: null
            });
        } catch (err) {
            next(err);
        }
    };

    cancelTrip = async (req, res, next) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.cancelTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip canceled successfully",
                data: trip
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = OperatorController;
