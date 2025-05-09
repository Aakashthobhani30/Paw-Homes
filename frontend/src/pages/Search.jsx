import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
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

const Search = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      searchProducts(query);
    }
  }, [searchParams]);

  const searchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/search/?q=${encodeURIComponent(query)}`);
      setResults(response.data);
      setError('');
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Failed to search products. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Searching products...</p>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Search Results 🔍</h1>
          <p className="lead">Showing results for "{searchParams.get('q')}"</p>
        </Container>
      </div>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {!error && results.length === 0 ? (
          <Alert variant="info" className="text-center">
            No products found matching your search criteria.
          </Alert>
        ) : (
          <Row>
            {results.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm hover-card">
                  {product.image && (
                    <Card.Img
                      variant="top"
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title style={{ color: PRIMARY_TEXT }}>{product.name}</Card.Title>
                    <Card.Text style={{ color: SECONDARY_TEXT }}>
                      {product.description?.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0" style={{ color: HEADING_COLOR }}>
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <style jsx global>{`
        .hover-card {
          transition: transform 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </Layout>
  );
};

export default Search; 