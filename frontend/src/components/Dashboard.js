import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Balance from './Balance';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import ExpenseChart from './charts/ExpenseChart';
import CategoryChart from './charts/CategoryChart';
import BudgetList from './budgets/BudgetList';
import BudgetForm from './budgets/BudgetForm';
import GoalList from './goals/GoalList';
import GoalForm from './goals/GoalForm';
import ReportGenerator from './reports/ReportGenerator';

const API_URL = `${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000')}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ total: 0, income: 0, expense: 0 });
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics(analyticsPeriod);
    }
  }, [activeTab, analyticsPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTransactions(),
        fetchBalance(),
        fetchBudgets(),
        fetchGoals(),
        fetchBudgetAlerts()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/balance`);
      setBalance(response.data.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_URL}/budgets`);
      setBudgets(response.data.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals`);
      setGoals(response.data.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchAnalytics = async (period = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/transactions/analytics?period=${period}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchBudgetAlerts = async () => {
    try {
      const response = await axios.get(`${API_URL}/budgets/alerts`);
      setBudgetAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, transactionData);
      setTransactions([response.data.data, ...transactions]);
      await Promise.all([
        fetchBalance(),
        fetchAnalytics(analyticsPeriod),
        fetchBudgetAlerts()
      ]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));
      await Promise.all([
        fetchBalance(),
        fetchAnalytics(analyticsPeriod),
        fetchBudgetAlerts()
      ]);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    }
  };

  const addBudget = async (budgetData) => {
    try {
      await axios.post(`${API_URL}/budgets`, budgetData);
      await Promise.all([
        fetchBudgets(),
        fetchBudgetAlerts()
      ]);
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Error adding budget. Please try again.');
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API_URL}/budgets/${id}`);
      await Promise.all([
        fetchBudgets(),
        fetchBudgetAlerts()
      ]);
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Error deleting budget. Please try again.');
    }
  };

  const addGoal = async (goalData) => {
    try {
      await axios.post(`${API_URL}/goals`, goalData);
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Error adding goal. Please try again.');
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Error deleting goal. Please try again.');
    }
  };

  const addToGoal = async (goalId, amount) => {
    try {
      await axios.post(`${API_URL}/goals/${goalId}/add`, { amount });
      fetchGoals();
    } catch (error) {
      console.error('Error adding to goal:', error);
      alert('Error adding to goal. Please try again.');
    }
  };

  const handleAnalyticsPeriodChange = (period) => {
    setAnalyticsPeriod(period);
    fetchAnalytics(period);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            💰 Expense Tracker Pro
          </div>
          <div className="nav-user">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span>Welcome, {user?.name}</span>
            </div>
            <button onClick={logout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="card">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['overview', 'transactions', 'budgets', 'goals', 'analytics', 'reports'].map(tab => (
            <button
              key={tab}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="card">
          <h3>💰 Budget Alerts</h3>
          {budgetAlerts.map((alert, index) => (
            <div key={index} className="alert alert-warning">
              <strong>{alert.category}:</strong> {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <Balance balance={balance} />
          
          <div className="dashboard-grid">
            <div>
              <AddTransaction onAddTransaction={addTransaction} />
              <TransactionList 
                transactions={transactions.slice(0, 5)} 
                onDeleteTransaction={deleteTransaction} 
                showViewAll={true}
              />
            </div>
            <div>
              {analytics.categorySpending && (
                <ExpenseChart categorySpending={analytics.categorySpending} />
              )}
              <BudgetList 
                budgets={budgets} 
                onDeleteBudget={deleteBudget}
                compact={true}
              />
            </div>
          </div>
        </>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="dashboard-grid">
          <div>
            <AddTransaction onAddTransaction={addTransaction} />
          </div>
          <div>
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction} 
            />
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="dashboard-grid">
          <div>
            <BudgetForm onAddBudget={addBudget} />
            <BudgetList 
              budgets={budgets} 
              onDeleteBudget={deleteBudget}
            />
          </div>
          <div>
            {analytics.categorySpending && (
              <ExpenseChart categorySpending={analytics.categorySpending} />
            )}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="dashboard-grid">
          <div>
            <GoalForm onAddGoal={addGoal} />
            <GoalList 
              goals={goals} 
              onDeleteGoal={deleteGoal}
              onAddToGoal={addToGoal}
            />
          </div>
          <div>
            <div className="card">
              <h3>🎯 Goals Progress</h3>
              <p>Track your financial goals and savings progress.</p>
              {goals.filter(goal => goal.isCompleted).length > 0 && (
                <div className="alert alert-success">
                  🎉 You've completed {goals.filter(goal => goal.isCompleted).length} goal(s)!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Period Selector */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h3>📊 Financial Analytics</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['week', 'month', 'year'].map(period => (
                  <button
                    key={period}
                    className={`btn btn-sm ${analyticsPeriod === period ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAnalyticsPeriodChange(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Overview Stats */}
          <div className="stats-grid">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#667eea', marginBottom: '5px' }}>📈</div>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Total Categories</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                {analytics.categorySpending ? Object.keys(analytics.categorySpending).length : 0}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#e74c3c', marginBottom: '5px' }}>💰</div>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Total Spent</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                ${analytics.totalSpent ? analytics.totalSpent.toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#2ecc71', marginBottom: '5px' }}>📅</div>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Analysis Period</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
                {analyticsPeriod.charAt(0).toUpperCase() + analyticsPeriod.slice(1)}
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#f39c12', marginBottom: '5px' }}>⚡</div>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>Transactions</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                {analytics.transactionCount || 0}
              </div>
            </div>
          </div>

          {/* Top Category Highlight */}
          {analytics.topCategory && (
            <div className="card">
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '20px', 
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>🏆 Top Spending Category</h4>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {analytics.topCategory.name}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  ${analytics.topCategory.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                  {((analytics.topCategory.amount / analytics.totalSpent) * 100).toFixed(1)}% of total spending
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="dashboard-grid">
            <div>
              <ExpenseChart categorySpending={analytics.categorySpending} />
            </div>
            <div>
              <CategoryChart 
                categorySpending={analytics.categorySpending} 
                period={analyticsPeriod}
              />
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="dashboard-grid">
            <div className="card">
              <h4>📋 Spending Summary</h4>
              {analytics.categorySpending ? (
                <div>
                  {Object.entries(analytics.categorySpending)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([category, amount]) => (
                      <div key={category} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid #f8f9fa'
                      }}>
                        <span style={{ fontWeight: '500' }}>{category}</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 'bold' }}>${amount.toFixed(2)}</div>
                          <div style={{ fontSize: '12px', color: '#6c757d' }}>
                            {((amount / analytics.totalSpent) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No spending data available for analysis.</p>
              )}
            </div>
            
            <div className="card">
              <h4>📈 Insights & Tips</h4>
              {analytics.categorySpending && (
                <div>
                  {analytics.averageSpending > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Average per Category:</strong> ${analytics.averageSpending.toFixed(2)}
                    </div>
                  )}
                  {analytics.topCategory && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Focus Area:</strong> Consider reviewing your {analytics.topCategory.name} spending
                    </div>
                  )}
                  <div style={{ 
                    background: '#e8f5e8', 
                    padding: '15px', 
                    borderRadius: '8px',
                    borderLeft: '4px solid #2ecc71'
                  }}>
                    <strong>💡 Tip:</strong> Try setting budgets for your top spending categories to better control your expenses.
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <ReportGenerator 
          transactions={transactions}
          analytics={analytics}
        />
      )}
    </div>
  );
};

export default Dashboard;