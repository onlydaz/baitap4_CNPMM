import React from 'react';
import { Card, Image, Typography, Space, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const productCount = category.products ? category.products.length : 0;

    const handleCategoryClick = () => {
        navigate(`/products/${category.id}`);
    };

    return (
        <Card
            hoverable
            style={{ width: '100%', marginBottom: 16, cursor: 'pointer' }}
            cover={
                <Image
                    alt={category.name}
                    src={category.image ? `http://localhost:8888/${category.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 150, objectFit: 'cover' }}
                    fallback="https://via.placeholder.com/300x200?text=Error+Loading+Image"
                />
            }
            onClick={handleCategoryClick}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                    <Title level={4} ellipsis={{ rows: 1 }}>
                        {category.name}
                    </Title>
                    <Badge count={productCount} showZero color="#1890ff" />
                </Space>
                
                <Text type="secondary" ellipsis={{ rows: 2 }}>
                    {category.description || 'Không có mô tả'}
                </Text>
            </Space>
        </Card>
    );
};

export default CategoryCard;
