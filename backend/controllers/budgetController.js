import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all budgets for user
// @route   GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const budgets = await Budget.find({ 
      month,
      year
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await Transaction.find({
          category: budget.category,
          date: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
          }
        });

        const spent = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
        
        return {
          ...budget.toObject(),
          spent
        };
      })
    );

    res.json({
      success: true,
      data: budgetsWithSpent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create budget
// @route   POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const existingBudget = await Budget.findOne({
      category,
      month,
      year
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists this month' });
    }

    const budget = await Budget.create({
      category,
      amount,
      month,
      year
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.amount = req.body.amount || budget.amount;
    const updatedBudget = await budget.save();

    res.json({
      success: true,
      data: updatedBudget
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budget alerts
// @route   GET /api/budgets/alerts
const getBudgetAlerts = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const budgets = await Budget.find({ 
      month,
      year
    });

    const alerts = [];

    for (const budget of budgets) {
      const transactions = await Transaction.find({
        category: budget.category,
        date: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        }
      });

      const spent = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
      const percentage = (spent / budget.amount) * 100;

      if (percentage >= 90) {
        alerts.push({
          category: budget.category,
          budget: budget.amount,
          spent: spent,
          percentage: percentage.toFixed(1),
          message: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget!`
        });
      }
    }

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions
export {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetAlerts
};