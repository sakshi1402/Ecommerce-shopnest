
const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");

require("dotenv").config();

// Admin Dashboard Stats
const getAdminStatesPayment = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });

        const totalProducts = await Product.countDocuments({});

        const totalOrders = await Order.countDocuments({});

        const paidOrders = await Order.countDocuments({
            paymentStatus: "Paid",
        });

        const pendingOrders = await Order.countDocuments({
            paymentStatus: "Pending",
        });

        const orders = await Order.find({
            paymentStatus: "Paid",
        });


        const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                paidOrders,
                pendingOrders,
                totalRevenue,
            },
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
        });
    }
};

// Payment Status by Order ID
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            orderId: order._id,
            paymentStatus: order.isPaid ? "Paid" : "Pending",
            paidAt: order.paidAt || null,
            amount: order.totalPrice,
        });
    } catch (error) {
        console.error("Payment Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch payment status",
        });
    }
};

module.exports = {
    getAdminStatesPayment,
    getPaymentStatus,
};

