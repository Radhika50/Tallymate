// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard">TallyMate</Link>
      </div>

      <div className="navbar-right">
        <div className="navbar-profile">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTdmrjoiXGVFEcd1cX9Arb1itXTr2u8EKNpw&s" alt="User Profile" className="profile-img" />
          <span>Username</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
