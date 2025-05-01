import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

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

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/services/');
        setServices(data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchServices();
  }, []);
  

  const filterAndSearch = (list) => {
    return list.filter(service => {
      const matchesSearch = (service.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (service.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (service.location || '').toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDay = true;
      if (dayFilter) {
        matchesDay = (service.availability || '').toLowerCase().includes(dayFilter.toLowerCase());
      }

      return matchesSearch && matchesDay;
    });
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  const formatDuration = (duration) => {
    return duration || 'Duration varies';
  };

  const renderServiceCard = (service) => {
    return (
      <Card className="h-100 shadow-sm hover-card">
        <div className="event-image-container">
          <Card.Img
            variant="top"
            src={service.image ? `${BASE_URL}${service.image}` : '/placeholder-service.jpg'}
            alt={service.name || 'Service Image'}
            className="event-image"
            onError={(e) => { e.target.src = '/placeholder-service.jpg'; }}
          />
        </div>
        <Card.Body>
          <Card.Title className="h5 mb-1">{service.name || 'Untitled Service'}</Card.Title>
          <p className="text-muted mb-2 small">
             ₹ {formatPrice(service.price)} <br />
            📅 Available: Schudel Your Service
          </p>
          <Card.Text className="event-description">
            {service.description || 'No description available.'}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="bg-white border-top-0">
          <Button 
            as={Link} 
            to={`/services/${service.id}`} 
            variant="dark" 
            className="w-100 btn-hover-teal"
          >
            Book Service
          </Button>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Expert Care, For Your Furry Friends! 🐶</h1>
        </Container>
      </div>
      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Card className="mb-4 p-3 shadow-sm">
          <Form>
            <Row className="g-3">
              <Col lg={6} md={12}>
                <Form.Control
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-focus"
                />
              </Col>
              <Col lg={6} md={12}>
                <Form.Select
                  value={dayFilter}
                  onChange={(e) => setDayFilter(e.target.value)}
                  className="filter-focus"
                >
                  <option value="">All Days</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </Form.Select>
                {dayFilter && (
                  <Button 
                    variant="link" 
                    className="position-absolute end-0 top-50 translate-middle-y" 
                    style={{ marginRight: '15px', padding: '0', color: THEME_COLOR }}
                    onClick={() => setDayFilter('')}
                  >
                    Clear
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" style={{ color: THEME_COLOR }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Row>
            {filterAndSearch(services).length > 0 ? (
              filterAndSearch(services).map(service => (
                <Col key={service.id} lg={4} md={6} className="mb-4">
                  {renderServiceCard(service)}
                </Col>
              ))
            ) : (
              <Col><p className="text-muted text-center">No services found matching your criteria.</p></Col>
            )}
          </Row>
        )}
      </Container>

      <style jsx global>{`
        .services-container {
          background-color: ${BACKGROUND_COLOR};
          min-height: 100vh;
          padding: 2rem 0;
        }

        .services-header {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          padding: 3rem 0;
          margin-bottom: 2rem;
        }

        .services-title {
          color: ${LIGHT_TEXT};
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .services-subtitle {
          color: ${LIGHT_TEXT};
          opacity: 0.9;
        }

        .service-card {
          background-color: ${LIGHT_TEXT};
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
          transition: all 0.3s ease;
          border: 1px solid ${THEME_COLOR_LIGHT};
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
          border-color: ${PRIMARY_TEXT};
        }

        .service-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }

        .service-content {
          padding: 1.5rem;
        }

        .service-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .service-description {
          color: ${SECONDARY_TEXT};
          margin-bottom: 1rem;
        }

        .service-price {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          font-size: 1.2rem;
        }

        .service-category {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .service-duration {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
        }

        .service-book-now {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .service-book-now:hover {
          background-color: ${SECONDARY_TEXT};
          border-color: ${SECONDARY_TEXT};
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }

        .services-filter {
          margin-bottom: 2rem;
        }

        .filter-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .filter-category {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.5rem 1rem;
          border-radius: 4px;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .filter-category:hover {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .filter-category.active {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .services-search {
          margin-bottom: 2rem;
        }

        .search-input {
          border-color: ${THEME_COLOR_LIGHT};
          border-radius: 4px;
          padding: 0.75rem 1rem;
        }

        .search-input:focus {
          border-color: ${PRIMARY_TEXT};
          box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
        }

        .services-pagination {
          margin-top: 2rem;
        }

        .page-link {
          color: ${PRIMARY_TEXT};
          border-color: ${THEME_COLOR_LIGHT};
        }

        .page-link:hover {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
        }

        .page-item.active .page-link {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .services-sidebar {
          background-color: ${LIGHT_TEXT};
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
        }

        .sidebar-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid ${THEME_COLOR_LIGHT};
        }

        .popular-services {
          list-style: none;
          padding: 0;
        }

        .popular-service-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid ${THEME_COLOR_LIGHT};
        }

        .popular-service-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .popular-service-price {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
        }

        .search-focus:focus,
        .filter-focus:focus {
          border-color: ${THEME_COLOR};
          box-shadow: 0 0 0 0.25rem rgba(15, 168, 168, 0.25);
        }

        .event-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        }

        .hover-card:hover .event-image {
          transform: scale(1.05);
        }

        .event-description {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 0.9rem;
        }

        .btn-hover-teal:hover {
          background-color: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
        }
      `}</style>
    </Layout>
  );
};

export default Services;
