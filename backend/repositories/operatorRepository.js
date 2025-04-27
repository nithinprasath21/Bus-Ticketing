const Bus = require("../models/busModel");
const Trip = require("../models/tripModel");

class OperatorRepository {
    async getBuses() {
        return Bus.find();
    }

    async getBusById(busId) {
        return Bus.findById(busId);
    }

    async createBus(busData) {
        return Bus.create(busData);
    }

    async updateBus(busId, updateData) {
        return Bus.findByIdAndUpdate(busId, updateData, { new: true });
    }

    async deleteBus(busId) {
        return Bus.findByIdAndDelete(busId);
    }
    
    async cancelTripsByBusId(busId) {
        return Trip.updateMany({ busId }, { status: "cancelled" });
    }

    async createTrip(tripData) {
        return Trip.create(tripData);
    }

    async getTripsByOperator(operatorId) {
        return Trip.find({ operatorId });
    }

    async getTripById(tripId) {
        return Trip.findById(tripId);
    }

    async updateTrip(tripId, updateData) {
        return Trip.findByIdAndUpdate(tripId, updateData, { new: true });
    }

    async deleteTrip(tripId) {
        return Trip.findByIdAndDelete(tripId);
    }

    async cancelTrip(tripId) {
        return Trip.findByIdAndUpdate(tripId, { status: "cancelled" }, { new: true });
    }
}

module.exports = OperatorRepository;
