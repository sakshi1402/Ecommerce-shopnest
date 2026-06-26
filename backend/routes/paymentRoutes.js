const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware')
const { createdOrder, verifyPayment } = require("../controllers/paymentController")

const router = express.Router();

//all product
router.post("/orders", createdOrder);
router.post("/verify", verifyPayment);
module.exports = router;