const express = require('express');
const { createUser, handleLogin, getUser, getAccount, forgotPassword, resetPassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

// Import new routes
const categoryRoutes = require('./category');
const productRoutes = require('./product');

const routerAPI = express.Router();

// Public routes (no auth required)
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

// Use category and product routes
routerAPI.use("/categories", categoryRoutes);
routerAPI.use("/products", productRoutes);

// Protected routes (auth required)
routerAPI.use(auth);
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; //export default