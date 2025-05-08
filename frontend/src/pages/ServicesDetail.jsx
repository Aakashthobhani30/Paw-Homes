import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Alert, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import api from '../api';
import Layout from '../components/Layout';

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

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedServices, setRelatedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServiceDetail = async () => {
      try {
        const response = await api.get(`/api/services/${id}/`);
        setService(response.data);
        
        // Fetch related services
        const relatedResponse = await api.get('/api/services/');
        // Filter out the current service and limit to 3 related services
        const filtered = relatedResponse.data
          .filter(item => item.id !== parseInt(id))
          .slice(0, 3);
        setRelatedServices(filtered);
        
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        console.error('Error fetching service detail:', error);
        setError('Failed to load service details. Please try again later.');
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(false);
    setBookingError('');
    
    if (!bookingDate || !bookingTime) {
      setBookingError('Please select both date and time for your booking.');
      return;
    }
    
    try {
      // Implement your booking API call here
      await api.post('/api/bookings/', {
        service_id: id,
        date: bookingDate,
        time: bookingTime
      });
      
      setBookingSuccess(true);
      setBookingDate('');
      setBookingTime('');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      console.error('Error making booking:', error);
      setBookingError('Failed to book the service. Please try again later.');
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `₹${price.toFixed(2)}` : price;
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

    if (error || !service) {
      return (
        <Container className="py-5 text-center">
          <Alert variant="danger" role="alert">
            {error || 'Service not found'}
          </Alert>
          <Button as={Link} to="/services" variant="primary" style={{ backgroundColor: THEME_COLOR, borderColor: THEME_COLOR }}>
            Back to Services
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
            to="/services" 
            variant="outline-dark" 
            className="mb-4 btn-hover-teal"
          >
            ← Back to Services
          </Button>

          <Row className="g-4">
            <Col lg={7}>
              <Card className="border-0 shadow-sm">
                {service.image && (
                  <div className="service-image-container">
                    <Card.Img 
                      src={service.image ? `${BASE_URL}${service.image}` : '/placeholder-service.jpg'}
                      alt={service.name} 
                      className="img-fluid service-image"
                      onError={(e) => { e.target.src = '/placeholder-service.jpg'; }}
                    />
                  </div>
                )}

                <Card.Body className="p-4">
                  <header className="service-header mb-4">
                    <h1 className="service-title">{service.name || 'Untitled Service'}</h1>
                    <div className="service-meta d-flex flex-wrap justify-content-between align-items-center">
                      <div>
                        <span className="price-tag">
                          {formatPrice(service.price)}
                        </span>
                        {service.duration && (
                          <span className="duration-tag ms-3">
                            ⏱️ {service.duration}
                          </span>
                        )}
                      </div>
                      {service.availability && (
                        <span className="badge bg-light text-dark">
                          Available: {service.availability}
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="service-content">
                    <h5 className="mb-3">Description</h5>
                    {service.description && service.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {service.location && (
                    <div className="service-location mt-4">
                      <h5 className="mb-2">Location</h5>
                      <p>
                        <i className="bi bi-geo-alt-fill me-2"></i>
                        {service.location}
                      </p>
                    </div>
                  )}

                  {service.requirements && (
                    <div className="service-requirements mt-4">
                      <h5 className="mb-2">Requirements</h5>
                      <p>{service.requirements}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-sm p-4">
                <Card.Body>
                  <h3 className="mb-4">Book This Service</h3>
                  
                  {bookingSuccess && (
                    <Alert variant="success" className="mb-4">
                      Your booking has been successfully scheduled! We'll contact you shortly to confirm.
                    </Alert>
                  )}
                  
                  {bookingError && (
                    <Alert variant="danger" className="mb-4">
                      {bookingError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleBookingSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="search-focus"
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Select Time</Form.Label>
                      <Form.Control 
                        type="time" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="search-focus"
                        required
                      />
                    </Form.Group>
                    
                    <Button 
                      type="submit"
                      variant="dark" 
                      className="w-100 py-2 btn-hover-teal"
                    >
                      Schedule Appointment
                    </Button>
                  </Form>
                  
                  <div className="booking-info mt-4">
                    <p className="text-muted small">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      After booking, our team will contact you to confirm your appointment. 
                      Please be ready with your pet's information.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {relatedServices.length > 0 && (
            <section className="related-services mt-5">
              <h3 className="mb-4">Other Services You May Like</h3>
              <Row xs={1} md={3} className="g-4">
                {relatedServices.map((relatedService, index) => (
                  <Col key={relatedService.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm hover-card">
                        <div className="event-image-container">
                          <Card.Img 
                            variant="top" 
                            src={relatedService.image ? `${BASE_URL}${relatedService.image}` : '/placeholder-service.jpg'}
                            alt={relatedService.name}
                            className="event-image"
                            onError={(e) => { e.target.src = '/placeholder-service.jpg'; }}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title className="h6">{relatedService.name || 'Untitled Service'}</Card.Title>
                          <p className="text-muted mb-2 small">
                            ₹ {formatPrice(relatedService.price)}
                          </p>
                        </Card.Body>
                        <Card.Footer className="bg-white border-top-0">
                          <Button 
                            as={Link} 
                            to={`/services/${relatedService.id}`} 
                            variant="dark" 
                            className="w-100 btn-hover-teal"
                          >
                            Book Service
                          </Button>
                        </Card.Footer>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </section>
          )}
        </motion.div>

        <style jsx>{`
          .service-image-container {
            max-height: 400px;
            overflow: hidden;
            border-radius: 8px 8px 0 0;
          }
          
          .service-image {
            width: 100%;
            height: auto;
            object-fit: cover;
          }
          
          .service-title {
            font-size: 2rem;
            font-weight: 700;
            color: ${PRIMARY_TEXT};
            margin-bottom: 1rem;
          }
          
          .service-meta {
            margin-bottom: 1.5rem;
          }
          
          .price-tag {
            font-size: 1.25rem;
            font-weight: 600;
            color: ${PRIMARY_TEXT};
          }
          
          .duration-tag {
            color: ${SECONDARY_TEXT};
          }
          
          .service-content {
            color: ${SECONDARY_TEXT};
            line-height: 1.7;
          }
          
          .event-image-container {
            position: relative;
            height: 180px;
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
            border: 1px solid ${THEME_COLOR_LIGHT};
          }
          
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
            border-color: ${PRIMARY_TEXT};
          }
          
          .hover-card:hover .event-image {
            transform: scale(1.05);
          }
          
          .btn-hover-teal {
            background-color: ${PRIMARY_TEXT};
            border-color: ${PRIMARY_TEXT};
            color: ${LIGHT_TEXT};
          }
          
          .btn-hover-teal:hover {
            background-color: ${SECONDARY_TEXT};
            border-color: ${SECONDARY_TEXT};
            color: ${LIGHT_TEXT};
          }
          
          .search-focus:focus {
            border-color: ${PRIMARY_TEXT};
            box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
          }

          .booking-info {
            background-color: ${THEME_COLOR_LIGHT};
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .booking-info p {
            color: ${SECONDARY_TEXT};
            margin-bottom: 0;
          }

          .booking-info i {
            color: ${PRIMARY_TEXT};
          }

          .service-location {
            background-color: ${THEME_COLOR_LIGHT};
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .service-location p {
            color: ${SECONDARY_TEXT};
            margin-bottom: 0;
          }

          .service-location i {
            color: ${PRIMARY_TEXT};
          }

          .service-requirements {
            background-color: ${THEME_COLOR_LIGHT};
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .service-requirements p {
            color: ${SECONDARY_TEXT};
            margin-bottom: 0;
          }

          .service-features {
            background-color: ${THEME_COLOR_LIGHT};
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
          }

          .service-features h3 {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .service-features ul {
            color: ${SECONDARY_TEXT};
            padding-left: 1.5rem;
          }

          .service-features li {
            margin-bottom: 0.5rem;
          }

          .service-booking-form {
            background-color: ${LIGHT_TEXT};
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
          }

          .booking-form-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .form-label {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
          }

          .form-control {
            border-color: ${THEME_COLOR_LIGHT};
            border-radius: 4px;
          }

          .form-control:focus {
            border-color: ${PRIMARY_TEXT};
            box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
          }

          .submit-booking-btn {
            background-color: ${PRIMARY_TEXT};
            border-color: ${PRIMARY_TEXT};
            color: ${LIGHT_TEXT};
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .submit-booking-btn:hover {
            background-color: ${SECONDARY_TEXT};
            border-color: ${SECONDARY_TEXT};
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
          }
          
          @media (max-width: 768px) {
            .service-title {
              font-size: 1.5rem;
            }
            
            .price-tag {
              font-size: 1.1rem;
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

export default ServiceDetail;