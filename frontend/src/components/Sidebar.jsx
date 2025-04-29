import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens here if you have
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src="https://img.pikbest.com/origin/10/01/92/16EpIkbEsTUyf.png!sw800"
          alt="TallyMate Logo"
          className="logo"
        />
        <h2 className="logo-text">TallyMate</h2>
      </div>

      <div className="sidebar-nav">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/create-group">Create Group</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>

      <div className="sidebar-profile">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTdmrjoiXGVFEcd1cX9Arb1itXTr2u8EKNpw&s"
          alt="User Profile"
          className="profile-img"
          onClick={() => setShowMenu(!showMenu)}
        />
        <p>Welcome, User!</p>

        {showMenu && (
          <div className="profile-menu" ref={menuRef}>
            <Link to="/settings">Settings</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
