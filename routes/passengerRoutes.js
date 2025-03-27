const express = require("express");
const PassengerController = require("../controllers/passengerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get("/buses/search", PassengerController.searchBuses);
router.get("/buses/:id/seats", PassengerController.checkSeatAvailability);
router.post("/bookings", PassengerController.bookTicket);
router.get("/bookings", PassengerController.viewBookingHistory);
router.delete("/bookings/:id", PassengerController.cancelBooking);

router.put("/profile", PassengerController.updateProfile);

module.exports = router;
