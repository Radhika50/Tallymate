// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidBy: {
    type: String,
    required: true
  },
  splitType: {
    type: String,
    enum: ['equal', 'exact', 'percent'],
    default: 'equal'
  },
  splitBetween: [String], // Array of member emails
  customSplits: {
    type: Map,
    of: Number
  },
  percentSplits: {
    type: Map,
    of: Number
  },
  isSettlement: {
    type: Boolean,
    default: false
  },
  settlementDetails: {
    payer: String,
    receiver: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;