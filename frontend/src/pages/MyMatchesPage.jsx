import React, { useState, useEffect } from 'react';
import './MyMatchesPage.css';
import { MdEmojiEvents } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const MyMatchesPage = () => {
  const [activeTab, setActiveTab] = useState('contests');
  const token = localStorage.getItem('token');
  const [allTeamsData, setAllTeamsData] = useState(null);
  const [contestData, setContestData] = useState(null);

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/my-terms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllTeamsData(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const fetchContestData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/my-contest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContestData(response.data.data);
      } catch (error) {
        console.error('Error fetching contest data:', error);
      }
    };

    fetchContestData();
    fetchAllTeams();
  }, []);

  // Function to calculate player role counts
  const getPlayerRoleCounts = (players) => {
    return players.reduce(
      (acc, player) => {
        if (player.status === 'Wicket Keeper') acc.WK++;
        else if (player.status === 'Batter') acc.BAT++;
        else if (player.status === 'All-Rounder') acc.AR++;
        else if (player.status === 'Bowler') acc.BOWL++;
        return acc;
      },
      { WK: 0, BAT: 0, AR: 0, BOWL: 0 }
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contests':
        return (
          <div className="contests-container">
            {contestData?.contests?.length > 0 ? (
              contestData.contests.map(contest => (
                <div key={contest.teamId} className="contest-card-mxs">
                  <div className='contest-header'>
                    <span>{`Rs. ${contest.prizePool}`}</span>
                    <span>Entry: <p>{`${contest.originalFee}`}</p></span>
                  </div>
                  <div className="contest-details">
                    <div>Prize Pool <span>₹ {contest.prizePool}</span></div>
                    <div>Spots Left: <span>{contest.spotsLeft}</span></div>
                    <div>Entry <span>{contest.entryFee}</span></div>
                  </div>
                  <div className='contest-details-extrs'>
                    <span>
                      <MdEmojiEvents />
                      {`${contest.totalWinnings} • ${contest.maxEntriesPerUser} Entries`}
                    </span>
                    <span>
                      {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                    </span>
                  </div>
                  <div className='contest-details-my-postiond'>
                    <div>
                      <h5>{contest.name}</h5>
                      <span
                        className={`contest-details-win-price ${contest.winamount < 0 ? 'text-red' : ''}`}
                      >
                        {contest.winamount === 0
                          ? '-'
                          : contest.winamount < 0
                            ? 'Better luck next time'
                            : `You won ₹${contest.winamount}`}
                      </span>
                    </div>
                    <span>{contest.score === 0 ? '-' : contest.score}</span>
                    <span className='contest-ranks5'>{contest.rank === 0 ? '-' : `#${contest.rank}`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-contests">
                <p>You haven't joined any contests yet</p>
                <Link to={`/`} className="join-contest-button">
                  Join a Contest
                </Link>
              </div>
            )}
          </div>
        );
      case 'teams':
        return (
          <div className="teams-container">
            {allTeamsData?.length > 0 ? (
              allTeamsData.map((team, index) => {
                const roleCounts = getPlayerRoleCounts(team.selectedPlayers);
                const totalPoints = team.selectedPlayers.reduce(
                  (sum, player) => sum + player.points,
                  0
                );
                const captainPlayer = team.selectedPlayers.find(
                  (p) => p.name === team.captain
                );
                const viceCaptainPlayer = team.selectedPlayers.find(
                  (p) => p.name === team.viceCaptain
                );

                return (
                  <Link
                    style={{ padding: '0' }}
                    to={`/playground/${team.matchId}/${team.paymentId}`}
                    key={team._id}
                    className="team-card"
                  >
                    <h3 className="team-name">
                      Team {index + 1} - {team.matchDetails.teama_short}
                    </h3>
                    <div className="team-detailsw">
                      <div className="team-points">
                        Points <br />
                        {totalPoints}
                      </div>
                      <div className="team-cap-vicpa">
                        <div className="team-cap-vi">
                          <span>C</span>
                          <img src={captainPlayer?.image} alt={team.captain} />
                          <p>{team.captain}</p>
                        </div>
                        <div className="team-cap-vi">
                          <span>VC</span>
                          <img
                            src={viceCaptainPlayer?.image}
                            alt={team.viceCaptain}
                          />
                          <p>{team.viceCaptain}</p>
                        </div>
                      </div>
                    </div>
                    <div className="player-stats">
                      <div className="stat-item">
                        <span className="stat-label">WK</span>
                        <span className="stat-value">{roleCounts.WK}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">BAT</span>
                        <span className="stat-value">{roleCounts.BAT}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">AR</span>
                        <span className="stat-value">{roleCounts.AR}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">BOWL</span>
                        <span className="stat-value">{roleCounts.BOWL}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="no-teams">
                <p>You haven't created any teams yet</p>
                <Link to={`/`} className="create-team-button">
                  Create a Team
                </Link>
              </div>
            )}
          </div>
        );
    
      default:
        return null;
    }
  };

  return (
    <div className="my-matches-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'contests' ? 'active' : ''}`}
          onClick={() => setActiveTab('contests')}
        >
          My Contests ({contestData?.contests?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          My Teams ({allTeamsData?.length || 0})
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default MyMatchesPage;