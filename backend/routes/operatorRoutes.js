const express = require('express');
const OperatorController = require('../controllers/operatorController.js');
const AuthMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();
const operatorController = new OperatorController();
const authMiddleware = new AuthMiddleware();

router.get('/buses', operatorController.getBuses);
router.get('/buses/:id', operatorController.getBus);
router.post('/buses', authMiddleware.protectOperator, operatorController.createBus);
router.patch('/buses/:id', authMiddleware.protectOperator, operatorController.updateBus);
router.delete('/buses/:id', authMiddleware.protectOperator, operatorController.deleteBus);

router.post('/trips', authMiddleware.protectOperator, operatorController.createTrip);
router.get('/trips', authMiddleware.protectOperator, operatorController.getMyTrips);
router.get('/trips/:id', authMiddleware.protectOperator, operatorController.getTrip);
router.patch('/trips/:id', authMiddleware.protectOperator, operatorController.updateTrip);
router.delete('/trips/:id', authMiddleware.protectOperator, operatorController.deleteTrip);
router.patch('/trips/:id/cancel', authMiddleware.protectOperator, operatorController.cancelTrip);

module.exports = router;
