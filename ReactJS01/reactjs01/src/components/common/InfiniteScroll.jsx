import React from 'react';
import { Spin, Alert, Button } from 'antd';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const InfiniteScroll = ({ 
    children, 
    onLoadMore, 
    hasMore, 
    loading,
    endMessage = "Đã hiển thị tất cả sản phẩm"
}) => {
    const { isLoading } = useInfiniteScroll(onLoadMore, hasMore, loading);

    return (
        <div>
            {children}
            
            {/* Loading indicator khi đang tải trang đầu tiên */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            )}
            
            {/* Loading indicator khi đang tải thêm sản phẩm */}
            {isLoading && !loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '10px' }}>Đang tải thêm sản phẩm...</div>
                </div>
            )}
            
            {/* Nút Load More (backup nếu scroll không hoạt động) */}
            {hasMore && !loading && !isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Button 
                        type="primary" 
                        onClick={onLoadMore}
                        loading={isLoading}
                    >
                        Tải thêm sản phẩm
                    </Button>
                </div>
            )}
            
            {/* Thông báo khi đã hết sản phẩm */}
            {!hasMore && !loading && (
                <Alert
                    message={endMessage}
                    type="info"
                    showIcon
                    style={{ margin: '20px 0', textAlign: 'center' }}
                />
            )}
        </div>
    );
};

export default InfiniteScroll;
