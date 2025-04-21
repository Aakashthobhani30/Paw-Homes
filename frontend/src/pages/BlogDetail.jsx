import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import api from '../api';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const THEME_COLOR = '#0fa8a8'; // Using the same theme color as EventDetail component

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await api.get(`/api/blog/${id}/`);
        setBlog(response.data);
        
        // Fetch related blogs (same category or similar tags)
        const relatedResponse = await api.get('/api/blog/');
        // Filter out the current blog and limit to 3 related posts
        const filtered = relatedResponse.data
          .filter(item => item.id !== parseInt(id))
          .slice(0, 3);
        setRelatedBlogs(filtered);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog detail:', error);
        setError('Failed to load blog post. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

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

    if (error || !blog) {
      return (
        <Container className="py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error || 'Blog post not found'}
          </div>
          <Button 
            as={Link} 
            to="/blog" 
            variant="dark"
            style={{ backgroundColor: THEME_COLOR, borderColor: THEME_COLOR }}
          >
            Back to Blog
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
            to="/blog" 
            variant="outline-dark" 
            className="mb-4"
          >
            ← Back to Blog
          </Button>

          <article className="blog-post">
            {/* Blog Information Card at the top */}
            <Card className="shadow-sm mb-4 blog-info-card">
              <Card.Body>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h1 className="blog-title mb-0">{blog.title}</h1>
                  {blog.category && (
                    <span className="badge" style={{ backgroundColor: THEME_COLOR }}>{blog.category}</span>
                  )}
                </div>
                
                <div className="blog-meta mb-3">
                  <span className="text-muted">
                    📅 {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}
                  </span>
                  {blog.author && (
                    <span className="text-muted ms-3">✍️ By {blog.author}</span>
                  )}
                </div>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags mb-3">
                    <h5>Tags:</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Blog Content */}
            <Card className="shadow-sm mb-4">
              {blog.image && (
                <div className="blog-image-container">
                  <img 
                    src={blog.image.startsWith('http') ? blog.image : `http://localhost:8000${blog.image}`}
                    alt={blog.title} 
                    className="img-fluid blog-image"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <Card.Body>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>
              </Card.Body>
            </Card>
          </article>

          {relatedBlogs.length > 0 && (
            <section className="related-blogs mt-5">
              <h3 className="mb-4">Related Posts</h3>
              <Row xs={1} md={3} className="g-4">
                {relatedBlogs.map((relatedBlog, index) => (
                  <Col key={relatedBlog.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-100 shadow-sm blog-card">
                        {relatedBlog.image && (
                          <Card.Img 
                            variant="top" 
                            src={relatedBlog.image.startsWith('http') ? relatedBlog.image : `http://localhost:8000${relatedBlog.image}`}
                            alt={relatedBlog.title}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Body>
                          <Card.Title className="h6">{relatedBlog.title}</Card.Title>
                          <Button 
                            as={Link} 
                            to={`/blog/${relatedBlog.id}`} 
                            variant="link" 
                            className="p-0"
                            style={{ color: THEME_COLOR, textDecoration: 'none' }}
                          >
                            Read More
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          <div className="mt-4">
            <Button 
              as={Link} 
              to="/blog" 
              variant="outline-dark" 
              className="w-100"
            >
              Back to Blogs
            </Button>
          </div>
        </motion.div>

        <style jsx>{`
          .blog-image-container {
            overflow: hidden;
          }
          
          .blog-image {
            width: 100%;
            height: auto;
            object-fit: cover;
          }
          
          .blog-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #333;
          }
          
          .blog-meta {
            color: #666;
            font-size: 0.95rem;
          }
          
          .blog-content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #444;
          }
          
          .blog-tags .badge {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-radius: 50px;
          }
          
          .blog-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            border: none;
          }
          
          .blog-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
          }

          .blog-info-card {
            border-radius: 12px;
            border: none;
          }
          
          @media (max-width: 768px) {
            .blog-title {
              font-size: 1.8rem;
            }
            
            .blog-content {
              font-size: 1rem;
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

export default BlogDetail;