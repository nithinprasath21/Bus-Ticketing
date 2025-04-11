const OperatorRepository = require("../repositories/operatorRepository");

class OperatorService {
    constructor() {
        this.operatorRepository = new OperatorRepository();
    }

    async getBuses() {
        return this.operatorRepository.getBuses();
    }

    async getBus(busId) {
        const bus = await this.operatorRepository.getBusById(busId);
        if (!bus) throw new Error("Bus not found");
        return bus;
    }

    async createBus(busData) {
        return this.operatorRepository.createBus(busData);
    }

    async updateBus(busId, updateData) {
        const updatedBus = await this.operatorRepository.updateBus(busId, updateData);
        if (!updatedBus) throw new Error("Bus not found or failed to update");
        return updatedBus;
    }

    async deleteBus(busId) {
        const deletedBus = await this.operatorRepository.deleteBus(busId);
        if (!deletedBus) throw new Error("Bus not found or already deleted");
    }

    async createTrip(tripData) {
        return this.operatorRepository.createTrip(tripData);
    }

    async getMyTrips(operatorId) {
        return this.operatorRepository.getTripsByOperator(operatorId);
    }

    async getTrip(tripId) {
        const trip = await this.operatorRepository.getTripById(tripId);
        if (!trip) throw new Error("Trip not found");
        return trip;
    }

    async updateTrip(tripId, updateData) {
        const updatedTrip = await this.operatorRepository.updateTrip(tripId, updateData);
        if (!updatedTrip) throw new Error("Trip not found or failed to update");
        return updatedTrip;
    }

    async deleteTrip(tripId) {
        const deletedTrip = await this.operatorRepository.deleteTrip(tripId);
        if (!deletedTrip) throw new Error("Trip not found or already deleted");
    }

    async cancelTrip(tripId) {
        const canceledTrip = await this.operatorRepository.cancelTrip(tripId);
        if (!canceledTrip) throw new Error("Trip not found or already canceled");
        return canceledTrip;
    }
}

module.exports = OperatorService;
