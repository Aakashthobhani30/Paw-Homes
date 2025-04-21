import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import api from '../api';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

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
          <Spinner animation="border" role="status" variant="primary">
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
          <Button as={Link} to="/blog" variant="primary">
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
            variant="outline-primary" 
            className="mb-4"
          >
            ← Back to Blog
          </Button>

          <article className="blog-post">
            {blog.image && (
              <div className="blog-image-container mb-4">
                <img 
                  src={blog.image.startsWith('http') ? blog.image : `http://localhost:8000${blog.image}`}
                  alt={blog.title} 
                  className="img-fluid rounded blog-image"
                />
              </div>
            )}

            <header className="blog-header mb-4">
              <h1 className="blog-title">{blog.title}</h1>
              <div className="blog-meta d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}
                  </span>
                  {blog.author && (
                    <span className="text-muted ms-3">By {blog.author}</span>
                  )}
                </div>
                {blog.category && (
                  <span className="badge bg-primary">{blog.category}</span>
                )}
              </div>
            </header>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>


            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags mt-4">
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
                            className="p-0 text-decoration-none"
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
        </motion.div>

        <style jsx>{`
          .blog-image-container {
            max-height: 500px;
            overflow: hidden;
            border-radius: 12px;
          }
          
          .blog-image {
            width: 100%;
            height: auto;
            object-fit: cover;
          }
          
          .blog-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1rem;
          }
          
          .blog-meta {
            color: #666;
            font-size: 0.9rem;
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
          
          .btn-outline-primary {
            border-color: #0b7e7e;
            color: #0b7e7e;
          }
          
          .btn-outline-primary:hover {
            background-color: #0b7e7e;
            color: white;
          }
          
          .badge.bg-primary {
            background-color: #0b7e7e !important;
          }
          
          @media (max-width: 768px) {
            .blog-title {
              font-size: 2rem;
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