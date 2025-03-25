const express = require("express");
const AdminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Only Admins should access these routes
router.use(authMiddleware.verifyAdmin);

// User & Operator Management
router.get("/users", AdminController.getAllUsers);
router.put("/users/:id/block", AdminController.blockUser);
router.put("/users/:id/unblock", AdminController.unblockUser);
router.get("/operators", AdminController.getAllOperators);
router.put("/operators/:id/verify", AdminController.verifyOperator);
router.put("/operators/:id/block", AdminController.blockOperator);
router.put("/operators/:id/unblock", AdminController.unblockOperator);

module.exports = router;
