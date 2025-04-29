// src/pages/CreateGroup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';
import Sidebar from '../components/Sidebar';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('home');
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUserList(res.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleAddMember = () => {
    if (members.trim() && !selectedMembers.includes(members.trim())) {
      setSelectedMembers([...selectedMembers, members.trim()]);
      setMembers('');
    }
  };

  const handleRemoveMember = (emailToRemove) => {
    setSelectedMembers(selectedMembers.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!groupName.trim()) {
      setError('Group name is required');
      setLoading(false);
      return;
    }

    const newGroup = {
      groupName,
      groupDescription,
      members: selectedMembers,
      currency,
      category,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/groups/create', newGroup);
      if (res.data.success) {
        alert('Group created successfully!');
        // Pass group data to GroupDetails page
        navigate('/groupdetails', {
          state: { group: newGroup },
        });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-wrapper">
      <Sidebar />
      {/* Main Form */}
      <div className="create-group-container">
        <h2>Create Group</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">Group Name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="groupDescription">Group Description (optional, max 30 words)</label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 30) {
                  setGroupDescription(e.target.value);
                } else {
                  setGroupDescription(words.slice(0, 30).join(' '));
                }
              }}
              rows={4}
              cols={40}
              placeholder="Enter up to 30 words (optional)"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="members">Add Group Members (by Email)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="email"
                id="memberEmail"
                placeholder="Enter member email"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="add-member-btn"
              >
                Add
              </button>
            </div>

            {selectedMembers.length > 0 && (
              <ul className="selected-members-list">
                {selectedMembers.map((email, index) => (
                  <li key={index}>
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(email)}
                      style={{
                        marginLeft: '8px',
                        color: 'red',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="home">Home</option>
              <option value="trip">Trip</option>
              <option value="shopping">Shopping</option>
              <option value="food">Food</option>
              <option value="office">Office</option>
              <option value="transport">Transport</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="create-group-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
