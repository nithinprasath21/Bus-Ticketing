const express = require("express");
const router = express.Router();
const OperatorController = require("../controllers/operatorController");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware to protect routes (Only Operators can access)
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isOperator);

// Operator-specific Routes
router.post("/register", OperatorController.registerOperator);
router.post("/trips", OperatorController.createTrip);
router.put("/trips/:id", OperatorController.modifyTrip);
router.delete("/trips/:id", OperatorController.cancelTrip);
router.get("/trips/:id/bookings", OperatorController.viewTripBookings);

module.exports = router;
