import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="footer-main py-5">
        <Container>
          <Row>
            {/* About Column */}
            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="text-white mb-4 white-paw-emoji">🐾 Paw & Homes</h5>
              <p className="text-light-gray mb-4">
                Creating happy tales, one paw at a time. We're dedicated to connecting pets with loving homes 
                and providing exceptional care services.🐶
              </p>
            </Col>

            {/* Quick Links Column */}
            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="text-white mb-4">Quick Links</h5>
              <ul className="list-unstyled footer-links">
                <li><Link to="/adoption">Pet Adoption</Link></li>
                <li><Link to="/product">Pet Products</Link></li>
                <li><Link to="/services">Our Services</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </Col>

            {/* Services Column */}
            <Col lg={3} md={6} className="mb-4 mb-lg-0">
              <h5 className="text-white mb-4">Our Services</h5>
              <ul className="list-unstyled footer-links">
                <li><Link to="/services">Pet Grooming</Link></li>
                <li><Link to="/services">Veterinary Care</Link></li>
                <li><Link to="/services">Pet Training</Link></li>
                <li><Link to="/services">Pet Boarding</Link></li>
                <li><Link to="/services">Pet Day Care</Link></li>
                <li><Link to="/services">Pet Transportation</Link></li>
              </ul>
            </Col>

            {/* Contact Info Column */}
            <Col lg={3} md={6}>
              <h5 className="text-white mb-4">Contact Info</h5>
              <ul className="list-unstyled contact-info">
                <li>
                  📍 Comming Soon.....
                </li>
                <li>
                  📞 (+91) 9904127855
                </li>
                <li>
                  ✉️ info@pawandhomes.com
                </li>
                <li>
                ⏰ Working Hours:<br /> Monday-Friday: 9:00 AM - 8:00 PM
                <br />Saturday-Sunday: 10:00 AM - 6:00 PM
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0">© 2024 Paw & Homes. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li className="list-inline-item mx-3">
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li className="list-inline-item">
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx global>{`
  .footer {
    background-color: #1c1c1c;
    color: ${LIGHT_TEXT};
    padding: 3rem 0;
    margin-top: 3rem;
    border-top: 1px solid ${THEME_COLOR};
  }

  .footer-title {
    color: ${LIGHT_TEXT};
    font-weight: 600;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
  }

  .footer-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: ${THEME_COLOR_LIGHTER};
  }

  .footer-link,
  .footer-links a,
  .contact-info li,
  .footer-bottom-text {
    color: ${LIGHT_TEXT};
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .footer-link:hover,
  .footer-links a:hover {
    color: ${LINK_COLOR};
    transform: translateX(5px);
  }

  .footer-bottom {
    background-color: #121212;
    padding: 1rem 0;
    margin-top: 2rem;
  }

  .social-icon {
    color: ${LINK_COLOR};
    font-size: 1.5rem;
    margin-right: 1rem;
    transition: all 0.3s ease;
  }

  .social-icon:hover {
    color: ${LIGHT_TEXT};
    transform: translateY(-3px);
  }
`}</style>

    </footer>
  );
};

export default Footer; 