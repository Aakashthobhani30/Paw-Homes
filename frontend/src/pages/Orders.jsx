import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const Orders = () => {
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

  const renderOrderHistory = () => (
    <Card className="shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <h4 className="mb-4" style={{ color: PRIMARY_TEXT }}>Order History</h4>
        {orders.length === 0 ? (
          <p className="text-center" style={{ color: SECONDARY_TEXT }}>No orders found</p>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th style={{ color: PRIMARY_TEXT }}>Order ID</th>
                <th style={{ color: PRIMARY_TEXT }}>Date</th>
                <th style={{ color: PRIMARY_TEXT }}>Items</th>
                <th style={{ color: PRIMARY_TEXT }}>Total</th>
                <th style={{ color: PRIMARY_TEXT }}>Status</th>
                <th style={{ color: PRIMARY_TEXT }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderData) => {
                const order = orderData.order;
                return (
                  <tr key={order.id}>
                    <td style={{ color: SECONDARY_TEXT }}>#{order.order_id || order.id}</td>
                    <td style={{ color: SECONDARY_TEXT }}>{formatDate(order.created_at)}</td>
                    <td style={{ color: SECONDARY_TEXT }}>{orderData.order_items.length} items</td>
                    <td style={{ color: SECONDARY_TEXT }}>₹{order.total.toFixed(2)}</td>
                    <td>{getStatusBadge(order.order_status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        style={{ 
                          color: LINK_COLOR,
                          borderColor: LINK_COLOR,
                          backgroundColor: 'transparent'
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
          <h1 className="display-4 fw-bold">My Orders</h1>
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

export default Orders; 