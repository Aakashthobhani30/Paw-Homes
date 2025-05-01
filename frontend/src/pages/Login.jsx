import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api";
import { setTokens } from "../utils/auth";

const THEME_COLOR = '#00bcd4'; // Bright Aqua
const THEME_COLOR_LIGHT = '#e0f7fa'; // Pale Aqua
const THEME_COLOR_LIGHTER = '#ffca28'; // Sunny Yellow
const BACKGROUND_COLOR = '#e0f7fa'; // Pale Aqua

// Text colors
const PRIMARY_TEXT = '#333333'; // Dark Gray for main text
const SECONDARY_TEXT = '#666666'; // Medium Gray for secondary text
const LIGHT_TEXT = '#ffffff'; // White
const LINK_COLOR = '#00bcd4'; // Bright Aqua for links and accents
const HEADING_COLOR = '#00bcd4'; // Bright Aqua for headings

const Login = () => {
  
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    setError('');
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      
      // Store both access and refresh tokens
      setTokens(res.data.access, res.data.refresh);

      // Get user data
      const userRes = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      const user = userRes.data;
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="welcome-text">
            <img 
              src="https://img.freepik.com/free-photo/rescue-dog-enjoying-being-pet-by-woman-shelter_23-2148682929.jpg"
              alt="Paw & Homes Logo" 
              className="logo" 
            />
            <h1 style={{ color: HEADING_COLOR }}>Welcome Back!</h1>
            <p style={{ color: SECONDARY_TEXT }}>Your furry friends are waiting for you</p>
          </div>
          <div className="background-pattern"></div>
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <h2 style={{ color: HEADING_COLOR }}>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" style={{ color: PRIMARY_TEXT }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="form-input"
                  style={{ 
                    borderColor: THEME_COLOR_LIGHT,
                    backgroundColor: LIGHT_TEXT
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" style={{ color: PRIMARY_TEXT }}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ 
                    borderColor: THEME_COLOR_LIGHT,
                    backgroundColor: LIGHT_TEXT
                  }}
                />
              </div>

              <div className="form-options">
                <label className="remember-me" style={{ color: SECONDARY_TEXT }}>
                  <input type="checkbox" style={{ accentColor: THEME_COLOR }} /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password" style={{ color: LINK_COLOR }}>
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
                style={{ 
                  backgroundColor: THEME_COLOR,
                  color: LIGHT_TEXT
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="register-link" style={{ color: SECONDARY_TEXT }}>
                Don't have an account? 
                <Link to="/register" style={{ color: LINK_COLOR }}> Create one</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BACKGROUND_COLOR};
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300bcd4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
          z-index: 0;
        }

        .login-container {
          display: flex;
          width: 100%;
          max-width: 1000px;
          background: ${LIGHT_TEXT};
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .login-left {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${THEME_COLOR_LIGHT};
          position: relative;
          overflow: hidden;
        }

        .welcome-text {
          text-align: center;
          z-index: 2;
        }

        .welcome-text h1 {
          font-size: 2.5rem;
          margin-bottom: 15px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .welcome-text p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .login-right {
          flex: 1;
          padding: 40px;
          display: flex;
          align-items: center;
          background: ${LIGHT_TEXT};
        }

        .login-form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .login-form-container h2 {
          font-size: 1.8rem;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid ${THEME_COLOR_LIGHT};
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: ${THEME_COLOR};
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
        }

        .form-input::placeholder {
          color: ${SECONDARY_TEXT};
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          font-size: 0.9rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .remember-me:hover {
          color: ${THEME_COLOR};
        }

        .remember-me input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .forgot-password {
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: ${THEME_COLOR};
          color: ${LIGHT_TEXT};
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover {
          background: ${THEME_COLOR_LIGHTER};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 188, 212, 0.2);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          background: ${SECONDARY_TEXT};
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .register-link {
          text-align: center;
          margin-top: 25px;
          font-size: 0.95rem;
        }

        .register-link a {
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .error-message {
          background: #ffe6e6;
          color: #d63031;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
          border: 1px solid #ffcccc;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            min-height: auto;
            margin: 20px;
          }

          .login-left {
            padding: 30px;
            min-height: 200px;
          }

          .welcome-text h1 {
            font-size: 2rem;
          }

          .login-right {
            padding: 30px;
          }

          .logo {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;