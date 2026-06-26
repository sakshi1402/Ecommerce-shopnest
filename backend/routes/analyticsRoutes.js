const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware')
const { getAdminStatesPayment, getPaymentStatus } = require("../controllers/analyticsController")

const router = express.Router();

//all product
router.get("/", protect, admin, getAdminStatesPayment);
router.get("/status/:orderId", protect, getPaymentStatus);
module.exports = router;