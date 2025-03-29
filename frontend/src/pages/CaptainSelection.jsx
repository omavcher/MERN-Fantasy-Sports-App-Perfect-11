import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/captainSelection.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const CaptainSelection = () => {
  const { matchId , prizePool } = useParams();
  const matchTitle = matchId.toUpperCase().replace('-', ' VS ');
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlayers } = location.state || { selectedPlayers: [] };
  const token = localStorage.getItem('token');
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/upcoming/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchDetails(response.data.upcomingMatches[0]);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };
    fetchMatchDetails();
  }, [matchId, token]);


  const calculateTimeLeft = () => {
    if (!matchDetails) return 'Loading...';
    const matchDateTime = new Date(`${matchDetails.date} ${matchDetails.time}`);
    const now = new Date();
    const diffMs = matchDateTime - now;

    if (diffMs <= 0) return 'Match Started';

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m Left`;
  };





  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);

  const handleCaptainChange = (playerName) => {
    if (viceCaptain === playerName) {
      setViceCaptain(null);
    }
    setCaptain(playerName);
  };

  const handleViceCaptainChange = (playerName) => {
    if (captain === playerName) {
      setCaptain(null);
    }
    setViceCaptain(playerName);
  };

  const calculatePoints = (player) => {
    let multiplier = 1;
    if (captain === player.name) {
      multiplier = 2;
    } else if (viceCaptain === player.name) {
      multiplier = 1.5;
    }
    return (player.points * multiplier).toFixed(1);
  };

  const handleSave = () => {
    if (!captain || !viceCaptain) {
      alert('Please select both a captain and a vice-captain.');
      return;
    }

    navigate(`/create/team/${matchId}`, {
      state: {prizePool , selectedPlayers, captain, viceCaptain },
    });
  };

  return (
    <div className="captain-selection-container">
      <div className="captain-selection-header">
        <h1>{matchDetails ? matchDetails.teams : 'Loading...'}</h1>
        <p>{calculateTimeLeft()}</p>
      </div>
      <div className="captain-info">
        <div className="captain">
          <span>Captain</span>
          <p>2X Points</p>
        </div>
        <div className="vice-captain">
          <span>Vice Captain</span>
          <p>1.5X Points</p>
        </div>
      </div>
      <div className="player-list-d3d9-header">
        <span>TYPE</span>
        <span>POINTS</span>
        <span>% C BY</span>
        <span>% VC BY</span>
      </div>
      <div className="player-list-d3d9">
        {selectedPlayers.map((player, index) => (
          <div key={index} className="player-card">
            <div className="player-info">
              <img src={player.image} alt={player.name} className="player-image" />

              <div className="player-details">
                <h3>{player.name}</h3>
                <p>{player.team} • {player.status}</p>
                <span>{calculatePoints(player)} pts</span>
                {(captain === player.name || viceCaptain === player.name) && (
                  <span className="multiplier">
                    {captain === player.name ? '2X' : '1.5X'}
                  </span>
                )}
              </div>
            </div>
            <div className="player-selection">
              <label className="radio-label">
                <input
                  type="radio"
                  name="captain"
                  checked={captain === player.name}
                  onChange={() => handleCaptainChange(player.name)}
                />
                <span className="radio-custom">C</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="vice-captain"
                  checked={viceCaptain === player.name}
                  onChange={() => handleViceCaptainChange(player.name)}
                />
                <span className="radio-custom">VC</span>
              </label>
              <span className="percentage">{player.selectedBy}</span>
              <span className="percentage">0.26%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="footer-buttons">
        <button className="preview-button">PREVIEW</button>
        <button className="save-button" onClick={handleSave}>SAVE</button>
      </div>
    </div>
  );
};

export default CaptainSelection;