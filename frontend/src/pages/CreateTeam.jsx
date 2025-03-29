import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/createTeam.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const CreateTeam = () => {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { prizePool: prizePoolRaw, selectedPlayers, captain, viceCaptain } = location.state || {};
  const [matchDetails, setMatchDetails] = useState(null);
  const [contestDetails, setContestDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const contests = [
    { id: 1, prizePool: 30000000, entryFee: 29, originalFee: 39, spotsLeft: 309877, totalSpots: 478632, additionalPrize: '₹ 7 Lakhs', entries: 6 },
    { id: 2, prizePool: 20000000, entryFee: 19, originalFee: 29, spotsLeft: 250000, totalSpots: 500000, additionalPrize: '₹ 5 Lakhs', entries: 4 },
    { id: 3, prizePool: 140000000, entryFee: 59, originalFee: 69, spotsLeft: 450000, totalSpots: 600000, additionalPrize: '₹ 10 Lakhs', entries: 8 },
    { id: 4, prizePool: 200000000, entryFee: 65, originalFee: 89, spotsLeft: 500000, totalSpots: 625000, additionalPrize: '₹ 15 Lakhs', entries: 10 },
  ];


  useEffect(() => {
    const fetchUserDetails = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        alert('Please login to proceed. Redirecting to login in 5 seconds...');
        setTimeout(() => navigate('/login'), 5000);
        return;
      }
      const sampleUser = { name: 'John Doe', email: 'john.doe@example.com', token: storedUser.token || 'sample-token-123' };
      setUser(sampleUser);
    };

    const fetchMatchDetails = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`${BASE_URL}/matches/upcoming/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchDetails(response.data.upcomingMatches[0]);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Ensure prizePool is a number and find the contest
    if (prizePoolRaw) {
      const prizePool = Number(prizePoolRaw); // Convert to number explicitly
      const selectedContest = contests.find((c) => {
        return c.prizePool === prizePool;
      });
      if (selectedContest) {
        setContestDetails(selectedContest);
      } else {
      }
    } else {
    }

    fetchUserDetails();
    fetchMatchDetails();
  }, [matchId, navigate, prizePoolRaw]);

  const calculateTimeLeft = () => {
    if (!matchDetails) return 'Loading...';
    const matchDateTime = new Date(`${matchDetails.date} ${matchDetails.time}`);
    const now = new Date();
    const diffMs = matchDateTime - now;
    return diffMs <= 0 ? 'Match Started' : `${Math.floor(diffMs / (1000 * 60 * 60))}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m Left`;
  };

  const formatPrizePool = (amount) => {
    return amount >= 10000000 ? `₹ ${amount / 10000000} CRORES` : `₹ ${amount / 100000} Lakhs`;
  };

  const handlePayment = async () => {  
    if (!user) {
      alert('Please login to proceed with payment. Redirecting to login in 5 seconds...');
      setTimeout(() => navigate('/login'), 5000);
      return;
    }
  
    if (!contestDetails || !window.Razorpay) {
      alert('Payment service is not available or contest details are missing. Please try again later.');
      return;
    }
  
    setLoading(true);
  
    const options = {
      key: 'rzp_test_y6rhmgP580s3Yc',
      amount: contestDetails.entryFee * 100,
      currency: 'INR',
      name: 'PERFECT 11',
      description: `Entry Fee for ${formatPrizePool(contestDetails.prizePool)} Contest`,
      handler: async (response) => {
        try {
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            amount: contestDetails.entryFee,
            matchId,
            contestId: contestDetails.id,
            selectedPlayers,
            captain,
            viceCaptain,
            matchDetails,
          };
          const saveResponse = await axios.post(`${BASE_URL}/matches/teams/save`, paymentData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert('Team saved successfully!');
          const paymentId = saveResponse.data.team.paymentId;
          navigate(`/playground/${matchId}/${paymentId}`);
        } catch (error) {
          alert('Failed to save team: ' + (error.response?.data?.message || error.message));
        } finally {
          setLoading(false);
        }
      },
      prefill: { name: user?.name || 'John Doe', email: user?.email || 'john.doe@example.com', contact: '9999999999' },
      theme: { color: '#28a745' },
    };
  
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const captainPlayer = selectedPlayers.find((p) => p.name === captain);
  const viceCaptainPlayer = selectedPlayers.find((p) => p.name === viceCaptain);

  return (
    <div className="create-team-container">
      <div className="create-team-header">
        <div className="match-info">
          <h1>{matchDetails ? matchDetails.teams : 'Loading...'}</h1>
          <p>{calculateTimeLeft()}</p>
        </div>
        <div className="role-badges">
          <div className="badge">
            <span className="role-label">C</span>
            <img src={captainPlayer?.image || '/players/default.png'} alt="Captain" className="role-image" onError={(e) => { e.target.src = './teams/default.webp'; }}/>
            <span className="role-name">{captain || 'N/A'}</span>
          </div>
          <div className="badge">
            <span className="role-label">VC</span>
            <img src={viceCaptainPlayer?.image || '/players/default.png'} onError={(e) => { e.target.src = './teams/default.webp'; }} alt="Vice-Captain" className="role-image" />
            <span className="role-name">{viceCaptain || 'N/A'}</span>
          </div>
        </div>
      </div>

      {contestDetails ? (
        <div className="prize-section">
          <div className="prize-details">
            <h2>Prize Pool: {formatPrizePool(contestDetails.prizePool)}</h2>
            <p>Additional Prize: {contestDetails.additionalPrize}</p>
            <p>Spots Left: {contestDetails.spotsLeft.toLocaleString()} / {contestDetails.totalSpots.toLocaleString()}</p>
            <p>Entries Allowed: {contestDetails.entries}</p>
          </div>
          <div className="payment-info">
            <span>Entry Fee</span>
            <h3>₹ {contestDetails.entryFee}</h3>
            <p>Original: ₹ {contestDetails.originalFee}</p>
            <button className="pay-button" onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing...' : `PAY ₹ ${contestDetails.entryFee}`}
            </button>
          </div>
        </div>
      ) : (
        <div className="prize-section loading">
          <p>Loading contest details...</p>
        </div>
      )}

      <div className="team-summary">
        <h2>Your Selected Team</h2>
        <div className="player-list">
          {selectedPlayers.map((player, index) => (
            <div key={index} className="player-card">
              <img src={player.image} alt={player.name} className="player-image" />
              <div className="player-details">
                <h3>{player.name}</h3>
                <p>{player.team} • {player.status}</p>
                <span>{player.points} pts</span>
                {captain === player.name && <span className="role-tag">C</span>}
                {viceCaptain === player.name && <span className="role-tag">VC</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;