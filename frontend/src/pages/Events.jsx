import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

const BASE_URL = import.meta.env.VITE_API_URL;
const THEME_COLOR = '#0fa8a8';

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
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
        if (error.response?.status===401)
          (localStorage.clear(),
      window.location.reload)
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
          <h1 className="display-4 fw-bold">Pet Events & Activities 🐾</h1>
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

export default Events;
