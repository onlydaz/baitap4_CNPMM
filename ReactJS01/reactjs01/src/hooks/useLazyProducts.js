import { useState, useEffect, useCallback, useRef } from 'react';
import { getProductsApi, searchProductsApi } from '../util/productApi';

export const useLazyProducts = (categoryId = null, search = '', filters = {}) => {
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
                    response = await getProductsApi(categoryId, page, 12, '');
                } else {
                    response = await searchProductsApi(search || '', {
                        page,
                        limit: 12,
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
                response = await getProductsApi(categoryId, page, 12, '');
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
                // fallback: fetch normal list (already done above if sortOnly; otherwise do here) and filter client-side
                const usingFiltersWithoutKeyword = hasFilters && !hasSearch && !sortOnly;
                if (usingFiltersWithoutKeyword && newProducts.length === 0) {
                    const normal = await getProductsApi(categoryId, page, 12, '');
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
                const pagination = response.pagination || {};
                
                if (reset) {
                    setProducts(newProducts);
                    currentPageRef.current = 2;
                } else {
                    setProducts(prev => {
                        const merged = [...prev, ...newProducts];
                        return sortOnly ? applyClientSort(merged) : merged;
                    });
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
    }, [categoryId, search, filters]);

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
    }, [categoryId, search, filters, loadProducts]);

    return {
        products,
        loading,
        hasMore,
        error,
        loadMore
    };
};
