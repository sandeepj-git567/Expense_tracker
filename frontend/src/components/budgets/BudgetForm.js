import React, { useState } from 'react';

const BudgetForm = ({ onAddBudget }) => {
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: ''
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    onAddBudget({
      category: formData.category,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      category: 'Food',
      amount: ''
    });
  };

  return (
    <div className="card">
      <h3>Create New Budget</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="form-control form-select"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Budget Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter budget amount"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Create Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;