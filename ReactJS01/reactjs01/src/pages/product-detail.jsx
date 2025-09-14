import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Row, 
    Col, 
    Typography, 
    Image, 
    Button, 
    Space, 
    Tag, 
    Divider,
    Spin,
    Alert,
    Card
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getProductByIdApi } from '../util/productApi';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getProductByIdApi(id);
                
                if (response.EC === 0) {
                    setProduct(response.data);
                } else {
                    setError(response.EM || 'Không tìm thấy sản phẩm');
                }
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', product.id);
    };

    const handleBackToProducts = () => {
        if (product?.category) {
            navigate(`/products/${product.category.id}`);
        } else {
            navigate('/');
        }
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
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/')}>
                            Về trang chủ
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Không tìm thấy sản phẩm"
                    description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."
                    type="warning"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/')}>
                            Về trang chủ
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Back Button */}
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleBackToProducts}
                >
                    Quay lại danh sách sản phẩm
                </Button>

                {/* Product Details */}
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Image
                            alt={product.name}
                            src={product.image ? `http://localhost:8888/${product.image}` : 'https://via.placeholder.com/500x400?text=No+Image'}
                            style={{ width: '100%', borderRadius: '8px' }}
                            fallback="https://via.placeholder.com/500x400?text=Error+Loading+Image"
                        />
                    </Col>
                    
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Title level={1}>{product.name}</Title>
                                {product.category && (
                                    <Tag color="blue" style={{ marginBottom: '16px' }}>
                                        {product.category.name}
                                    </Tag>
                                )}
                            </div>

                            <Card>
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </Title>
                                    </div>

                                    <div>
                                        <Text strong>Tình trạng: </Text>
                                        <Tag color={product.stock > 0 ? 'green' : 'red'}>
                                            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                                        </Tag>
                                    </div>

                                    <Divider />

                                    <Space>
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                        </Button>
                                    </Space>
                                </Space>
                            </Card>

                            {product.description && (
                                <Card title="Mô tả sản phẩm">
                                    <Paragraph>{product.description}</Paragraph>
                                </Card>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default ProductDetailPage;
