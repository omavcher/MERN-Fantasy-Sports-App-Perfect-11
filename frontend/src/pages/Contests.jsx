import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/contests.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const Contests = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('contests'); // Default tab is 'contests'
  const [sortBy, setSortBy] = useState('ENTRY'); // Default sort option
  const token = localStorage.getItem('token');

  // Sample contest data (replace with API data later)
  const [contests, setContests] = useState([
    {
      id: 1,
      prizePool: 30000000, // ₹ 3 Crores in rupees
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
      prizePool: 20000000, // ₹ 2 Crores
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
      prizePool: 140000000, // ₹ 14 Crores
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
      prizePool: 200000000, // ₹ 20 Crores
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
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/upcoming/${matchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatchDetails(response.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };
    fetchMatchDetails();
  }, [matchId, token]);

  // Calculate time left until match
  const calculateTimeLeft = (matchDate, matchTime) => {
    const now = new Date();
    const matchDateTime = new Date(`${matchDate} ${matchTime}`);
    const diffMs = matchDateTime - now;
    if (diffMs <= 0) return "Match Started";
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m Left`;
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sortOption = e.target.value;
    setSortBy(sortOption);

    const sortedContests = [...contests];
    if (sortOption === 'ENTRY') {
      sortedContests.sort((a, b) => a.entryFee - b.entryFee);
    } else if (sortOption === 'PRIZE POOL') {
      sortedContests.sort((a, b) => b.prizePool - a.prizePool); // Descending order
    } else if (sortOption === '% WINNERS') {
      sortedContests.sort((a, b) => {
        const aPercentage = (a.totalSpots - a.spotsLeft) / a.totalSpots;
        const bPercentage = (b.totalSpots - b.spotsLeft) / b.totalSpots;
        return bPercentage - aPercentage; // Descending order
      });
    }
    setContests(sortedContests);
  };

  // Format prize pool to readable format (e.g., ₹ X CRORES)
  const formatPrizePool = (amount) => {
    if (amount >= 10000000) {
      return `₹ ${amount / 10000000} CRORES`;
    }
    return `₹ ${amount / 100000} Lakhs`;
  };

  // Render Contests Section
  const renderContests = () => {
    return matchDetails && matchDetails.upcomingMatches ? (
      <>
        <div className="sort-options">
          <span>Sort By</span>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="ENTRY">ENTRY</option>
            <option value="PRIZE POOL">PRIZE POOL</option>
            <option value="% WINNERS">% WINNERS</option>
          </select>
        </div>
        {contests.map((contest) => (
          <Link to={contest.link} className="contest-link" key={contest.id}>
            <div className="contest-card">
              <div className="contest-details">
                <div className="prize-pool">
                  <span>Prize Pool</span>
                  <h2>{formatPrizePool(contest.prizePool)}</h2>
                </div>
                <div className="entry-fee">
                  <button className="entry-button">₹ {contest.entryFee}</button>
                  <p>Entry: ₹ {contest.originalFee}</p>
                </div>
              </div>
              <div className="contest-stats-sec">
                <div className="stats-details">
                  <span>{contest.spotsLeft.toLocaleString()} spots left</span>
                  <span>{contest.totalSpots.toLocaleString()} spots</span>
                </div>
                <div className="additional-info">
                  <span>{contest.additionalPrize} • {contest.entries} Entries</span>
                  <span className="confirmed">Confirmed</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </>
    ) : (
      <div className="loading">
        <p>Loading contests...</p>
      </div>
    );
  };

  // Render My Contests Section
  const renderMyContests = () => {
    const myContests = []; // Placeholder
    return myContests.length > 0 ? (
      <div className="my-contests">
        <p>My Contests content goes here...</p>
      </div>
    ) : (
      <div className="no-data">
        <p>No contests joined yet. Join a contest to get started!</p>
        <button className="create-team-btn" onClick={()=> setActiveTab('contests') }>
          <span className="plus-icon">+</span> CREATE TEAM
        </button>
      </div>
    );
  };

  // Render My Teams Section
  const renderMyTeams = () => {
    const myTeams = []; // Placeholder
    return myTeams.length > 0 ? (
      <div className="my-teams">
        <p>My Teams content goes here...</p>
      </div>
    ) : (
      <div className="no-data">
        <p>No teams created yet. Create a team to participate!</p>
        <button className="create-team-btn" onClick={()=> setActiveTab('contests') }>
          <span className="plus-icon">+</span> CREATE TEAM
        </button>
      </div>
    );
  };

  return (
    <div className="contests-container">
      {/* Header */}
      {matchDetails && matchDetails.upcomingMatches && matchDetails.upcomingMatches.length > 0 ? (
        <div className="contests-header">
          <h1>{matchDetails.upcomingMatches[0].teama_short}</h1>
          <p>{calculateTimeLeft(matchDetails.upcomingMatches[0].date, matchDetails.upcomingMatches[0].time)}</p>
          <p>
            {matchDetails.upcomingMatches[0].venue} | {matchDetails.upcomingMatches[0].series}
          </p>
        </div>
      ) : (
        <div className="contests-header">
          <h1>Loading...</h1>
        </div>
      )}

      {/* Tabs */}
      <div className="contests-tabs">
        <span
          className={`tab ${activeTab === 'contests' ? 'active' : ''}`}
          onClick={() => handleTabClick('contests')}
        >
          Contests
        </span>
        <span
          className={`tab ${activeTab === 'my-contests' ? 'active' : ''}`}
          onClick={() => handleTabClick('my-contests')}
        >
          My Contests (0)
        </span>
        <span
          className={`tab ${activeTab === 'my-teams' ? 'active' : ''}`}
          onClick={() => handleTabClick('my-teams')}
        >
          My Teams (0)
        </span>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'contests' && renderContests()}
        {activeTab === 'my-contests' && renderMyContests()}
        {activeTab === 'my-teams' && renderMyTeams()}
      </div>

      {/* Create Team Button (only for Contests tab) */}
      {activeTab === 'contests' && (
        <div className="create-team-button">
          <button>
            <span className="plus-icon">+</span> CREATE TEAM
          </button>
        </div>
      )}
    </div>
  );
};

export default Contests;