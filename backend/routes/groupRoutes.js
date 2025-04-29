// routes/groupRoutes.js
const express = require('express');
const mongoose = require('mongoose');  // Make sure mongoose is imported
const router = express.Router();
const Group = require('../models/Group');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Group routes working' });
});

// Create Group
router.post('/create', async (req, res) => {
  try {
    const { groupName, groupDescription, members, currency, category } = req.body;
    
    const newGroup = new Group({
      groupName,
      groupDescription,
      members,
      currency: currency || 'USD',
      category: category || 'home',
    });

    const savedGroup = await newGroup.save();
    res.status(201).json({ 
      success: true, 
      message: 'Group created successfully!',
      group: savedGroup
    });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ message: 'Error creating group', error: err.message });
  }
});

// Fetch all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({ groups });
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Add member to group
router.put('/:id/add-member', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(email)) {
      return res.status(400).json({ message: 'Member already in group' });
    }

    group.members.push(email);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      group
    });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Error adding member' });
  }
});
// Remove member from group
router.put('/:id/remove-member', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(email)) {
      return res.status(400).json({ message: 'Member not in group' });
    }

    group.members = group.members.filter(member => member !== email);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      group
    });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ message: 'Error removing member' });
  }
});


// Get single group by ID
router.get('/:id', async (req, res) => {
  const groupId = req.params.id;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID' });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ group });
  } catch (err) {
    console.error('Error fetching group:', err);
    res.status(500).json({ message: 'Error fetching group' });
  }
});

module.exports = router;
