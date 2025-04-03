import express from 'express';
import PassengerController from '../controllers/passengerController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const passengerController = new PassengerController();
const authMiddleware = new AuthMiddleware();

router.get('/buses/search', passengerController.searchBuses);
router.get('/buses/:id/seats', passengerController.checkSeatAvailability);

router.post('/bookings', authMiddleware.protectUser, passengerController.bookTicket);
router.get('/bookings', authMiddleware.protectUser, passengerController.viewBookingHistory);
router.get('/bookings/:id', authMiddleware.protectUser, passengerController.getBooking);
router.patch("/bookings/:id/cancel", authMiddleware.protectUser, passengerController.cancelBooking);
router.delete('/bookings/:id', authMiddleware.protectUser, passengerController.cancelBooking);

router.get('/profile/:id', authMiddleware.protectUser, passengerController.viewProfile);
router.patch('/profile/:id', authMiddleware.protectUser, passengerController.updateProfile);

export default router;
