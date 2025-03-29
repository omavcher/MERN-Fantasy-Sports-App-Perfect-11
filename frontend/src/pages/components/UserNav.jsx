import React from 'react';
import { FaHome, FaTrophy, FaGift, FaUsers, FaBars } from 'react-icons/fa';
import './userNav.css';
import { Link, useLocation } from 'react-router-dom';

const UserNav = () => {
  return (
    <div className="user-nav">
      <Link to={`/`} className="nav-item active">
        <FaHome className="nav-icon" />
        <span>Home</span>
      </Link>
      <Link to={`/matches`} className="nav-item">
        <FaTrophy className="nav-icon" />
        <span>My Matches</span>
      </Link>
    
    </div>
  );
};

export default UserNav;