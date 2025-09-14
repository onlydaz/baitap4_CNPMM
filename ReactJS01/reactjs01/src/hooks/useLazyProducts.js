import { useState, useEffect, useCallback } from 'react';
import { getProductsApi, searchProductsApi } from '../util/productApi';

export const useProducts = (categoryId = null, search = '', filters = {}, currentPage = 1) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9
    });

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            let response;
            const hasSearch = !!(search && search.trim());
            const hasFilters = (() => {
                const f = filters || {};
                return Object.entries(f).some(([k, v]) => {
                    if (k === 'sort') return v && v !== 'relevance';
                    if (typeof v === 'boolean') return v === true;
                    return v !== undefined && v !== null && v !== '';
                });
            })();
            
            // Determine if only sort is active (no other filters and no search)
            const sortOnly = (() => {
                const f = filters || {};
                const onlySortActive = f.sort && f.sort !== 'relevance';
                const othersActive = ['price_min','price_max','has_promo','discount_min','views_min']
                    .some(k => {
                        const v = f[k];
                        if (typeof v === 'boolean') return v === true;
                        return v !== undefined && v !== null && v !== '';
                    });
                return onlySortActive && !othersActive && !hasSearch;
            })();

            if (hasSearch || hasFilters) {
                if (sortOnly) {
                    // Fallback: load normal list then sort client-side
                    response = await getProductsApi(categoryId, currentPage, 9, '');
                } else {
                    response = await searchProductsApi(search || '', {
                        page: currentPage,
                        limit: 9,
                        category_id: categoryId || undefined,
                        price_min: filters.price_min,
                        price_max: filters.price_max,
                        has_promo: filters.has_promo,
                        discount_min: filters.discount_min,
                        views_min: filters.views_min,
                        sort: filters.sort
                    });
                }
            } else {
                response = await getProductsApi(categoryId, currentPage, 9, '');
            }
            
            if (response.EC === 0) {
                let newProducts = response.data || [];
                
                // If only sort is active, apply client-side sort
                const applyClientSort = (items) => {
                    const s = filters?.sort;
                    if (!s || s === 'relevance') return items;
                    const cloned = [...items];
                    if (s === 'price_asc') cloned.sort((a,b) => Number(a.price) - Number(b.price));
                    else if (s === 'price_desc') cloned.sort((a,b) => Number(b.price) - Number(a.price));
                    else if (s === 'discount_desc') cloned.sort((a,b) => Number(b.discount_percent||0) - Number(a.discount_percent||0));
                    else if (s === 'views_desc') cloned.sort((a,b) => Number(b.views||0) - Number(a.views||0));
                    return cloned;
                };

                // If using filters without keyword and ES returns empty (ES disabled or no hits),
                // fallback: fetch normal list and filter client-side
                const usingFiltersWithoutKeyword = hasFilters && !hasSearch && !sortOnly;
                if (usingFiltersWithoutKeyword && newProducts.length === 0) {
                    const normal = await getProductsApi(categoryId, currentPage, 9, '');
                    if (normal.EC === 0) {
                        const raw = normal.data || [];
                        newProducts = raw.filter(p => {
                            const price = Number(p.price);
                            const discount = Number(p.discount_percent || 0);
                            const views = Number(p.views || 0);
                            if (filters.price_min != null && price < Number(filters.price_min)) return false;
                            if (filters.price_max != null && price > Number(filters.price_max)) return false;
                            if (filters.has_promo === true && !(discount > 0)) return false;
                            if (filters.discount_min != null && !(discount >= Number(filters.discount_min))) return false;
                            if (filters.views_min != null && !(views >= Number(filters.views_min))) return false;
                            return true;
                        });
                        newProducts = applyClientSort(newProducts);
                        response = normal; // reuse pagination
                    }
                }
                
                if (sortOnly) {
                    newProducts = applyClientSort(newProducts);
                }
                
                setProducts(newProducts);
                setPagination(response.pagination || {
                    currentPage: currentPage,
                    totalPages: 1,
                    totalItems: newProducts.length,
                    itemsPerPage: 9
                });
            } else {
                setError(response.EM || 'Có lỗi xảy ra');
                setProducts([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 9
                });
            }
        } catch (err) {
            setError('Không thể tải sản phẩm');
            setProducts([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 9
            });
        } finally {
            setLoading(false);
        }
    }, [categoryId, search, filters, currentPage]);

    // Load products when dependencies change
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        loading,
        error,
        pagination
    };
};
