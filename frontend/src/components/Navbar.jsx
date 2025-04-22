import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Define the NEW, darker teal color
const NAVBAR_BG_COLOR = '#0b7e7e'; // Even darker shade

const Navbar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0); // Sample
  const accessToken = localStorage.getItem('access');

  return (
    <BootstrapNavbar style={{ backgroundColor: NAVBAR_BG_COLOR }} variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          <span className="white-paw-emoji">🐾</span> Paw & Homes
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/adoption">Adoption</Nav.Link>
            <Nav.Link as={Link} to="/product">Products</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/cart" className="me-2 position-relative">
              Cart
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
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
      
      {/* Add CSS for the white paw emoji and icons */}
      <style jsx global>{`
        .white-paw-emoji {
          /* Filter approach - turns the emoji white */
          filter: brightness(0) invert(1);
          /* Add some spacing and vertical alignment adjustments if needed */
          margin-right: 4px;
          display: inline-block;
        }
        
        .cart-badge {
          font-size: 0.6rem;
          top: 0;
          right: 0;
          transform: translate(25%, -25%);
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar;