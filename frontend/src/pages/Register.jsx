import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from "../api";
import { setTokens } from "../utils/auth";

const Register = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post("/api/user/register/", {
        username,
        password,
        first_name: first_name,
        last_name: last_name,
      });

      // Store tokens using the utility function
      setTokens(res.data.access, res.data.refresh);

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <Container className="py-5">
          <div className="register-container mx-auto" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4">Create an Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                />
              </Form.Group>

              <Button 
                variant="dark" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>

              <div className="text-center">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </Form>
          </div>
        </Container>

        <style jsx>{`
          .register-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
            padding: 20px;
          }

          .register-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }

          .btn-dark:hover {
            background-color: #0b7e7e !important;
            border-color: #0b7e7e !important;
          }

          a {
            color: #0b7e7e;
            text-decoration: none;
          }

          a:hover {
            color: #096666;
            text-decoration: underline;
          }
        `}</style>
      </div>
    </>
  );
};

export default Register; 