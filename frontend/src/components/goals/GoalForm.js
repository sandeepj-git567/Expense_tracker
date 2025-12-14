import React, { useState } from 'react';

const GoalForm = ({ onAddGoal }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'Savings',
    color: '#3498db'
  });

  const categories = ['Savings', 'Vacation', 'Emergency Fund', 'Investment', 'Education', 'Other'];
  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(formData.deadline) <= new Date()) {
      alert('Please select a future date for the deadline');
      return;
    }

    onAddGoal({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline,
      category: formData.category,
      color: formData.color
    });

    // Reset form
    setFormData({
      title: '',
      targetAmount: '',
      deadline: '',
      category: 'Savings',
      color: '#3498db'
    });
  };

  return (
    <div className="card">
      <h3>Create New Goal</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Goal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., New Car, Vacation, Emergency Fund"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            className="form-control"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="Enter target amount"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            className="form-control"
            value={formData.deadline}
            onChange={handleChange}
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

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {colors.map(color => (
              <label key={color} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={formData.color === color}
                  onChange={handleChange}
                />
                <div 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: color, 
                    borderRadius: '50%',
                    border: formData.color === color ? '2px solid #333' : '1px solid #ccc'
                  }}
                ></div>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Create Goal
        </button>
      </form>
    </div>
  );
};

export default GoalForm;