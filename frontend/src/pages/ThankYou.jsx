import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const THEME_COLOR = '#0fa8a8';

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
            <Card className="shadow-sm text-center">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h3 className="mb-3">Order Confirmed!</h3>
                <p className="text-muted mb-4">
                  Thank you for your purchase. We've sent a confirmation email with your order details.
                  Your items will be shipped within 2-3 business days.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button
                    as={Link}
                    to="/product"
                    variant="dark"
                    className="btn-hover-teal"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    as={Link}
                    to="/orders"
                    variant="dark"
                    className="btn-hover-teal"
                  >
                    View Orders
                  </Button>
                  <Button
                    as={Link}
                    to="/" 
                    variant="dark"
                    className="btn-hover-teal"
                  >
                    Back To Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .btn-hover-teal:hover {
          background-color: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
        }
      `}</style>
    </Layout>
  );
};

export default ThankYou; 