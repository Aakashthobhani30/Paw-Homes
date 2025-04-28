import React, { useEffect } from 'react'; 
import { Container, Row, Col, Card } from 'react-bootstrap';
import Layout from '../components/Layout';

const THEME_COLOR = '#0fa8a8';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const aboutSections = [
    {
      title: "Our Story",
      description: "Founded in 2020, Paw & Homes began with a simple mission: to create a bridge between loving homes and pets in need. What started as a small local initiative has grown into a comprehensive pet care and adoption center.",
      image: "https://img.freepik.com/free-photo/young-woman-hugging-her-pitbull_23-2149131407.jpg",
      details: [
        "Started with a team of passionate animal lovers",
        "Helped hundreds of pets find their forever homes",
        "Expanded to offer comprehensive pet care services",
        "Built strong community relationships"
      ]
    },
    {
      title: "Our Mission",
      description: "We are dedicated to providing exceptional care for pets and supporting pet owners in our community. Our commitment to animal welfare drives everything we do.",
      image: "https://img.freepik.com/free-photo/young-woman-hugging-her-dog_23-2148345895.jpg",
      details: [
        "Finding loving homes for every pet in need",
        "Providing high-quality pet care services",
        "Educating about responsible pet ownership",
        "Supporting animal welfare initiatives"
      ]
    },
    {
      title: "Our Team",
      description: "Our team consists of dedicated professionals who are passionate about animal welfare. From veterinarians to pet care specialists, we work together to ensure the best care for your pets.",
      image: "https://media.assettype.com/freepressjournal/2025-01-04/6b9j6w23/Pet-fed-4.JPG",
      details: [
        "Experienced veterinarians",
        "Certified pet trainers",
        "Caring adoption coordinators",
        "Professional groomers"
      ]
    }
  ];

  return (
    <Layout>
      <div style={{ backgroundColor: THEME_COLOR }} className="text-white text-center py-5 mb-4">
        <Container>
          <h1 className="display-4 fw-bold">About Paw & Homes 🐾</h1>
          <p className="lead">Creating Happy Tales, One Paw at a Time</p>
        </Container>
      </div>

      <Container className="py-4">
        {aboutSections.map((section, index) => (
          <Card key={index} className="mb-4 shadow-sm hover-card">
            <Card.Body className="p-4">
              <Row className={`align-items-center ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <Col lg={6} className="mb-4 mb-lg-0">
                  <div className="event-image-container">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="event-image"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x400?text=Paw+%26+Homes';
                      }}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <h2 className="h2 mb-4">{section.title}</h2>
                  <p className="lead mb-4">{section.description}</p>
                  <ul className="feature-list">
                    {section.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}

        {/* Contact Section */}
        <Card className="mb-4 shadow-sm hover-card">
          <Card.Body className="p-4">
            <h2 className="h2 mb-4 text-center">Get in Touch</h2>
            <p className="lead mb-4 text-center">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="contact-info text-left">
              <p><strong>📍 Location:</strong> Comming Soon....</p>
              <p><strong>📞 Phone:</strong> (+91) 9904127855</p>
              <p><strong>✉️ Email:</strong> info@pawandhomes.com</p>
              <p><strong>⏰ Working Hours:</strong><br /> Monday-Friday: 9:00 AM - 8:00 PM
              <br />Saturday-Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <style jsx global>{`
        .event-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
          border-radius: 8px;
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

        .feature-list {
          list-style: none;
          padding-left: 0;
        }

        .feature-list li {
          padding: 8px 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .feature-list li::before {
          content: "•";
          color: ${THEME_COLOR};
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .contact-info {
          max-width: 500px;
          margin: 0 auto;
        }

        .contact-info p {
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .event-image-container {
            height: 300px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default About; 