const express = require("express");

const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRotes')
const paymentRoutes = require('./routes/paymentRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const dotenv = require("dotenv");
dotenv.config();
connectDB()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.get("/", (req, res) => {
    res.send("Shopnest backend is working properly")
})

app.use('/api/auth', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})