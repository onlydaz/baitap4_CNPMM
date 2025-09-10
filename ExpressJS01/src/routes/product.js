const express = require('express');
const { getProducts, getProductById, searchProducts, createProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

const routerProduct = express.Router();

// Public routes (no auth required)
routerProduct.get("/", getProducts);
routerProduct.get("/search", searchProducts);
routerProduct.get("/:id", getProductById);

// Protected routes (auth required)
routerProduct.post("/", auth, createProduct);

module.exports = routerProduct;
