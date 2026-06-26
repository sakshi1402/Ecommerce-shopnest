const Razorpay = require("razorpay");
const crypto = require("crypto");

dotenv = require('dotenv').config();
const createdOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
            });
        }

        // Razorpay instance
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // convert rupees → paise
            currency,
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};


const verifyPayment = async (req, res) => {
    try {



        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Validate required fields
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification fields",
            });
        }



        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");



        if (razorpay_signature === expectedSign) {


            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        }



        return res.status(400).json({
            success: false,
            message: "Invalid signature sent!",
        });

    } catch (error) {


        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification failed",
        });
    }
};

module.exports = {
    createdOrder,
    verifyPayment,
};