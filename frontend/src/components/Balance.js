import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Balance = ({ balance }) => {
  const { user } = useAuth();
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  }[user?.currency] || '$';

  return (
    <div className="card balance-card">
      <h3>Your Balance</h3>
      <div className="balance-amount">
        {currencySymbol}{Math.abs(balance.total).toLocaleString()}
      </div>
      <div className="income-expense">
        <div className="income">
          <h4>INCOME</h4>
          <div className="amount">
            {currencySymbol}{balance.income}
          </div>
        </div>
        <div className="expense">
          <h4>EXPENSE</h4>
          <div className="amount">
            {currencySymbol}{balance.expense}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;