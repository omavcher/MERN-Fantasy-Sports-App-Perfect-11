// Create a new component for payment handling (Payment.js)
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const Payment = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlayers, captain, viceCaptain } = location.state || {};
  const token = localStorage.getItem('token');
  
  // Get entry fee from previous contest selection (you might need to pass this through state)
  const entryFee = location.state?.entryFee || 0;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      // Create order on your backend
      const response = await axios.post(
        `${BASE_URL}/create-order`,
        {
          amount: entryFee * 100, // Convert to paise
          currency: 'INR',
          matchId: matchId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId } = response.data;

      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
        amount: entryFee * 100,
        currency: 'INR',
        name: 'Fantasy Cricket',
        description: `Entry fee for Match ${matchId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment and save team
            const verifyResponse = await axios.post(
              `${BASE_URL}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                selectedPlayers,
                captain,
                viceCaptain,
                matchId,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyResponse.data.success) {
              alert('Payment successful! Team submitted.');
              navigate(`/my-contests/${matchId}`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name', // You can fetch this from user profile
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Error initiating payment');
    }
  };

  return (
    <div className="payment-container">
      <h2>Confirm Your Entry</h2>
      <p>Entry Fee: ₹{entryFee}</p>
      <button onClick={handlePayment} className="pay-button">
        Pay Now
      </button>
    </div>
  );
};

export default Payment;