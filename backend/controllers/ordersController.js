const Order = require("../model/Order");
const Product = require("../model/Product");
const sendEmail = require("../utils/sendEmail");

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name price");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get my order
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        })
            .populate("items.productId", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Create Order
const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            address,
            paymentId
        } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId,
            paymentStatus: "Paid"
        });

        await sendEmail(
            req.user.email,
            "Order Placed Successfully",
            `Your order ${order._id} has been placed successfully.`
        );

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus =
            req.body.orderStatus || order.orderStatus;

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllOrders,
    createOrder,
    getMyOrders,
    updateOrderStatus
};