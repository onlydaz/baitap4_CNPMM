import { useState, useEffect, useCallback, useRef } from 'react';
import { getProductsApi } from '../util/productApi';

export const useLazyProducts = (categoryId = null, search = '') => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const currentPageRef = useRef(1);
    const isLoadingRef = useRef(false);

    const loadProducts = useCallback(async (reset = false) => {
        if (isLoadingRef.current) return;
        
        isLoadingRef.current = true;
        setLoading(true);
        setError(null);
        
        try {
            const page = reset ? 1 : currentPageRef.current;
            const response = await getProductsApi(categoryId, page, 12, search);
            
            if (response.EC === 0) {
                const newProducts = response.data || [];
                const pagination = response.pagination || {};
                
                if (reset) {
                    setProducts(newProducts);
                    currentPageRef.current = 2;
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                    currentPageRef.current = currentPageRef.current + 1;
                }
                
                setHasMore(pagination.hasNextPage || false);
            } else {
                setError(response.EM || 'Có lỗi xảy ra');
                setHasMore(false);
            }
        } catch (err) {
            setError('Không thể tải sản phẩm');
            setHasMore(false);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [categoryId, search]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading && !isLoadingRef.current) {
            loadProducts(false);
        }
    }, [hasMore, loading, loadProducts]);

    // Reset products khi categoryId hoặc search thay đổi
    useEffect(() => {
        setProducts([]);
        currentPageRef.current = 1;
        setHasMore(true);
        setError(null);
        loadProducts(true);
    }, [categoryId, search, loadProducts]);

    return {
        products,
        loading,
        hasMore,
        error,
        loadMore
    };
};
