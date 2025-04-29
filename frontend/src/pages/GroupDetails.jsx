// src/pages/GroupDetails.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GroupDetails.css';


const GroupDetails = () => {
  const location = useLocation();
  const { group } = location.state || {};  // Accessing passed data from CreateGroup.jsx

  const [groupDetails, setGroupDetails] = useState(group || {});
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [members, setMembers] = useState(groupDetails?.members || []);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    payer: '',
  });

  useEffect(() => {
    if (!group) {
      console.error("No group data found.");
    }
  }, [group]);

  const handleEmailChange = (e) => {
    setNewMemberEmail(e.target.value);
  };

  const handleAddMember = () => {
    if (newMemberEmail && !members.includes(newMemberEmail)) {
      setMembers([...members, newMemberEmail]);
      setNewMemberEmail('');
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description && newExpense.payer) {
      setExpenses([...expenses, newExpense]);
      setNewExpense({ amount: '', description: '', payer: '' });
    }
  };

  // Calculate each member's share and balance
  const calculateBalances = () => {
    const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    const equalShare = totalAmount / members.length;

    const balances = members.reduce((acc, member) => {
      acc[member] = { paid: 0, owes: 0 };
      return acc;
    }, {});

    expenses.forEach((expense) => {
      balances[expense.payer].paid += parseFloat(expense.amount);
    });

    members.forEach((member) => {
      const balance = balances[member];
      balance.owes = equalShare - balance.paid;
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Group Details</h1>

      {/* Group Information Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Group Information</h2>
        <p className="text-gray-600">Here are the details of your group.</p>
        <ul className="list-disc pl-5 mt-2">
          <li><strong>Group Name:</strong> {groupDetails?.groupName}</li>
          <li><strong>Description:</strong> {groupDetails?.groupDescription}</li>
          <li><strong>Currency:</strong> {groupDetails?.currency}</li>
          <li><strong>Category:</strong> {groupDetails?.category}</li>
        </ul>
      </div>

      {/* Members List Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Group Members</h2>
        <ul className="list-none">
          {members.map((member, index) => (
            <li key={index} className="flex items-center justify-between p-2 border-b">
              <span>{member}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Member Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add New Member</h2>
        <div className="flex items-center space-x-4">
          <input
            type="email"
            value={newMemberEmail}
            onChange={handleEmailChange}
            placeholder="Enter member's email"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add Expense</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleExpenseChange}
              placeholder="Amount"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="description"
              value={newExpense.description}
              onChange={handleExpenseChange}
              placeholder="Description"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <select
              name="payer"
              value={newExpense.payer}
              onChange={handleExpenseChange}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Payer</option>
              {members.map((member, index) => (
                <option key={index} value={member}>{member}</option>
              ))}
            </select>
            <button
              onClick={handleAddExpense}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expense List Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <ul className="list-none">
          {expenses.map((expense, index) => (
            <li key={index} className="p-2 border-b">
              <strong>{expense.payer}</strong> paid <strong>{expense.amount}</strong> for <em>{expense.description}</em>
            </li>
          ))}
        </ul>
      </div>

      {/* Balances Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Balances</h2>
        <ul className="list-none">
          {members.map((member, index) => {
            const balance = balances[member];
            return (
              <li key={index} className="p-2 border-b">
                <span>{member}:</span>
                <span className={balance.owes === 0 ? 'text-green-500' : 'text-red-500'}>
                  {balance.owes > 0 ? `Owes: $${balance.owes.toFixed(2)}` : `Paid: $${Math.abs(balance.owes).toFixed(2)}`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default GroupDetails;
