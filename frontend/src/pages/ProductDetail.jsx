import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Form, Alert, Badge } from 'react-bootstrap';
import api from "../api";
import Layout from "../components/Layout";

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#0fa8a8';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);

  useEffect(() => {
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

  const handleAddToCart = () => {
    // Implement cart functionality here
    console.log(`Added ${quantity} of ${product.name} to cart`);
    setAddToCartSuccess(true);
    
    // Reset the success message after 3 seconds
    setTimeout(() => {
      setAddToCartSuccess(false);
    }, 3000);
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

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          transition: box-shadow 0.3s ease;
        }
        
        .product-card:hover img {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
    </Layout>
  );
};

export default ProductDetail;