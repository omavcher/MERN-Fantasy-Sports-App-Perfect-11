import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/matchLeaderboard.css';

const MatchLeaderboard = () => {
  const { matchId } = useParams();
  const matchTitle = matchId.toUpperCase().replace('-', ' VS ');
  const [activeTab, setActiveTab] = useState('My Contests');
  const [contestView, setContestView] = useState('My Results'); // Sub-tab for My Contests

  // Sample data for the match
  const matchData = {
    team1: { name: 'Delhi Capitals Women', score: '131/9', overs: '20' },
    team2: { name: 'Mumbai Indians Women', score: '134/3', overs: '19.3' },
    result: 'Mumbai Indians Women won by 7 wickets',
    contests: [
      {
        prizePool: '₹7000',
        spots: '3',
        entryFee: '₹2699',
        teamName: 'HITMANFANTASY45',
        points: 825.5,
        rank: 1,
        winnings: '₹7000',
      },
      {
        prizePool: '₹3000',
        spots: '3',
        entryFee: '₹1079',
        teamName: 'HITMANFANTASY45',
        points: 825.5,
        rank: 1,
        winnings: '₹3000',
      },
      {
        prizePool: '₹7000',
        spots: '3',
        entryFee: '₹2699',
        teamName: 'HITMANFANTASY45',
        points: 825.5,
        rank: 1,
        winnings: '₹7000',
      },
    ],
    totalInvestment: '₹8796',
    totalWinnings: '₹267400',
    totalProfit: '₹178604',
    contestsWon: 23,
    teams: 1,
    winnersList: Array.from({ length: 55 }, (_, index) => {
      const rank = index + 1;
      let winnings = '₹0';
      if (rank === 1) winnings = '₹7000'; // 1st prize
      else if (rank === 2) winnings = '₹4000'; // 2nd prize
      else if (rank === 3) winnings = '₹2000'; // 3rd prize
      else if (rank >= 4 && rank <= 10) winnings = '₹500'; // 4th to 10th prize
      else if (rank >= 11 && rank <= 20) winnings = '₹100'; // 11th to 20th prize

      return {
        rank,
        teamName: `Team_${String.fromCharCode(65 + (index % 26))}${index + 1}`, // e.g., Team_A1, Team_B2
        points: Math.floor(Math.random() * (825 - 300) + 300), // Random points between 300 and 825
        winnings,
      };
    }),
  };

  return (
    <div className="match-leaderboard-container">
      {/* Match Header */}
      <div className="match-header">
        <h1>{matchTitle}</h1>
        <p className="status">Completed</p>
        <div className="match-scores">
          <div className="team-score">
            <span>{matchData.team1.name}</span>
            <p>{matchData.team1.score} ({matchData.team1.overs})</p>
          </div>
          <div className="team-score">
            <span>{matchData.team2.name}</span>
            <p>{matchData.team2.score} ({matchData.team2.overs})</p>
          </div>
        </div>
        <p className="result">{matchData.result}</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'Full Match' ? 'active' : ''}
          onClick={() => setActiveTab('Full Match')}
        >
          Full Match
        </button>
        <button
          className={activeTab === 'Scorecard' ? 'active' : ''}
          onClick={() => setActiveTab('Scorecard')}
        >
          Scorecard
        </button>
        <button
          className={activeTab === 'Commentary' ? 'active' : ''}
          onClick={() => setActiveTab('Commentary')}
        >
          Commentary
        </button>
        <button
          className={activeTab === 'My Contests' ? 'active' : ''}
          onClick={() => setActiveTab('My Contests')}
        >
          My Contests ({matchData.contests.length})
        </button>
        <button
          className={activeTab === 'My Teams' ? 'active' : ''}
          onClick={() => setActiveTab('My Teams')}
        >
          My Teams ({matchData.teams})
        </button>
        <button
          className={activeTab === 'Player Stats' ? 'active' : ''}
          onClick={() => setActiveTab('Player Stats')}
        >
          Player Stats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'My Contests' && (
        <div className="tab-content">
          {/* Sub-Tabs for My Contests */}
          <div className="sub-tabs">
            <button
              className={contestView === 'My Results' ? 'active' : ''}
              onClick={() => setContestView('My Results')}
            >
              My Results
            </button>
            <button
              className={contestView === 'Winners List' ? 'active' : ''}
              onClick={() => setContestView('Winners List')}
            >
              Winners List
            </button>
          </div>

          {/* My Results View */}
          {contestView === 'My Results' && (
            <>
              <div className="contest-summary">
                <div className="summary-item">
                  <span>Investment</span>
                  <p>{matchData.totalInvestment}</p>
                </div>
                <div className="summary-item">
                  <span>Winnings</span>
                  <p>{matchData.totalWinnings}</p>
                </div>
                <div className="summary-item">
                  <span>Profit</span>
                  <p>{matchData.totalProfit}</p>
                </div>
              </div>
              <div className="congratulations">
                <p>Congratulations! You have won in {matchData.contestsWon} contests</p>
              </div>
              {matchData.contests.map((contest, index) => (
                <div key={index} className="contest-card">
                  <div className="contest-header">
                    <span className="winners">Winners: 1</span>
                    <span className="prize">1st Prize: {contest.winnings}</span>
                  </div>
                  <div className="contest-details">
                    <div className="detail">
                      <span>Prize Pool</span>
                      <p>{contest.prizePool}</p>
                    </div>
                    <div className="detail">
                      <span>Spot</span>
                      <p>{contest.spots}</p>
                    </div>
                    <div className="detail">
                      <span>Entry Fee</span>
                      <p>{contest.entryFee}</p>
                    </div>
                  </div>
                  <div className="contest-stats">
                    <div className="stat">
                      <span>Teams</span>
                      <p>{contest.teamName}</p>
                    </div>
                    <div className="stat">
                      <span>Points</span>
                      <p>{contest.points}</p>
                    </div>
                    <div className="stat">
                      <span>Rank</span>
                      <p>#{contest.rank} <span className="rank-up">▲</span></p>
                    </div>
                  </div>
                  <div className="contest-winnings">
                    <p>YOU WON: {contest.winnings}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Winners List View */}
          {contestView === 'Winners List' && (
            <div className="winners-list">
              <table className="winners-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Winnings</th>
                  </tr>
                </thead>
                <tbody>
                  {matchData.winnersList.map((winner, index) => (
                    <tr key={index} className={winner.teamName === 'HITMANFANTASY45' ? 'highlight' : ''}>
                      <td>#{winner.rank}</td>
                      <td>{winner.teamName}</td>
                      <td>{winner.points}</td>
                      <td>{winner.winnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchLeaderboard;