import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Empty
                description="Không có sản phẩm nào"
                style={{ padding: '50px' }}
            />
        );
    }

    return (
        <Row gutter={[16, 16]}>
            {products.map((product) => (
                <Col 
                    key={product.id} 
                    xs={24} 
                    sm={12} 
                    md={8} 
                    lg={6} 
                    xl={6}
                >
                    <ProductCard product={product} />
                </Col>
            ))}
        </Row>
    );
};

export default ProductList;
