import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import ProductList from '../components/product/ProductList';
import ProductSearch from '../components/product/ProductSearch';
import ProductFilters from '../components/product/ProductFilters';
import InfiniteScroll from '../components/common/InfiniteScroll';
import { useCategories } from '../hooks/useProducts';
import { useLazyProducts } from '../hooks/useLazyProducts';

const { Title } = Typography;

const ProductsPage = () => {
    const { categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const search = searchParams.get('search') || '';
    const [filters, setFilters] = useState({
        price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
        price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
        has_promo: searchParams.get('has_promo') === 'true' ? true : false,
        discount_min: searchParams.get('discount_min') ? Number(searchParams.get('discount_min')) : undefined,
        views_min: searchParams.get('views_min') ? Number(searchParams.get('views_min')) : undefined,
        sort: searchParams.get('sort') || 'relevance'
    });
    
    const { categories } = useCategories();
    const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));
    
    const { products, loading, hasMore, error, loadMore } = useLazyProducts(categoryId, search, filters);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setSearchParams({ 
            ...Object.fromEntries(searchParams),
            search: query
        });
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchParams({ 
            ...Object.fromEntries(searchParams),
            search: ''
        });
    };

    const handleFiltersChange = (next) => {
        setFilters(next);
        const params = {
            ...Object.fromEntries(searchParams),
            search: searchParams.get('search') || ''
        };
        if (next.price_min != null) params.price_min = next.price_min; else delete params.price_min;
        if (next.price_max != null) params.price_max = next.price_max; else delete params.price_max;
        if (next.has_promo != null) params.has_promo = next.has_promo; else delete params.has_promo;
        if (next.discount_min != null) params.discount_min = next.discount_min; else delete params.discount_min;
        if (next.views_min != null) params.views_min = next.views_min; else delete params.views_min;
        if (next.sort) params.sort = next.sort; else delete params.sort;
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        const cleared = { price_min: undefined, price_max: undefined, has_promo: false, discount_min: undefined, views_min: undefined, sort: 'relevance' };
        setFilters(cleared);
        const params = {
            ...Object.fromEntries(searchParams),
            search: searchParams.get('search') || ''
        };
        delete params.price_min;
        delete params.price_max;
        delete params.has_promo;
        delete params.discount_min;
        delete params.views_min;
        delete params.sort;
        setSearchParams(params);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space>
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate('/')}
                            >
                                Quay lại
                            </Button>
                            <Title level={2} style={{ margin: 0 }}>
                                {currentCategory ? currentCategory.name : 'Tất cả sản phẩm'}
                            </Title>
                        </Space>
                    </Col>
                </Row>

                {/* Search */}
                <ProductSearch
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    loading={loading}
                />

                {/* Content layout: Filters (left) + Products (right) */}
                <Row gutter={[16, 16]} align="top">
                    <Col xs={24} md={7} lg={6} xl={5}>
                        <div style={{ position: 'sticky', top: 16 }}>
                            <ProductFilters
                                value={filters}
                                onChange={handleFiltersChange}
                                onClear={handleClearFilters}
                                loading={loading}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={17} lg={18} xl={19}>
                        {error && (
                            <Alert
                                message="Lỗi"
                                description={error}
                                type="error"
                                showIcon
                                closable
                                style={{ marginBottom: 12 }}
                            />
                        )}
                        <InfiniteScroll
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                            loading={loading}
                        >
                            <ProductList products={products} loading={false} />
                        </InfiniteScroll>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default ProductsPage;
