import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from "../api";

const THEME_COLOR = '#0fa8a8';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

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
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.put(`/api/cart/${itemId}/`, { quantity: newQuantity });
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}/`);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Proceeding to checkout...');
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

    if (cartItems.length === 0) {
      return (
        <Card className="text-center py-5">
          <Card.Body>
            <h3 className="mb-4">Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              as={Link} 
              to="/product" 
              variant="dark"
              className="btn-hover-teal"
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
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">{item.description}</small>
                    </div>
                  </div>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      min="1"
                      className="quantity-input mx-2"
                      style={{ width: '60px' }}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="mt-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total:</h5>
                <h3 className="mb-0" style={{ color: THEME_COLOR }}>${total.toFixed(2)}</h3>
              </div>
              <div>
                <Button
                  as={Link}
                  to="/product"
                  variant="outline-secondary"
                  className="me-2"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="dark"
                  className="btn-hover-teal"
                  onClick={handleCheckout}
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
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
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

        .btn-hover-teal:hover {
          background-color: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
        }
      `}</style>
    </Layout>
  );
};

export default Cart; 