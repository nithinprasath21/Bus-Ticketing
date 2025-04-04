const AdminRepository = require("../repositories/adminRepository.js");

class AdminService {
    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async getAllUsers() {
        return await this.adminRepository.findAllUsers();
    }

    async getUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) {
            throw new Error("User is not found");
        }
        return user;
    }

    async blockUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) {
            throw new Error("User is not found");
        }
        user.isBlocked = true;
        return await this.adminRepository.saveUser(user);
    }

    async unblockUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) {
            throw new Error("User is not found");
        }
        user.isBlocked = false;
        return await this.adminRepository.saveUser(user);
    }

    async getOperators() {
        return await this.adminRepository.findAllOperators();
    }

    async getOperator(operatorId) {
        const operator = await this.adminRepository.findOperatorById(operatorId);
        if (!operator) {
            throw new Error("Operator is not found");
        }
        return operator;
    }

    async blockUnblock(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) {
            throw new Error("User is not found");
        }
        user.isBlocked = !user.isBlocked;
        return await this.adminRepository.saveUser(user);
    }

    async approveOperator(operatorId) {
        const operator = await this.adminRepository.findOperatorById(operatorId);
        if (!operator || operator.role !== "operator") {
            throw new Error("Operator is not found");
        }
        operator.isVerified = true;
        return await this.adminRepository.saveOperator(operator);
    }

    async getAllTrips() {
        return await this.adminRepository.findAllTrips();
    }

    async getTripDetails(tripId) {
        const trip = await this.adminRepository.findTripById(tripId);
        if (!trip) {
            throw new Error("Trip is not found");
        }
        return trip;
    }

    async updateTrip(tripData, tripId) {
        const { source, destination, departureTime, arrivalTime, price, availableSeats } = tripData;

        const updateData = {};
        if (source) updateData.source = source;
        if (destination) updateData.destination = destination;
        if (departureTime) updateData.departureTime = departureTime;
        if (arrivalTime) updateData.arrivalTime = arrivalTime;
        if (price) updateData.price = price;
        if (availableSeats) updateData.availableSeats = availableSeats;

        return await this.adminRepository.updateTrip(tripId, updateData);
    }

    async cancelTrip(tripId) {
        const trip = await this.adminRepository.findTripById(tripId);
        if (!trip) {
            throw new Error("Trip is not found");
        }
        if (trip.status === "Cancelled") {
            throw new Error("Trip is already cancelled");
        }
        trip.status = "Cancelled";
        return await this.adminRepository.saveTrip(trip);
    }

    async getPassengerBookings(userId) {
        const bookings = await this.adminRepository.findBookingsByPassenger(userId);
        return bookings;
    }

    async deletePassengerBooking(userId, bookingId) {
        const booking = await this.adminRepository.findBookingById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.passenger.toString() !== userId) {
            throw new Error("Unauthorized to delete this booking");
        }
        return await this.adminRepository.deleteBooking(bookingId);
    }
}

module.exports = AdminService;
