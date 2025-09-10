import { useState, useEffect, useCallback } from 'react';
import { getProductsApi, getCategoriesApi } from '../util/productApi';

export const useProducts = (categoryId = null, page = 1, limit = 10, search = '') => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getProductsApi(categoryId, page, limit, search);
            
            if (response.EC === 0) {
                setProducts(response.data || []);
                setPagination(response.pagination || {});
            } else {
                setError(response.EM || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError('Không thể tải sản phẩm');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, page, limit, search]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        pagination,
        error,
        refetch: fetchProducts
    };
};

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getCategoriesApi();
            
            if (response.EC === 0) {
                setCategories(response.data || []);
            } else {
                setError(response.EM || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError('Không thể tải danh mục');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories
    };
};
