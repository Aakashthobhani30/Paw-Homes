import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

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

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cart items from API on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        // Get cart data from API
        const response = await api.get('/api/cart/');
        setCartItems(response.data);
        
        // Get shipping information from localStorage or use default
        const storedShippingInfo = localStorage.getItem('shippingInfo');
        if (storedShippingInfo) {
          setShippingInfo(JSON.parse(storedShippingInfo));
        } else {
          // Default shipping info (could be empty in a real app)
          setShippingInfo({
            name: 'Aakash Thobhani',
            address: 'Navrangpura',
            city: 'Ahmedabad',
            state: 'Gujarat',
            zip: '38009',
            country: 'India',
            phone: '+91 8780091991'
          });
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Calculate order totals based on current cart items
  const calculateOrderTotals = () => {
    const TAX_RATE = 0.18;
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
    const tax = subtotal * TAX_RATE;
    const shipping = 0; // Free shipping
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total
    };
  };
  

  const { subtotal, tax, shipping, total } = calculateOrderTotals();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }
    
    try {
      // Complete the purchase through the API
      await api.post('/api/cart/complete/');
      setOrderPlaced(true);
      
      // Navigate to thank you page after a short delay
      setTimeout(() => {
        navigate('/thank-you');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your checkout information...</p>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/cart')}>
            Back to Cart
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Checkout 🐾</h1>
          <p className="lead">Review your order and complete the purchase</p>
        </Container>
      </div>

      <Container className="pb-5">
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow-sm" style={{ backgroundColor: LIGHT_TEXT }}>
              <Card.Header className="bg-white"><h5 className="mb-0" style={{ color: HEADING_COLOR }}>Shipping Address</h5></Card.Header>
              <Card.Body>
                {shippingInfo ? (
                  <>
                    <p className="mb-1" style={{ color: PRIMARY_TEXT }}><strong>{shippingInfo.name}</strong></p>
                    <p className="mb-1" style={{ color: SECONDARY_TEXT }}>{shippingInfo.address}</p>
                    <p className="mb-1" style={{ color: SECONDARY_TEXT }}>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                    <p className="mb-1" style={{ color: SECONDARY_TEXT }}>{shippingInfo.country}</p>
                    <p className="mb-0" style={{ color: SECONDARY_TEXT }}>Phone: {shippingInfo.phone}</p>
                  </>
                ) : (
                  <p style={{ color: SECONDARY_TEXT }}>Please add a shipping address</p>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-sm" style={{ backgroundColor: LIGHT_TEXT }}>
              <Card.Header className="bg-white"><h5 className="mb-0" style={{ color: HEADING_COLOR }}>Order Summary</h5></Card.Header>
              <Card.Body>
                {cartItems.length === 0 ? (
                  <Alert variant="info">
                    Your cart is empty. <Button variant="link" className="p-0" onClick={() => navigate('/products')} style={{ color: LINK_COLOR }}>Continue shopping</Button>
                  </Alert>
                ) : (
                  cartItems.map((item) => (
                    <Row key={item.id} className="mb-3 align-items-center">
                      <Col xs={3}>
                        {item.product_details?.image ? (
                          <img src={`${import.meta.env.VITE_API_URL}${item.product_details.image}`} alt={item.product_details.name} className="img-fluid rounded" />
                        ) : (
                          <div className="bg-light rounded p-3 text-center">No image</div>
                        )}
                      </Col>
                      <Col xs={6}>
                        <h6 style={{ color: PRIMARY_TEXT }}>{item.product_details?.name}</h6>
                        <small style={{ color: SECONDARY_TEXT }}>Quantity: {item.quantity}</small>
                      </Col>
                      <Col xs={3} className="text-end" style={{ color: SECONDARY_TEXT }}>
                        ₹{parseFloat(item.total_amount).toFixed(2)}
                      </Col>
                    </Row>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm" style={{ backgroundColor: LIGHT_TEXT }}>
              <Card.Header className="bg-white"><h5 className="mb-0" style={{ color: HEADING_COLOR }}>Order Total</h5></Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: PRIMARY_TEXT }}>Subtotal</span>
                  <span style={{ color: SECONDARY_TEXT }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: PRIMARY_TEXT }}>Shipping</span>
                  <span style={{ color: THEME_COLOR }}>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: PRIMARY_TEXT }}>Tax (18%)</span>
                  <span style={{ color: SECONDARY_TEXT }}>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong style={{ color: PRIMARY_TEXT }}>Total</strong>
                  <strong style={{ color: HEADING_COLOR }}>₹{total.toFixed(2)}</strong>
                </div>

                {cartItems.length > 0 && !orderPlaced ? (
                  <Button 
                    variant="dark" 
                    className="w-100" 
                    onClick={handlePlaceOrder}
                    disabled={!shippingInfo}
                    style={{ 
                      backgroundColor: THEME_COLOR,
                      borderColor: THEME_COLOR,
                      color: LIGHT_TEXT
                    }}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>Place Order
                  </Button>
                ) : cartItems.length === 0 ? (
                  <Button 
                    variant="primary" 
                    className="w-100" 
                    onClick={() => navigate('/products')}
                    style={{ 
                      backgroundColor: THEME_COLOR,
                      borderColor: THEME_COLOR,
                      color: LIGHT_TEXT
                    }}
                  >
                    Continue Shopping
                  </Button>
                ) : null}

                {orderPlaced && (
                  <Alert variant="success" className="text-center mt-3">
                    Order placed successfully! Redirecting...
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Checkout;