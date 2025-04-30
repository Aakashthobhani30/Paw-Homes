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
              src="https://img.freepik.com/free-photo/rescue-dog-enjoying-being-pet-by-woman-shelter_23-2148682929.jpg"
              alt="Paw & Homes Logo" 
              className="logo" 
            />
            <h1>Welcome Back!</h1>
            <p>Your furry friends are waiting for you</p>
          </div>
          <div className="background-pattern"></div>
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
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
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230b7e7e' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
          z-index: 0;
        }

        .login-container {
          display: flex;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          max-width: 1000px;
          min-height: 600px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .login-container:hover {
          transform: translateY(-5px);
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

        .background-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.1;
        }

        .welcome-text {
          text-align: center;
          position: relative;
          z-index: 1;
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo {
          width: 120px;
          height: 120px;
          margin-bottom: 20px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
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
          background: white;
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
          color: #333;
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
          color: #555;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          border-color: #0b7e7e;
          outline: none;
          box-shadow: 0 0 0 3px rgba(11, 126, 126, 0.1);
          background: white;
        }

        .form-input::placeholder {
          color: #999;
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
          color: #666;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .remember-me:hover {
          color: #0b7e7e;
        }

        .remember-me input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #0b7e7e;
          cursor: pointer;
        }

        .forgot-password {
          color: #0b7e7e;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .forgot-password:hover {
          color: #096666;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: #0b7e7e;
          color: white;
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
          background: #096666;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(11, 126, 126, 0.2);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          background: #7c9999;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .register-link {
          text-align: center;
          margin-top: 25px;
          color: #666;
          font-size: 0.95rem;
        }

        .register-link a {
          color: #0b7e7e;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .register-link a:hover {
          color: #096666;
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