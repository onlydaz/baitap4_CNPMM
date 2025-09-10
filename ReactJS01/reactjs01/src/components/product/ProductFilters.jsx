import React, { useEffect, useState } from 'react';
import { Row, Col, InputNumber, Checkbox, Select, Button, Space, Card, Typography, Divider } from 'antd';

const sortOptions = [
  { label: 'Liên quan', value: 'relevance' },
  { label: 'Giá tăng dần', value: 'price_asc' },
  { label: 'Giá giảm dần', value: 'price_desc' },
  { label: 'Giảm giá nhiều', value: 'discount_desc' },
  { label: 'Lượt xem nhiều', value: 'views_desc' }
];

const ProductFilters = ({ value = {}, onChange, loading = false, onClear }) => {
  const [local, setLocal] = useState({
    price_min: undefined,
    price_max: undefined,
    has_promo: false,
    discount_min: undefined,
    views_min: undefined,
    sort: 'relevance'
  });

  useEffect(() => {
    setLocal(prev => ({ ...prev, ...value }));
  }, [value]);

  const updateLocal = (changed) => setLocal(prev => ({ ...prev, ...changed }));
  const handleApply = () => onChange && onChange(local);

  return (
    <Card
      title={<Typography.Text strong>Bộ lọc</Typography.Text>}
      size="small"
      bordered
      style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}
      bodyStyle={{ paddingTop: 12 }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Typography.Text type="secondary">Khoảng giá</Typography.Text>
          <Row gutter={8} style={{ marginTop: 8 }}>
            <Col span={12}>
              <InputNumber placeholder="Từ" style={{ width: '100%' }} min={0} step={1000}
                value={local.price_min}
                onChange={(v) => updateLocal({ price_min: v })}
                disabled={loading}
              />
            </Col>
            <Col span={12}>
              <InputNumber placeholder="Đến" style={{ width: '100%' }} min={0} step={1000}
                value={local.price_max}
                onChange={(v) => updateLocal({ price_max: v })}
                disabled={loading}
              />
            </Col>
          </Row>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Typography.Text type="secondary">Khuyến mãi</Typography.Text>
          <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
            <Checkbox
              checked={!!local.has_promo}
              onChange={(e) => updateLocal({ has_promo: e.target.checked })}
              disabled={loading}
            >Có khuyến mãi</Checkbox>
            <InputNumber placeholder="Giảm tối thiểu (%)" style={{ width: '100%' }} min={0} max={100}
              value={local.discount_min}
              onChange={(v) => updateLocal({ discount_min: v })}
              disabled={loading}
            />
          </Space>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Typography.Text type="secondary">Lượt xem</Typography.Text>
          <InputNumber placeholder="Lượt xem tối thiểu" style={{ width: '100%', marginTop: 8 }} min={0} step={10}
            value={local.views_min}
            onChange={(v) => updateLocal({ views_min: v })}
            disabled={loading}
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Typography.Text type="secondary">Sắp xếp</Typography.Text>
          <Select
            options={sortOptions}
            value={local.sort || 'relevance'}
            onChange={(v) => updateLocal({ sort: v })}
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>

        <Button onClick={handleApply} disabled={loading} block type="primary">
          Áp dụng
        </Button>
        <Button onClick={onClear} disabled={loading} block type="default">
          Xóa lọc
        </Button>
      </Space>
    </Card>
  );
};

export default ProductFilters;


