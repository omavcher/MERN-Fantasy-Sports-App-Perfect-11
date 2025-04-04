import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import VerifyOTP from './pages/VerifyOTP';
import Home from './pages/Home';
import Contests from './pages/Contests';
import TeamSelection from './pages/TeamSelection';
import CaptainSelection from './pages/CaptainSelection';
import MyMatches from './pages/MyMatches';
import MatchLeaderboard from './pages/MatchLeaderboard';
import Navbar from './pages/components/Navbar';
import UserNav from './pages/components/UserNav';
import AddCash from './pages/AddCash';
import LoadingPage from './pages/LoadingPage';
import NotFoundPage from './pages/NotFoundPage';
import Payment from './pages/Payment';
import CreateTeam from './pages/CreateTeam';
import Playground from './pages/Playground';
import MyMatchesPage from './pages/MyMatchesPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={localStorage.getItem('token') ? <Navigate to="/home" /> : <SignIn />} />
        <Route path="/verify-otp" element={localStorage.getItem('token') ? <Navigate to="/home" /> : <VerifyOTP />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/contests/:matchId" element={<PrivateRoute><Contests /></PrivateRoute>} />
        <Route path="/team-selection/:matchId/:prizePool" element={<PrivateRoute><TeamSelection /></PrivateRoute>} />
        <Route path="/captain-selection/:matchId/:prizePool" element={<PrivateRoute><CaptainSelection /></PrivateRoute>} />
        <Route path="/create/team/:matchId" element={<PrivateRoute><CreateTeam /></PrivateRoute>} />
        <Route path="/playground/:matchId/:teamId" element={<PrivateRoute><Playground /></PrivateRoute>} />
        <Route path="/my-matches/:matchId" element={<PrivateRoute><MyMatches /></PrivateRoute>} />
        <Route path="/match-leaderboard/:matchId" element={<PrivateRoute><MatchLeaderboard /></PrivateRoute>} />
        <Route path="/add-cash" element={<PrivateRoute><AddCash /></PrivateRoute>} />
        <Route path="/payment/:matchId" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/matches" element={<PrivateRoute><MyMatchesPage /></PrivateRoute>} />
        <Route path="/l" element={<PrivateRoute><LoadingPage /></PrivateRoute>} />
        <Route path="*" element={localStorage.getItem('token') ? <NotFoundPage /> : <Navigate to="/" />} />
      </Routes>
      {isMobile && <UserNav />}
    </Router>
  );
}

export default App;
