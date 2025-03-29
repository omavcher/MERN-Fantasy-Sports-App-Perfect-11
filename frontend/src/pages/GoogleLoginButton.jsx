import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const GoogleLoginButton = ({ onSuccess }) => {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('invite');

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/google-login', {
        token: credentialResponse.credential,
        inviteCode // Pass the invite code to the backend
      });
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      onSuccess(response.data.user);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
      text="Sign in with Google"
      width="300"
    />
  );
};

export default GoogleLoginButton;