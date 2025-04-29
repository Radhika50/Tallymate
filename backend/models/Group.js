// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: String,
  groupDescription: String,
  members: [String], // Array of emails (strings)
  currency: String,
  category: String,
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
