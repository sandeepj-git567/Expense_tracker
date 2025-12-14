import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ReportGenerator = ({ transactions, analytics }) => {
  const { user } = useAuth();
  const [reportPeriod, setReportPeriod] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [generating, setGenerating] = useState(false);

  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  }[user?.currency] || '$';

  const generateReport = async (format = 'json') => {
    setGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/transactions/report`, {
        startDate: reportPeriod.startDate,
        endDate: reportPeriod.endDate,
        format
      });

      if (format === 'csv') {
        // Download CSV
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expense-report-${reportPeriod.startDate}-to-${reportPeriod.endDate}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Display JSON report
        console.log('Report data:', response.data);
        alert('Report generated! Check console for details.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netSavings = totalIncome - totalExpense;

  return (
    <div className="card">
      <h3>Financial Reports</h3>
      
      {/* Report Period Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Select Report Period</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={reportPeriod.startDate}
              onChange={(e) => setReportPeriod({...reportPeriod, startDate: e.target.value})}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={reportPeriod.endDate}
              onChange={(e) => setReportPeriod({...reportPeriod, endDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <h4>Total Income</h4>
          <div style={{ fontSize: '1.5em', color: '#2ecc71', fontWeight: 'bold' }}>
            {currencySymbol}{totalIncome.toFixed(2)}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4>Total Expense</h4>
          <div style={{ fontSize: '1.5em', color: '#e74c3c', fontWeight: 'bold' }}>
            {currencySymbol}{totalExpense.toFixed(2)}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4>Net Savings</h4>
          <div style={{ 
            fontSize: '1.5em', 
            color: netSavings >= 0 ? '#2ecc71' : '#e74c3c', 
            fontWeight: 'bold' 
          }}>
            {currencySymbol}{Math.abs(netSavings).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {analytics.categorySpending && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Spending by Category</h4>
          <div className="card">
            {Object.entries(analytics.categorySpending).map(([category, amount]) => (
              <div key={category} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>{category}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {currencySymbol}{amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div>
        <h4>Export Report</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => generateReport('json')}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'View Detailed Report'}
          </button>
          <button
            className="btn btn-success"
            onClick={() => generateReport('csv')}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Download CSV'}
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: '30px' }}>
        <h4>Recent Transactions</h4>
        <div className="card">
          {transactions.slice(0, 10).map(transaction => (
            <div key={transaction._id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '8px 0',
              borderBottom: '1px solid #f8f9fa'
            }}>
              <div>
                <strong>{transaction.text}</strong>
                <br />
                <small>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</small>
              </div>
              <span style={{ 
                color: transaction.amount > 0 ? '#2ecc71' : '#e74c3c',
                fontWeight: 'bold'
              }}>
                {transaction.amount > 0 ? '+' : ''}{currencySymbol}{Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;