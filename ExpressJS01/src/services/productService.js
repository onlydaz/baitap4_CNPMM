const Product = require('../models/product');
const Category = require('../models/category');
const { Op } = require('sequelize');

const getProductsService = async (categoryId, page = 1, limit = 10, search = '') => {
    try {
        const offset = (page - 1) * limit;
        
        const whereClause = {
            status: 'active'
        };
        
        if (categoryId) {
            whereClause.category_id = categoryId;
        }
        
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            limit: parseInt(limit),
            offset: offset,
            order: [['id', 'DESC']]
        });
        
        return {
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        console.log('Error in getProductsService:', error);
        return null;
    }
};

const getProductByIdService = async (id) => {
    try {
        const product = await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }]
        });
        return product;
    } catch (error) {
        console.log('Error in getProductByIdService:', error);
        return null;
    }
};

const searchProductsService = async (searchQuery, page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        
        const { count, rows } = await Product.findAndCountAll({
            where: {
                status: 'active',
                [Op.or]: [
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { description: { [Op.like]: `%${searchQuery}%` } }
                ]
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            limit: parseInt(limit),
            offset: offset,
            order: [['id', 'DESC']]
        });
        
        return {
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        console.log('Error in searchProductsService:', error);
        return null;
    }
};

const createProductService = async (name, description, price, image, categoryId, stock) => {
    try {
        const product = await Product.create({
            name,
            description,
            price,
            image,
            category_id: categoryId,
            stock
        });
        return product;
    } catch (error) {
        console.log('Error in createProductService:', error);
        return null;
    }
};

module.exports = {
    getProductsService,
    getProductByIdService,
    searchProductsService,
    createProductService
};
