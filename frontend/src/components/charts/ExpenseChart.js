import React from 'react';

function ExpenseChart({ expenses }) {
  // ADD THIS NULL CHECK AT THE TOP
  if (!expenses || typeof expenses !== 'object') {
    return <div>No expenses data available</div>;
  }

  const categories = Object.keys(expenses);
  
  if (categories.length === 0) {
    return <div>No expenses to display</div>;
  }

  // Your existing chart rendering code here
  return (
    <div className="expense-chart">
      <h3>Expense Chart</h3>
      {categories.map(category => (
        <div key={category}>
          {category}: ${expenses[category]}
        </div>
      ))}
    </div>
  );
}

export default ExpenseChart;