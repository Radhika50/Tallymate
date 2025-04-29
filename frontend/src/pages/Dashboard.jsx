// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/groups');
        setGroups(response.data.groups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-main">
          <h2>Your Groups</h2>
          <div className="groups-container">
            {groups.length === 0 ? (
              <div className="no-groups-message">
                <p>You don't have any groups yet.</p>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group._id} className="group">
                  <h3>{group.groupName}</h3>
                  <p>{group.groupDescription || 'No description available'}</p>
                  <div className="group-info">
                    <span className="members-count">
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/group/${group._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/create-group" className="add-group-btn">
            <span>+</span> Create New Group
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;