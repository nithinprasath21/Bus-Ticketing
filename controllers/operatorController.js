import OperatorService from "../services/operatorService.js";

class OperatorController {
    constructor() {
        this.operatorService = new OperatorService();
    }

    getBuses = async (req, res) => {
        try {
            const buses = await this.operatorService.getBuses();
            return res.status(200).json({
                success: true,
                message: "Buses fetched successfully",
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

    getBus = async (req, res) => {
        try {
            const busId = req.params.id;
            const bus = await this.operatorService.getBus(busId);
            return res.status(200).json({
                success: true,
                message: "Bus details fetched successfully",
                data: bus
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    createBus = async (req, res) => {
        try {
            const bus = await this.operatorService.createBus(req.body);
            return res.status(201).json({
                success: true,
                message: "Bus created successfully",
                data: bus
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    updateBus = async (req, res) => {
        try {
            const busId = req.params.id;
            const bus = await this.operatorService.updateBus(busId, req.body);
            return res.status(200).json({
                success: true,
                message: "Bus updated successfully",
                data: bus
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    deleteBus = async (req, res) => {
        try {
            await this.operatorService.deleteBus(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Bus deleted successfully",
                data: null
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    createTrip = async (req, res) => {
        try {
            const trip = await this.operatorService.createTrip(req.body);
            return res.status(201).json({
                success: true,
                message: "Trip created successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getMyTrips = async (req, res) => {
        try {
            const trips = await this.operatorService.getMyTrips(req.operator.id);
            return res.status(200).json({
                success: true,
                message: "Trips fetched successfully",
                data: trips
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.getTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip details fetched successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    updateTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.updateTrip(tripId, req.body);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    deleteTrip = async (req, res) => {
        try {
            await this.operatorService.deleteTrip(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Trip deleted successfully",
                data: null
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    cancelTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.cancelTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip canceled successfully",
                data: trip
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

export default OperatorController;
