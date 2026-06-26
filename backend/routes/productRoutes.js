const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware')
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const upload = require("../middleware/upload");

const app = express()
app.use("/uploads", express.static("uploads"));
const router = express.Router();
//all product
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct)
//single specific product
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct)

module.exports = router;