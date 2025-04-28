import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api";
import { setTokens } from "../utils/auth";

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
              src="https://img.freepik.com/free-photo/rescue-dog-enjoying-being-pet-by-woman-shelter_23-2148682929.jpg" // Replace with your actual logo URL
              alt="Paw & Homes Logo" 
              className="logo" 
            />
            <h1>Welcome Back!</h1>
            <p>Your furry friends are waiting for you</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="register-link">
                Don't have an account? 
                <Link to="/register"> Create one</Link>
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
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
          padding: 20px;
        }

        .login-container {
          display: flex;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .login-left {
          flex: 1;
          background: linear-gradient(135deg, #0b7e7e 0%, #0d9a9a 100%);
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .welcome-text {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .logo {
          width: 120px;
          height: 120px;
          margin-bottom: 20px;
          object-fit: contain;
          filter: brightness(0) invert(1); /* Makes the logo white */
        }

        .welcome-text h1 {
          font-size: 2.5rem;
          margin-bottom: 15px;
          font-weight: 600;
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
        }

        .login-form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .login-form-container h2 {
          color: #333;
          font-size: 1.8rem;
          margin-bottom: 30px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-color: #0b7e7e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(11, 126, 126, 0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          cursor: pointer;
        }

        .remember-me input[type="checkbox"] {
          accent-color: #0b7e7e;
        }

        .forgot-password {
          color: #0b7e7e;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #096666;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: #0b7e7e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-button:hover {
          background: #096666;
          transform: translateY(-1px);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          background: #7c9999;
          cursor: not-allowed;
          transform: none;
        }

        .register-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }

        .register-link a {
          color: #0b7e7e;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link a:hover {
          color: #096666;
        }

        .error-message {
          background: #ffe6e6;
          color: #d63031;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            min-height: auto;
          }

          .login-left {
            padding: 30px;
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