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
        if (!busData.seats || busData.seats.length === 0) {
            const seats = [];
            for (let i = 1; i <= busData.totalSeats; i++) {
                seats.push(i.toString());
            }
            busData.seats = seats;
        }
        return this.operatorRepository.createBus(busData);
    }

    async updateBus(busId, updateData) {
        const updatedBus = await this.operatorRepository.updateBus(busId, updateData);
        if (!updatedBus) throw new Error("Bus not found or failed to update");
        return updatedBus;
    }

    async deleteBus(busId) {
        const bus = await this.operatorRepository.deleteBus(busId);
        if (!bus) throw new Error("Bus not found or already deleted");
    
        await this.operatorRepository.cancelTripsByBusId(busId);
    }

    async createTrip(tripData) {
        if (!tripData.availableSeats || tripData.availableSeats.length === 0) {
            const bus = await this.operatorRepository.getBusById(tripData.busId);
            if (!bus) throw new Error("Bus not found for trip creation");
            tripData.availableSeats = bus.seats;
        }
        return this.operatorRepository.createTrip(tripData);
    }

    async getMyTrips(operatorId) {
        const trips = await this.operatorRepository.getTripsByOperator(operatorId);
        const activeTrips = trips.filter(trip => trip.status !== "completed" && trip.status !== "cancelled");
        return activeTrips;
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
