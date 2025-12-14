import React, { useState } from 'react';

const GoalList = ({ goals, onDeleteGoal, onAddToGoal }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  const handleContribution = async (goalId) => {
    if (!contributionAmount || contributionAmount <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }

    await onAddToGoal(goalId, parseFloat(contributionAmount));
    setSelectedGoal(null);
    setContributionAmount('');
  };

  if (goals.length === 0) {
    return (
      <div className="card">
        <h3>Financial Goals</h3>
        <div className="empty-state">
          <p>No goals set yet. Create your first financial goal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Financial Goals</h3>
      <div className="goal-list">
        {goals.map(goal => {
          const percentage = goal.currentAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          
          return (
            <div 
              key={goal._id} 
              className="goal-item"
              style={{ borderLeftColor: goal.color }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4>{goal.title}</h4>
                  <p>Target: ${goal.targetAmount} • Category: {goal.category}</p>
                  <p>Deadline: {new Date(goal.deadline).toLocaleDateString()} ({daysLeft} days left)</p>
                  
                  <div className="goal-progress">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>${goal.currentAmount} of ${goal.targetAmount}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: goal.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginLeft: '15px' }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setSelectedGoal(goal._id)}
                    disabled={goal.isCompleted}
                  >
                    Add
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteGoal(goal._id)}
                    title="Delete goal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {selectedGoal === goal._id && (
                <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Contribution amount"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      style={{ flex: 1, padding: '8px' }}
                      step="0.01"
                      min="0.01"
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleContribution(goal._id)}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedGoal(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {goal.isCompleted && (
                <div style={{ marginTop: '10px', padding: '5px 10px', background: '#2ecc71', color: 'white', borderRadius: '5px', display: 'inline-block' }}>
                  🎉 Goal Completed!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalList;