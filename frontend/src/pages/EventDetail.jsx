import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Image, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#0fa8a8';

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