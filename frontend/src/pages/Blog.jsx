import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#00bcd4'; // Bright Aqua
const SECONDARY_TEXT = '#008ba3'; // Darker Aqua
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#ffca28'; // Sunny Yellow

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // <-- Scroll to top when page loads
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
          <h1 className="display-4 fw-bold white-paw-emoji">Our Blog 🐾</h1>
          <p className="lead">Stay updated with the latest news, tips, and stories from Paw & Homes</p>
        </Container>
      </div>
      {renderContent()}
      <style jsx global>{`
        .blog-container {
          background-color: ${BACKGROUND_COLOR};
          min-height: 100vh;
          padding: 2rem 0;
        }

        .blog-header {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
          padding: 3rem 0;
          margin-bottom: 2rem;
        }

        .blog-title {
          color: ${LIGHT_TEXT};
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .blog-meta {
          color: ${LIGHT_TEXT};
          opacity: 0.9;
        }

        .blog-card {
          background-color: ${LIGHT_TEXT};
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
          transition: all 0.3s ease;
          border: 1px solid ${THEME_COLOR_LIGHT};
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
          border-color: ${PRIMARY_TEXT};
        }

        .blog-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }

        .blog-content {
          padding: 1.5rem;
        }

        .blog-post-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .blog-post-excerpt {
          color: ${SECONDARY_TEXT};
          margin-bottom: 1rem;
        }

        .blog-post-meta {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
        }

        .blog-category {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .blog-author {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
        }

        .blog-date {
          color: ${SECONDARY_TEXT};
        }

        .blog-read-more {
          color: ${LINK_COLOR};
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .blog-read-more:hover {
          color: ${PRIMARY_TEXT};
        }

        .blog-pagination {
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

        .blog-search {
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

        .blog-categories {
          margin-bottom: 2rem;
        }

        .category-list {
          list-style: none;
          padding: 0;
        }

        .category-item {
          margin-bottom: 0.5rem;
        }

        .category-link {
          color: ${SECONDARY_TEXT};
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .category-link:hover {
          color: ${PRIMARY_TEXT};
        }

        .blog-tags {
          margin-top: 2rem;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-item {
          background-color: ${THEME_COLOR_LIGHT};
          color: ${PRIMARY_TEXT};
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .tag-item:hover {
          background-color: ${PRIMARY_TEXT};
          color: ${LIGHT_TEXT};
        }

        .blog-sidebar {
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

        .recent-posts {
          list-style: none;
          padding: 0;
        }

        .recent-post-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid ${THEME_COLOR_LIGHT};
        }

        .recent-post-title {
          color: ${PRIMARY_TEXT};
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .recent-post-date {
          color: ${SECONDARY_TEXT};
          font-size: 0.9rem;
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