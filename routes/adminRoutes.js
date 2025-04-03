import express from 'express';
import AdminController from '../controllers/adminController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const adminController = new AdminController();
const authMiddleware = new AuthMiddleware();

router.get('/users', authMiddleware.protectAdmin, adminController.getAllUsers);
router.get('/users/:id', authMiddleware.protectAdmin, adminController.getUser);
router.put('/users/:id/block', authMiddleware.protectAdmin, adminController.blockUser);
router.put('/users/:id/unblock', authMiddleware.protectAdmin, adminController.unblockUser);

router.get('/operators', authMiddleware.protectAdmin, adminController.getOperators);
router.get('/operators/:id', authMiddleware.protectAdmin, adminController.getOperator);
router.patch('/block_unblock/:id', authMiddleware.protectAdmin, adminController.blockUnblock);
router.patch('/operator/:id/approve', authMiddleware.protectAdmin, adminController.approveOperator);

router.get('/trips', authMiddleware.protectAdmin, adminController.getAllTrips);
router.get('/trips/:id', authMiddleware.protectAdmin, adminController.getTripDetails);
router.patch('/trips/:id', authMiddleware.protectAdmin, adminController.updateTrip);
router.patch('/trips/:id/cancel', authMiddleware.protectAdmin, adminController.cancelTrip);
router.delete('/trips/:id', authMiddleware.protectAdmin, adminController.cancelTrip);

router.get('/users/:id/bookings', authMiddleware.protectAdmin, adminController.getPassengerBookings);
router.delete('/users/:id/bookings/:bookingId', authMiddleware.protectAdmin, adminController.deletePassengerBooking);

export default router;
