const { getCategoriesService, getCategoryByIdService, createCategoryService } = require('../services/categoryService');

const getCategories = async (req, res) => {
    try {
        const data = await getCategoriesService();
        if (data) {
            return res.status(200).json({
                EC: 0,
                EM: 'Get categories successfully',
                data: data
            });
        } else {
            return res.status(500).json({
                EC: 1,
                EM: 'Error getting categories'
            });
        }
    } catch (error) {
        console.log('Error in getCategories controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getCategoryByIdService(id);
        if (data) {
            return res.status(200).json({
                EC: 0,
                EM: 'Get category successfully',
                data: data
            });
        } else {
            return res.status(404).json({
                EC: 1,
                EM: 'Category not found'
            });
        }
    } catch (error) {
        console.log('Error in getCategoryById controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const data = await createCategoryService(name, description, image);
        if (data) {
            return res.status(201).json({
                EC: 0,
                EM: 'Create category successfully',
                data: data
            });
        } else {
            return res.status(500).json({
                EC: 1,
                EM: 'Error creating category'
            });
        }
    } catch (error) {
        console.log('Error in createCategory controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory
};
