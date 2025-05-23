import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import api from "../api";
import { setTokens } from "../utils/auth";

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
      {/* <Navbar /> */}
      <div className="register-page">
        <Container className="py-5">
          <div className="register-container mx-auto" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4" style={{ color: HEADING_COLOR }}>Create an Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: PRIMARY_TEXT }}>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      style={{ 
                        borderColor: THEME_COLOR_LIGHT,
                        backgroundColor: LIGHT_TEXT
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: PRIMARY_TEXT }}>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      style={{ 
                        borderColor: THEME_COLOR_LIGHT,
                        backgroundColor: LIGHT_TEXT
                      }}
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: PRIMARY_TEXT }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={{ 
                    borderColor: THEME_COLOR_LIGHT,
                    backgroundColor: LIGHT_TEXT
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: PRIMARY_TEXT }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  style={{ 
                    borderColor: THEME_COLOR_LIGHT,
                    backgroundColor: LIGHT_TEXT
                  }}
                />
              </Form.Group>

              <Button 
                variant="dark" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
                style={{ 
                  backgroundColor: THEME_COLOR,
                  borderColor: THEME_COLOR,
                  color: LIGHT_TEXT
                }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>

              <div className="text-center">
                <p style={{ color: SECONDARY_TEXT }}>
                  Already have an account? <Link to="/login" style={{ color: LINK_COLOR }}>Login here</Link>
                </p>
              </div>
            </Form>
          </div>
        </Container>

        <style jsx>{`
          .register-page {
            min-height: 100vh;
            background: ${BACKGROUND_COLOR};
            padding: 20px;
          }

          .register-container {
            background: ${LIGHT_TEXT};
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }

          .btn-dark:hover {
            background-color: ${THEME_COLOR_LIGHTER} !important;
            border-color: ${THEME_COLOR_LIGHTER} !important;
          }

          a {
            color: ${LINK_COLOR};
            text-decoration: none;
          }

          a:hover {
            color: ${THEME_COLOR};
            text-decoration: underline;
          }

          .form-control:focus {
            border-color: ${THEME_COLOR};
            box-shadow: 0 0 0 0.2rem rgba(0, 188, 212, 0.25);
          }
        `}</style>
      </div>
    </>
  );
};

export default Register; 