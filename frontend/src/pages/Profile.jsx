import React, { useState, useEffect } from 'react';
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status===401)
        (localStorage.clear(),
    window.location.reload)
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.put("/api/user/", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="avatar-image"
            />
          </div>
          <h1>{user.first_name} {user.last_name}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={user.phone_number}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
              rows="3"
            />
          </div>

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
          padding: 20px;
        }

        .profile-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-avatar {
          margin-bottom: 20px;
        }

        .avatar-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #0b7e7e;
        }

        .profile-header h1 {
          color: #333;
          font-size: 2rem;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .form-input:focus {
          border-color: #0b7e7e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(11, 126, 126, 0.1);
        }

        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .edit-button, .save-button, .cancel-button {
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-button, .save-button {
          background: #0b7e7e;
          color: white;
          border: none;
        }

        .cancel-button {
          background: #fff;
          color: #0b7e7e;
          border: 2px solid #0b7e7e;
        }

        .edit-button:hover, .save-button:hover {
          background: #096666;
          transform: translateY(-1px);
        }

        .cancel-button:hover {
          background: #f5f5f5;
        }

        .error-message {
          background: #ffe6e6;
          color: #d63031;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.2rem;
          color: #0b7e7e;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .profile-container {
            padding: 20px;
          }

          .button-group {
            flex-direction: column;
          }

          .edit-button, .save-button, .cancel-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile; 