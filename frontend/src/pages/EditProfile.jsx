import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";
import { clearTokens } from "../utils/auth";

const THEME_COLOR = '#0fa8a8';

const EditProfile = () => {
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put("/api/user/", user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container className="py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Edit Profile 🐾</h1>
          <p className="lead">Update Your Account Information</p>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={user.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={user.last_name}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={user.phone_number}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={user.address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => navigate('/profile')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      variant="dark"
                      className="btn-hover-teal"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default EditProfile; 