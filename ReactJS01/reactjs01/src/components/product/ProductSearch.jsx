import React from 'react';
import { Input, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

const ProductSearch = ({ 
    searchQuery, 
    onSearchChange, 
    onSearch, 
    onClear,
    loading = false 
}) => {
    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Row justify="center" style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        size="large"
                        disabled={loading}
                    />
                    <Button 
                        type="primary" 
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        loading={loading}
                        size="large"
                    >
                        Tìm kiếm
                    </Button>
                    {searchQuery && (
                        <Button 
                            icon={<ClearOutlined />}
                            onClick={onClear}
                            size="large"
                        >
                            Xóa
                        </Button>
                    )}
                </Space.Compact>
            </Col>
        </Row>
    );
};

export default ProductSearch;
