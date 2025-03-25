const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

// CRUD Operations for Buses
router.post("/buses", busController.createBus);
router.get("/buses", busController.getAllBuses);
router.get("/buses/:id", busController.getBusById);
router.put("/buses/:id", busController.updateBus);
router.delete("/buses/:id", busController.deleteBus);

module.exports = router;
