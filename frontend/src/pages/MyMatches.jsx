import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/myMatches.css';

const MyMatches = () => {
  const { matchId } = useParams();
  const matchTitle = matchId.toUpperCase().replace('-', ' VS ');
  const [activeTab, setActiveTab] = useState('My Contests');

  // Sample data for the match
  const matchData = {
    team1: { name: 'EMR', score: '220/4', overs: '15.6' },
    team2: { name: 'DUB', score: '216/4', overs: '20' },
    result: 'EMR Beat DUB by 6 Wickets',
    contests: [
      {
        prizePool: '₹ 100,000,000',
        entryFee: '₹ 39',
        spots: '40,38,109',
        entries: '33',
        rank: '5,25,5874',
        winnings: '₹ 33',
        teams: 1,
      },
    ],
    teams: [
      {
        name: 'Raj Avengers 16 (T1)',
        points: 401,
        wk: 2,
        bat: 2,
        ar: 2,
        bowl: 3,
        captain: 'J Bumrah',
        viceCaptain: 'J Bumrah',
      },
      {
        name: 'Raj Avengers 16 (T2)',
        points: 801,
        wk: 2,
        bat: 2,
        ar: 2,
        bowl: 3,
        captain: 'J Bumrah',
        viceCaptain: 'J Bumrah',
      },
    ],
    scorecard: {
      team1: {
        name: 'Emirates Red',
        score: '220-8 (19 Ov)',
        batting: [
          { name: 'Prabhsimran', runs: 0, balls: 2, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Prashant b Shami', runs: 0, balls: 2, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Dhawan (c)', runs: 8, balls: 8, fours: 2, sixes: 0, sr: 100.00 },
          { name: 'c Joseph b Joshua Little', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Matthew Short', runs: 36, balls: 24, fours: 6, sixes: 1, sr: 150.00 },
          { name: 'b Rashid Khan', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'B Rajapaksa', runs: 20, balls: 26, fours: 1, sixes: 0, sr: 76.92 },
          { name: 'c Shubham Gill b Azhar Joseph', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Jitesh Sharma (wk)', runs: 25, balls: 23, fours: 5, sixes: 0, sr: 108.70 },
          { name: 'c W Saha b Mohit Sharma', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Sam Curran', runs: 22, balls: 22, fours: 1, sixes: 1, sr: 100.00 },
          { name: 'c Shubham Gill b Mohit Sharma', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Shahrukh Khan', runs: 22, balls: 9, fours: 1, sixes: 2, sr: 244.44 },
          { name: 'run out (Miller/W Saha)', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Harpreet Brar', runs: 8, balls: 5, fours: 0, sixes: 1, sr: 160.00 },
          { name: 'not out', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
          { name: 'Rishi Dhawan', runs: 1, balls: 1, fours: 0, sixes: 0, sr: 100.00 },
          { name: 'run out (W Saha)', runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0.00 },
        ],
        extras: '11 (b 0, lb 2, w 9, nb 0, p 0)',
        total: '153 (8 wkts, 20 Ov)',
        bowling: [
          { name: 'Shami', overs: 4, maidens: 0, runs: 44, wickets: 1, eco: 11.00 },
          { name: 'Joshua Little', overs: 4, maidens: 0, runs: 31, wickets: 1, eco: 7.80 },
          { name: 'Azhar Joseph', overs: 4, maidens: 0, runs: 32, wickets: 1, eco: 8.00 },
        ],
      },
      team2: {
        name: 'Dubai Titans',
        score: '216-8 (20 Ov)',
        batting: [],
        bowling: [],
      },
    },
    stats: [
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
      { name: 'I Turkmen', team: 'GUJ-BAT', points: 134, selected: '64.34%', captain: '0.34%', viceCaptain: '0.26%' },
    ],
  };

  return (
    <div className="my-matches-container">
      {/* Match Header */}
      <div className="match-header">
        <h1>{matchTitle}</h1>
        <p>Completed</p>
        <div className="match-scores">
          <div className="team-score">
            <img src="emr-logo.png" alt="EMR" />
            <span>{matchData.team1.score} ({matchData.team1.overs})</span>
          </div>
          <div className="team-score">
            <img src="dub-logo.png" alt="DUB" />
            <span>{matchData.team2.score} ({matchData.team2.overs})</span>
          </div>
        </div>
        <p className="result">{matchData.result}</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
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
          My Teams ({matchData.teams.length})
        </button>
        <button
          className={activeTab === 'Scorecard' ? 'active' : ''}
          onClick={() => setActiveTab('Scorecard')}
        >
          Scorecard
        </button>
        <button
          className={activeTab === 'Stats' ? 'active' : ''}
          onClick={() => setActiveTab('Stats')}
        >
          Stats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'My Contests' && (
        <div className="tab-content">
          {matchData.contests.map((contest, index) => (
            <div key={index} className="contest-card">
              <div className="contest-header">
                <span className="prize-pool">{contest.prizePool}</span>
                <span className="entry-fee">Entry: {contest.entryFee}</span>
              </div>
              <div className="contest-details">
                <div className="detail">
                  <span>Prize Pool</span>
                  <p>{contest.prizePool}</p>
                </div>
                <div className="detail">
                  <span>Spots</span>
                  <p>{contest.spots}</p>
                </div>
                <div className="detail">
                  <span>Entry</span>
                  <p>{contest.entries}</p>
                </div>
              </div>
              <div className="contest-stats">
                <div className="stat">
                  <span>₹ 7 Lakhs, 6 Entries</span>
                  <p>Guaranteed</p>
                </div>
                <div className="stat">
                  <span>Rank Avengers 16</span>
                  <p>You won ₹33</p>
                </div>
                <div className="stat">
                  <span>T1 812.5</span>
                  <p>#5,25,5874</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'My Teams' && (
        <div className="tab-content">
          {matchData.teams.map((team, index) => (
            <div key={index} className="team-card">
              <div className="team-header">
                <span className="team-name">{team.name}</span>
                <span className="points">{team.points}</span>
              </div>
              <div className="team-roles">
                <span>WK {team.wk}</span>
                <span>BAT {team.bat}</span>
                <span>AR {team.ar}</span>
                <span>BOWL {team.bowl}</span>
              </div>
              <div className="team-leaders">
                <div className="leader">
                  <img src="player-placeholder.png" alt="Captain" />
                  <span>C</span>
                  <p>{team.captain}</p>
                </div>
                <div className="leader">
                  <img src="player-placeholder.png" alt="Vice-Captain" />
                  <span>VC</span>
                  <p>{team.viceCaptain}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Scorecard' && (
        <div className="tab-content">
          <div className="scorecard-section">
            <h3>{matchData.scorecard.team1.name}</h3>
            <p>{matchData.scorecard.team1.score}</p>
            <table className="scorecard-table">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {matchData.scorecard.team1.batting.map((batter, index) => (
                  <tr key={index}>
                    <td>{batter.name}</td>
                    <td>{batter.runs}</td>
                    <td>{batter.balls}</td>
                    <td>{batter.fours}</td>
                    <td>{batter.sixes}</td>
                    <td>{batter.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Extras: {matchData.scorecard.team1.extras}</p>
            <p>Total: {matchData.scorecard.team1.total}</p>
            <h4>Did not bat: Rabada, Anshdeep Singh, Rahul Chahar</h4>
            <h4>Bowling</h4>
            <table className="scorecard-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>ECO</th>
                </tr>
              </thead>
              <tbody>
                {matchData.scorecard.team1.bowling.map((bowler, index) => (
                  <tr key={index}>
                    <td>{bowler.name}</td>
                    <td>{bowler.overs}</td>
                    <td>{bowler.maidens}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{bowler.eco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scorecard-section">
            <h3>{matchData.scorecard.team2.name}</h3>
            <p>{matchData.scorecard.team2.score}</p>
            {/* Add batting and bowling data for team2 if needed */}
          </div>
        </div>
      )}

      {activeTab === 'Stats' && (
        <div className="tab-content">
          <table className="stats-table">
            <thead>
              <tr>
                <th>PLAYERS</th>
                <th>POINTS</th>
                <th>% SEL</th>
                <th>% C</th>
                <th>% VC</th>
              </tr>
            </thead>
            <tbody>
              {matchData.stats.map((player, index) => (
                <tr key={index}>
                  <td>
                    <img src="player-placeholder.png" alt={player.name} />
                    {player.name} ({player.team})
                  </td>
                  <td>{player.points}</td>
                  <td>{player.selected}</td>
                  <td>{player.captain}</td>
                  <td>{player.viceCaptain}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="dream-team-button">Dream Team</button>
        </div>
      )}
    </div>
  );
};

export default MyMatches;