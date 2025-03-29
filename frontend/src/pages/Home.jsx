import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import axios from 'axios';
import BASE_URL from '../config/BaseUrl';

const Home = () => {
  const [liveMatchData, setLiveMatchData] = useState(null);
  const [upcomingMatchData, setUpcomingMatchData] = useState([]);
  const [myMatchesData, setMyMatchesData] = useState([]);
  const [iplNews, setiplNews] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLiveMatchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/live-score`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLiveMatchData(response.data);
      } catch (error) {
        console.error('Error fetching live match data:', error);
      }
    };
    
    const fetchUpcomingMatchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/get-upcoming`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpcomingMatchData(response.data.matches);
      } catch (error) {
        console.error('Error fetching upcoming match data:', error);
      }
    };

    const fetchNewsLiveData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/ipl-news`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setiplNews(response.data.items);
      } catch (error) {
        console.error('Error fetching upcoming match data:', error);
      }
    };
    
    const fetchMymtches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/matches/my-matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyMatchesData(response.data.data.teams);
      } catch (error) {
        console.error('Error fetching upcoming match data:', error);
      }
    };
    
    fetchMymtches();
    fetchNewsLiveData();
    fetchUpcomingMatchData();
    fetchLiveMatchData();

    const intervalId = setInterval(fetchLiveMatchData, 10000);
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <div className="home-container">
      <div className="container">
        {/* Live Matches Section */}
        {liveMatchData && liveMatchData.liveMatches?.length > 0 && (
          <div className="live-matches">
            {liveMatchData.liveMatches.map((match) => (
              <div key={match.matchId} className="match-card live-match-card">
                <div className="match-teams">
                  <div className="team">
                    <img 
                      src={`./teams/${match.teams.shortNames.team1.toLowerCase()}.avif`} 
                      alt={match.teams.shortNames.team1} 
                      onError={(e) => { e.target.src = './teams/default.webp'; }}
                    />
                    <span>{match.teams.shortNames.team1}</span>
                    {match.currentInnings.battingTeam === match.teams.shortNames.team1 && (
                      <span className="score">
                        {match.currentInnings.score}/{match.currentInnings.wickets}
                      </span>
                    )}
                  </div>
                  <div className="match-time">
                    <span className="live-status">LIVE</span>
                    <span>{match.currentInnings.overs} overs</span>
                  </div>
                  <div className="team">
                    <img 
                      src={`./teams/${match.teams.shortNames.team2.toLowerCase()}.avif`} 
                      alt={match.teams.shortNames.team2} 
                      onError={(e) => { e.target.src = './teams/default.webp'; }}
                    />
                    <span>{match.teams.shortNames.team2}</span>
                    {match.currentInnings.battingTeam === match.teams.shortNames.team2 && (
                      <span className="score">
                        {match.currentInnings.score}/{match.currentInnings.wickets}
                      </span>
                    )}
                  </div>
                </div>
                <div className="match-details">
                  <span>{match.venue}</span>
                  <span>IPL 2025</span>
                  <span>{match.toss}</span>
                </div>
                <div className="live-stats">
                  <span>RR: {match.currentInnings.runRate}</span>
                  <span>{match.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Matches Section */}
        <div className="my-matches">
          <div className="section-header">
            <h2>My Matches</h2>
            <a href="/matches" className="view-all">VIEW ALL</a>
          </div>
          
          {myMatchesData?.length > 0 ? (
            myMatchesData.slice(0, 2).map((match) => (
              <Link 
                to={`/Playground/${match.matchId}/${match.paymentId}`}
                className="match-link" 
                key={match.paymentId}
              >
                <div className="match-card">
                  <div className="match-teams">
                    <div className="team">
                      <img 
                        src={`./teams/${match.matchDetails.teama_short.split(' vs ')[0].toLowerCase().replace(/\s+/g, '-')}.avif`} 
                        alt={match.matchDetails.teams.split(' vs ')[0]} 
                      />
                      <span>{match.matchDetails.teama_short.split(' vs ')[0]}</span>
                    </div>
                    <div className="match-time">
                      <span>{match.matchDetails.time}</span>
                      <span>{match.matchDetails.date}</span>
                    </div>
                    <div className="team">
                      <img 
                        src={`./teams/${match.matchDetails.teama_short.split(' vs ')[1].toLowerCase().replace(/\s+/g, '-')}.avif`} 
                        alt={match.matchDetails.teams.split(' vs ')[1]} 
                      />
                      <span>{match.matchDetails.teama_short.split(' vs ')[1]}</span>
                    </div>
                  </div>
                  <div className="match-details">
                    <span>{match.matchDetails.series}</span>
                    <div className='match-type-linw'>
                      <span>{match.matchDetails.teams.split(' vs ')[0]}</span>
                      <span>{match.matchDetails.teams.split(' vs ')[1]}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-matches">
              <p>You haven't joined any matches yet</p>
              <Link to="/matches" className="join-button">Join a Match</Link>
            </div>
          )}

          <div className="banner">
            <img src="/banner.png" alt="Banner" />
          </div>
        </div>

        {/* Upcoming Matches Section */}
        <div className="upcoming-matches">
          <div className="section-header">
            <h2>Upcoming Matches</h2>
            <a href="#" className="view-all">VIEW ALL</a>
          </div>
          
          {upcomingMatchData.map((match) => (
            <Link 
              to={`/contests/${match.matchfile}`}
              className="match-link" 
              key={match.matchId}
            >
              <div className="match-card">
                <div className="match-teams">
                  <div className="team">
                    <img 
                      src={`./teams/${match.teama_short.split(' vs ')[0].toLowerCase().replace(/\s+/g, '-')}.avif`} 
                      alt={match.teams.split(' vs ')[0]} 
                    />
                    <span>{match.teama_short.split(' vs ')[0]}</span>
                  </div>
                  <div className="match-time">
                    <span>{match.time}</span>
                    <span>{match.date}</span>
                  </div>
                  <div className="team">
                    <img 
                      src={`./teams/${match.teama_short.split(' vs ')[1].toLowerCase().replace(/\s+/g, '-')}.avif`} 
                      alt={match.teams.split(' vs ')[1]} 
                    />
                    <span>{match.teama_short.split(' vs ')[1]}</span>
                  </div>
                </div>
                <div className="match-details">
                  <span>{match.series}</span>
                  <div className='match-type-linw'>
                    <span>{match.teams.split(' vs ')[0]}</span>
                    <span>{match.teams.split(' vs ')[1]}</span>
                  </div>
                </div>
                <div className="mega-prize">
                  <span>MEGA ₹100 CRORE</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Latest News Section */}
        <div className="latest-news">
          <div className="section-header">
            <h2>Latest News</h2>
          </div>
          <div className="news-container">
            {iplNews.map((newsItem, index) => (
              <div key={index} className="news-card">
                <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="news-link">
                  <div className="news-image-container">
                    <img 
                      src={newsItem.thumbnailURL} 
                      alt={newsItem.title} 
                      className="news-image"
                      onError={(e) => { e.target.src = '/news-placeholder.jpg'; }}
                    />
                  </div>
                  <div className="news-content">
                    <h3 className="news-title">{newsItem.title.split('\n')[0]}</h3>
                    <div className="news-meta">
                      <span className="news-author">{newsItem.author}</span>
                      <span className="news-likes">❤️ {newsItem.likeCount.toLocaleString()}</span>
                      <span className="news-time">
                        {new Date(newsItem.published).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;