// Navbar.jsx
import React, { useState , useEffect} from 'react';
import { MdSportsCricket } from 'react-icons/md';
import { FaBell, FaWallet, FaUserCircle, FaHome, FaTrophy, FaGift, FaUsers, FaBars } from 'react-icons/fa';
import ProfileDialog from './ProfileDialog';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config/BaseUrl';

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };


  useEffect(() => {
    const update10x = async () => {
      try {
        await axios.get(`${BASE_URL}/matches/update10x`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };
    update10x();
  }, [token, location.pathname]);  // Runs when token OR URL changes
  



  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-left">
        <Link to="/" style={{marginTop:'0'}} className="logo">
          <MdSportsCricket className="sports-icon" />
          <span>PERFECT 11</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="navbar-center">
        <div className="nav-items">
          <Link to="/" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/matches" className={`nav-link ${location.pathname === '/matches' ? 'active' : ''}`}>
            <FaTrophy className="nav-icon" />
            <span>My Matches</span>
          </Link>
          
        </div>
      </div>

      {/* User Actions */}
      <div className="navbar-right">
        <div className="nav-actions">
          <FaUserCircle className="action-icon profile" onClick={toggleDialog} />
        </div>
      </div>

      {isDialogOpen && <ProfileDialog onClose={toggleDialog} />}
    </nav>
  );
};

export default Navbar;