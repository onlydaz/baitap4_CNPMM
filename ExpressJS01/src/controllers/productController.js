const { getProductsService, getProductByIdService, searchProductsService, createProductService } = require('../services/productService');
const { searchProducts: esSearchProducts, indexProduct: esIndexProduct } = require('../services/searchService');

const getProducts = async (req, res) => {
    try {
        const { category_id, page = 1, limit = 10, search = '' } = req.query;
        const data = await getProductsService(category_id, page, limit, search);
        
        if (data) {
            return res.status(200).json({
                EC: 0,
                EM: 'Get products successfully',
                data: data.products,
                pagination: data.pagination
            });
        } else {
            return res.status(500).json({
                EC: 1,
                EM: 'Error getting products'
            });
        }
    } catch (error) {
        console.log('Error in getProducts controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getProductByIdService(id);
        
        if (data) {
            return res.status(200).json({
                EC: 0,
                EM: 'Get product successfully',
                data: data
            });
        } else {
            return res.status(404).json({
                EC: 1,
                EM: 'Product not found'
            });
        }
    } catch (error) {
        console.log('Error in getProductById controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

const searchProducts = async (req, res) => {
    try {
        const params = {
            q: req.query.q || '',
            category_id: req.query.category_id,
            price_min: req.query.price_min,
            price_max: req.query.price_max,
            has_promo: req.query.has_promo,
            discount_min: req.query.discount_min,
            views_min: req.query.views_min,
            sort: req.query.sort,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const result = await esSearchProducts(params);

        return res.status(200).json({
            EC: 0,
            EM: 'Search products successfully',
            data: result.items,
            pagination: {
                currentPage: result.page,
                totalPages: Math.ceil(result.total / result.limit),
                totalItems: result.total,
                itemsPerPage: result.limit,
                hasNextPage: result.page < Math.ceil(result.total / result.limit),
                hasPrevPage: result.page > 1
            }
        });
    } catch (error) {
        console.log('Error in searchProducts controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category_id, stock } = req.body;
        const data = await createProductService(name, description, price, image, category_id, stock);
        
        if (data) {
            // index to Elasticsearch (best-effort)
            esIndexProduct(data).catch(() => {});
            return res.status(201).json({
                EC: 0,
                EM: 'Create product successfully',
                data: data
            });
        } else {
            return res.status(500).json({
                EC: 1,
                EM: 'Error creating product'
            });
        }
    } catch (error) {
        console.log('Error in createProduct controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Server error'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    createProduct
};
