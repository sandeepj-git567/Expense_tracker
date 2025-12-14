import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TransactionList = ({ transactions, onDeleteTransaction, showViewAll = false }) => {
  const { user } = useAuth();
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  }[user?.currency] || '$';

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h3>Transaction History</h3>
        <div className="empty-state">
          <p>No transactions yet. Add your first transaction!</p>
        </div>
      </div>
    );
  }

  const displayTransactions = showViewAll ? transactions.slice(0, 5) : transactions;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Transaction History</h3>
        {showViewAll && transactions.length > 5 && (
          <span className="text-muted">Showing 5 of {transactions.length}</span>
        )}
      </div>
      <div className="transaction-list">
        {displayTransactions.map(transaction => (
          <div key={transaction._id} className="transaction-item">
            <div className="transaction-text">
              <h4>{transaction.text}</h4>
              <p>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className="transaction-amount">
              <span className={transaction.amount > 0 ? 'positive' : 'negative'}>
                {transaction.amount > 0 ? '+' : ''}{currencySymbol}{Math.abs(transaction.amount)}
              </span>
            </div>
            <button
              className="delete-btn"
              onClick={() => onDeleteTransaction(transaction._id)}
              title="Delete transaction"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {showViewAll && transactions.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button className="btn btn-outline btn-sm">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;