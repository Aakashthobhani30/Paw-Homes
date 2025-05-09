import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

// Navbar specific colors
const NAVBAR_BG = '#f8f9fa'; // Light gray background
const NAVBAR_TEXT = '#00bcd4'; // Bright Aqua
const NAVBAR_HOVER = '#008ba3'; // Darker Aqua
const NAVBAR_ACCENT = '#ffca28'; // Sunny Yellow

const Navbar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0); // Sample
  const [searchQuery, setSearchQuery] = useState('');
  const accessToken = localStorage.getItem('access');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <BootstrapNavbar style={{ backgroundColor: BACKGROUND_COLOR }} variant="light" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold" style={{ color: PRIMARY_TEXT }}>
          <span className="paw-emoji ">🐾</span> Paw & Homes
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: PRIMARY_TEXT }}>Home</Nav.Link>
            <Nav.Link as={Link} to="/adoption" style={{ color: PRIMARY_TEXT }}>Adoption</Nav.Link>
            <Nav.Link as={Link} to="/product" style={{ color: PRIMARY_TEXT }}>Products</Nav.Link>
            <Nav.Link as={Link} to="/events" style={{ color: PRIMARY_TEXT }}>Events</Nav.Link>
            <Nav.Link as={Link} to="/blog" style={{ color: PRIMARY_TEXT }}>Blog</Nav.Link>
            <Nav.Link as={Link} to="/services" style={{ color: PRIMARY_TEXT }}>Services</Nav.Link>
            <Nav.Link as={Link} to="/about" style={{ color: PRIMARY_TEXT }}>About Us</Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderColor: THEME_COLOR,
                  borderRadius: '20px 0 0 20px',
                  padding: '0.375rem 1rem'
                }}
              />
              <button
                className="btn"
                type="submit"
                style={{
                  backgroundColor: THEME_COLOR,
                  color: LIGHT_TEXT,
                  borderRadius: '0 20px 20px 0',
                  border: `1px solid ${THEME_COLOR}`
                }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/cart" className="me-2 position-relative" style={{ color: PRIMARY_TEXT }}>
            🛒
              {cartItemsCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute cart-badge"
                  style={{ top: 0, right: 0, transform: 'translate(50%, -50%)' }}
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Nav.Link>
            {accessToken ? (
              <Nav.Link as={Link} to="/profile" style={{ color: PRIMARY_TEXT }}>👤</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" style={{ color: PRIMARY_TEXT }}>Login</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
      
      {/* Add CSS for the paw emoji and icons */}
      <style jsx global>{`
        .navbar {
          background-color: ${NAVBAR_BG};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .navbar-brand {
          color: ${NAVBAR_TEXT} !important;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .navbar-brand:hover {
          color: ${NAVBAR_HOVER} !important;
        }

        .nav-link {
          color: ${NAVBAR_TEXT} !important;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: ${NAVBAR_HOVER} !important;
        }

        .nav-link.active {
          color: ${NAVBAR_HOVER} !important;
          font-weight: 600;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: ${NAVBAR_ACCENT};
          transform: scaleX(1);
        }

        .navbar-toggler {
          border-color: ${NAVBAR_TEXT};
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='${encodeURIComponent(NAVBAR_TEXT)}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .mobile-menu {
          background-color: ${NAVBAR_BG};
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mobile-menu .nav-link {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mobile-menu .nav-link:last-child {
          border-bottom: none;
        }

        .mobile-menu .nav-link:hover {
          background-color: rgba(0, 188, 212, 0.1);
        }

        .mobile-menu .nav-link.active {
          background-color: rgba(0, 188, 212, 0.1);
        }

        .btn-outline-primary {
          color: ${NAVBAR_TEXT};
          border-color: ${NAVBAR_TEXT};
        }

        .btn-outline-primary:hover {
          background-color: ${NAVBAR_TEXT};
          border-color: ${NAVBAR_TEXT};
          color: ${LIGHT_TEXT};
        }

        .btn-primary {
          background-color: ${NAVBAR_TEXT};
          border-color: ${NAVBAR_TEXT};
        }

        .btn-primary:hover {
          background-color: ${NAVBAR_HOVER};
          border-color: ${NAVBAR_HOVER};
        }

        .cart-badge {
          background-color: ${NAVBAR_ACCENT};
          color: ${LIGHT_TEXT};
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          position: absolute;
          top: -5px;
          right: -5px;
        }

        .paw-emoji {
          color: ${NAVBAR_TEXT};
          margin-right: 4px;
          display: inline-block;
        }

        .form-control:focus {
          border-color: ${THEME_COLOR};
          box-shadow: 0 0 0 0.2rem rgba(0, 188, 212, 0.25);
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar;