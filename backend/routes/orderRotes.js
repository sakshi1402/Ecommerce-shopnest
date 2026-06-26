const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware')
const { getAllOrders, createOrder, getMyOrders, updateOrderStatus } = require("../controllers/ordersController")

const app = express()

const router = express.Router();
//all product
router.route('/').get(protect, admin, getAllOrders).post(protect, createOrder)
//single specific product
router.route('/myOrders').get(protect, getMyOrders)
router.route('/:id/status').put(protect, admin, updateOrderStatus)

module.exports = router;