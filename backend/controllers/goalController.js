import Goal from '../models/Goal.js';

// @desc    Get all goals for user
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create goal
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, category, color } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      deadline,
      category,
      color
    });

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount = req.body.currentAmount || goal.currentAmount;
    goal.title = req.body.title || goal.title;
    goal.targetAmount = req.body.targetAmount || goal.targetAmount;
    goal.deadline = req.body.deadline || goal.deadline;
    goal.category = req.body.category || goal.category;
    goal.color = req.body.color || goal.color;

    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    const updatedGoal = await goal.save();

    res.json({
      success: true,
      data: updatedGoal
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await Goal.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add to goal progress
// @route   POST /api/goals/:id/add
export const addToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount += parseFloat(amount);

    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      goal.currentAmount = goal.targetAmount; // Prevent over-saving
    }

    const updatedGoal = await goal.save();

    res.json({
      success: true,
      data: updatedGoal
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};