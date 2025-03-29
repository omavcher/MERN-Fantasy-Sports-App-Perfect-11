import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/signIn.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!email) {
      alert('Please enter an email address.');
      return;
    }
    if (!isOver18) {
      alert('Please confirm that you are 18+ years in age.');
      return;
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/users/signup/send-otp`, { email });
      navigate('/verify-otp', { state: { email, isNewUser: response.data.isNewUser } });
    } catch (error) {
      alert('Failed to send OTP');
    }
  };

  const handleGoogleSuccess = (user) => {
    if (!isOver18) {
      alert('Please confirm that you are 18+ years in age.');
      return;
    }
    navigate('/home');
  };

  const REACT_APP_GOOGLE_CLIENT_ID = "273920667679-85i343d6q2eibbc7e597ougsflo7u6c0.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="signin-container">
        <div className="logo">
          <span>PERFECT 11</span>
        </div>
        <div className="signin-box">
          <h2>Login/Signup</h2>
          <div className="input-group">
            <span className="email-icon">✉️</span>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="continue-button" onClick={handleContinue}>
            CONTINUE
          </button>
          <div className="google-login">
            <GoogleLoginButton onSuccess={handleGoogleSuccess} />
          </div>
          <label className="age-confirmation">
            <input
              type="checkbox"
              checked={isOver18}
              onChange={() => setIsOver18(!isOver18)}
            />
            <span>I confirm that I am 18+ years in age</span>
          </label>
          <p className="terms">
            <span className="age-icon">18+</span> By continuing, you accept you are 18+ & agree to our{' '}
            <a href="/terms">T&C</a> & <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
        <footer className="footer">
          ©2023 Perfect 11 24X7, Ltd. All Rights Reserved
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;