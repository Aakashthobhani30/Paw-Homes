import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

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

const ThankYou = () => {
  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Thank You! 🎉</h1>
          <p className="lead">Your order has been placed successfully</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm text-center" style={{ backgroundColor: LIGHT_TEXT }}>
              <Card.Body className="py-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: THEME_COLOR }}></i>
                </div>
                <h3 className="mb-3" style={{ color: HEADING_COLOR }}>Order Confirmed!</h3>
                <p className="mb-4" style={{ color: SECONDARY_TEXT }}>
                  Thank you for your purchase. We've sent a confirmation email with your order details.
                  Your items will be shipped within 2-3 business days.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button
                    as={Link}
                    to="/product"
                    variant="dark"
                    style={{ 
                      backgroundColor: THEME_COLOR,
                      borderColor: THEME_COLOR,
                      color: LIGHT_TEXT
                    }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    as={Link}
                    to="/orders"
                    variant="dark"
                    style={{ 
                      backgroundColor: THEME_COLOR,
                      borderColor: THEME_COLOR,
                      color: LIGHT_TEXT
                    }}
                  >
                    View Orders
                  </Button>
                  <Button
                    as={Link}
                    to="/" 
                    variant="dark"
                    style={{ 
                      backgroundColor: THEME_COLOR,
                      borderColor: THEME_COLOR,
                      color: LIGHT_TEXT
                    }}
                  >
                    Back To Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default ThankYou; 