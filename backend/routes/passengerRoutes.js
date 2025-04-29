const express = require('express');
const PassengerController = require('../controllers/passengerController.js');
const AuthMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();
const passengerController = new PassengerController();
const authMiddleware = new AuthMiddleware();

router.get('/buses/search', authMiddleware.protectUser, passengerController.searchBuses);
router.get('/buses/:id/seats', authMiddleware.protectUser, passengerController.checkSeatAvailability);

router.post('/bookings', authMiddleware.protectUser, passengerController.bookTicket);
router.get('/bookings', authMiddleware.protectUser, passengerController.viewBookingHistory);
router.get('/bookings/:id', authMiddleware.protectUser, passengerController.getBooking);
router.patch("/bookings/:id/cancel", authMiddleware.protectUser, passengerController.cancelBooking);
router.delete('/bookings/:id', authMiddleware.protectUser, passengerController.deleteBooking);

router.get('/profile/:id', authMiddleware.protectUser, passengerController.viewProfile);
router.patch('/profile/:id', authMiddleware.protectUser, passengerController.updateProfile);

module.exports = router;
