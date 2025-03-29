import React, { useEffect, useState } from 'react';
import '../styles/loadingPage.css';

const LoadingPage = () => {
  const [isVisible, setIsVisible] = useState(true);
    const t = 5000; // 3 seconds delay
  // Simulate a loading effect (e.g., hide the loading page after 3 seconds)
  useEffect(() => {
    const timer = setTimeout((t) => {
      setIsVisible(false);
    }, t); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null; // Hide the loading page after the timer

  return (
    <div className="loading-page">
      <div className="logo-container">
        <div className="shield">
          <span className="number">11</span>
        </div>
        <h1 className="logo-text">PERFECT 11</h1>
      </div>
    </div>
  );
};

export default LoadingPage;