import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const THEME_COLOR = '#0fa8a8';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/api/blog/');
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

    if (error) {
      return (
        <Container className="py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Container>
      );
    }

    return (
      <Container className="py-4">
        {blogs.length === 0 ? (
          <div className="text-center py-5">
            <h3>No blog posts available yet</h3>
            <p className="text-muted">Check back soon for new content!</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {blogs.map((blog, index) => (
              <Col key={blog.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-100 shadow-sm hover-card">
                    {blog.image && (
                      <div className="event-image-container">
                        <Card.Img 
                          variant="top" 
                          src={blog.image.startsWith('http') ? blog.image : `http://localhost:8000${blog.image}`} 
                          alt={blog.title}
                          className="event-image"
                        />
                      </div>
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5 mb-3">{blog.title}</Card.Title>
                      <Card.Text 
                        className="text-muted mb-3 event-description" 
                        dangerouslySetInnerHTML={{ 
                          __html: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : '') 
                        }} 
                      />

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}
                          </small>
                          {blog.author && (
                            <small className="text-muted">By {blog.author}</small>
                          )}
                        </div>
                        <Button 
                          as={Link} 
                          to={`/blog/${blog.id}`} 
                          variant="dark" 
                          className="w-100 btn-hover-teal"
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">Our Blog 🐾</h1>
          <p className="lead">Stay updated with the latest news, tips, and stories from Paw & Homes</p>
        </Container>
      </div>
      {renderContent()}
      <style jsx global>{`
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
          border-radius: 12px;
          overflow: hidden;
          border: none;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
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

        @media (max-width: 768px) {
          .event-image-container {
            height: 200px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Blog; 