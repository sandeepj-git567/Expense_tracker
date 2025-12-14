import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryChart = ({ categorySpending, period = 'month' }) => {
  // If no data, show empty state
  if (!categorySpending || Object.keys(categorySpending).length === 0) {
    return (
      <div className="chart-container">
        <h3>Spending by Category</h3>
        <div className="empty-state">
          <p>No spending data available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Sort categories by spending amount (descending)
  const sortedCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const data = {
    labels: Object.keys(sortedCategories),
    datasets: [
      {
        label: 'Amount Spent',
        data: Object.values(sortedCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(199, 199, 199)',
          'rgb(83, 102, 255)',
          'rgb(40, 159, 64)',
          'rgb(210, 99, 132)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Spending by Category (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  // Calculate total spending
  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="chart-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h3>Category Spending Analysis</h3>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Total: ${totalSpending.toFixed(2)}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Bar data={data} options={options} />
      </div>

      {/* Category Breakdown Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginTop: '20px'
      }}>
        {Object.entries(sortedCategories).slice(0, 6).map(([category, amount], index) => {
          const percentage = ((amount / totalSpending) * 100).toFixed(1);
          const colors = [
            'linear-gradient(135deg, #FF6384, #C70039)',
            'linear-gradient(135deg, #36A2EB, #1B4F72)',
            'linear-gradient(135deg, #FFCE56, #B7950B)',
            'linear-gradient(135deg, #4BC0C0, #1D8348)',
            'linear-gradient(135deg, #9966FF, #6C3483)',
            'linear-gradient(135deg, #FF9F40, #CA6F1E)'
          ];

          return (
            <div 
              key={category}
              style={{
                background: colors[index] || 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '15px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>
                {category}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                ${amount.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Category List */}
      {Object.keys(sortedCategories).length > 6 && (
        <div style={{ marginTop: '20px' }}>
          <h4>All Categories</h4>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '10px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {Object.entries(sortedCategories).map(([category, amount]) => {
              const percentage = ((amount / totalSpending) * 100).toFixed(1);
              return (
                <div 
                  key={category}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #e9ecef'
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{category}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>${amount.toFixed(2)}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;