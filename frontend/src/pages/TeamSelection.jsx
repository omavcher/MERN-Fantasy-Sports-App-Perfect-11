import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/teamSelection.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const TeamSelection = () => {
  const { matchId, prizePool } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [matchDetails, setMatchDetails] = useState(null);
  const [players, setPlayers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');

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

    const fetchPlayerDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/player-stats/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const playerData = response.data;

        const transformedPlayers = [];
        for (const teamId in playerData) {
          const team = playerData[teamId];
          const teamShort = team.Name_Short;
          for (const playerId in team.Players) {
            const player = team.Players[playerId];
            transformedPlayers.push({
              name: player.Name_Full,
              team: teamShort,
              selectedBy: `${(Math.random() * 75).toFixed(2)}%`,
              points: Math.floor(
                parseInt(player.Batting.Runs) / 50 + parseInt(player.Bowling.Wickets) * 10
              ),
              credits: parseFloat((Math.random() * 2 + 7.5).toFixed(1)),
              status: player.Role,
              playedLastMatch: Math.random() > 0.3,
              selected: false,
              image: player.Image,
            });
          }
        }
        setPlayers(transformedPlayers);
      } catch (error) {
        console.error('Error fetching player details:', error);
      }
    };

    fetchPlayerDetail();
    fetchMatchDetails();
  }, [matchId, token]);

  const selectedPlayersCount = players.filter((player) => player.selected).length;
  const totalCredits = 100;
  const usedCredits = players
    .filter((player) => player.selected)
    .reduce((sum, player) => sum + player.credits, 0);
  const creditsLeft = totalCredits - usedCredits;

  const togglePlayerSelection = (index) => {
    const updatedPlayers = [...players];
    const player = updatedPlayers[index];
    const teamCount = players.filter((p) => p.team === player.team && p.selected).length;

    if (selectedPlayersCount >= 11 && !player.selected) {
      alert('You can only select up to 11 players.');
      return;
    }
    if (teamCount >= 7 && !player.selected) {
      alert('You can only select up to 7 players from a single team.');
      return;
    }

    updatedPlayers[index].selected = !player.selected;
    setPlayers(updatedPlayers);
  };

  const handleNext = () => {
    const selectedPlayers = players.filter((player) => player.selected);
    if (selectedPlayers.length < 11) {
      alert('Please select 11 players before proceeding.');
      return;
    }
    navigate(`/captain-selection/${matchId}/${prizePool}`, { state: { selectedPlayers } });
  };

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

  const filteredPlayers = players.filter((player) =>
    activeCategory === 'ALL' ? true : player.status === activeCategory
  );

  return (
    <div className="team-selection-container">
      <div className="team-selection-header">
        <h1>{matchDetails ? matchDetails.teams : 'Loading...'}</h1>
        <p>{calculateTimeLeft()}</p>
      </div>

      <div className="team-selection-info">
        <div className="players-selected">
          <span>{selectedPlayersCount}/11</span>
          <p>Max 7 Players From A Team</p>
          <div className="progress-candles">
            {Array.from({ length: 11 }).map((_, index) => (
              <div
                key={index}
                className={`candle ${index < selectedPlayersCount ? 'filled' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        <div className="team-logos">
          {matchDetails ? (
            <>
              <div className="team">
                <img
                  src={`/teams/${matchDetails.teama_short.split(' ')[0].toLowerCase()}.avif`}
                  alt={matchDetails.teama_short.split(' ')[0]}
                  onError={(e) => (e.target.src = '/default.webp')}
                />
                <span>{players.filter((p) => p.team === 'GT' && p.selected).length}</span>
              </div>
              <div className="team">
                <img
                  src={`/teams/${matchDetails.teama_short.split(' ')[2].toLowerCase()}.avif`}
                  alt={matchDetails.teama_short.split(' ')[2]}
                  onError={(e) => (e.target.src = '/default.webp')}
                />
                <span>{players.filter((p) => p.team === 'MI' && p.selected).length}</span>
              </div>
            </>
          ) : (
            <div>Loading teams...</div>
          )}
        </div>
        <div className="credits-left">
          <span>Credits Left</span>
          <p>{creditsLeft.toFixed(1)}</p>
        </div>
      </div>

      {matchDetails && (
        <div className="match-details-tdss">
          <p>{matchDetails.series}</p>
          <p>{matchDetails.venue}</p>
          <p>{matchDetails.date} • {matchDetails.time}</p>
        </div>
      )}

      <div className="copy-teams-banner">
        <span>Copy Teams Of Your Favorite Gurus</span>
      </div>

      <div className="player-categories">
        {['Wicket Keeper', 'Batter','All-Rounder', 'Bowler'].map((category) => (
          <span
            key={category}
            className={`category ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}  ({players.filter((p) => p.status === category).length})
          </span>
        ))}
      </div>

      <div className="selection-instruction">
        <span>
          Select{' '}
          {activeCategory === 'WK'
            ? '1 - 4 Wicket Keepers'
            : activeCategory === 'BAT'
            ? '3 - 6 Batsmen'
            : activeCategory === 'ALL'
            ? '1 - 4 All-Rounders'
            : '3 - 6 Bowlers'}
        </span>
        <select>
          <option>Selected By ↓</option>
          <option>Points</option>
          <option>Credits</option>
        </select>
      </div>

      <div className="player-list-tdss">
        {filteredPlayers.map((player, index) => (
          <div key={index} className="player-card-tdss">
            <div className="player-info-tdss">
              <img
                src={player.image}
                alt={player.name}
                className="player-image"
                onError={(e) => (e.target.src = '/players/default.png')}
              />
              <div className="player-details-tdss">
                <h3>{player.name}</h3>
                <p>Sel by {player.selectedBy}</p>
                {player.playedLastMatch && <span className="played-last-match">Played last match</span>}
              </div>
            </div>
            <div className="player-stats-tdss">
              <span className="team-status">
                {player.team} • {player.status}
              </span>
              <div className="points-credits">
                <span className="points">{player.points}</span>
                <span className="credits">{player.credits}</span>
              </div>
              <button
                className={`select-button ${player.selected ? '' : 'selected'}`}
                onClick={() => togglePlayerSelection(players.indexOf(player))}
              >
                {player.selected ? '-' : '+'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-buttons">
        <button className="preview-button">PREVIEW</button>
        <button className="next-button" onClick={handleNext}>NEXT</button>
      </div>
    </div>
  );
};

export default TeamSelection;