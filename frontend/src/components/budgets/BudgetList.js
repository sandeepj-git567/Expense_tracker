import React from 'react';

const BudgetList = ({ budgets, onDeleteBudget, compact = false }) => {
  const getProgressColor = (percentage) => {
    if (percentage < 70) return 'budget-safe';
    if (percentage < 90) return 'budget-warning';
    return 'budget-danger';
  };

  if (budgets.length === 0) {
    return (
      <div className="card">
        <h3>Monthly Budgets</h3>
        <div className="empty-state">
          <p>No budgets set for this month. Create your first budget!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Monthly Budgets</h3>
      <div className="budget-list">
        {budgets.map(budget => {
          const percentage = budget.spent > 0 ? (budget.spent / budget.amount) * 100 : 0;
          
          return (
            <div key={budget._id} className="budget-item">
              <div className="budget-info">
                <h4>{budget.category}</h4>
                <p>${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}</p>
                <div className="budget-progress">
                  <div 
                    className={`budget-used ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <small>{percentage.toFixed(1)}% used</small>
              </div>
              {!compact && (
                <button
                  className="delete-btn"
                  onClick={() => onDeleteBudget(budget._id)}
                  title="Delete budget"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;