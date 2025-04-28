import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert, Modal, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";
import { clearTokens } from "../utils/auth";

const THEME_COLOR = '#0fa8a8';

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
    window.location.href = '/login';
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

  // const getStatusBadge = (status) => {
  //   const statusColors = {
  //     completed: 'success',
  //     pending: 'warning',
  //     cancelled: 'danger'
  //   };
  //   return (
  //     <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
  //       {status.charAt(0).toUpperCase() + status.slice(1)}
  //     </span>
  //   );
  // };

  const renderOrderStats = () => (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0">{orderStats.total}</h3>
            <p className="text-muted mb-0">Total Orders</p>
          </Card.Body>
        </Card>
      </Col>
      {/* <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0 text-success">{orderStats.completed}</h3>
            <p className="text-muted mb-0">Completed</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0 text-warning">{orderStats.pending}</h3>
            <p className="text-muted mb-0">Pending</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0 text-danger">{orderStats.cancelled}</h3>
            <p className="text-muted mb-0">Cancelled</p>
          </Card.Body>
        </Card>
      </Col> */}
    </Row>
  );

  const renderOrderHistory = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="mb-4">Order History</h4>
        {orders.length === 0 ? (
          <p className="text-center text-muted">No orders found</p>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{order.items_count} items</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
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
        <Card className="shadow-sm hover-card mb-4">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <div className="profile-avatar mb-3">
                <img 
                  src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: `4px solid ${THEME_COLOR}` }}
                />
              </div>
              <h2 className="h3 mb-0">{user.first_name} {user.last_name}</h2>
              <p className="text-muted">{user.username}</p>
            </div>

            <div className="profile-info">
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">First Name</label>
                    <p className="mb-0">{user.first_name}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Last Name</label>
                    <p className="mb-0">{user.last_name}</p>
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <p className="mb-0">{user.username}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Joined</label>
                <p className="mb-0">{user.date_joined}</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Address</label>
                <p className="mb-0">{user.address}</p>
              </div>

              <div className="text-center">
                {/* <Button 
                  variant="dark"
                  className="btn-hover-teal me-2"
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </Button> */}
                <Button 
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="me-2"
                >
                  Delete Profile
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={handleLogout}
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
          <Modal.Title>Delete Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
          <p className="text-danger">All your data will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
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
    </Layout>
  );
};

export default Profile;