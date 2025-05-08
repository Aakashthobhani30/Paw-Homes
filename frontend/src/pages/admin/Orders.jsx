import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api';

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders/checkout/");
      setOrders(response.data);
      calculateOrderStats(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  const calculateOrderStats = (orderData) => {
    const stats = {
      total: orderData.length,
      completed: orderData.filter(order => order.order.order_status === 5).length,
      pending: orderData.filter(order => order.order.order_status === 1).length,
      cancelled: orderData.filter(order => order.order.order_status === 6).length
    };
    setOrderStats(stats);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { text: 'Placed', color: 'warning' },
      2: { text: 'Processing', color: 'info' },
      3: { text: 'Shipped', color: 'primary' },
      4: { text: 'Out for Delivery', color: 'info' },
      5: { text: 'Delivered', color: 'success' },
      6: { text: 'Cancelled', color: 'danger' }
    };

    const statusInfo = statusMap[status] || { text: 'Unknown', color: 'secondary' };
    
    return (
      <span className={`badge bg-${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status/`, { status: newStatus });
      fetchOrders(); // Refresh orders after status update
    } catch (error) {
      setError('Failed to update order status. Please try again.');
    }
  };

  const renderOrderStats = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center h-100 shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-0" style={{ color: PRIMARY_TEXT }}>{orderStats.total}</h3>
            <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Total Orders</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100 shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-0" style={{ color: 'success' }}>{orderStats.completed}</h3>
            <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Completed</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100 shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-0" style={{ color: 'warning' }}>{orderStats.pending}</h3>
            <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Pending</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100 shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-0" style={{ color: 'danger' }}>{orderStats.cancelled}</h3>
            <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Cancelled</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderFilters = () => (
    <Card className="shadow-sm mb-4" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: PRIMARY_TEXT }}>Status Filter</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderColor: THEME_COLOR }}
              >
                <option value="all">All Status</option>
                <option value="1">Placed</option>
                <option value="2">Processing</option>
                <option value="3">Shipped</option>
                <option value="4">Out for Delivery</option>
                <option value="5">Delivered</option>
                <option value="6">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: PRIMARY_TEXT }}>Date Filter</Form.Label>
              <Form.Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ borderColor: THEME_COLOR }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderOrderHistory = () => (
    <Card className="shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <h4 className="mb-4" style={{ color: PRIMARY_TEXT }}>Order Management</h4>
        {orders.length === 0 ? (
          <p className="text-center" style={{ color: SECONDARY_TEXT }}>No orders found</p>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th style={{ color: PRIMARY_TEXT }}>Order ID</th>
                <th style={{ color: PRIMARY_TEXT }}>Date</th>
                <th style={{ color: PRIMARY_TEXT }}>Customer</th>
                <th style={{ color: PRIMARY_TEXT }}>Items</th>
                <th style={{ color: PRIMARY_TEXT }}>Total</th>
                <th style={{ color: PRIMARY_TEXT }}>Status</th>
                <th style={{ color: PRIMARY_TEXT }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderData) => {
                const order = orderData.order;
                return (
                  <tr key={order.id}>
                    <td style={{ color: SECONDARY_TEXT }}>#{order.order_id || order.id}</td>
                    <td style={{ color: SECONDARY_TEXT }}>{formatDate(order.created_at)}</td>
                    <td style={{ color: SECONDARY_TEXT }}>{order.user?.username || 'Guest'}</td>
                    <td style={{ color: SECONDARY_TEXT }}>{orderData.order_items.length} items</td>
                    <td style={{ color: SECONDARY_TEXT }}>₹{order.total.toFixed(2)}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, parseInt(e.target.value))}
                        style={{ 
                          width: 'auto',
                          borderColor: THEME_COLOR,
                          color: SECONDARY_TEXT
                        }}
                      >
                        <option value="1">Placed</option>
                        <option value="2">Processing</option>
                        <option value="3">Shipped</option>
                        <option value="4">Out for Delivery</option>
                        <option value="5">Delivered</option>
                        <option value="6">Cancelled</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        style={{ 
                          color: LINK_COLOR,
                          borderColor: LINK_COLOR,
                          backgroundColor: 'transparent',
                          marginRight: '5px'
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Order Management</h1>
        </Container>
      </div>
      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {renderOrderStats()}
            {renderFilters()}
            {renderOrderHistory()}
          </>
        )}
      </Container>

      <style jsx global>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }

        .table th {
          font-weight: 600;
        }

        .badge {
          padding: 0.5em 1em;
          font-weight: 500;
        }
      `}</style>
    </Layout>
  );
};

export default AdminOrders; 