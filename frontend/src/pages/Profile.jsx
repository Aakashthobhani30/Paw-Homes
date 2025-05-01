import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert, Modal, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";
import { clearTokens } from "../utils/auth";

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#333333'; // Dark Gray for main text
const SECONDARY_TEXT = '#666666'; // Medium Gray for secondary text
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#00bcd4'; // Bright Aqua for links and accents
const HEADING_COLOR = '#00bcd4'; // Bright Aqua for headings

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
    address: '',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
  });

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/user/");
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        clearTokens();
        window.location.href = '/login';
      }
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders/");
      setOrders(response.data);
      calculateOrderStats(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const calculateOrderStats = (orderData) => {
    const stats = {
      total: orderData.length,
    };
    setOrderStats(stats);
  };

  const handleLogout = () => {
    clearTokens();
    window.location.href = '/';
  };

  const handleDeleteProfile = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/api/user/");
      clearTokens();
      window.location.href = '/register';
    } catch (error) {
      setError('Failed to delete profile. Please try again.');
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'processing': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return (
      <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderOrderStats = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center h-100 shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-0" style={{ color: HEADING_COLOR }}>{orderStats.total}</h3>
            <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Total Orders</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderOrderHistory = () => (
    <Card className="shadow-sm hover-card" style={{ backgroundColor: LIGHT_TEXT }}>
      <Card.Body>
        <h4 className="mb-4" style={{ color: HEADING_COLOR }}>Order History</h4>
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ color: SECONDARY_TEXT }}>#{order.id}</td>
                  <td style={{ color: SECONDARY_TEXT }}>{formatDate(order.created_at)}</td>
                  <td style={{ color: SECONDARY_TEXT }}>{order.items_count} items</td>
                  <td style={{ color: SECONDARY_TEXT }}>${order.total.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
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
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm hover-card mb-4" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <div className="profile-avatar mb-3">
                <img 
                  src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="Profile"
                  className="rounded-circle"
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    border: `4px solid ${PRIMARY_TEXT}` 
                  }}
                />
              </div>
              <h2 className="h3 mb-0" style={{ color: PRIMARY_TEXT }}>{user.first_name} {user.last_name}</h2>
              <p style={{ color: SECONDARY_TEXT }}>{user.username}</p>
            </div>

            <div className="profile-info">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: PRIMARY_TEXT }}>First Name</label>
                    <p className="mb-0" style={{ color: SECONDARY_TEXT }}>{user.first_name}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: PRIMARY_TEXT }}>Last Name</label>
                    <p className="mb-0" style={{ color: SECONDARY_TEXT }}>{user.last_name}</p>
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: PRIMARY_TEXT }}>Username</label>
                <p className="mb-0" style={{ color: SECONDARY_TEXT }}>{user.username}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ color: PRIMARY_TEXT }}>Joined</label>
                <p className="mb-0" style={{ color: SECONDARY_TEXT }}>{formatDate(user.date_joined)}</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: PRIMARY_TEXT }}>Address</label>
                <p className="mb-0" style={{ color: SECONDARY_TEXT }}>{user.address}</p>
              </div>

              <div className="text-center">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="me-2"
                >
                  Delete Profile
                </Button>

                <Button 
                  variant="dark"
                  onClick={handleLogout}
                  style={{ 
                    backgroundColor: PRIMARY_TEXT,
                    borderColor: PRIMARY_TEXT,
                    color: LIGHT_TEXT
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {renderOrderStats()}
        {renderOrderHistory()}
      </motion.div>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">My Profile 🐾</h1>
          <p className="lead">View Your Account Information</p>
        </Container>
      </div>

      <Container className="py-4">
        {renderContent()}
      </Container>

      {/* Delete Profile Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: HEADING_COLOR }}>Delete Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: PRIMARY_TEXT }}>Are you sure you want to delete your profile? This action cannot be undone.</p>
          <p className="text-danger">All your data will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
            style={{ 
              backgroundColor: THEME_COLOR_LIGHT,
              borderColor: THEME_COLOR_LIGHT,
              color: PRIMARY_TEXT
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteProfile}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Profile'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid ${THEME_COLOR_LIGHT};
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
          border-color: ${LINK_COLOR};
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background-color: ${LINK_COLOR};
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .profile-avatar img {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Profile;