const express = require("express");
const router = express.Router();
const BusController = require("../controllers/busController");

router.post("/buses", BusController.createBus);
router.get("/buses", BusController.getAllBuses);
router.get("/buses/:id", BusController.getBusById);
router.put("/buses/:id", BusController.updateBus);
router.delete("/buses/:id", BusController.deleteBus);

module.exports = router;
