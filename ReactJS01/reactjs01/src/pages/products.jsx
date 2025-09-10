import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import ProductList from '../components/product/ProductList';
import ProductSearch from '../components/product/ProductSearch';
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
    
    const { categories } = useCategories();
    const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));
    
    const { products, loading, hasMore, error, loadMore } = useLazyProducts(categoryId, search);

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

                {/* Error Alert */}
                {error && (
                    <Alert
                        message="Lỗi"
                        description={error}
                        type="error"
                        showIcon
                        closable
                    />
                )}

                {/* Products with Infinite Scroll */}
                <InfiniteScroll
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    loading={loading}
                >
                    <ProductList products={products} loading={false} />
                </InfiniteScroll>
            </Space>
        </div>
    );
};

export default ProductsPage;
