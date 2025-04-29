// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Group = require('../models/Group');

// Create a new expense
router.post('/create', async (req, res) => {
  try {
    const { 
      groupId, 
      title, 
      amount, 
      paidBy, 
      splitType, 
      splitBetween,
      customSplits,
      percentSplits 
    } = req.body;

    // Validate the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Create new expense
    const newExpense = new Expense({
      groupId,
      title,
      amount,
      paidBy,
      splitType,
      splitBetween: splitBetween || group.members
    });

    // Add split-specific data
    if (splitType === 'exact' && customSplits) {
      newExpense.customSplits = customSplits;
    } else if (splitType === 'percent' && percentSplits) {
      newExpense.percentSplits = percentSplits;
    }

    await newExpense.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
});

// Get all expenses for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId });
    res.status(200).json({ expenses });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Record a settlement
router.post('/settle', async (req, res) => {
  try {
    const { groupId, payer, receiver, amount, title } = req.body;
    
    // Verify the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Create settlement expense
    const settlement = new Expense({
      groupId,
      title: title || `Settlement: ${payer} paid ${receiver}`,
      amount,
      paidBy: payer,
      splitType: 'exact',
      splitBetween: [receiver],
      customSplits: { [receiver]: amount },
      isSettlement: true,
      settlementDetails: {
        payer,
        receiver
      }
    });
    
    await settlement.save();
    
    res.status(201).json({
      success: true,
      message: 'Settlement recorded successfully',
      settlement
    });
  } catch (err) {
    console.error('Error recording settlement:', err);
    res.status(500).json({ message: 'Error recording settlement', error: err.message });
  }
});

// Delete an expense
router.delete('/:expenseId', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.expenseId);
    
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

module.exports = router;