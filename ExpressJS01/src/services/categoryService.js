const Category = require('../models/category');
const Product = require('../models/product');

const getCategoriesService = async () => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'name', 'price', 'image'],
                where: { status: 'active' },
                required: false
            }],
            order: [['id', 'DESC']]
        });
        return categories;
    } catch (error) {
        console.log('Error in getCategoriesService:', error);
        return null;
    }
};

const getCategoryByIdService = async (id) => {
    try {
        const category = await Category.findByPk(id, {
            include: [{
                model: Product,
                as: 'products',
                where: { status: 'active' },
                required: false
            }]
        });
        return category;
    } catch (error) {
        console.log('Error in getCategoryByIdService:', error);
        return null;
    }
};

const createCategoryService = async (name, description, image) => {
    try {
        const category = await Category.create({
            name,
            description,
            image
        });
        return category;
    } catch (error) {
        console.log('Error in createCategoryService:', error);
        return null;
    }
};

module.exports = {
    getCategoriesService,
    getCategoryByIdService,
    createCategoryService
};
