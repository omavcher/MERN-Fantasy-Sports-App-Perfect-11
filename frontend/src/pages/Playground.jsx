import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/playground.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const Playground = () => {
  const { matchId, teamId } = useParams();
  const token = localStorage.getItem('token');
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [contests] = useState([
    {
      id: 1,
      prizePool: 30000000,
      entryFee: 29,
      originalFee: 39,
      spotsLeft: 309877,
      totalSpots: 478632,
      additionalPrize: '₹ 7 Lakhs',
      entries: 6,
      link: `/team-selection/${matchId}/30000000`,
    },
    {
      id: 2,
      prizePool: 20000000,
      entryFee: 19,
      originalFee: 29,
      spotsLeft: 250000,
      totalSpots: 500000,
      additionalPrize: '₹ 5 Lakhs',
      entries: 4,
      link: `/team-selection/${matchId}/20000000`,
    },
    {
      id: 3,
      prizePool: 140000000,
      entryFee: 59,
      originalFee: 69,
      spotsLeft: 450000,
      totalSpots: 600000,
      additionalPrize: '₹ 10 Lakhs',
      entries: 8,
      link: `/team-selection/${matchId}/140000000`,
    },
    {
      id: 4,
      prizePool: 200000000,
      entryFee: 65,
      originalFee: 89,
      spotsLeft: 500000,
      totalSpots: 625000,
      additionalPrize: '₹ 15 Lakhs',
      entries: 10,
      link: `/team-selection/${matchId}/200000000`,
    },
  ]);

  useEffect(() => {
    const fetchMatchPlayersInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/matches/players/show/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatchData(response.data);
      } catch (error) {
        console.error('Error fetching match players info:', error);
        setError('Failed to load match data');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchPlayersInfo();
  }, [matchId, teamId, token]);

  if (loading) return <div className="playground-container">Loading...</div>;
  if (error) return <div className="playground-container">{error}</div>;
  if (!matchData?.data) return <div className="playground-container">No data available</div>;

  const { selectedPlayers, captain, viceCaptain, matchDetails, amount } = matchData.data;

  const teamWithRoles = selectedPlayers.map((player) => ({
    ...player,
    isCaptain: captain === player.name,
    isViceCaptain: viceCaptain === player.name,
    status: player.status === "Wicket Keeper" ? "WK" : 
            player.status === "All-Rounder" ? "ALL" : 
            player.status === "Batter" ? "BAT" : "BOWL"
  }));

  const teamCounts = teamWithRoles.reduce((acc, player) => {
    acc[player.team] = (acc[player.team] || 0) + 1;
    return acc;
  }, {});

  const totalCredits = 100;
  const usedCredits = teamWithRoles.reduce((sum, player) => sum + player.credits, 0);
  const creditsLeft = totalCredits - usedCredits;

  const calculateTimeLeft = () => {
    const matchDateTime = new Date(`${matchDetails.date} ${matchDetails.time}`);
    const now = new Date();
    const diffMs = matchDateTime - now;

    if (diffMs <= 0) return 'Match Started';

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m Left`;
  };

  const selectedContest = contests.find(contest => contest.entryFee === amount);

  const teamA = matchDetails.teama_short.split(' vs ')[0].toLowerCase();
  const teamB = matchDetails.teama_short.split(' vs ')[1].toLowerCase();

  return (
    <div className="playground-container">
      {/* Header */}
      <div className="playground-header">
        <h1>{matchDetails.teams}</h1>
        <p>{calculateTimeLeft()}</p>
      </div>

      {/* Match Info */}
      <div className="match-details-e3cd">
        <p>{matchDetails.series}</p>
        <p>{matchDetails.venue}</p>
        <p>{matchDetails.date} • {matchDetails.time}</p>
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="players-selected">
          <span>{teamWithRoles.length}/11</span>
          <p>Max 7 Players From A Team</p>
          <div className="progress-candles">
            {Array.from({ length: 11 }).map((_, index) => (
              <div
                key={index}
                className={`candle ${index < teamWithRoles.length ? 'filled' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        <div className="team-logos">
          <div className="team">
            <img
              src={`/teams/${teamA}.avif`}
              alt={teamA.toUpperCase()}
              onError={(e) => (e.target.src = '/default.webp')}
            />
            <span>{teamCounts[teamA.toUpperCase()] || 0}</span>
          </div>
          <div className="team">
            <img
              src={`/teams/${teamB}.avif`}
              alt={teamB.toUpperCase()}
              onError={(e) => (e.target.src = '/default.webp')}
            />
            <span>{teamCounts[teamB.toUpperCase()] || 0}</span>
          </div>
        </div>
        <div className="credits-left">
          <span>Credits Left</span>
          <p>{creditsLeft.toFixed(1)}</p>
        </div>
      </div>

      {/* Cricket Pitch */}
      <div className="cricket-pitch">
        <div className="player-row wk-row">
          {teamWithRoles
            .filter((player) => player.status === 'WK')
            .map((player) => (
              <div
                key={player._id}
                className={`player wk ${player.isCaptain ? 'captain' : ''} ${player.isViceCaptain ? 'vice-captain' : ''}`}
              >
                <img src={player.image} alt={player.name} onError={(e) => (e.target.src = '/default.webp')} />
                <span>{player.name}</span>
                <span className="credits">{player.credits}</span>
                {player.isCaptain && <span className="role-badge">C</span>}
                {player.isViceCaptain && <span className="role-badge">VC</span>}
              </div>
            ))}
        </div>
        <div className="player-row bat-row">
          {teamWithRoles
            .filter((player) => player.status === 'BAT')
            .map((player) => (
              <div
                key={player._id}
                className={`player bat ${player.isCaptain ? 'captain' : ''} ${player.isViceCaptain ? 'vice-captain' : ''}`}
              >
                <img src={player.image} alt={player.name} onError={(e) => (e.target.src = '/default.webp')} />
                <span>{player.name}</span>
                <span className="credits">{player.credits}</span>
                {player.isCaptain && <span className="role-badge">C</span>}
                {player.isViceCaptain && <span className="role-badge">VC</span>}
              </div>
            ))}
        </div>
        <div className="player-row all-row">
          {teamWithRoles
            .filter((player) => player.status === 'ALL')
            .map((player) => (
              <div
                key={player._id}
                className={`player all ${player.isCaptain ? 'captain' : ''} ${player.isViceCaptain ? 'vice-captain' : ''}`}
              >
                <img src={player.image} alt={player.name} onError={(e) => (e.target.src = '/default.webp')} />
                <span>{player.name}</span>
                <span className="credits">{player.credits}</span>
                {player.isCaptain && <span className="role-badge">C</span>}
                {player.isViceCaptain && <span className="role-badge">VC</span>}
              </div>
            ))}
        </div>
        <div className="player-row bowl-row">
          {teamWithRoles
            .filter((player) => player.status === 'BOWL')
            .map((player) => (
              <div
                key={player._id}
                className={`player bowl ${player.isCaptain ? 'captain' : ''} ${player.isViceCaptain ? 'vice-captain' : ''}`}
              >
                <img src={player.image} alt={player.name} onError={(e) => (e.target.src = '/default.webp')} />
                <span>{player.name}</span>
                <span className="credits">{player.credits}</span>
                {player.isCaptain && <span className="role-badge">C</span>}
                {player.isViceCaptain && <span className="role-badge">VC</span>}
              </div>
            ))}
        </div>
      </div>

      {/* Participation Details */}
      {selectedContest && (
        <div className="participation-details">
          <h2>Participation Details</h2>
          <div className="contest-info">
            <div className="contest-item">
              <span className="label">Prize Pool:</span>
              <span className="value">₹ {(selectedContest.prizePool / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="contest-item">
              <span className="label">Entry Fee:</span>
              <span className="value">₹ {selectedContest.entryFee}</span>
            </div>
            <div className="contest-item">
              <span className="label">Spots:</span>
              <span className="value">{selectedContest.spotsLeft} / {selectedContest.totalSpots}</span>
            </div>
            <div className="contest-item">
              <span className="label">Additional Prize:</span>
              <span className="value">{selectedContest.additionalPrize}</span>
            </div>
            <div className="contest-item">
              <span className="label">Entries:</span>
              <span className="value">{selectedContest.entries}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;