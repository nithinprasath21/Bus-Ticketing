const express = require("express");
const AdminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware.verifyAdmin);

router.get("/users", AdminController.getAllUsers);
router.put("/users/:id/block", AdminController.blockUser);
router.put("/users/:id/unblock", AdminController.unblockUser);
router.get("/operators", AdminController.getAllOperators);
router.put("/operators/:id/verify", AdminController.verifyOperator);
router.put("/operators/:id/block", AdminController.blockOperator);
router.put("/operators/:id/unblock", AdminController.unblockOperator);

module.exports = router;
