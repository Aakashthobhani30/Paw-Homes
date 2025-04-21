import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Form, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
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
    // This is a placeholder - you would typically call an API or update local storage
    console.log(`Added ${quantity} of ${product.name} to cart`);
    setAddToCartSuccess(true);
    
    // Reset the success message after 3 seconds
    setTimeout(() => {
      setAddToCartSuccess(false);
    }, 3000);
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

    if (error || !product) {
      return (
        <Container className="py-5 text-center">
          <Alert variant="danger" role="alert">
            {error || "Product not found"}
          </Alert>
          <Button as={Link} to="/product" variant="primary" style={{ backgroundColor: THEME_COLOR, borderColor: THEME_COLOR }}>
            Back to Products
          </Button>
        </Container>
      );
    }

    return (
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            as={Link} 
            to="/product" 
            variant="outline-dark" 
            className="mb-4 btn-hover-teal"
          >
            ← Back to Products
          </Button>

          <Row className="g-4 mb-5">
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <div className="product-detail-image-container">
                  <img 
                    src={`${BASE_URL}${product.image}`} 
                    alt={product.name} 
                    className="img-fluid product-detail-image"
                    onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                  />
                </div>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="border-0 shadow-sm p-4">
                <Card.Body>
                  <div className="mb-3 d-flex justify-content-between align-items-start">
                    <h1 className="product-title">{product.name}</h1>
                    <span className="product-detail-price">₹{parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="badge bg-info text-dark">{product.category}</span>
                  </div>
                  
                  <div className="product-description mb-4">
                    {product.description && product.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {addToCartSuccess && (
                    <Alert variant="success" className="mb-4">
                      Successfully added to cart!
                    </Alert>
                  )}
                  
                  <div className="mb-4">
                    <div className="quantity-selector d-flex align-items-center mb-3">
                      <label htmlFor="quantity" className="me-3 fw-bold">Quantity:</label>
                      <div className="d-flex align-items-center">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="quantity-btn"
                        >
                          -
                        </Button>
                        <Form.Control
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="mx-2 text-center filter-focus"
                          style={{ width: '60px' }}
                        />
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="dark" 
                      className="w-100 py-2 btn-hover-teal"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  
                  <div className="product-info mt-4 p-3 bg-light rounded">
                    <h5 className="mb-3">Product Information</h5>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">SKU:</span>
                        <span>{product.sku || `PRD-${product.id}`}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">In Stock:</span>
                        <span>{product.in_stock ? 'Yes' : 'Yes'}</span>
                      </div>
                      {product.brand && (
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Brand:</span>
                          <span>{product.brand}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {relatedProducts.length > 0 && (
            <section className="related-products mt-5">
              <h3 className="mb-4">You May Also Like</h3>
              <Row xs={1} sm={2} md={4} className="g-4">
                {relatedProducts.map((relatedProduct, index) => (
                  <Col key={relatedProduct.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm hover-shadow-lg product-card">
                        <div className="product-image-container">
                          <Card.Img 
                            variant="top" 
                            src={`${BASE_URL}${relatedProduct.image}`} 
                            alt={relatedProduct.name}
                            className="product-image"
                            onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h6 mb-0">{relatedProduct.name}</Card.Title>
                            <span className="product-price">₹{parseFloat(relatedProduct.price).toFixed(2)}</span>
                          </div>
                          <Button 
                            as={Link}
                            to={`/product/${relatedProduct.id}`} 
                            variant="dark"
                            className="w-100 mt-auto btn-hover-teal"
                          >
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </section>
          )}
        </motion.div>

        <style jsx>{`
          .product-detail-image-container {
            height: auto;
            max-height: 500px;
            overflow: hidden;
            border-radius: 8px;
          }
          
          .product-detail-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .product-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #333;
          }
          
          .product-detail-price {
            font-size: 1.6rem;
            font-weight: bold;
            color: ${THEME_COLOR};
          }
          
          .product-description {
            color: #444;
            font-size: 1rem;
            line-height: 1.6;
          }
          
          .quantity-btn {
            width: 30px;
            height: 30px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .product-image-container {
            position: relative;
            overflow: hidden;
          }
          
          .product-image {
            height: 180px;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          
          .product-card:hover .product-image {
            transform: scale(1.05);
          }
          
          .product-price {
            font-size: 1rem;
            font-weight: bold;
            color: ${THEME_COLOR};
          }
          
          .btn-hover-teal {
            transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
          }
          
          .btn-hover-teal:hover {
            background-color: ${THEME_COLOR} !important;
            border-color: ${THEME_COLOR} !important;
            color: white !important;
          }
          
          .hover-shadow-lg {
            transition: box-shadow 0.3s ease;
          }
          
          .hover-shadow-lg:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .filter-focus:focus {
            border-color: ${THEME_COLOR};
            box-shadow: 0 0 0 0.25rem rgba(15, 168, 168, 0.25);
          }
          
          @media (max-width: 768px) {
            .product-title {
              font-size: 1.5rem;
            }
            
            .product-detail-price {
              font-size: 1.3rem;
            }
          }
        `}</style>
      </Container>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default ProductDetail;