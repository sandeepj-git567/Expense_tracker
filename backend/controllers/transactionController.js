import Transaction from '../models/Transaction.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public
const addTransaction = async (req, res) => {
  try {
    const { text, amount, category } = req.body;

    const transaction = await Transaction.create({
      text,
      amount,
      category
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await Transaction.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get balance
// @route   GET /api/balance
// @access  Public
const getBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);

    const expense = (
      amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    res.json({
      success: true,
      data: {
        total,
        income,
        expense
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get spending analytics
// @route   GET /api/transactions/analytics
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const currentDate = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    }

    const transactions = await Transaction.find({
      date: { $gte: startDate }
    });

    // Category-wise spending
    const categorySpending = {};
    let totalSpent = 0;
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        categorySpending[category] = (categorySpending[category] || 0) + amount;
        totalSpent += amount;
      }
    });

    // Monthly trend
    const monthlyTrend = {};
    transactions.forEach(transaction => {
      const monthYear = transaction.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (transaction.amount < 0) {
        monthlyTrend[monthYear] = (monthlyTrend[monthYear] || 0) + Math.abs(transaction.amount);
      }
    });

    // Top spending category
    const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];

    res.json({
      success: true,
      data: {
        categorySpending,
        monthlyTrend,
        totalSpent,
        period,
        topCategory: topCategory ? {
          name: topCategory[0],
          amount: topCategory[1]
        } : null,
        transactionCount: transactions.length,
        averageSpending: totalSpent / Object.keys(categorySpending).length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate expense report
// @route   POST /api/transactions/report
// @access  Public
const generateReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.body;

    const transactions = await Transaction.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });

    const report = {
      period: { startDate, endDate },
      summary: {
        totalIncome: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
        netSavings: transactions.reduce((sum, t) => sum + t.amount, 0)
      },
      categoryBreakdown: {},
      transactions
    };

    // Calculate category breakdown
    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        report.categoryBreakdown[category] = (report.categoryBreakdown[category] || 0) + amount;
      }
    });

    if (format === 'csv') {
      // Generate CSV (simplified)
      let csv = 'Date,Description,Category,Amount\n';
      transactions.forEach(transaction => {
        csv += `${transaction.date.toISOString().split('T')[0]},${transaction.text},${transaction.category},${transaction.amount}\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=expense-report.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions
export {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getBalance,
  getAnalytics,
  generateReport
};