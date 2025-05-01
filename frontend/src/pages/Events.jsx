import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Alert } from 'react-bootstrap';
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

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/events/');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const upcoming = [];
        const past = [];
  
        data.forEach(event => {
          const eventDate = new Date(event.date);
          if (eventDate >= today) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });
  
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  

  const filterAndSearch = (list) => {
    return list.filter(event => {
      const matchesSearch = (event.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.location || '').toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (dateFilter) {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        matchesDate = eventDate === dateFilter;
      }

      return matchesSearch && matchesDate;
    });
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours = '00', minutes = '00', seconds = '00'] = timeString.split(':');
    return new Date(`2000-01-01T${hours}:${minutes}:${seconds}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEventCard = (event) => {
    const isEventPast = new Date(event.date) < new Date().setHours(0, 0, 0, 0);
    
    return (
      <Card className="h-100 shadow-sm hover-card">
        <div className="event-image-container">
          <Card.Img
            variant="top"
            src={event.image ? `${BASE_URL}${event.image}` : '/placeholder-event.jpg'}
            alt={event.title || 'Event Image'}
            className="event-image"
            onError={(e) => { e.target.src = '/placeholder-event.jpg'; }}
          />
        </div>
        <Card.Body>
          <Card.Title className="h5 mb-1">{event.name || 'Untitled Event'}</Card.Title>
          <p className="text-muted mb-2 small">
            📅 {formatDate(event.date)} <br />
            🕒 {formatTime(event.time)} <br />
          </p>
          <p className="text-muted mb-2 small">
            📍 {event.location || 'Location not specified'}
          </p>
          <Card.Text className="event-description">
            {event.description || 'No description available.'}
          </Card.Text>
        </Card.Body>
        {!isEventPast && (
          <Card.Footer className="bg-white border-top-0">
            <Button 
              as={Link} 
              to={`/events/${event.id}`} 
              variant="dark" 
              className="w-100 btn-hover-teal"
            >
              Book Ticket
            </Button>
          </Card.Footer>
        )}
      </Card>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold white-paw-emoji">Pet Events & Activities 🐾</h1>
          <p className="lead">Join us for exciting pet-related events and make new furry friends!</p>
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
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-focus"
                />
              </Col>
              <Col lg={6} md={12}>
                <Form.Control
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-focus"
                />
                {dateFilter && (
                  <Button 
                    variant="link" 
                    className="position-absolute end-0 top-50 translate-middle-y" 
                    style={{ marginRight: '15px', padding: '0', color: THEME_COLOR }}
                    onClick={() => setDateFilter('')}
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
          <>
            <h2 className="mb-3">📅 Upcoming Events</h2>
            <Row className="mb-5">
              {filterAndSearch(upcomingEvents).length > 0 ? (
                filterAndSearch(upcomingEvents).map(event => (
                  <Col key={event.id} lg={4} md={6} className="mb-4">
                    {renderEventCard(event)}
                  </Col>
                ))
              ) : (
                <Col><p className="text-muted">No upcoming events found.</p></Col>
              )}
            </Row>

            <h2 className="mb-3">🕓 Past Events</h2>
            <Row>
              {filterAndSearch(pastEvents).length > 0 ? (
                filterAndSearch(pastEvents).map(event => (
                  <Col key={event.id} lg={4} md={6} className="mb-4">
                    {renderEventCard(event)}
                  </Col>
                ))
              ) : (
                <Col><p className="text-muted">No past events found.</p></Col>
              )}
            </Row>
          </>
        )}
      </Container>

      <style jsx global>{`
        .hover-shadow-lg:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 188, 212, 0.15) !important;
          transform: translateY(-5px);
        }

        .transition-shadow {
          transition: box-shadow 0.3s ease-in-out;
        }

        .btn-meet, .btn-register {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          transition: all 0.3s ease;
        }

        .btn-meet:hover, .btn-register:hover {
          background-color: ${SECONDARY_TEXT};
          border-color: ${SECONDARY_TEXT};
          color: ${LIGHT_TEXT} !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }

        .filter-focus:focus {
          border-color: ${PRIMARY_TEXT};
          box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
        }

        .badge.bg-info { 
          background-color: ${PRIMARY_TEXT} !important;
          color: ${LIGHT_TEXT};
        }

        .badge.bg-secondary { 
          background-color: ${THEME_COLOR_LIGHTER} !important;
          color: ${LIGHT_TEXT};
        }

        .event-card {
          border: 1px solid ${THEME_COLOR_LIGHT};
          transition: all 0.3s ease;
        }

        .event-card:hover {
          border-color: ${PRIMARY_TEXT};
          box-shadow: 0 0.5rem 1rem rgba(0, 188, 212, 0.15);
        }

        .event-name {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
        }

        .event-date {
          color: ${SECONDARY_TEXT};
        }

        .event-price {
          color: ${THEME_COLOR_LIGHTER};
          font-weight: 600;
        }

        .event-description {
          color: ${PRIMARY_TEXT};
        }

        .modal-header {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
        }

        .modal-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
        }

        .modal-body {
          background-color: ${LIGHT_TEXT};
        }

        .event-detail-label {
          color: ${PRIMARY_TEXT};
          font-weight: 500;
        }

        .event-detail-value {
          color: ${SECONDARY_TEXT};
        }

        .register-btn {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          transition: all 0.3s ease;
        }

        .register-btn:hover {
          background-color: ${SECONDARY_TEXT};
          border-color: ${SECONDARY_TEXT};
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
        }

        .filter-card {
          background-color: ${LIGHT_TEXT};
          border: 1px solid ${THEME_COLOR_LIGHT};
        }

        .filter-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
        }

        .filter-label {
          color: ${SECONDARY_TEXT};
        }

        .form-check-input:checked {
          background-color: ${PRIMARY_TEXT};
          border-color: ${PRIMARY_TEXT};
        }

        .form-check-input:focus {
          border-color: ${PRIMARY_TEXT};
          box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25);
        }

        .no-events-message {
          color: ${PRIMARY_TEXT};
          text-align: center;
          padding: 2rem;
        }

        .loading-spinner {
          color: ${PRIMARY_TEXT};
        }

        .error-message {
          color: ${PRIMARY_TEXT};
          text-align: center;
          padding: 2rem;
        }

        .event-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px 8px 0 0;
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .event-card:hover .event-image {
          transform: scale(1.05);
        }

        .event-meta {
          padding: 1rem;
        }

        .event-category-badge {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          display: inline-block;
        }

        .event-location {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .event-actions {
          padding: 1rem;
          border-top: 1px solid ${THEME_COLOR_LIGHT};
        }

        .event-status {
          color: ${THEME_COLOR_LIGHTER};
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .event-ticket-info {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </Layout>
  );
};

export default Events;
