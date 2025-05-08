import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Form, Alert, Badge } from 'react-bootstrap';
import api from "../api";
import Layout from "../components/Layout";

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/product/${id}/`);
        setProduct(response.data);
        
        // Fetch related products (same category)
        const allProductsResponse = await api.get("/api/product/");
        const filtered = allProductsResponse.data
          .filter(item => item.id !== parseInt(id) && item.category === response.data.category)
          .slice(0, 4);
        setRelatedProducts(filtered);
        
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        console.error("Error fetching product detail:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/api/cart/add/', {
        product: product.id,
        quantity: quantity,
        type: 'product'
      });
      setAddToCartSuccess(true);
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
    } catch (error) {
      setError('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger">{error || "Product not found"}</Alert>
          <Button as={Link} to="/product" variant="outline-primary">
            Back to Products
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Product Details 🛍️</h1>
        </Container>
      </div>

      <Container className="py-4">
        {addToCartSuccess && (
          <Alert variant="success" onClose={() => setAddToCartSuccess(false)} dismissible>
            Successfully added {product.name} to cart!
          </Alert>
        )}
        
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <div style={{ height: '400px', overflow: 'hidden' }}>
                <Card.Img
                  variant="top"
                  src={`${BASE_URL}${product.image}`}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { 
                    console.warn('Failed to load product image');
                    e.target.src = '/placeholder-product.jpg'; 
                  }}
                />
              </div>
              <Card.Body>
                <h2 className="mb-4">{product.name}</h2>
                <p className="lead">
                  {product.description && product.description.split('\n').map((paragraph, index) => (
                    <span key={index}>
                      {paragraph}
                      {index < product.description.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h3 className="h4 mb-4">Product Information</h3>
                <p className="mb-3">
                  <strong>💰 Price:</strong><br />
                  ₹{parseFloat(product.price).toFixed(2)}
                </p>
                <p className="mb-3">
                  <strong>🏷️ Category:</strong><br />
                  <Badge bg="info" text="dark">{product.category.name}</Badge>
                </p>
                <p className="mb-3">
                  <strong>📦 In Stock:</strong><br />
                  {product.in_stock ? 'Yes' : 'Yes'}
                </p>
                {product.brand && (
                  <p className="mb-3">
                    <strong>🏭 Brand:</strong><br />
                    {product.brand}
                  </p>
                )}
                <p className="mb-3">
                  <strong>🔢 SKU:</strong><br />
                  {product.sku || `PRD-${product.id}`}
                </p>
                
                <div className="d-flex align-items-center mb-3">
                  <strong className="me-3">Quantity:</strong>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="mx-2 text-center"
                    style={{ width: '60px' }}
                  />
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                
                <Button 
                  variant="dark" 
                  size="lg" 
                  className="w-100"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = THEME_COLOR}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#212529'}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>

            <Button 
              as={Link} 
              to="/product" 
              variant="outline-dark" 
              className="w-100"
            >
              Back to Products
            </Button>
          </Col>
        </Row>
        
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-4">You May Also Like</h3>
            <Row xs={1} sm={2} md={4} className="g-4">
              {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id}>
                  <Card className="h-100 shadow-sm hover-shadow product-card">
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <Card.Img 
                        variant="top" 
                        src={`${BASE_URL}${relatedProduct.image}`} 
                        alt={relatedProduct.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6 mb-0">{relatedProduct.name}</Card.Title>
                        <span style={{ color: THEME_COLOR, fontWeight: 'bold' }}>
                          ₹{parseFloat(relatedProduct.price).toFixed(2)}
                        </span>
                      </div>
                      <Button 
                        as={Link}
                        to={`/product/${relatedProduct.id}`} 
                        variant="dark"
                        className="w-100 mt-auto"
                        style={{ transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = THEME_COLOR}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#212529'}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      <style jsx global>{`
        .product-detail-container {
          background-color: ${BACKGROUND_COLOR};
          min-height: 100vh;
          padding: 2rem 0;
        }

        .product-header {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          padding: 3rem 0;
          margin-bottom: 2rem;
        }

        .product-title {
          color: ${LIGHT_TEXT};
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .product-meta {
          color: ${LIGHT_TEXT};
          opacity: 0.9;
        }

        .product-content {
          background-color: ${LIGHT_TEXT};
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
          padding: 2rem;
        }

        .product-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .product-description {
          color: ${PRIMARY_TEXT};
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .product-details-list {
          list-style: none;
          padding: 0;
        }

        .product-details-list li {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .product-details-list li i {
          color: ${PRIMARY_TEXT};
          margin-right: 1rem;
          font-size: 1.2rem;
        }

        .product-details-list li span {
          color: ${SECONDARY_TEXT};
        }

        .price-section {
          background-color: ${THEME_COLOR_LIGHT};
          border-radius: 8px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .product-price {
          color: ${THEME_COLOR_LIGHTER};
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .product-stock {
          color: ${SECONDARY_TEXT};
          margin-bottom: 1.5rem;
        }

        .add-to-cart-btn {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          background-color: ${SECONDARY_TEXT};
          border-color: ${SECONDARY_TEXT};
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }

        .product-category {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .category-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .category-name {
          color: ${SECONDARY_TEXT};
          margin-bottom: 1rem;
        }

        .product-specifications {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .specifications-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .specifications-list {
          color: ${SECONDARY_TEXT};
        }

        .specifications-list li {
          margin-bottom: 0.5rem;
        }

        .product-reviews {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .reviews-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .review-card {
          background-color: ${THEME_COLOR_LIGHT};
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .review-author {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
        }

        .review-date {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
        }

        .review-content {
          color: ${SECONDARY_TEXT};
          margin-top: 0.5rem;
        }

        .review-rating {
          color: ${THEME_COLOR_LIGHTER};
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .quantity-btn {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .quantity-input {
          width: 60px;
          text-align: center;
          border: 1px solid ${THEME_COLOR_LIGHT};
          border-radius: 4px;
          padding: 0.5rem;
        }

        .product-tags {
          margin-top: 2rem;
        }

        .product-tag {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          display: inline-block;
          font-size: 0.9rem;
        }

        .product-share {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .share-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .share-buttons {
          display: flex;
          gap: 1rem;
        }

        .share-button {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .share-button:hover {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          transform: translateY(-2px);
        }

        .product-status-badge {
          background-color: ${THEME_COLOR_LIGHTER};
          color: ${LIGHT_TEXT};
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .product-availability {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .product-shipping {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .shipping-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .shipping-info {
          color: ${SECONDARY_TEXT};
        }

        .shipping-details {
          margin-top: 1rem;
        }

        .shipping-detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .shipping-detail-item i {
          color: ${PRIMARY_TEXT};
          margin-right: 0.5rem;
        }

        .shipping-detail-item span {
          color: ${SECONDARY_TEXT};
        }
      `}</style>
    </Layout>
  );
};

export default ProductDetail;