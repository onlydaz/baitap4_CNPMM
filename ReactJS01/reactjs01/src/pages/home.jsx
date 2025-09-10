import React from 'react';
import { Typography, Row, Col, Spin, Alert, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import CategoryCard from '../components/category/CategoryCard';

const { Title } = Typography;

const HomePage = () => {
    const navigate = useNavigate();
    const { categories, loading, error } = useCategories();

    const handleCategoryClick = (categoryId) => {
        navigate(`/products/${categoryId}`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
            />
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                    <Title level={1}>Cửa hàng trực tuyến</Title>
                    <Title level={3} type="secondary">
                        Khám phá các sản phẩm theo danh mục
                    </Title>
                </div>

                {categories && categories.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {categories.map((category) => (
                            <Col 
                                key={category.id} 
                                xs={24} 
                                sm={12} 
                                md={8} 
                                lg={6} 
                                xl={6}
                            >
                                <CategoryCard 
                                    category={category}
                                    onClick={() => handleCategoryClick(category.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Alert
                        message="Chưa có danh mục nào"
                        description="Vui lòng thêm danh mục sản phẩm để bắt đầu."
                        type="info"
                        showIcon
                    />
                )}
            </Space>
        </div>
    );
};

export default HomePage;