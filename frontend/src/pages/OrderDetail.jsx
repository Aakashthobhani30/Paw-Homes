import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/api/orders/checkout/`);
      const orderData = response.data.find(order => order.order.id === parseInt(id));
      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Order not found');
      }
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      setError('Failed to load order details. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const renderOrderInfo = () => (
    <Card className="shadow-sm hover-card mb-4" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h5 style={{ color: PRIMARY_TEXT }}>Order Information</h5>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Order ID:</strong> #{order.order.order_id || order.order.id}
            </p>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Date:</strong> {formatDate(order.order.created_at)}
            </p>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Status:</strong> {getStatusBadge(order.order.order_status)}
            </p>
          </Col>
          <Col md={6}>
            <h5 style={{ color: PRIMARY_TEXT }}>Payment Information</h5>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Payment Status:</strong> {order.order.payment_status === 1 ? 'Paid' : 'Pending'}
            </p>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Payment ID:</strong> {order.order.payment_id || 'N/A'}
            </p>
            <p className="mb-1" style={{ color: SECONDARY_TEXT }}>
              <strong>Total Amount:</strong> ₹{order.order.total.toFixed(2)}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderOrderItems = () => (
    <Card className="shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <h5 className="mb-4" style={{ color: PRIMARY_TEXT }}>Order Items</h5>
        <Table responsive>
          <thead>
            <tr>
              <th style={{ color: PRIMARY_TEXT }}>Item</th>
              <th style={{ color: PRIMARY_TEXT }}>Type</th>
              <th style={{ color: PRIMARY_TEXT }}>Quantity</th>
              <th style={{ color: PRIMARY_TEXT }}>Unit Price</th>
              <th style={{ color: PRIMARY_TEXT }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, index) => {
              const itemName = item.type === 1 
                ? (item.product?.name || 'Product not found')
                : (item.event?.title || 'Event not found');
              const itemPrice = item.type === 1 
                ? (item.product?.price || 0)
                : (item.event?.price || 0);
              const itemTotal = itemPrice * item.quantity;
              
              return (
                <tr key={index}>
                  <td style={{ color: SECONDARY_TEXT }}>
                    <div className="d-flex align-items-center">
                      {item.type === 1 && item.product?.image && (
                        <img 
                          src={item.product.image} 
                          alt={itemName}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover',
                            marginRight: '10px',
                            borderRadius: '4px'
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '500' }}>{itemName}</div>
                        {item.type === 1 && item.product?.description && (
                          <small style={{ color: SECONDARY_TEXT, opacity: 0.8 }}>
                            {item.product.description.substring(0, 50)}...
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: SECONDARY_TEXT }}>
                    <span className={`badge bg-${item.type === 1 ? 'primary' : 'success'}`}>
                      {item.type === 1 ? 'Product' : 'Event'}
                    </span>
                  </td>
                  <td style={{ color: SECONDARY_TEXT }}>{item.quantity}</td>
                  <td style={{ color: SECONDARY_TEXT }}>₹{itemPrice.toFixed(2)}</td>
                  <td style={{ color: SECONDARY_TEXT }}>₹{itemTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end" style={{ color: PRIMARY_TEXT, fontWeight: 'bold' }}>
                Order Total:
              </td>
              <td style={{ color: PRIMARY_TEXT, fontWeight: 'bold' }}>
                ₹{order.order.total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Order Details</h1>
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
        ) : order ? (
          <>
            <Button
              variant="outline-primary"
              className="mb-4"
              onClick={() => navigate('/orders')}
              style={{ 
                color: LINK_COLOR,
                borderColor: LINK_COLOR,
                backgroundColor: 'transparent'
              }}
            >
              ← Back to Orders
            </Button>
            {renderOrderInfo()}
            {renderOrderItems()}
          </>
        ) : (
          <Alert variant="warning" className="text-center">
            Order not found
          </Alert>
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

export default OrderDetail; 