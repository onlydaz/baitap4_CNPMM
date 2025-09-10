import React from 'react';
import { Card, Image, Typography, Space, Tag, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleViewDetail = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product.id);
    };

    return (
        <Card
            hoverable
            style={{ width: '100%', marginBottom: 16 }}
            cover={
                <Image
                    alt={product.name}
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 200, objectFit: 'cover' }}
                    fallback="https://via.placeholder.com/300x200?text=Error+Loading+Image"
                />
            }
            actions={[
                <Button 
                    type="primary" 
                    icon={<EyeOutlined />} 
                    onClick={handleViewDetail}
                >
                    Xem chi tiết
                </Button>,
                <Button 
                    icon={<ShoppingCartOutlined />} 
                    onClick={handleAddToCart}
                >
                    Thêm giỏ hàng
                </Button>
            ]}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4} ellipsis={{ rows: 2 }}>
                    {product.name}
                </Title>
                
                <Text type="secondary" ellipsis={{ rows: 2 }}>
                    {product.description}
                </Text>
                
                <Space justify="space-between" style={{ width: '100%' }}>
                    <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(product.price)}
                    </Title>
                    
                    <Tag color={product.stock > 0 ? 'green' : 'red'}>
                        {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                    </Tag>
                </Space>
                
                {product.category && (
                    <Tag color="blue">{product.category.name}</Tag>
                )}
            </Space>
        </Card>
    );
};

export default ProductCard;
