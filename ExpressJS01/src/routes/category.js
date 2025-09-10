const express = require('express');
const { getCategories, getCategoryById, createCategory } = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const routerCategory = express.Router();

// Public routes (no auth required)
routerCategory.get("/", getCategories);
routerCategory.get("/:id", getCategoryById);

// Protected routes (auth required)
routerCategory.post("/", auth, createCategory);

module.exports = routerCategory;
