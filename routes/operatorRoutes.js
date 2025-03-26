const express = require("express");
const router = express.Router();
const OperatorController = require("../controllers/operatorController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isOperator);

router.post("/register", OperatorController.registerOperator);
router.post("/trips", OperatorController.createTrip);
router.put("/trips/:id", OperatorController.modifyTrip);
router.delete("/trips/:id", OperatorController.cancelTrip);
router.get("/trips/:id/bookings", OperatorController.viewTripBookings);

module.exports = router;
