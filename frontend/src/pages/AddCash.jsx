import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/addCash.css';

const AddCash = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0); // User input amount (what they pay)
  const [gst, setGst] = useState(0); // GST amount (18%)
  const [depositAmount, setDepositAmount] = useState(0); // Final amount credited after GST deduction

  // Preset amounts for quick selection
  const presetAmounts = [100, 500, 1000, 5000];

  // GST calculation (18% GST deducted from the input amount)
  const calculateGstAndDeposit = (value) => {
    const gstValue = (value * 0.18).toFixed(2); // 18% GST
    const depositValue = (parseFloat(value) - parseFloat(gstValue)).toFixed(2); // Amount after GST deduction
    setAmount(value);
    setGst(gstValue);
    setDepositAmount(depositValue);
  };

  // Handle input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      calculateGstAndDeposit(value);
    }
  };

  // Handle preset amount click
  const handlePresetClick = (presetValue) => {
    calculateGstAndDeposit(presetValue);
  };

  // Razorpay integration
  const handleAddCash = () => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: amount * 100, // User pays the original amount (in paise)
      currency: 'INR',
      name: 'Add Cash',
      description: 'Add cash to wallet',
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        navigate('/wallet'); // Redirect to wallet page after payment
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="add-cash-wrapper">
      <div className="add-cash-container">
        {/* Header */}
        <div className="header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2>Add Cash</h2>
        </div>

        {/* Total Balance Section */}
        <div className="balance-section">
          <p className="section-title">Total Balance</p>
          <h3>₹350.23</h3>
        </div>

        {/* Amount Input Section */}
        <div className="amount-section">
          <p className="section-title">Amount to Add</p>
          <input
            type="number"
            value={amount || ''}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="amount-input"
          />
        </div>

        {/* Preset Amounts */}
        <div className="preset-amounts">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              className={`preset-btn ${amount === preset ? 'active' : ''}`}
              onClick={() => handlePresetClick(preset)}
            >
              ₹{preset}
            </button>
          ))}
        </div>

        {/* GST and Deposit Breakdown */}
        <div className="gst-breakdown">
          <div className="breakdown-item">
            <span>Amount Paid</span>
            <span>₹{amount || 0}</span>
          </div>
          <div className="breakdown-item">
            <span>Gov Tax (18% GST)</span>
            <span>-₹{gst}</span>
          </div>
          <div className="breakdown-item total">
            <span>Deposit Amount</span>
            <span>₹{depositAmount}</span>
          </div>
        </div>

        {/* Add Cash Button */}
        <button className="add-cash-btn" onClick={handleAddCash}>
          Add Cash with Razorpay
        </button>

        {/* Current Balance and Withdrawal Section */}
        <div className="balance-details">
          <div className="balance-item">
            <p className="section-title">Winnings</p>
            <h4>₹331.13</h4>
            <button className="withdraw-btn">Withdraw Instantly</button>
          </div>
          <div className="balance-item">
            <p className="section-title">Cash Bonus</p>
            <h4>₹19.1</h4>
            <p className="bonus-info">
              Maximum usable Cash Bonus per match = 10% of Entry Fees{' '}
              <span className="know-more">Know more</span>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="additional-links">
          <p className="link-item">My Recent Transactions</p>
          <p className="link-item">Manage Payments</p>
          <p className="link-subitem">Add/Remove Cards, Wallets, etc.</p>
          <p className="link-item">KYC Details</p>
          <p className="link-item">Refer and Earn</p>
          <p className="link-subitem">Invite a friend and collect up to ₹500 cash bonus</p>
          <p className="help-link">Have a question about your balance? Get help</p>
        </div>
      </div>
    </div>
  );
};

export default AddCash;