import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { FaWallet, FaHistory, FaUsers, FaQuestionCircle, FaCog,FaShareAlt , FaEnvelope, FaSignOutAlt, FaTrophy, FaInfoCircle ,FaWhatsapp  } from 'react-icons/fa';
import '../styles/profileDialog.css';
import axios from 'axios';
import BASE_URL from '../../config/BaseUrl';

const ProfileDialog = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('Sidebar');
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const token = localStorage.getItem('token');
  const [userDetail , setUserDetail] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');


  const dialogRef = useRef(null);
  const navigate = useNavigate(); // Add navigation hook

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(response.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };
    fetchMatchDetails();
  }, [token]);

useEffect(() => {
  const fetchInviteData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/invite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInviteCode(response.data.inviteCode);
    } catch (error) {
      console.error('Error fetching invite data:', error);
    }
  };
  
  if (activeSection === 'InviteCollect') {
    fetchInviteData();
  }
}, [activeSection, token]);


  // User data state
  const [user, setUser] = useState({
    username: 'Raj Avengers 16',
    skillScore: 584,
    totalBalance: 39,
    instantCash: 309,
    winnings: 300,
    bonus: 100,
    followers: 2,
    following: 4,
    level: 2,
    contests: 239,
    matches: 167,
    series: 51,
    sports: 167,
    joinDate: 'Jun 2019',
    email: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pinCode: '',
    state: '',
    country: 'India',
  });


  const invites = [
    { id: 1, friend: 'Amit Sharma', status: 'Joined', reward: 50 },
    { id: 2, friend: 'Priya Singh', status: 'Pending', reward: 0 },
  ];

  const champions = {
    level: 'Silver',
    points: 1200,
    nextLevel: 'Gold',
    pointsToNextLevel: 800,
    benefits: ['Exclusive Contests', 'Priority Support', 'Bonus Rewards'],
  };

  const people = [
    { id: 1, username: 'Vikram Patel', skillScore: 620, followers: 15 },
    { id: 2, username: 'Neha Gupta', skillScore: 550, followers: 8 },
    { id: 3, username: 'Rohan Mehta', skillScore: 700, followers: 25 },
  ];

  const howToPlaySteps = [
    { step: 1, title: 'Create an Account', description: 'Sign up with your email or mobile number.' },
    { step: 2, title: 'Join a Contest', description: 'Select a match and join a contest of your choice.' },
    { step: 3, title: 'Build Your Team', description: 'Pick players within the budget to form your team.' },
    { step: 4, title: 'Earn Points', description: 'Score points based on your players’ real-life performance.' },
    { step: 5, title: 'Win Prizes', description: 'Rank high on the leaderboard to win cash prizes.' },
  ];

  const contactInfo = {
    email: 'omawchar07@gmail.com',
    phone: '+91 9890712303',
    faqs: [
      { question: 'How do I withdraw my winnings?', answer: 'Verify your PAN card and bank details, then request a withdrawal from the My Balance section.' },
      { question: 'What is the Champions Club?', answer: 'It’s a loyalty program where you earn points and unlock exclusive benefits.' },
    ],
  };

  const pointsSystem = [
    { action: 'Run Scored', points: 1 },
    { action: 'Wicket Taken', points: 25 },
    { action: 'Catch', points: 8 },
    { action: 'Captain Bonus', points: '2x' },
    { action: 'Vice-Captain Bonus', points: '1.5x' },
  ];

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handleAddCash = async () => {
    if (userDetail?.totalBalance < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }
    
    try {
      const response = await axios.post(
        `${BASE_URL}/users/cashout/`,
        { amount: userDetail?.totalBalance },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Withdrawal request submitted successfully!');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setUser((prev) => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };

  const handleVerifyEmail = () => {
    if (user.email) {
      setIsEmailVerified(true);
      alert('Email verified successfully! (Simulated)');
    } else {
      alert('Please enter an email address to verify.');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully! (Simulated)');
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Close dialog
    setIsOpen(false);
    setTimeout(() => {
      onClose(); // Close the dialog
      navigate('/'); 
    }, 300);
    
    // Optional: Show logout confirmation
    alert('You have been logged out successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleInviteFriend = () => {
    alert('Invite sent! (Simulated)');
  };

  const handleFollowPerson = (personId) => {
    alert(`Followed user with ID ${personId}! (Simulated)`);
  };

  const sendEmailInvite = async () => {
    try {
      if (!friendName || !friendEmail) {
        alert('Please enter your friend\'s name and email');
        return;
      }
  
      await axios.post(`${BASE_URL}/users/invite/send`, {
        email: friendEmail,
        name: friendName
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert('Invite sent successfully!');
      setFriendName('');
      setFriendEmail('');
      setShowEmailForm(false);
      
      // Refresh invite data
      const response = await axios.get(`${BASE_URL}/users/invite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInviteCode(response.data.inviteCode);
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invite: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const shareViaWhatsApp = () => {
    const message = `Join me on Perfect11! Use my invite code ${inviteCode} when you sign up and we both get ₹100 bonus! ${process.env.FRONTEND_URL || window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const shareViaOther = () => {
    const message = `Join me on Perfect11! Use my invite code ${inviteCode} when you sign up and we both get ₹100 bonus!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Perfect11',
        text: message,
        url: window.location.origin,
      }).catch(err => {
        console.log('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${message} ${window.location.origin}`);
      alert('Invite message copied to clipboard!');
    }
  };

  return (
    <div className="profile-dialog-overlay">
      <div className={`profile-dialog ${isOpen ? 'open' : ''}`} ref={dialogRef}>
        {/* Sidebar Menu */}
        {activeSection === 'Sidebar' && (
          <div className="sidebar">
            <div className="profile-header">
              <div className="profile-info">
                <h3>{userDetail?.name}</h3>
                <p>Skill Score: {userDetail?.skillScore}</p>
              </div>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="balance-info">
              <p>Total Balance</p>
              <h2>₹{userDetail?.totalBalance}</h2>
              <button className="add-cash-button" onClick={handleAddCash}>
              Withdrawal Cash
              </button>
              <br></br>
              <button className="view-all" onClick={() => handleSectionChange('MyBalance')}>
                View All
              </button>
            </div>
            <div className="menu-items">
              <div className="menu-item" onClick={() => handleSectionChange('MyBalance')}>
                <FaWallet className="menu-icon" />
                <span>My Balance</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('TransactionHistory')}>
                <FaHistory className="menu-icon" />
                <span>Transaction History</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('InviteCollect')}>
                <FaUsers className="menu-icon" />
                <span>Invite & Collect</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('ChampionsClub')}>
                <FaTrophy className="menu-icon" />
                <span>Champions Club</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('HowToPlay')}>
                <FaQuestionCircle className="menu-icon" />
                <span>How to Play</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('Profile')}>
                <FaCog className="menu-icon" />
                <span>My Info & Settings</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('ContactUs')}>
                <FaEnvelope className="menu-icon" />
                <span>Contact Us</span>
              </div>
              <div className="menu-item" onClick={() => handleSectionChange('FantasyPoints')}>
                <FaInfoCircle className="menu-icon" />
                <span>Fantasy Points System</span>
              </div>
              <div className="menu-item" onClick={handleLogout}>
                <FaSignOutAlt className="menu-icon" />
                <span>Log Out</span>
              </div>
            </div>
            <div className="app-info">
              <p>Version 5.1.0</p>
              <p className="update-status">Up to Date</p>
            </div>
            <div className="help-support">
              <FaQuestionCircle className="help-icon" />
              <span>Help & Support</span>
              <p>FAQs, Chat with us & more</p>
            </div>
          </div>
        )}

        {/* Rest of the sections remain unchanged */}
        {activeSection === 'MyBalance' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>My Balance</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="balance-details">
              <div className="balance-item">
                <h3>Total Balance</h3>
                <p>₹{userDetail?.totalBalance}</p>
              </div>
              <div className="balance-item">
                <h3>Total Winnings</h3>
                <p>₹{userDetail?.winnings}</p>
              </div>
              <button className="add-cash-button" onClick={handleAddCash}>
              Withdrawal Cash
              </button>
            </div>
            <div className="balance-links">
              <button>Update Bank Details</button>
              <button>TDS Dashboard</button>
              <button>My Recent Transactions</button>
              <button>Gift Sent to Gurus</button>
              <button>My Recent Deposits</button>
              <button>My Recent Withdrawals</button>
            </div>
          </div>
        )}

        {activeSection === 'TransactionHistory' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>Transaction History</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="transaction-list">
  {userDetail?.transactionHistory.slice().reverse().map((transaction) => (
    <div key={transaction._id} className="transaction-item">
      <div className="transaction-details">
        <h3>{transaction.type}</h3>
        <p>{new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>
      <div className="transaction-amount">
        <p>₹{transaction.rupees}</p>
        <span className={`status ${transaction.state.toLowerCase()}`}>
          {transaction.state}
        </span>
      </div>
    </div>
  ))}
            </div>
          </div>
        )}

// Replace the Invite & Collect section in ProfileDialog.js with this:

{activeSection === 'InviteCollect' && (
  <div className="dialog-content">
    <div className="content-header">
      <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
      <h2>Invite & Collect</h2>
      <button className="close-button" onClick={handleClose}>×</button>
    </div>
    <div className="invite-section">
      <div className="invite-card">
        <h3>Invite Friends, Earn ₹100 Each!</h3>
        <p>Share your invite code and get ₹100 when they join and play their first contest.</p>
        
        <div className="invite-code-container">
          <input 
            type="text" 
            value={inviteCode} 
            readOnly 
            className="invite-code"
          />
          <button 
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(inviteCode);
              alert('Invite code copied to clipboard!');
            }}
          >
            Copy
          </button>
        </div>
        
        <div className="invite-methods">
          <button className="invite-method" onClick={() => setShowEmailForm(true)}>
            <FaEnvelope /> Email
          </button>
          <button className="invite-method" onClick={shareViaWhatsApp}>
            <FaWhatsapp /> WhatsApp
          </button>
          <button className="invite-method" onClick={shareViaOther}>
            <FaShareAlt /> Other
          </button>
        </div>
        
        {showEmailForm && (
          <div className="email-invite-form">
            <h4>Send Invite via Email</h4>
            <input
              type="text"
              placeholder="Friend's Name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Friend's Email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
            <div className="form-actions">
              <button onClick={sendEmailInvite}>Send Invite</button>
              <button onClick={() => setShowEmailForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="invite-stats">
        <div className="stat-item">
          <h4>Total Invites</h4>
          <p>{userDetail?.invitedFriends?.length || 0}</p>
        </div>
        <div className="stat-item">
          <h4>Accepted</h4>
          <p>{userDetail?.invitedFriends?.filter(f => f.status === 'accepted').length || 0}</p>
        </div>
        <div className="stat-item">
          <h4>Earned</h4>
          <p>₹{userDetail?.invitedFriends?.reduce((sum, f) => sum + (f.reward || 0), 0) || 0}</p>
        </div>
      </div>
      
      <h3 className="invites-list-title">Your Invites</h3>
      <div className="invite-list">
        {userDetail?.invitedFriends?.length > 0 ? (
          userDetail.invitedFriends.map((invite, index) => (
            <div key={index} className="invite-item">
              <div className="invite-details">
                <h4>{invite.name}</h4>
                <p>{invite.email}</p>
              </div>
              <div className="invite-status">
                <span className={`status ${invite.status.toLowerCase()}`}>
                  {invite.status}
                </span>
                {invite.reward > 0 && (
                  <span className="reward">+₹{invite.reward}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-invites">You haven't invited anyone yet.</p>
        )}
      </div>
    </div>
  </div>
)}

        {activeSection === 'ChampionsClub' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>Champions Club</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="champions-club">
              <div className="club-level">
              <h3>
  Your Level: {userDetail?.championsClub.yourLevel
    ? userDetail.championsClub.yourLevel.charAt(0).toUpperCase() + userDetail.championsClub.yourLevel.slice(1)
    : ""}
</h3>
                <p>Points: {userDetail.championsClub.points}</p>
              </div>
              <div className="club-benefits">
                <h3>Benefits</h3>
                <ul>
                  {champions.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'FindPeople' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>Find People</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="people-list">
              {people.map((person) => (
                <div key={person.id} className="person-item">
                  <div className="person-details">
                    <h3>{person.username}</h3>
                    <p>Skill Score: {person.skillScore}</p>
                    <p>Followers: {person.followers}</p>
                  </div>
                  <button
                    className="follow-button"
                    onClick={() => handleFollowPerson(person.id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'HowToPlay' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>How to Play</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="how-to-play">
              {howToPlaySteps.map((step) => (
                <div key={step.step} className="step-item">
                  <h3>Step {step.step}: {step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'ContactUs' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>Contact Us</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="contact-us">
              <div className="contact-info">
                <h3>Contact Information</h3>
                <p>Email: {contactInfo.email}</p>
                <p>Phone: {contactInfo.phone}</p>
              </div>
              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                {contactInfo.faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'FantasyPoints' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>Fantasy Points System</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="points-system">
              {pointsSystem.map((point, index) => (
                <div key={index} className="point-item">
                  <h3>{point.action}</h3>
                  <p>{point.points}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'Profile' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Sidebar')}>←</button>
              <h2>{userDetail?.name}</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="profile-details">
              <div className="profile-header">
                <div className="profile-info">
                  <h3>{userDetail?.name}</h3>
                  <p>Skill Score: {userDetail?.skillScore}</p>
                </div>
              </div>
              <h3 style={{color:'black'}}>Playing History</h3>
              <div className="history-stats">
                <div className="stat">
                  <p>Contests</p>
                  <h4>{userDetail?.playingHistory.contests}</h4>
                </div>
                <div className="stat">
                  <p>Matches</p>
                  <h4>{userDetail?.playingHistory.matches}</h4>
                </div>
                <div className="stat">
                  <p>Series</p>
                  <h4>{userDetail?.playingHistory.series}</h4>
                </div>
                <div className="stat">
                  <p>Sports</p>
                  <h4>{userDetail?.playingHistory.sports}</h4>
                </div>
              </div>
              <p className="join-date">
  You have been playing on Perfect11 since {userDetail?.joinDate 
    ? new Date(userDetail.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : ""}
</p>
              <button className="edit-profile-button" onClick={() => handleSectionChange('EditProfile')}>
                Profile
              </button>
            </div>
          </div>
        )}

        {activeSection === 'EditProfile' && (
          <div className="dialog-content">
            <div className="content-header">
              <button className="back-button" onClick={() => handleSectionChange('Profile')}>←</button>
              <h2>Edit Profile</h2>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <form className="edit-profile-form" onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Name as on PAN Card</label>
                <input
                  type="text"
                  name="username"
                  value={userDetail?.name}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="email-input-group">
                  <input
                    type="email"
                    name="email"
                    value={userDetail?.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    disabled={isEmailVerified}
                    
                  />
                  
                  {<span className="verified-label">Verified</span>}
                </div>
              </div>
            
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDialog;