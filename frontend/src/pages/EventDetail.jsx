import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Image, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerStatus, setRegisterStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/events/${id}/`);
        setEvent(data);
      } catch (err) {
        if (error.response?.status===401)
          (localStorage.clear(),
      window.location.reload)
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // Return the original string if formatting fails
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const [hours = '00', minutes = '00'] = timeString.split(':');
      return new Date(`2000-01-01T${hours}:${minutes}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString; // Return the original string if formatting fails
    }
  };

  const handleRegister = () => {
    // Placeholder for registration logic
    setRegisterStatus('success');
    // You might want to redirect or show a success message
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/api/cart/add/', {
        event: event.id,
        quantity: quantity,
        type: 'event'
      });
      setAddToCartSuccess(true);
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);
    } catch (error) {
      setError('Failed to add tickets to cart');
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
          <Button as={Link} to="/events" variant="outline-primary">
            Back to Events
          </Button>
        </Container>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="info">Event not found.</Alert>
          <Button as={Link} to="/events" variant="outline-primary">
            Back to Events
          </Button>
        </Container>
      </Layout>
    );
  }
  

  const isEventPast = event.date ? new Date(event.date) < new Date().setHours(0, 0, 0, 0) : false;

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Event Details 🎉</h1>
        </Container>
      </div>

      <Container className="py-4">
        {registerStatus === 'success' && (
          <Alert variant="success" onClose={() => setRegisterStatus(null)} dismissible>
            Successfully registered for {event.name}!
          </Alert>
        )}
         <div className="mb-4 text-start">
                 <Button 
            as={Link} 
            to="/events" 
            variant="outline-dark"
          >
            ← Back to Events
          </Button>
        </div>
        
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <div style={{ height: '400px', overflow: 'hidden' }}>
                <Card.Img
                  variant="top"
                  src={event.image ? `${BASE_URL}${event.image}` : '/placeholder-event.jpg'}
                  alt={event.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { 
                    console.warn('Failed to load event image');
                    e.target.src = '/placeholder-event.jpg'; 
                  }}
                />
              </div>
              <Card.Body>
                <h2 className="mb-4">{event.name}</h2>
                <p className="lead">{event.description}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h3 className="h4 mb-4">Event Information</h3>
                <p className="mb-3">
                  <strong>📅 Date:</strong><br />
                  {formatDate(event.date)}
                </p>
                <p className="mb-3">
                  <strong>🕒 Time:</strong><br />
                  {formatTime(event.time)}
                </p>
                <p className="mb-3">
                  <strong>📍 Location:</strong><br />
                  {event.location || 'To be announced'}
                </p>
                {!isEventPast && (
                  <Button 
                    variant="dark" 
                    size="lg" 
                    className="w-100"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = THEME_COLOR}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#212529'}
                    onClick={handleRegister}
                  >
                    Buy Tickets
                  </Button>
                )}
                {isEventPast && (
                  <Alert variant="info">
                    This event has already taken place.
                  </Alert>
                )}
              </Card.Body>
            </Card>

           
          </Col>
        </Row>
      </Container>
      <Container className="my-5">
  <Card className="shadow-sm">
    <Card.Body>
      <h4 className="mb-3">Terms & Conditions</h4>
      <ul className="list-unstyled text-muted">
        <li>• Please carry a valid ID proof along with you.</li>
        <li>• No refunds on purchased ticket are possible, even in case of any rescheduling.</li>
        <li>• Security procedures, including frisking remain the right of the management.</li>
        <li>• Please follow all venue rules and instructions from staff.</li>
        <li>• The organizer is not responsible for lost or stolen items.</li>
        <li>• People in an inebriated state may not be allowed entry.</li>
        <li>• Organizers hold the right to deny late entry to the event.</li>
        <li>• For the safety and enjoyment of all guests, the following items are strictly prohibited inside the venue:
              Weapons, knives, firearms, fireworks, helmets, laser devices, bottles, and musical instruments.
              Possession of any such items may result in immediate removal from the venue, with or without the owner.</li>
      </ul>
    </Card.Body>
  </Card>
</Container>

    </Layout>
  );
};

export default EventDetail;

<style jsx global>{`
  .event-detail-container {
    background-color: ${BACKGROUND_COLOR};
    min-height: 100vh;
    padding: 2rem 0;
  }

  .event-header {
    background-color: ${PRIMARY_TEXT};
    color: ${LIGHT_TEXT};
    padding: 3rem 0;
    margin-bottom: 2rem;
  }

  .event-title {
    color: ${LIGHT_TEXT};
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .event-meta {
    color: ${LIGHT_TEXT};
    opacity: 0.9;
  }

  .event-content {
    background-color: ${LIGHT_TEXT};
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
    padding: 2rem;
  }

  .event-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .event-description {
    color: ${PRIMARY_TEXT};
    line-height: 1.8;
    margin-bottom: 2rem;
  }

  .event-details-list {
    list-style: none;
    padding: 0;
  }

  .event-details-list li {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .event-details-list li i {
    color: ${PRIMARY_TEXT};
    margin-right: 1rem;
    font-size: 1.2rem;
  }

  .event-details-list li span {
    color: ${SECONDARY_TEXT};
  }

  .ticket-section {
    background-color: ${THEME_COLOR_LIGHT};
    border-radius: 8px;
    padding: 2rem;
    margin-top: 2rem;
  }

  .ticket-price {
    color: ${THEME_COLOR_LIGHTER};
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .ticket-details {
    color: ${SECONDARY_TEXT};
    margin-bottom: 1.5rem;
  }

  .register-btn {
    background-color: ${PRIMARY_TEXT};
    border-color: ${PRIMARY_TEXT};
    color: ${LIGHT_TEXT};
    padding: 0.75rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .register-btn:hover {
    background-color: ${SECONDARY_TEXT};
    border-color: ${SECONDARY_TEXT};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
  }

  .event-location {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid ${THEME_COLOR_LIGHT};
  }

  .location-title {
    color: ${PRIMARY_TEXT};
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .location-address {
    color: ${SECONDARY_TEXT};
    margin-bottom: 1rem;
  }

  .map-container {
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1rem;
  }

  .event-organizer {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid ${THEME_COLOR_LIGHT};
  }

  .organizer-title {
    color: ${PRIMARY_TEXT};
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .organizer-info {
    color: ${SECONDARY_TEXT};
  }

  .organizer-contact {
    margin-top: 1rem;
  }

  .contact-link {
    color: ${LINK_COLOR};
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .contact-link:hover {
    color: ${PRIMARY_TEXT};
  }

  .event-status-badge {
    background-color: ${THEME_COLOR_LIGHTER};
    color: ${LIGHT_TEXT};
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .event-tags {
    margin-top: 2rem;
  }

  .event-tag {
    background-color: ${THEME_COLOR_LIGHT};
    color: ${PRIMARY_TEXT};
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
    font-size: 0.9rem;
  }

  .event-share {
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
`}</style>