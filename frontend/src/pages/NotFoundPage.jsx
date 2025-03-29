import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/notFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to the homepage
  };

  return (
    <div className="not-found-page">
      <div className="content-container">
        {/* Perfect 11 Logo */}
        <div className="logo-container">
          <div className="shield">
            <span className="number">11</span>
          </div>
          <h1 className="logo-text">PERFECT 11</h1>
        </div>

        {/* 404 Message */}
        <div className="error-message">
          <h2 className="error-code">404</h2>
          <h3 className="error-text">Page Not Found</h3>
          <p className="error-description">
            Oops! The page you're looking for doesn't exist. Let's get you back to the game!
          </p>
        </div>

        {/* Go to Home Button */}
        <button className="home-button" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;