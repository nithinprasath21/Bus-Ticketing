const express = require("express");
const AdminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware.verifyAdmin);

router.get("/users", AdminController.getAllUsers);
router.put("/users/:id/block", AdminController.blockUser);
router.put("/users/:id/unblock", AdminController.unblockUser);

router.get("/trips/:id", AdminController.getTripDetails);
router.delete("/trips/:id", AdminController.cancelTrip);

router.get("/users/:id/bookings", AdminController.getPassengerBookings); 
router.delete("/users/:id/bookings/:bookingId", AdminController.deletePassengerBooking);

module.exports = router;
