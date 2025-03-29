import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/verifyOTP.css';
import BASE_URL from '../config/BaseUrl';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, isNewUser } = location.state || { email: '', isNewUser: true };
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(51);
  const [name, setName] = useState('');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      alert('Please enter OTP.');
      return;
    }
    if (isNewUser && !name) {
      alert('Please enter your name.');
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/users/signup/verify-otp`, {
        email,
        otp,
        name: isNewUser ? name : undefined
      });
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      alert(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      try {
        await axios.post(`${BASE_URL}/users/signup/send-otp`, { email });
        setTimer(51);
        alert('OTP resent to your email.');
      } catch (error) {
        alert('Failed to resend OTP');
      }
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="logo">
        <img src="logo.png" alt="Perfect 11 Logo" />
        <h1>PERFECT 11</h1>
      </div>
      <div className="verify-otp-box">
        <h2>Verify with OTP</h2>
        <p>OTP sent to your email {email} <a href="/">✏️</a></p>
        {isNewUser && (
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <p className="resend-otp">
          Resend OTP in {timer} s
          {timer === 0 && (
            <span className="resend-link" onClick={handleResend}>
              Resend
            </span>
          )}
        </p>
        <button className="verify-button" onClick={handleVerify}>
          Verify
        </button>
        <p className="support">
          Facing any issue? Please email us at: <a href="mailto:support@my11circle.com">support@my11circle.com</a>
        </p>
      </div>
      <footer className="footer">
        ©2023 Perfect 11 24X7, Ltd. All Rights Reserved
      </footer>
    </div>
  );
};

export default VerifyOTP;