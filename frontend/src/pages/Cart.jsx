import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";

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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [quantityUpdateLoading, setQuantityUpdateLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await api.get('/api/cart/');
      setCartItems(response.data);
      calculateTotal(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + parseFloat(item.total_amount), 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    // Validate quantity input
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99; // Set a reasonable max limit
    
    // Optimize UI by updating locally first
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { 
        ...item, 
        quantity: newQuantity,
        total_amount: (parseFloat(item.type === 'product' ? item.product_details?.price : item.event_details?.price) * newQuantity).toFixed(2)
      } : item
    );
    
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    
    // Show loading state for this specific item
    setQuantityUpdateLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Find the current item to get its type
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) {
        throw new Error('Cart item not found');
      }

      await api.patch(`/api/cart/update/${itemId}/`, { 
        quantity: newQuantity,
        type: currentItem.type // Include the type field from the current item
      });
      
      console.log(`Cart item ${itemId} quantity updated to ${newQuantity}`);
    } catch (error) {
      console.error('Cart update error:', error.response ? error.response.data : error.message);
      setError('Failed to update quantity. Please try again.');
      fetchCartItems(); // Refetch to ensure data consistency
    } finally {
      // Hide loading state
      setQuantityUpdateLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Debounce function to prevent excessive API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Use debounced version for input changes
  const debouncedQuantityChange = debounce(handleQuantityChange, 500);

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/remove/${itemId}/`);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page instead of completing purchase directly
    navigate('/checkout');
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

    if (purchaseSuccess) {
      return (
        <Alert variant="success" className="text-center">
          Purchase completed successfully! Redirecting...
        </Alert>
      );
    }

    if (cartItems.length === 0) {
      return (
        <Card className="text-center py-5" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <h3 className="mb-4" style={{ color: HEADING_COLOR }}>Your cart is empty</h3>
            <p className="mb-4" style={{ color: SECONDARY_TEXT }}>Looks like you haven't added any items to your cart yet.</p>
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
          </Card.Body>
        </Card>
      );
    }

    return (
      <>
        <Table responsive className="cart-table">
          <thead>
            <tr>
              <th style={{ color: PRIMARY_TEXT }}>Item</th>
              <th style={{ color: PRIMARY_TEXT }}>Price</th>
              <th style={{ color: PRIMARY_TEXT }}>Quantity</th>
              <th style={{ color: PRIMARY_TEXT }}>Total</th>
              <th style={{ color: PRIMARY_TEXT }}></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${item.type === 'product' ? item.product_details?.image : item.event_details?.image}`}
                      alt={item.type === 'product' ? item.product_details?.name : item.event_details?.name}
                      className="cart-item-image me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0" style={{ color: PRIMARY_TEXT }}>{item.type === 'product' ? item.product_details?.name : item.event_details?.name}</h6>
                    </div>
                  </div>
                </td>
                <td style={{ color: SECONDARY_TEXT }}>₹{parseFloat(item.type === 'product' ? item.product_details?.price : item.event_details?.price).toFixed(2)}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1 || quantityUpdateLoading[item.id]}
                      style={{ 
                        color: SECONDARY_TEXT,
                        borderColor: SECONDARY_TEXT
                      }}
                    >
                      -
                    </Button>
                    <div className="position-relative mx-2">
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          debouncedQuantityChange(item.id, value);
                        }}
                        min="1"
                        max="99"
                        className="quantity-input"
                        style={{ width: '60px' }}
                        disabled={quantityUpdateLoading[item.id]}
                      />
                      {quantityUpdateLoading[item.id] && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
                          <Spinner animation="border" size="sm" style={{ color: THEME_COLOR }} />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= 99 || quantityUpdateLoading[item.id]}
                      style={{ 
                        color: SECONDARY_TEXT,
                        borderColor: SECONDARY_TEXT
                      }}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td style={{ color: SECONDARY_TEXT }}>₹{parseFloat(item.total_amount).toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={quantityUpdateLoading[item.id]}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="mt-4" style={{ backgroundColor: LIGHT_TEXT }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0" style={{ color: PRIMARY_TEXT }}>Total:</h5>
                <h3 className="mb-0" style={{ color: HEADING_COLOR }}>₹{total.toFixed(2)}</h3>
              </div>
              <div>
                <Button
                  as={Link}
                  to="/product"
                  variant="outline-secondary"
                  className="me-2"
                  style={{ 
                    color: SECONDARY_TEXT,
                    borderColor: SECONDARY_TEXT
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="dark"
                  onClick={handleCheckout}
                  style={{ 
                    backgroundColor: THEME_COLOR,
                    borderColor: THEME_COLOR,
                    color: LIGHT_TEXT
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Shopping Cart 🛒</h1>
          <p className="lead">Review and manage your items</p>
        </Container>
      </div>

      <Container className="py-4">
        {renderContent()}
      </Container>

      <style jsx>{`
        .cart-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cart-table th {
          background-color: ${THEME_COLOR_LIGHT};
          border-bottom: 2px solid ${THEME_COLOR_LIGHT};
          padding: 1rem;
        }

        .cart-table td {
          padding: 1rem;
          vertical-align: middle;
        }

        .cart-item-image {
          border-radius: 8px;
        }

        .quantity-btn {
          width: 30px;
          height: 30px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-input {
          text-align: center;
        }
      `}</style>
    </Layout>
  );
};

export default Cart;