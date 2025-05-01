import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
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
        </motion.div>

        <style jsx global>{`
          .blog-detail-container {
            background-color: ${BACKGROUND_COLOR};
            min-height: 100vh;
            padding: 2rem 0;
          }

          .blog-detail-header {
            background-color: ${PRIMARY_TEXT};
            color: ${LIGHT_TEXT};
            padding: 3rem 0;
            margin-bottom: 2rem;
          }

          .blog-detail-title {
            color: ${LIGHT_TEXT};
            font-weight: 700;
            margin-bottom: 1rem;
          }

          .blog-detail-meta {
            color: ${LIGHT_TEXT};
            opacity: 0.9;
          }

          .blog-detail-content {
            background-color: ${LIGHT_TEXT};
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
            padding: 2rem;
          }

          .blog-detail-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .blog-detail-text {
            color: ${PRIMARY_TEXT};
            line-height: 1.8;
            margin-bottom: 2rem;
          }

          .blog-detail-author {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid ${THEME_COLOR_LIGHT};
          }

          .author-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .author-info {
            color: ${SECONDARY_TEXT};
          }

          .author-bio {
            margin-top: 1rem;
          }

          .blog-detail-categories {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid ${THEME_COLOR_LIGHT};
          }

          .categories-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .category-tag {
            background-color: ${THEME_COLOR_LIGHT};
            color: ${PRIMARY_TEXT};
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            display: inline-block;
            font-size: 0.9rem;
          }

          .blog-detail-tags {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid ${THEME_COLOR_LIGHT};
          }

          .tags-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .tag-item {
            background-color: ${THEME_COLOR_LIGHT};
            color: ${PRIMARY_TEXT};
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            display: inline-block;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .tag-item:hover {
            background-color: ${PRIMARY_TEXT};
            color: ${LIGHT_TEXT};
          }

          .blog-detail-share {
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

          .blog-detail-comments {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid ${THEME_COLOR_LIGHT};
          }

          .comments-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .comment-card {
            background-color: ${THEME_COLOR_LIGHT};
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .comment-author {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
          }

          .comment-date {
            color: ${SECONDARY_TEXT};
            font-size: 0.9rem;
          }

          .comment-content {
            color: ${SECONDARY_TEXT};
            margin-top: 0.5rem;
          }

          .comment-form {
            margin-top: 2rem;
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

          .submit-comment-btn {
            background-color: ${PRIMARY_TEXT};
            border-color: ${PRIMARY_TEXT};
            color: ${LIGHT_TEXT};
            padding: 0.75rem 2rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .submit-comment-btn:hover {
            background-color: ${SECONDARY_TEXT};
            border-color: ${SECONDARY_TEXT};
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
          }

          .related-posts {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid ${THEME_COLOR_LIGHT};
          }

          .related-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .related-post-card {
            background-color: ${LIGHT_TEXT};
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.1);
            transition: all 0.3s ease;
            border: 1px solid ${THEME_COLOR_LIGHT};
          }

          .related-post-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
            border-color: ${PRIMARY_TEXT};
          }

          .related-post-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
          }

          .related-post-title {
            color: ${PRIMARY_TEXT};
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .related-post-date {
            color: ${SECONDARY_TEXT};
            font-size: 0.9rem;
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