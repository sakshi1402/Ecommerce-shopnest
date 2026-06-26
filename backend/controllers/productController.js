const Product = require("../model/Product");

const cloudinary = require('../config/cloudinary')


const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'server error' })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Wrong product id ' })
        }
    } catch (error) {
        res.status(500).json({ message: 'server error' })
    }
}


const createProduct = async (req, res) => {

    try {

        const { name, description, price, category, stock } = req.body;
        let imageUrl = "";

        if (req.file) {

            const result = await cloudinary.uploader.upload(
                req.file.path,

            );

            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: imageUrl,
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


const updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.stock = req.body.stock || product.stock;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);

            product.imageUrl = result.secure_url
        }
        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
module.exports = {
    getProducts, createProduct, getProductById, updateProduct, deleteProduct
}