import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const THEME_COLOR = '#0fa8a8';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    window.location.href = '/login';
  };

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
        <Card className="shadow-sm hover-card">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <div className="profile-avatar mb-3">
                <img 
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: `4px solid ${THEME_COLOR}` }}
                />
              </div>
              <h2 className="h3 mb-0">{user.first_name} {user.last_name}</h2>
              <p className="text-muted">{user.email}</p>
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
                <label className="form-label fw-bold">Email</label>
                <p className="mb-0">{user.email}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <p className="mb-0">{user.phone_number}</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Address</label>
                <p className="mb-0">{user.address}</p>
              </div>

              <div className="text-center">
                <Button 
                  variant="dark"
                  className="btn-hover-teal me-2"
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
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
    </Layout>
  );
};

export default Profile; 