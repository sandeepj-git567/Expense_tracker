import React, { useState } from 'react';

const AddTransaction = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    category: 'Other'
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Income', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.text.trim() || !formData.amount) {
      alert('Please add a description and amount');
      return;
    }

    onAddTransaction({
      text: formData.text.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category
    });

    // Reset form
    setFormData({
      text: '',
      amount: '',
      category: 'Other'
    });
  };

  return (
    <div className="card">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">Description</label>
          <input
            type="text"
            id="text"
            name="text"
            className="form-control"
            value={formData.text}
            onChange={handleChange}
            placeholder="Enter description..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">
            Amount <br />
            <small>(negative - expense, positive - income)</small>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount..."
            step="0.01"
            required
          />
        </div>
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
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;